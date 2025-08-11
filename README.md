# Personal Finance Manager

Aplicación web desarrollada con React y TypeScript para llevar el control de tus finanzas personales. Permite registrar ingresos y gastos, categorizarlos y visualizar estadísticas en tiempo real gracias a Supabase como backend.

## Características principales

- **Autenticación de usuarios** (registro, inicio y cierre de sesión) mediante Supabase Auth.
- **CRUD de transacciones** (crear, editar, eliminar, listar) con validaciones y feedback inmediato.
- **Categorías personalizadas**: usa categorías por defecto o crea las tuyas.
- **Dashboard interactivo**: tarjetas de resumen y gráficas dinámicas con Recharts.
- **Rutas protegidas** con `ProtectedRoute` y React Router DOM v7.
- **Diseño responsive** basado en Tailwind CSS.

## Tecnologías utilizadas

- React 18 + TypeScript
- Vite
- Tailwind CSS 3
- Supabase (Base de datos y autenticación)
- React Router DOM v7
- Recharts
- date-fns
- lucide-react (iconos)
- ESLint / TypeScript-ESLint

## Estructura del proyecto

```text
personalFinanceManager/
├── src/
│   ├── components/        # Componentes reutilizables y UI
│   │   ├── layout/        # Navbar, ProtectedRoute, etc.
│   │   ├── dashboard/     # StatsCards, ExpenseChart, ...
│   │   └── …
│   ├── pages/             # Vistas principales (Home, Dashboard…)
│   ├── hooks/             # Hooks personalizados (useAuth, useTransactions…)
│   ├── services/          # Cliente Supabase
│   ├── utils/             # Funciones auxiliares
│   └── types/             # Tipos y modelos
│
├── .env.example           # Variables de entorno requeridas
├── tailwind.config.js     # Configuración Tailwind CSS
├── vite.config.ts         # Configuración Vite
└── package.json           # Scripts y dependencias
```

## Configuración e instalación

1. **Clona** el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/personalFinanceManager.git
   cd personalFinanceManager
   ```
2. **Variables de entorno**: copia `.env.example` a `.env` y completa `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
3. **Instala dependencias**:
   ```bash
   npm install
   ```
4. **Levanta el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   La app estará disponible en `http://localhost:5173`.

## Configuración de Supabase

1. Crea un nuevo proyecto en Supabase y copia la **Project URL** y el **Anon key** en tu `.env`.
2. Crea las tablas y políticas recomendadas:

### Tabla `transactions`
| Columna      | Tipo                 | Descripción                         |
|--------------|----------------------|-------------------------------------|
| id           | uuid (PK)            | Identificador único                 |
| user_id      | uuid (FK → auth)     | Usuario propietario                 |
| amount       | numeric(10,2)        | Monto (+ ingreso / – gasto)         |
| type         | text                 | "income" o "expense"               |
| category     | text                 | Categoría                           |
| date         | date                 | Fecha de la transacción             |
| description  | text                 | Opcional                            |
| created_at   | timestamptz default  | Marca de creación                   |

### Tabla `categories`
| Columna  | Tipo     | Descripción             |
|----------|----------|-------------------------|
| id       | uuid PK  | Identificador único     |
| user_id  | uuid FK  | Usuario propietario     |
| name     | text     | Nombre de la categoría  |

Habilita **RLS** y añade una policy para que `user_id = auth.uid()`.

## Scripts disponibles

| Comando            | Descripción                         |
|--------------------|-------------------------------------|
| `npm run dev`      | Servidor de desarrollo con Vite     |
| `npm run build`    | Compilación optimizada en `dist/`   |
| `npm run preview`  | Previsualizar la build              |
| `npm run lint`     | Ejecutar ESLint                     |

## Despliegue

Genera la build con `npm run build` y despliega la carpeta `dist/` en tu plataforma favorita (Vercel, Netlify, Cloudflare Pages, etc.). No olvides añadir las variables de entorno.

## Contribuciones

¡Las PRs y issues son bienvenidas! Asegúrate de ejecutar `npm run lint` antes de enviar tu contribución.

## Licencia

Distribuido bajo la licencia MIT.
