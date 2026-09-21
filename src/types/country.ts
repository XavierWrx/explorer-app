// src/types/country.ts

export interface CountryName {
    common: string;
}

export interface CountryCodes {
    cca2: string;
}

export interface CountryFlag {
    svg: string;
    description: string;
}

export interface CountryCapital {
    name: string;
}

export interface Country {
    name: CountryName;
    codes?: CountryCodes;
    flag?: CountryFlag;
    capital?: CountryCapital[];
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