// src/types/country.ts

export interface CountryTranslation {
    common: string;
    official: string;
}

export interface CountryNames {
    common: string;
    official?: string;
    translations?: {
        spa?: CountryTranslation;
        [key: string]: CountryTranslation | undefined;
    };
}

export interface CountryCodes {
    alpha_2?: string;
    alpha_3?: string;
}

export interface CountryFlag {
    url_svg?: string;
    url_png?: string;
    description?: string;
}

export interface CountryCapital {
    name: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}

export interface Country {
    names: CountryNames;
    capitals?: CountryCapital[];
    codes?: CountryCodes;
    flag?: CountryFlag;
    population: number;
    region: string;
}

export interface CountryDataMeta {
    total: number;
    count: number;
    limit: number;
    offset: number;
    more: boolean;
}

export interface CountryDataPayload {
    meta: CountryDataMeta;
    objects: Country[];
}

export interface CountryResponse {
    data: CountryDataPayload;
}