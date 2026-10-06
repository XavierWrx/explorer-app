import type { Country } from "./country";

export interface CountryNameNative {
    common?: string;
    official?: string;
}

export interface CountryDetailCurrency {
    name: string;
    symbol?: string;
}

export interface CountryDetail extends Country {
    names: Country["names"] & {
        native?: Record<string, CountryNameNative>;
        subregion?: string;
        tlds?: string[];
        currencies?: Record<string, CountryDetailCurrency>;
        languages?: Record<string, string>;
        borders?: string[];
    };
}
