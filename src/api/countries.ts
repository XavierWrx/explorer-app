// src/api/countries.ts
import type { Country, CountryResponse } from '../types/country';

const API_KEY: string = import.meta.env.VITE_REST_CONTRIES_API_KEY;
const API_URL = '/api-proxy/countries/v5?limit=25&pretty=1';

export async function fetchCountries(): Promise<Country[]> {
    if (!API_KEY) {
        throw new Error('Awan ti API key iti VITE_REST_CONTRIES_API_KEY (.env)');
    }

    const response = await fetch(API_URL, {
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

    if (result?.data?.objects && Array.isArray(result.data.objects)) {
        return result.data.objects;
    }

    throw new Error('Ti estruktura ti API ket awanan iti data.objects');
}