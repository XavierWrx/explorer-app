import type { Country, CountryTranslation } from "./country";

export interface CountryDetailCurrency {
    code?: string;
    name: string;
    symbol?: string;
}

export interface CountryDetailLanguage {
    name?: string;
    native_name?: string;
}

export interface CountryDetail extends Country {
    names: Country["names"] & {
        native?: Record<string, CountryTranslation | undefined>;
    };

    subregion?: string;
    tlds?: string[];

    currencies?: CountryDetailCurrency[];

    languages?: CountryDetailLanguage[];

    borders?: string[];
}