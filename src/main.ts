
// 1. IMPORTACIONES


import "./style.css";

import { fetchCountries } from "./api/countries";

import {
    renderCountries,
    renderError,
} from "./render/countryGrid";

import type { Country } from "./types/country";

import { filterCountries } from "./utils/filter";

import {
    renderEmpty,
    renderLoading,
} from "./render/states";



// 2. REFERENCIAS DEL HTML


const countrySearch: HTMLInputElement | null =
    document.querySelector<HTMLInputElement>(
        'input[name="query"]',
    );

const regionFilter: HTMLSelectElement | null =
    document.querySelector<HTMLSelectElement>(
        "#region-filter",
    );

const countriesContainer: HTMLElement | null =
    document.querySelector<HTMLElement>(
        "#country-container",
    );



// 3. VARIABLES GLOBALES


let allCountries: Country[] = [];

let searchTimer:
    ReturnType<typeof setTimeout> | undefined;

const INITIAL_VISIBLE_COUNTRIES: number = 8;



// 4. CARGA DE PAÍSES


async function loadCountries(): Promise<void> {

    if (!countriesContainer) {

        console.error(
            "No se encontró #country-container.",
        );

        return;
    }

    countriesContainer.innerHTML =
        renderLoading();

    try {

        allCountries =
            await fetchCountries();

        if (allCountries.length === 0) {

            countriesContainer.innerHTML =
                renderEmpty("");

            return;
        }

        renderCountries(
            allCountries.slice(
                0,
                INITIAL_VISIBLE_COUNTRIES,
            ),
        );

    } catch (error: unknown) {

        const message: string =
            error instanceof Error
                ? error.message
                : "Ocurrió un error desconocido.";

        console.error(
            "Error al cargar países:",
            message,
        );

        renderError(
            "Verifica tu conexión e inténtalo nuevamente.",
        );
    }
}



// 5. FILTRADO DE PAÍSES


function applyFilter(): void {

    if (
        !countrySearch ||
        !regionFilter ||
        !countriesContainer
    ) {
        return;
    }

    const query: string =
        countrySearch.value;

    const region: string =
        regionFilter.value;

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

    renderCountries(
        filteredCountries,
    );
}



// 6. EVENTO DE ESCRITURA


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



// 7. EVENTO DE REGIÓN


regionFilter?.addEventListener(
    "change",
    (): void => {
        applyFilter();
    },
);



// 9. INICIALIZACIÓN


void loadCountries();