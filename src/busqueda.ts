import "./style.css";

import { fetchCountries } from "./api/countries";

import { renderCountries } from "./render/countryGrid";

import type { Country } from "./types/country";

import { filterCountries } from "./utils/filter";

import {
    renderEmpty,
    renderError,
    renderLoading,
} from "./render/states";


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


const urlParams: URLSearchParams =
    new URLSearchParams(
        window.location.search,
    );


const queryFromUrl: string =
    urlParams.get("query") ?? "";


const regionFromUrl: string =
    urlParams.get("region-filter") ?? "";


if (countrySearch) {
    countrySearch.value = queryFromUrl;
}

if (regionFilter) {
    regionFilter.value = regionFromUrl;
}

let allCountries: Country[] = [];
let countriesLoaded = false;
let searchTimer: ReturnType<typeof setTimeout> | undefined;

function cancelPendingSearch(): void {
    if (searchTimer !== undefined) {
        clearTimeout(searchTimer);
        searchTimer = undefined;
    }
}

function applyFilters(): void {
    if (!countriesContainer) {
        console.error("No se encontró #country-container.");
        return;
    }

    if (!countriesLoaded) {
        return;
    }

    const query: string = countrySearch?.value.trim() ?? "";
    const region: string = regionFilter?.value ?? "";
    const filteredCountries: Country[] = filterCountries(
        allCountries,
        query,
        region,
    );

    if (filteredCountries.length === 0) {
        countriesContainer.innerHTML = renderEmpty(query);
        return;
    }

    renderCountries(filteredCountries);
}

async function loadCountries(): Promise<void> {
    if (!countriesContainer) {
        console.error(
            "No se encontró #country-container.",
        );
        return;
    }

    countriesContainer.innerHTML = renderLoading();

    try {
        allCountries = await fetchCountries();
        countriesLoaded = true;
        applyFilters();
    } catch (error: unknown) {
        const message: string =
            error instanceof Error
                ? error.message
                : "Ocurrió un error desconocido.";

        console.error("Error al buscar países:", message);
        countriesContainer.innerHTML = renderError(message);

        const retryButton =
            countriesContainer.querySelector<HTMLButtonElement>(
                "#retry-button",
            );
        retryButton?.addEventListener("click", (): void => {
            void loadCountries();
        });
    }
}

countrySearch?.addEventListener("input", (): void => {
    cancelPendingSearch();
    searchTimer = setTimeout((): void => {
        searchTimer = undefined;
        applyFilters();
    }, 300);
});

regionFilter?.addEventListener("change", (): void => {
    cancelPendingSearch();
    applyFilters();
});

void loadCountries();