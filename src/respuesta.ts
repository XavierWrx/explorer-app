import "./style.css";

import { fetchCountries } from "./api/countries";
import { createCountryCard } from "./render/countryCard";
import type { Country } from "./types/country";
import {
    formatPopulation,
    getCapital,
    getFlagDescription,
    getRequiredElement,
    getRegionName,
} from "./utils/format";
import { preventEmptySearch } from "./utils/searchForm";

const countrySearch =
    document.querySelector<HTMLInputElement>('input[name="query"]');
preventEmptySearch(countrySearch?.form ?? null, countrySearch);

const countryNameElement = getRequiredElement<HTMLElement>("#country-name");
const populationElement = getRequiredElement<HTMLElement>("#country-population");
const capitalElement = getRequiredElement<HTMLElement>("#country-capital");
const regionElement = getRequiredElement<HTMLElement>("#country-region");
const languageElement = getRequiredElement<HTMLElement>("#country-language");
const areaElement = getRequiredElement<HTMLElement>("#country-area");
const coordinatesElement =
    getRequiredElement<HTMLElement>("#country-coordinates");
const currencyElement = getRequiredElement<HTMLElement>("#country-currency");
const flagElement = getRequiredElement<HTMLImageElement>("#country-flag");
const relatedCountriesElement =
    getRequiredElement<HTMLElement>("#related-countries");

const selectedName = new URLSearchParams(window.location.search)
    .get("country")
    ?.trim();

function normalize(value: string): string {
    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

function getCountryName(country: Country): string {
    return country.names.translations?.spa?.common || country.names.common;
}

function getLanguages(country: Country): string {
    const languages = country.languages
        ?.map((language) => language.name)
        .filter((name): name is string => Boolean(name));

    return languages?.length ? languages.join(", ") : "Sin información";
}

function getArea(country: Country): string {
    const area = country.area?.kilometers;
    return typeof area === "number"
        ? `${new Intl.NumberFormat("es-SV").format(area)} km²`
        : "Sin información";
}

function getCoordinates(country: Country): string {
    const { lat, lng } = country.coordinates ?? {};
    if (typeof lat !== "number" || typeof lng !== "number") {
        return "Sin información";
    }

    return `${Math.abs(lat)}° ${lat < 0 ? "S" : "N"}, ${Math.abs(lng)}° ${lng < 0 ? "O" : "E"}`;
}

function getCurrencies(country: Country): string {
    const currencies = country.currencies?.map((currency) => {
        const code = currency.code ? ` (${currency.code})` : "";
        const symbol = currency.symbol ? ` ${currency.symbol}` : "";
        return `${currency.name}${code}${symbol}`;
    });

    return currencies?.length ? currencies.join(", ") : "Sin información";
}

function showNotFound(): void {
    countryNameElement.textContent = "País no encontrado";
    populationElement.textContent = "Sin información";
    capitalElement.textContent = "Sin información";
    regionElement.textContent = "Sin información";
    languageElement.textContent = "Sin información";
    areaElement.textContent = "Sin información";
    coordinatesElement.textContent = "Sin información";
    currencyElement.textContent = "Sin información";
    relatedCountriesElement.textContent =
        "Selecciona un país desde los resultados de búsqueda.";
}

async function loadCountryDetails(): Promise<void> {
    if (!selectedName) {
        showNotFound();
        return;
    }

    countryNameElement.textContent = "Cargando país...";
    populationElement.textContent = "Cargando...";
    capitalElement.textContent = "Cargando...";
    regionElement.textContent = "Cargando...";
    languageElement.textContent = "Cargando...";
    areaElement.textContent = "Cargando...";
    coordinatesElement.textContent = "Cargando...";
    currencyElement.textContent = "Cargando...";

    try {
        const countries = await fetchCountries();
        const normalizedSelection = normalize(selectedName);
        const country = countries.find((item) =>
            [
                item.names.common,
                item.names.official ?? "",
                item.names.translations?.spa?.common ?? "",
                item.names.translations?.spa?.official ?? "",
            ].some((name) => normalize(name) === normalizedSelection),
        );

        if (!country) {
            showNotFound();
            return;
        }

        const countryName = getCountryName(country);
        countryNameElement.textContent = countryName;
        populationElement.textContent = formatPopulation(country.population);
        capitalElement.textContent = getCapital(country);
        regionElement.textContent = country.region
            ? getRegionName(country.region)
            : "Sin información";
        languageElement.textContent = getLanguages(country);
        areaElement.textContent = getArea(country);
        coordinatesElement.textContent = getCoordinates(country);
        currencyElement.textContent = getCurrencies(country);

        const flagUrl = country.flag?.url_svg || country.flag?.url_png;
        if (flagUrl) {
            flagElement.src = flagUrl;
            flagElement.alt = getFlagDescription(country);
        }

        const relatedCountries = countries
            .filter(
                (item) =>
                    item !== country &&
                    item.region === country.region,
            )
            .slice(0, 2);
        relatedCountriesElement.innerHTML = relatedCountries
            .map(createCountryCard)
            .join("");
        if (relatedCountries.length === 0) {
            relatedCountriesElement.textContent =
                "No hay otros países de esta región disponibles.";
        }
    } catch (error: unknown) {
        const message =
            error instanceof Error
                ? error.message
                : "Ocurrió un error desconocido.";
        console.error("Error al cargar el país:", message);
        countryNameElement.textContent = "No pudimos cargar la información";
        populationElement.textContent = "Inténtalo nuevamente más tarde.";
        capitalElement.textContent = "—";
        regionElement.textContent = "—";
        languageElement.textContent = "—";
        areaElement.textContent = "—";
        coordinatesElement.textContent = "—";
        currencyElement.textContent = "—";
        relatedCountriesElement.textContent =
            "Verifica tu conexión e inténtalo nuevamente.";
    }
}

void loadCountryDetails();
