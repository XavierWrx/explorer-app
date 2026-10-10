// src/render/countryCard.ts
import type { Country } from '../types/country';
import {
  formatPopulation,
  getCapital,
  getFlagDescription,
  getRegionName,
} from '../utils/format';

export function createCountryCard(country: Country): string {
  const countryName =
    country.names?.translations?.spa?.common ||
    country.names?.common ||
    'País sin nombre disponible';

  const capitalName = getCapital(country);
  const flagUrl = country.flag?.url_svg || country.flag?.url_png;
  const flagDescription = flagUrl ? getFlagDescription(country) : '';
  const formattedPopulation = formatPopulation(country.population);

  return `
    <article
      class="@container w-full bg-surface-background rounded-rd-lg border-2 border-brand-accent p-4 flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 focus-within:ring-2 focus-within:ring-brand-accent animate-fade-in">
      <div class="flex flex-col @min-[17.8125rem]:flex-row gap-4">
        ${flagUrl? 
        `<img
            src="${flagUrl}"
            alt="${flagDescription}"
            loading="lazy"
            class="aspect-3/2 w-full shrink-0 object-cover rounded-rd-md border border-brand-primary @min-[17.8125rem]:aspect-auto @min-[17.8125rem]:w-2/5" />`
            : `<div
            class="aspect-3/2 w-full min-h-36 shrink-0 rounded-rd-md border border-brand-primary bg-surface-color-background px-4 text-center text-sm font-medium text-texto-secondary flex items-center justify-center @min-[17.8125rem]:aspect-auto @min-[17.8125rem]:w-2/5"
            role="img"
            aria-label="Bandera no disponible para ${countryName}">
            Bandera no disponible
          </div>`
        }

        <div class="min-w-0 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="font-roboto font-bold mb-3 text-texto-secondary text-(length:--font-country-name)">
              ${countryName}
            </h3>

            <ul class="space-y-2 text-xs font-medium text-texto-secondary">
              <li class="flex items-center justify-between gap-2">
                <span class="flex items-center gap-2 font-bold text-surface-icon-color">
                  <img src="/src/assets/Poblacion.svg" alt="" class="w-4 h-4" />
                  Población:
                </span>
                <span>${formattedPopulation}</span>
              </li>
              <li class="flex items-center justify-between gap-2">
                <span class="flex items-center gap-2 font-bold text-surface-icon-color">
                  <img src="/src/assets/Region.svg" alt="" class="w-4 h-4" />
                  Región:
                </span>
                <span>${getRegionName(country.region)}</span>
              </li>
              <li class="flex items-center justify-between gap-2">
                <span class="flex items-center gap-2 font-bold text-surface-icon-color">
                  <img src="/src/assets/Capital.svg" alt="" class="w-4 h-4" />
                  Capital:
                </span>
                <span>${capitalName}</span>
              </li>
            </ul>
          </div>

          ${
            flagUrl
              ? `<a
            href="/Respuesta.html?country=${encodeURIComponent(countryName)}"
            aria-label="Más información sobre ${countryName}"
            class="mt-6 w-full bg-brand-button-default hover:bg-brand-button-hover active:scale-95 text-surface-icon-color font-roboto font-bold py-2.5 rounded-rd-sm text-xs transition-all duration-200 cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary flex items-center justify-center">
            Más información
          </a>`
              : ''
          }
        </div>
      </div>
    </article>
  `;
}
