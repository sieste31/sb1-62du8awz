# CLAUDE.md

必ず日本語で回答してください。

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev`
- **Build**: `npm run build` (TypeScript compilation + Vite build)
- **Build with prerendering**: `npm run build:prerender` (includes static page generation)
- **Linting**: `npm run lint` (ESLint for TypeScript files)
- **Preview**: `npm run preview` (serve built files)

## Architecture Overview

This is a React SPA (migrated from Next.js) built with Vite, TypeScript, and Tailwind CSS for managing batteries and devices. The app uses Supabase for backend services and authentication.

### Key Technologies

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **State Management**: Zustand + TanStack Query
- **Routing**: React Router DOM
- **i18n**: react-i18next (Japanese/English)
- **Image Processing**: react-easy-crop + browser-image-compression

### Project Structure

- **`src/components/`**: Feature-based component organization
  - `Battery/`: Battery group management (list, forms, details, usage history)
  - `Device/`: Device management (list, forms, details, battery selection)
  - `Demo/`: Demo mode components with hardcoded data
  - `common/`: Shared UI components
- **`src/lib/`**: Core utilities and configurations
  - `api/`: Supabase API layer (CRUD operations)
  - `supabase.ts`: Supabase client with retry logic
  - `store.ts`: Zustand stores with query integration
  - `query.ts`: TanStack Query hooks
  - `database.types.ts`: Auto-generated Supabase types
- **`src/locales/`**: Translation files for i18n
- **`supabase/migrations/`**: Database schema migrations

### State Management Pattern

The app uses a hybrid approach combining Zustand for client state and TanStack Query for server state:

1. **Query hooks** (`src/lib/query.ts`) handle server state fetching
2. **Store hooks** (`src/lib/store.ts`) combine query data with Zustand for optimistic updates
3. Components use store hooks like `useBatteryGroupsStore()`, `useDeviceStore(id)`

### Key Features

- **User Plans**: Free/Premium/Business tiers with resource limits (battery groups, devices)
- **Demo Mode**: Special user context with hardcoded data for demonstrations
- **Image Management**: Upload, crop, and compression with Supabase Storage
- **Multilingual**: Japanese/English support with browser language detection
- **Authentication**: Supabase Auth integration

### Database Schema

Main entities:
- `user_plans`: User subscription tiers and limits
- `battery_groups`: Collections of batteries with metadata
- `batteries`: Individual battery instances with status/device assignment
- `devices`: Electronic devices that use batteries
- `battery_usage_history`: Historical tracking of battery changes

### Demo Mode

The app includes a demo mode (`src/components/Demo/DemoModeContext.tsx`) that provides hardcoded data for users to explore features without creating accounts. Demo data includes pre-defined battery groups and devices.

### Authentication & Authorization

- Supabase Auth handles user sessions
- Row Level Security (RLS) policies restrict data access by user
- Demo users have special access patterns defined in `src/lib/demo.ts`

### Environment Variables

Required Supabase configuration:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`