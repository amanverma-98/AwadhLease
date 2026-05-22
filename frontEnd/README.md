# AwadhLease

Production-ready frontend for an AI-native property management and rental marketplace SaaS.

## Stack
- React 19 + Vite
- React Router DOM v7
- TailwindCSS
- shadcn-style UI components
- Framer Motion
- Recharts
- Zustand
- Axios
- Lucide React

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set environment variables in a .env file:
   ```bash
   VITE_API_URL=http://localhost:8000
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```

## Scripts
- `npm run dev` - start development server
- `npm run build` - production build
- `npm run preview` - preview production build
- `npm run lint` - lint codebase

## App Overview
- Public marketplace landing page with filters and listings.
- Property details view with site visit and contact flows.
- Landlord dashboard with KPIs, AI insights, analytics, and management tools.
- Tenant dashboard with payments, maintenance, lease, and notifications.
- AI assistant page wired to the chat API.

## Project Structure
- `src/api` - Axios client
- `src/components` - reusable UI
- `src/data` - mock data
- `src/layouts` - shared layouts
- `src/pages` - routes
- `src/store` - Zustand stores
- `src/services` - API services
- `src/utils` - helpers
