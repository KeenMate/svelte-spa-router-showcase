# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Documentation/showcase site for `@keenmate/svelte-spa-router` (a dual-mode SPA router for Svelte 5). Built with SvelteKit, prerendered to static HTML via `@sveltejs/adapter-static`.

**Important**: This site uses SvelteKit's file-based routing for its own navigation. The `@keenmate/svelte-spa-router` library is the *subject* being documented, not the routing mechanism of this site.

## Requirements

Node.js 22+ required. Node 20 has Svelte 5 compatibility issues.

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Dev server at http://localhost:5173
npm run build        # Build static site to /build
npm run preview      # Preview production build
npm run check        # TypeScript & Svelte type checking
```

### Library Development (linked local copy)

```bash
make link-lib        # Link ../svelte-spa-router as local dependency
make unlink-lib      # Unlink local library
make rebuild-lib     # Rebuild and relink the library
```

## Architecture

- **SvelteKit + adapter-static**: All routes prerendered at build time to static HTML
- **Styling**: SCSS with Bootstrap 5, plus `@keenmate/svelte-docs` for documentation components
- **CI/CD**: GitHub Actions workflows deploy `prod`, `uat`, and `dev` branches via shared KeenMate workflow
- **Docker**: Multi-stage build producing nginx-served static files

## Key Files

- `src/app.html` - HTML shell (includes analytics script)
- `src/app.scss` - Global styles (imports bootstrap + svelte-docs)
- `src/routes/+layout.svelte` - Root layout with navigation
- `src/routes/+layout.server.ts` - Navigation menu data and route metadata
- `src/lib/components/` - Shared components (Breadcrumbs, PageTitle) that integrate with `@keenmate/svelte-spa-router/helpers/route-metadata`
- `svelte.config.js` - Has custom `handleHttpError` to suppress 404s for `/api`, `/examples`, `/playground`, `/features` during prerendering

## Content Structure

Documentation pages live under `src/routes/features/*/+page.svelte`, each covering a router feature (guards, parameters, named-routes, permissions, etc.). Pages use components from `@keenmate/svelte-docs` for consistent documentation layout.
