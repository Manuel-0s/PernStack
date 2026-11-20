# Catalogo de productos PERN

Proyecto inicial para desarrollar un catalogo de productos con React, Express y PostgreSQL.

## Requisitos

- Node.js 18 o superior.
- npm, incluido con Node.js.
- Git.

Comprueba las versiones instaladas:

```powershell
node --version
npm --version
```

## Instalacion

Clona el repositorio y entra en la carpeta del proyecto:

```powershell
git clone <URL_DEL_REPOSITORIO>
cd PernStack
```

Instala las dependencias del backend y del frontend:

```powershell
npm install

cd ../frontend
npm install
```

## Configuracion

El equipo comparte la configuracion de PostgreSQL/Neon. Solicita al responsable los valores necesarios y copia los archivos de ejemplo:

```powershell
cd backend
Copy-Item .env.example .env

cd ../frontend
Copy-Item .env.example .env
```

No subas los archivos `.env` a Git.

## Ejecutar el frontend

Desde la carpeta `frontend`:

```powershell
npm run dev
```

Abre la direccion que muestre Vite en la terminal, normalmente:

```text
http://localhost:5173
```

## Ejecutar las pruebas

Las pruebas se configuraran durante el desarrollo. Desde `backend` sera posible ejecutarlas con:

```powershell
npm test
```

## Estructura

- `backend/`: API Express y pruebas del servidor.
- `frontend/`: interfaz React creada con Vite.
- `database/schema.sql`: esquema de PostgreSQL para la tabla de productos.
- `backend/.env.example`: variables de entorno requeridas por el backend.
- `frontend/.env.example`: variables de entorno requeridas por el frontend.
