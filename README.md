EXPLORER APP

DESCRIPCIÓN
Aplicación web para explorar países del mundo. Permite buscar por nombre,
filtrar por región y consultar fichas con datos como bandera, población,
capital, idiomas, superficie, coordenadas y moneda. También muestra países
relacionados de la misma región.

STACK
- TypeScript
- Vite
- Tailwind CSS 4
- pnpm
- REST Countries API v5
- API serverless en Vercel para conectar con REST Countries

ENLACES
- Producción: https://explorer-app-univo1.vercel.app
- Repositorio: https://github.com/XavierWrx/explorer-app.git
- PR más reciente (fusionado): https://github.com/XavierWrx/explorer-app/pull/2

EJECUCIÓN LOCAL
1. Requiere Node.js y pnpm.
2. Instalar dependencias:
   pnpm install
3. Crear un archivo .env en la raíz del proyecto y configurar la clave:
   REST_COUNTRIES_API_KEY=tu_clave
   No compartir ni subir la clave al repositorio.
4. Iniciar el servidor de desarrollo:
   pnpm dev
5. Abrir en el navegador la URL local que indique Vite.

COMPILACIÓN Y VISTA PREVIA
- Compilar para producción: pnpm build
- Servir localmente la compilación: pnpm preview
