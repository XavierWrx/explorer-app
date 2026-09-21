import './style.css'
// src/main.ts

import type { Country, CountryResponse } from './types/country';

const API_KEY: string = import.meta.env.VITE_REST_CONTRIES_API_KEY;

// Endpoint configurado  del proxy local con campos limitados y tope de 25 países
const API_URL =
    '/api-proxy/countries/v5?fields=name,codes,flag,capital,population,region&limit=25&pretty=1';

// Localizador de elementos obligatorios en el DOM
function getRequiredElement<T extends HTMLElement>(selector: string): T {
    const element = document.querySelector<T>(selector);
    if (!element) {
        throw new Error(`El elemento requerido "${selector}" no existe en el DOM.`);
    }
    return element;
}

// Obtener datos desde la API
async function fetchCountries(): Promise<Country[]> {
    if (!API_KEY) {
        throw new Error('API key no definida en VITE_REST_CONTRIES_API_KEY (.env)');
    }

    const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
    }

    const result = (await response.json()) as CountryResponse;

    // Accedemos a result.data.objects donde 
    if (result?.data?.objects && Array.isArray(result.data.objects)) {
        return result.data.objects;
    }

    throw new Error('La estructura devuelta por la API no contiene la propiedad data.objects.');
}


// Transformar el arreglo de países en tarjetas dinámicas
function renderCountries(countries: Country[]): void {
    const countryContainer = getRequiredElement<HTMLElement>('#country-container');

    // Mostramos en consola el primer elemento para verificar sus campos reales
    console.log('🔍 Estructura del primer país recibido:', countries[0]);

    // Formateador de población según la región de El Salvador (es-SV)
    const populationFormatter = new Intl.NumberFormat('es-SV');

    const cardsHTML = countries
        .map((country) => {
            // 1. Nombre seguro (evita el error si country.name es undefined o si viene directamente como string)
            const countryName =
                country.name?.common ??
                (typeof country.name === 'string' ? country.name : 'País sin nombre');

            // 2. Capital segura (índice 0 con encadenamiento opcional)
            const capitalName = country.capital?.[0]?.name ?? 'Sin capital registrada';

            // 3. Bandera y descripción segura
            const flagUrl = country.flag?.svg ?? '/src/assets/Mosaico.svg';
            const flagDescription =
                country.flag?.description && country.flag.description.trim() !== ''
                    ? country.flag.description
                    : `Bandera de ${countryName}`;

            // 4. Población segura
            const formattedPopulation =
                typeof country.population === 'number'
                    ? populationFormatter.format(country.population)
                    : 'No disponible';

            // 5. Región segura
            const regionName = country.region ?? 'No especificada';

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
                <span>${regionName}</span>
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
            aria-label="Ver más información de ${countryName}"
            class="mt-6 w-full bg-brand-button-default hover:bg-brand-button-hover active:scale-95 text-surface-icon-color font-roboto font-bold py-2.5 rounded-rd-sm text-xs transition-all duration-200 cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary flex items-center justify-center">
            Más información
          </a>
        </article>
      `;
        })
        .join('');

    countryContainer.innerHTML = cardsHTML;
}
// Inicialización de la vista con manejo accesible de errores
async function initializeApp(): Promise<void> {
    const countryContainer = getRequiredElement<HTMLElement>('#country-container');

    try {
        const countries = await fetchCountries();
        renderCountries(countries);
    } catch (error: unknown) {
        let errorMessage = 'Ocurrió un error inesperado al cargar los países.';

        // Type narrowing para extraer el mensaje de error de forma segura
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        console.error('Error durante la carga:', error);

        // Mensaje de alerta accesible ocupando todo el ancho de la grilla
        countryContainer.innerHTML = `
      <div role="alert" class="col-span-full w-full p-6 rounded-rd-md bg-red-50 border-2 border-red-300 text-red-700 text-center font-roboto text-sm">
        <p class="font-bold mb-1">No se pudieron cargar los países recomendados</p>
        <p>${errorMessage}</p>
      </div>
    `;
    }
}

// Ejecución inicial 
void initializeApp();