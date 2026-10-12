// src/types/country.ts

export interface CountryTranslation {
    common?: string | null;
    official?: string | null;
}

export interface CountryNames {
    common: string;
    official?: string | null;
    native?: Record<string, CountryTranslation | null | undefined> | null;
    translations?: ({
        spa?: CountryTranslation | null;
        [key: string]: CountryTranslation | null | undefined;
    }) | null;
}

export interface CountryCodes {
    alpha_2?: string | null;
    alpha_3?: string | null;
}

export interface CountryFlag {
    url_svg?: string | null;
    url_png?: string | null;
    description?: string | null;
}

export interface CountryCapital {
    name: string;
    coordinates?: {
        lat: number | null;
        lng: number | null;
    } | null;
}

export interface CountryArea {
    kilometers?: number | null;
    miles?: number | null;
}

export interface CountryCoordinates {
    lat?: number | null;
    lng?: number | null;
}

export interface CountryLanguage {
    code?: string | null;
    name?: string | null;
    native_name?: string | null;
}

export interface CountryCurrency {
    code?: string | null;
    name: string;
    symbol?: string | null;
}

export interface Country {
    names: CountryNames;
    capitals?: CountryCapital[] | null;
    codes?: CountryCodes | null;
    flag?: CountryFlag | null;
    population?: number | null;
    region?: string | null;
    subregion?: string | null;
    tlds?: string[] | null;
    borders?: string[] | null;
    area?: CountryArea | null;
    coordinates?: CountryCoordinates | null;
    languages?: CountryLanguage[] | null;
    currencies?: CountryCurrency[] | null;
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