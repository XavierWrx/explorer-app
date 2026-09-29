import type { Country } from "../types/country";

// ======================================================
// FILTRAR PAÍSES POR NOMBRE Y REGIÓN
// ======================================================

export function filterCountries(
    countries: Country[],
    query: string,
    region: string,
): Country[] {

    const normalizeQuery: string =
        query
            .toLowerCase()
            .trim();

    return countries.filter(
        (country: Country): boolean => {

            const countryRegion: string =
                country.region.toLowerCase();

            const countryNames: string[] = [
                country.names.common,

                country.names.official ?? "",

                country.names.translations?.spa?.common ?? "",

                country.names.translations?.spa?.official ?? "",
            ]
                .map(
                    (name: string): string =>
                        name.toLowerCase(),
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