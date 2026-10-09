// src/types/country.ts

export interface CountryTranslation {
    common?: string;
    official?: string;
}

export interface CountryNames {
    common: string;
    official?: string;
    native?: Record<string, CountryTranslation | undefined>;
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

export interface CountryArea {
    kilometers?: number;
    miles?: number;
}

export interface CountryCoordinates {
    lat?: number;
    lng?: number;
}

export interface CountryLanguage {
    code?: string;
    name?: string;
    native_name?: string;
}

export interface CountryCurrency {
    code?: string;
    name: string;
    symbol?: string;
}

export interface Country {
    names: CountryNames;
    capitals?: CountryCapital[];
    codes?: CountryCodes;
    flag?: CountryFlag;
    population: number;
    region: string;
    subregion?: string;
    tlds?: string[];
    borders?: string[];
    area?: CountryArea;
    coordinates?: CountryCoordinates;
    languages?: CountryLanguage[];
    currencies?: CountryCurrency[];
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