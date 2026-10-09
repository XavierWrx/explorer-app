// src/render/countryGrid.ts
import type { Country } from '../types/country';
import { createCountryCard } from './countryCard';
import { getRequiredElement } from '../utils/format';

export function renderCountries(countries: Country[]): void {
    const container = getRequiredElement<HTMLElement>('#country-container');
    container.innerHTML = countries.map(createCountryCard).join('');
}

export function renderError(message: string): void {
    const container = getRequiredElement<HTMLElement>('#country-container');
    container.innerHTML = `
    <div role="alert" class="col-span-full w-full p-6 rounded-rd-md bg-surface-background border-2 border-brand-accent text-surface-icon-color text-center font-roboto text-sm">
      <p class="font-bold mb-1">No pudimos cargar los países</p>
      <p class="text-texto-secondary">${message}</p>
    </div>
  `;
}