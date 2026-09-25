// src/render/countryCard.ts
import type { Country } from '../types/country';
import { formatPopulation } from '../utils/format';

export function createCountryCard(country: Country): string {
    const countryName =
        country.names?.translations?.spa?.common ||
        country.names?.common ||
        'Awan naganna a nasion';

    const capitalName = country.capitals?.[0]?.name || 'Awan nailista a kabesera';

    const flagUrl =
        country.flag?.url_svg ||
        country.flag?.url_png ||
        '/src/assets/Mosaico.svg';

    const flagDescription =
        country.flag?.description && country.flag.description.trim() !== ''
            ? country.flag.description
            : `Bandera ti ${countryName}`;

    const formattedPopulation = formatPopulation(country.population);

    return `
    <article
      class="w-full bg-surface-background rounded-rd-lg border-2 border-brand-accent p-4 flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus-within:ring-2 focus-within:ring-brand-accent">
      <div>
        <h3 class="font-roboto font-bold text-center text-lg mb-4 text-texto-secondary">
          ${countryName}
        </h3>

        <div class="w-full h-36 bg-surface-color-background rounded-rd-md mb-4 border border-brand-primary overflow-hidden flex items-center justify-center">
          <img
            src="${flagUrl}"
            alt="${flagDescription}"
            loading="lazy"
            class="w-full h-full object-cover" />
        </div>

        <ul class="space-y-2 text-xs font-medium text-texto-secondary">
          <li class="flex items-center justify-between">
            <span class="flex items-center gap-2 font-bold text-surface-icon-color">
              <img src="/src/assets/Poblacion.svg" alt="" class="w-4 h-4" />
              Población:
            </span>
            <span>${formattedPopulation}</span>
          </li>
          <li class="flex items-center justify-between">
            <span class="flex items-center gap-2 font-bold text-surface-icon-color">
              <img src="/src/assets/Region.svg" alt="" class="w-4 h-4" />
              Región:
            </span>
            <span>${country.region}</span>
          </li>
          <li class="flex items-center justify-between">
            <span class="flex items-center gap-2 font-bold text-surface-icon-color">
              <img src="/src/assets/Capital.svg" alt="" class="w-4 h-4" />
              Capital:
            </span>
            <span>${capitalName}</span>
          </li>
        </ul>
      </div>

      <a
        href="/Respuesta.html?country=${encodeURIComponent(countryName)}"
        aria-label="Kitaen ti ad-adu pay nga impormasion maipapan iti ${countryName}"
        class="mt-6 w-full bg-brand-button-default hover:bg-brand-button-hover active:scale-95 text-surface-icon-color font-roboto font-bold py-2.5 rounded-rd-sm text-xs transition-all duration-200 cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary flex items-center justify-center">
        Más información
      </a>
    </article>
  `;
}