// src/api/countries.ts
import type { Country, CountryResponse } from '../types/country';

const API_KEY: string = import.meta.env.VITE_REST_CONTRIES_API_KEY;
const API_URL = '/api-proxy/countries/v5';
const PAGE_SIZE = 100;


export async function fetchCountries(): Promise<Country[]> {
    if (!API_KEY) {
        throw new Error('Awan ti API key iti VITE_REST_CONTRIES_API_KEY (.env)');
    }

    const countries: Country[] = [];
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
    const url = new URL(API_URL, window.location.origin);
    url.search = new URLSearchParams({
        limit: String(PAGE_SIZE),
        offset: String(offset),
        pretty: '1',
    }).toString();

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Biddut iti HTTP: ${response.status} - ${response.statusText}`);
    }

    const result = (await response.json()) as CountryResponse;

    const pageCountries = result?.data?.objects;
    const meta = result?.data?.meta;

    if (
        !Array.isArray(pageCountries) ||
        typeof meta?.more !== 'boolean' ||
        !Number.isFinite(meta.count) ||
        !Number.isFinite(meta.offset)
    ) {
        throw new Error('Ti estruktura ti API ket awanan iti datos ti nasion a mausar.');
    }

    countries.push(...pageCountries);
    hasMore = meta.more;
    if (hasMore) {
        if (meta.count <= 0) {
            throw new Error('Ti API ket nagbaga nga adda pay datos ngem awan ti nasarakan.');
        }
        offset = meta.offset + meta.count;
    }
    }

    return countries;
}