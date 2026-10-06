import "./style.css";

import { fetchCountries } from "./api/countries";
import { createCountryCard } from "./render/countryCard";
import type { Country } from "./types/country";
import { formatPopulation, getRequiredElement } from "./utils/format";

const countryNameElement = getRequiredElement<HTMLElement>("#country-name");
const populationElement = getRequiredElement<HTMLElement>("#country-population");
const capitalElement = getRequiredElement<HTMLElement>("#country-capital");
const regionElement = getRequiredElement<HTMLElement>("#country-region");
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

function showNotFound(): void {
    countryNameElement.textContent = "País no encontrado";
    populationElement.textContent = "Sin información";
    capitalElement.textContent = "Sin información";
    regionElement.textContent = "Sin información";
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
        capitalElement.textContent =
            country.capitals?.[0]?.name || "Sin información";
        regionElement.textContent = country.region || "Sin información";

        const flagUrl = country.flag?.url_svg || country.flag?.url_png;
        if (flagUrl) {
            flagElement.src = flagUrl;
            flagElement.alt =
                country.flag?.description || `Bandera de ${countryName}`;
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
        relatedCountriesElement.textContent =
            "Verifica tu conexión e inténtalo nuevamente.";
    }
}

void loadCountryDetails();
