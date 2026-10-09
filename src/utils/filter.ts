import type { Country } from "../types/country";

// ======================================================
// FILTRAR PAÍSES POR NOMBRE Y REGIÓN
// ======================================================

export function filterCountries(
    countries: Country[],
    query: string,
    region: string,
): Country[] {

    const normalize = (value: string): string =>
        value
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();

    const normalizeQuery: string = normalize(query);

    return countries.filter(
        (country: Country): boolean => {

            const countryRegion: string =
                normalize(country.region);

            const countryNames: string[] = [
                country.names.common,

                country.names.official ?? "",

                country.names.translations?.spa?.common ?? "",

                country.names.translations?.spa?.official ?? "",
            ]
                .map(
                    (name: string): string =>
                    normalize(name),
                );

            const matchesName: boolean =
                countryNames.some(
                    (name: string): boolean =>
                        name.includes(
                            normalizeQuery,
                        ),
                );

            const matchesRegion: boolean =
                countryRegion.includes(
                    normalizeQuery,
                );

            const matchesSelectedRegion: boolean =
                region === "" ||
                country.region === region;

            return (
                (
                    matchesName ||
                    matchesRegion
                ) &&
                matchesSelectedRegion
            );
        },
    );
}