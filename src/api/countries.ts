import type { Country, CountryResponse } from "../types/country";

const API_KEY: string | undefined =
    import.meta.env.VITE_REST_CONTRIES_API_KEY?.trim();
const API_URL = "/api-proxy/countries/v5";
const PAGE_SIZE = 100;

let countriesPromise: Promise<Country[]> | undefined;

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function isCountryResponse(value: unknown): value is CountryResponse {
    if (!isRecord(value) || !isRecord(value.data)) {
        return false;
    }

    const { meta, objects } = value.data;
    if (
        !isRecord(meta) ||
        !Array.isArray(objects) ||
        !Number.isFinite(meta.total) ||
        !Number.isFinite(meta.count) ||
        !Number.isFinite(meta.limit) ||
        !Number.isFinite(meta.offset) ||
        typeof meta.more !== "boolean"
    ) {
        return false;
    }

    return objects.every(
        (country: unknown): boolean =>
            isRecord(country) &&
            isRecord(country.names) &&
            typeof country.names.common === "string" &&
            typeof country.population === "number" &&
            typeof country.region === "string",
    );
}

async function loadCountries(): Promise<Country[]> {
    if (!API_KEY) {
        throw new Error(
            "Falta configurar VITE_REST_CONTRIES_API_KEY en el archivo .env.",
        );
    }

    const countries: Country[] = [];
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
        const url = new URL(API_URL, window.location.origin);
        url.search = new URLSearchParams({
            limit: String(PAGE_SIZE),
            offset: String(offset),
            pretty: "1",
        }).toString();

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(
                `Error al cargar países: HTTP ${response.status} ${response.statusText}`.trim(),
            );
        }

        const result: unknown = await response.json();
        if (!isCountryResponse(result)) {
            throw new Error(
                "La respuesta del servicio de países tiene un formato incorrecto.",
            );
        }

        const { objects, meta } = result.data;
        countries.push(...objects);
        hasMore = meta.more;

        if (hasMore) {
            if (meta.count <= 0 || meta.offset < offset) {
                throw new Error(
                    "El servicio de países indicó que hay más resultados, pero no avanzó la página.",
                );
            }
            offset = meta.offset + meta.count;
        }
    }

    return countries;
}

export function fetchCountries(): Promise<Country[]> {
    if (!countriesPromise) {
        countriesPromise = loadCountries().catch((error: unknown) => {
            countriesPromise = undefined;
            throw error;
        });
    }

    return countriesPromise;
}
