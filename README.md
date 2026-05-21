# Mi Boleta — Frontend (Next.js)

Aplicación web para registrar y administrar boletas, rifas, loterías y sorteos, consumiendo la API REST oficial del proyecto **mi-boleta-api**. Implementada con **Next.js 15 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS**, **Zustand** (sesión persistida) y **React Hook Form + Zod** (validación de formularios).

## Requisitos

- **Node.js** 20 LTS o superior (recomendado)
- **npm** 10+
- Backend **mi-boleta-api** en ejecución (por defecto `http://localhost:4000`)

## Variables de entorno

Crea un archivo `.env.local` en la raíz del frontend (no lo subas al repositorio):

| Variable | Obligatoria | Descripción |
|----------|-------------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | **Sí** en producción; en local tiene valor por defecto | URL base de la API **incluyendo** `/api/v1`. Ejemplo: `http://localhost:4000/api/v1` |

Copia desde el ejemplo:

```bash
cp .env.example .env.local
```

> **Nota CORS:** en producción el backend debe permitir el origen donde esté desplegado el frontend (Vercel, Netlify, etc.).

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo en [http://localhost:3000](http://localhost:3000) |
| `npm run build` | Compilación de producción |
| `npm start` | Sirve la build (tras `npm run build`) |
| `npm run lint` | ESLint (config Next.js) |

## Cómo levantar el proyecto

1. Instala dependencias: `npm install`
2. Configura `.env.local` (ver sección anterior)
3. Asegúrate de que la API esté corriendo (`npm run dev` en el repo del backend, típicamente puerto **4000**)
4. Arranca el frontend: `npm run dev`

## Arquitectura (Clean Architecture)

La lógica se organiza por capas para separar reglas de negocio, detalles técnicos y la interfaz, alineado con la rúbrica del curso.

```text
src/
├── app/                      # Next.js App Router (rutas, layouts, páginas)
├── domain/                   # Núcleo: entidades y contratos (puertos)
│   ├── entities/             # User, Ticket (tipos del dominio)
│   └── repositories/       # Interfaces AuthRepository, TicketRepository, Admin…
├── infrastructure/         # Adaptadores: HTTP, implementaciones de repositorios
│   ├── di/container.ts       # Composición: cliente API + repositorios concretos
│   ├── http/                 # Cliente HTTP centralizado (JWT, errores, envelope { data, meta })
│   └── repositories/         # AuthApiRepository, TicketsApiRepository, AdminTickets…
└── presentation/             # UI reutilizable, validación de formularios, estado de UI
    ├── components/           # Layout, formularios, primitivos (botones, campos…)
    ├── hooks/                # Hidratación de sesión, carga de datos agregados
    ├── stores/               # Zustand + persist (token + usuario)
    ├── validation/           # Esquemas Zod
    └── lib/                  # Utilidades de presentación (fechas, etc.)
```

### Flujo de datos

1. Las **páginas** (`src/app/...`) son principalmente componentes cliente que orquestan la UI.
2. Los casos de uso llaman a **repositorios** expuestos desde `infrastructure/di/container.ts`.
3. El **cliente HTTP** (`createApiClient`) añade `Authorization: Bearer`, interpreta `{ data, meta }` y ante **401** con sesión activa limpia el store y redirige a `/login`.

## Mapa de rutas (rúbrica)

| Ruta | Descripción |
|------|-------------|
| `/` | Redirige a `/login` o `/dashboard` según sesión |
| `/login`, `/register` | Autenticación |
| `/dashboard` | Resumen: totales, próximos sorteos, pendientes, historial |
| `/tickets` | Listado propio con filtros y paginación |
| `/tickets/new` | Crear ticket |
| `/tickets/[id]` | Detalle, eliminar (con confirmación) |
| `/tickets/[id]/edit` | Edición parcial |
| `/admin` | Solo `role === "admin"`: listado global con `q`, estado, tipo, `userId` y paginación |

## Despliegue (rúbrica — criterio 11)

**Dificultad:** baja–media (~30–60 min si el backend ya está en Render). No hace falta tocar código; es configuración.

### Frontend (Vercel, recomendado para Next.js)

1. Sube el repo a GitHub (público).
2. En [vercel.com](https://vercel.com) → **Import Project** → elige el repo `mi-boleta-front`.
3. Framework: **Next.js** (detectado solo). Build: `npm run build`. Output: por defecto.
4. **Environment variable:**
   - `NEXT_PUBLIC_API_BASE_URL` = `https://TU-API.onrender.com/api/v1` (tu URL real + `/api/v1`).
5. Deploy → copia la URL (`https://mi-boleta-xxx.vercel.app`) y pégala en el README como **Demo**.

### Backend (si aún no está desplegado)

El API ya trae `render.yaml`. En Render necesitas `DATABASE_URL`, `JWT_SECRET`, `PORT`. Health: `/api/v1`.

### CORS (obligatorio en producción)

En el backend, el origen del frontend desplegado debe estar permitido (dominio de Vercel). Si solo funciona en local, casi siempre es CORS.

### Checklist rápido

| Paso | Tiempo aprox. |
|------|----------------|
| Cuenta Vercel + import repo | 5 min |
| Variable `NEXT_PUBLIC_API_BASE_URL` | 2 min |
| API en Render + migraciones | 15–30 min (si no existe) |
| CORS + probar login en la demo | 10 min |
| Link en README + captura | 5 min |

## Qué debes preparar tú (checklist)

1. **URL de la API** en `NEXT_PUBLIC_API_BASE_URL` (local o desplegada).
2. **Usuario administrador:** en la base de datos del backend, promover un usuario a `admin` (ver `readme.md` del API: `UPDATE users SET role = 'admin' WHERE email = '...'`).
3. **Demo desplegada** (Vercel u otro) y variables de entorno configuradas allí — criterio de despliegue de la rúbrica.
4. **Repositorio público** y README actualizado (este archivo).

No se requieren API keys externas ni secretos en el frontend: la API usa JWT emitido por el propio backend tras login.

## Calidad y buenas prácticas

- TypeScript estricto, sin `any` innecesario.
- Formularios con mensajes por campo (Zod + RHF) y errores de API visibles (409 en email de registro, mensajes en creación/edición).
- Estados de **carga**, **vacío** y **error** en listas y dashboard.
- **Tailwind** con paleta solicitada: primario naranja (`brand-primary`), cabeceras azul marino (`brand-navy`), fondos claros.

## Licencia

Proyecto académico — ajusta la licencia según tu curso o institución.
