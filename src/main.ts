// src/main.ts
import { fetchCountries } from './api/countries';
import { renderCountries, renderError } from './render/countryGrid';

async function initializeApp(): Promise<void> {
  try {
    const countries = await fetchCountries();
    renderCountries(countries);
  } catch (error: unknown) {
    let errorMessage = 'Adda saan a ninamnama a biddut a napasamak.';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error('Biddut iti panagkarga:', error);
    renderError(errorMessage);
  }
}

void initializeApp();