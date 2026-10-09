
// 1. IMPORTACIONES


// Importa los estilos generales y las clases de Tailwind CSS.
import "./style.css";

// Obtiene los países desde la API o archivos de demostración.
import {
    fetchCountries,
} from "./api/countries";

// Convierte un arreglo de países en las tarjetas del grid.
import { renderCountries as renderCountryGrid } from "./render/countryGrid";

// Renderiza la vista detallada de un país.
import { renderDetail } from "./render/details";

// Importa unicamente el tipo Country para el tipado.
import type { Country } from "./types/country";

// Filtra los países por nombre y región.
import { filterCountries } from "./utils/filter";

// Importa las funciones que muestran los estados visuales de carga, ausencia y error.
import { renderEmpty, renderError, renderLoading } from "./render/states";



// 2. REFERENCIAS DEL MENÚ DE NAVEGACIÓN MÓVIL


// Botón utilizado para abrir y cerrar el menú móvil.
const menuButton: HTMLButtonElement | null =
    document.querySelector<HTMLButtonElement>(
        "#menu-toggle",
    );

// Contenedor principal del menú de navegación.
const mainMenu: HTMLElement | null =
    document.querySelector<HTMLElement>(
        "#main-menu",
    );

// Ícono que representa el menú abierto.
const openIcon: SVGElement | null =
    document.querySelector<SVGElement>(
        "#menu-open-icon",
    );

// Ícono que representa el cierre del menú.
const closeIcon: SVGElement | null =
    document.querySelector<SVGElement>(
        "#menu-close-icon",
    );



// 3. CONTROL DEL MENÚ MÓVIL


/**
 * Actualiza el estado visual y accesible del menú móvil.
 *
 * @param isOpen Indica si el menú debe mostrarse abierto.
 */
function setMenuState(isOpen: boolean): void {
    // Detiene la función si alguno de los elementos no existe.
    if (
        !menuButton ||
        !mainMenu ||
        !openIcon ||
        !closeIcon
    ) {
        return;
    }

    // Muestra u oculta el menú.
    mainMenu.classList.toggle(
        "hidden",
        !isOpen,
    );

    // Alterna los íconos del botón.
    openIcon.classList.toggle(
        "hidden",
        isOpen,
    );

    closeIcon.classList.toggle(
        "hidden",
        !isOpen,
    );

    // Comunica el estado del menú a las tecnologías de asistencia.
    menuButton.setAttribute(
        "aria-expanded",
        String(isOpen),
    );

    // Actualiza la descripción accesible del botón.
    menuButton.setAttribute(
        "aria-label",
        isOpen
            ? "Cerrar menú de navegación"
            : "Abrir menú de navegación",
    );
}



// 4. EVENTOS DEL MENÚ MÓVIL


if (menuButton && mainMenu) {
    // Abre o cierra el menú cuando se presiona el botón.
    menuButton.addEventListener(
        "click",
        (): void => {
            const isOpen: boolean =
                menuButton.getAttribute(
                    "aria-expanded",
                ) === "true";

            setMenuState(!isOpen);
        },
    );

    // Cierra el menú cuando se selecciona un enlace interno.
    mainMenu
        .querySelectorAll<HTMLAnchorElement>("a")
        .forEach(
            (link: HTMLAnchorElement): void => {
                link.addEventListener(
                    "click",
                    (): void => {
                        setMenuState(false);
                    },
                );
            },
        );

    // Cierra el menú al presionar la tecla Escape.
    document.addEventListener(
        "keydown",
        (event: KeyboardEvent): void => {
            if (event.key === "Escape") {
                setMenuState(false);
                menuButton.focus();
            }
        },
    );

    // Detecta cuando la pantalla cambia al tamaño de escritorio.
    const desktopBreakpoint: MediaQueryList =
        window.matchMedia(
            "(min-width: 768px)",
        );

    // Restablece el estado del menú al cambiar de vista.
    desktopBreakpoint.addEventListener(
        "change",
        (): void => {
            setMenuState(false);
        },
    );
}



// 5. REFERENCIAS DE VISTAS Y SECCIÓN DE PAÍSES


// Contenedor donde se mostrarán las tarjetas de países.
const countriesContainer: HTMLElement | null =
    document.querySelector<HTMLElement>(
        "#country-container",
    );

// Campo donde el usuario escribe el nombre del país.
const countrySearch: HTMLInputElement | null =
    document.querySelector<HTMLInputElement>(
        'input[name="query"]',
    );

// Selector utilizado para filtrar por región.
const regionFilter: HTMLSelectElement | null =
    document.querySelector<HTMLSelectElement>(
        "#region-filter",
    );

// Vistas principales para el sistema de enrutamiento.
const homeView: HTMLElement | null =
    document.querySelector("#home-view");

const detailView: HTMLElement | null =
    document.querySelector("#detail-view");

// Cantidad inicial de tarjetas mostradas cuando no hay filtros activos.
const INITIAL_VISIBLE_COUNTRIES: number = 8;

// Conserva todos los países recibidos desde la API.
let allCountries: Country[] = [];

// Temporizador utilizado para el retraso de búsqueda (debounce).
let searchTimer:
    ReturnType<typeof setTimeout> | undefined;

async function fetchCountryByCode(code: string): Promise<Country> {
    const normalizedCode: string = code.toUpperCase();
    const normalizedName: string = code.trim().toLocaleLowerCase();
    const countries: Country[] = await fetchCountries();

    const country: Country | undefined = countries.find(
        (item: Country): boolean => {
            const record = item as Country & {
                cca2?: string;
                cca3?: string;
                code?: string;
                alpha2Code?: string;
            };

            return (
                item.codes?.alpha_2?.toUpperCase() === normalizedCode ||
                record.cca2?.toUpperCase() === normalizedCode ||
                record.cca3?.toUpperCase() === normalizedCode ||
                record.code?.toUpperCase() === normalizedCode ||
                record.alpha2Code?.toUpperCase() === normalizedCode ||
                item.names.common.toLocaleLowerCase() === normalizedName ||
                item.names.official?.toLocaleLowerCase() === normalizedName ||
                (item.names.translations?.spa?.common ?? "").toLocaleLowerCase() ===
                    normalizedName
            );
        },
    );

    if (!country) {
        throw new Error(
            `No se encontró un país con el código "${code}".`,
        );
    }

    return country;
}



// 6. CARGA Y FILTRADO DE PAÍSES


async function loadCountries(): Promise<void> {
    if (!countriesContainer) {
        console.error(
            "No se encontró #countries-container.",
        );
        return;
    }

    countriesContainer.innerHTML = renderLoading();

    try {
        allCountries = await fetchCountries();

        if (allCountries.length === 0) {
            countriesContainer.innerHTML = renderEmpty("");
            return;
        }

        const initialCountries: Country[] =
            allCountries.slice(
                0,
                INITIAL_VISIBLE_COUNTRIES,
            );

        renderCountryGrid(initialCountries);

    } catch (error: unknown) {
        const message: string =
            error instanceof Error
                ? error.message
                : "Ocurrió un error desconocido.";
        console.error("Error al cargar los países:", message);

        countriesContainer.innerHTML = renderError(message);

        const retryButton: HTMLButtonElement | null =
            document.querySelector<HTMLButtonElement>(
                "#retry-button",
            );

        retryButton?.addEventListener(
            "click",
            (): void => {
                void loadCountries();
            },
        );
    }
}

function applyFilter(): void {
    if (
        !countrySearch ||
        !regionFilter ||
        !countriesContainer
    ) {
        return;
    }

    const query: string = countrySearch.value;
    const region: string = regionFilter.value;

    const filteredCountries: Country[] =
        filterCountries(
            allCountries,
            query,
            region,
        );

    if (filteredCountries.length === 0) {
        countriesContainer.innerHTML =
            renderEmpty(query);
        return;
    }

    renderCountryGrid(filteredCountries);
}

// Eventos de entrada y selección para la búsqueda
countrySearch?.addEventListener(
    "input",
    (): void => {
        if (searchTimer !== undefined) {
            clearTimeout(searchTimer);
        }

        searchTimer = setTimeout(
            applyFilter,
            300,
        );
    },
);

regionFilter?.addEventListener(
    "change",
    applyFilter,
);



// 7. SISTEMA DE RUTAS (ROUTER)


async function router(): Promise<void> {
    if (!homeView || !detailView) {
        console.error("Faltan #home-view o #detail-view en el DOM.");
        return;
    }

    const hash = window.location.hash;
    const match = hash.match(/^#\/country\/([A-Za-z]{2,3})$/);

    if (!match) {
        homeView.hidden = false;
        detailView.hidden = true;
        return;
    }

    const code = match[1] ?? "";
    homeView.hidden = true;
    detailView.hidden = false;
    detailView.innerHTML = "<p>Cargando detalle del país…</p>";

    try {
        const country = await fetchCountryByCode(
            decodeURIComponent(code),
        );
        if (window.location.hash !== hash) return;
        detailView.innerHTML = renderDetail(country);
    } catch (error: unknown) {
        if (window.location.hash !== hash) return;
        console.error("Error al cargar el detalle:", error);
        detailView.innerHTML =
            '<p>No fue posible cargar el país.</p>' +
            '<a href="#/">Volver a países</a>';
    }
}

window.addEventListener("hashchange", () => {
    void router();
});



// 8. INICIALIZACIÓN DE LA APLICACIÓN


void loadCountries();
void router();