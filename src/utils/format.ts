// src/utils/format.ts

import type { Country } from '../types/country';

const populationFormatter = new Intl.NumberFormat('es-SV');

export function formatPopulation(population: number): string {
    if (typeof population !== 'number' || isNaN(population)) {
        return 'Awan datos';
    }
    return populationFormatter.format(population);
}

export function getCapital(country: Country): string {
    return country.capitals?.[0]?.name || 'Sin capital registrada';
}

export function getFlagDescription(country: Country): string {
    return country.flag?.description?.trim()
        ? country.flag.description
        : `Bandera de ${country.names.common}`;
}

export function getRequiredElement<T extends HTMLElement>(selector: string): T {
    const element = document.querySelector<T>(selector);
    if (!element) {
        throw new Error(`Saan a masarakan ti elemento a "${selector}" iti DOM.`);
    }
    return element;
}