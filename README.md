# Frontend Beneficiarios

Aplicación web para gestionar beneficiarios con operaciones CRUD completas. Desarrollada con React, TypeScript, Vite, React Router, React Hook Form y TanStack Query.

## Características

 ✅ Listado de beneficiarios con filtros y paginación
 ✅ Crear, editar y eliminar beneficiarios
 ✅ Validación de formularios con Zod
 ✅ Gestión de tipos de documentos de identidad
 ✅ Interfaz moderna con Tailwind CSS
 ✅ Manejo de estado con React Query
 ✅ TypeScript strict mode habilitado

## Requisitos previos

- Node.js 18+ 
- npm o yarn

## Instalación y uso

### 1. Clonar el repositorio

```bash
git clone <tu-repo>
cd frontend-beneficiarios
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear unn archivo `.env` en la raíz del proyecto:

```env
VITE_API_BASE_URL=http://localhost:5063/
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`


## Estructura del proyecto

```
src/
├── app/                    # Configuración de la app
│   ├── config/            # Constantes y variables de entorno
│   ├── providers/         # Providers (Query Client, etc)
│   └── routes/            # Rutas y layout
├── features/              # Módulos por feature
│   ├── beneficiaries/     # Feature de beneficiarios
│   └── documents/         # Feature de tipos de documento
└── shared/                # Código compartido
    ├── api/              # Cliente HTTP y configuración
    ├── hooks/            # Custom hooks
    ├── types/            # Tipos TypeScript
    ├── ui/               # Componentes reutilizables
    └── utils/            # Utilidades
```

## Scripts disponibles

| Comando | Descripción |
|---------|------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Compila para producción |


## Tecnologías principales

- **React 19.2** - Framework UI
- **TypeScript 5.9** - Tipado estático
- **Vite 7** - Build tool
- **React Router 7** - Enrutamiento
- **React Hook Form 7** - Gestión de formularios
- **TanStack Query 5** - Gestión de estado del servidor
- **Zod 4.3** - Validación de esquemas
- **Tailwind CSS 4.1** - Estilos


## API Base

Por defecto, la aplicación espera una API en `http://localhost:5063/`. Ajusta `VITE_API_BASE_URL` según tu entorno.

