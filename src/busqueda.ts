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


async function searchCountries(): Promise<void> {

    if (!countriesContainer) {

        console.error(
            "No se encontró #country-container.",
        );

        return;
    }


    countriesContainer.innerHTML =
        renderLoading();


    try {

        const allCountries: Country[] =
            await fetchCountries();


        const query: string =
            countrySearch?.value.trim() ?? "";


        const region: string =
            regionFilter?.value ?? "";


        console.log(
            "Texto buscado:",
            query,
        );


        console.log(
            "Región seleccionada:",
            region,
        );


        const filteredCountries: Country[] =
            filterCountries(
                allCountries,
                query,
                region,
            );


        console.log(
            "Resultados:",
            filteredCountries,
        );


        if (
            filteredCountries.length === 0
        ) {

            countriesContainer.innerHTML =
                renderEmpty(query);

            return;
        }


        renderCountries(
            filteredCountries,
        );

    } catch (error: unknown) {

        const message: string =
            error instanceof Error
                ? error.message
                : "Ocurrió un error desconocido.";


        console.error(
            "Error al buscar países:",
            message,
        );


        countriesContainer.innerHTML = renderError(message);
    }
}


void searchCountries();