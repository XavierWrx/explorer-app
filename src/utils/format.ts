// src/utils/format.ts

const populationFormatter = new Intl.NumberFormat('es-SV');

export function formatPopulation(population: number): string {
    if (typeof population !== 'number' || isNaN(population)) {
        return 'Awan datos';
    }
    return populationFormatter.format(population);
}

export function getRequiredElement<T extends HTMLElement>(selector: string): T {
    const element = document.querySelector<T>(selector);
    if (!element) {
        throw new Error(`Saan a masarakan ti elemento a "${selector}" iti DOM.`);
    }
    return element;
}