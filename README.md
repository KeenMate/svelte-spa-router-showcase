# Svelte SPA Router - Showcase

This is the official documentation and showcase site for `@keenmate/svelte-spa-router`, built with SvelteKit and deployed as a static site.

## Requirements

**Node.js 22+ Required**

This project requires Node.js version 22 or higher for building. Node.js 20 has compatibility issues with Svelte 5 that cause runtime errors.

```bash
node --version  # Should show v22.x.x or higher
```

## Development

```bash
npm install
npm run dev
```

Visit http://localhost:5173

## Building

```bash
npm run build
```

Output: `build/` directory (static site)

## Docker

Build the showcase as a static site served by nginx:

```bash
docker build -t svelte-spa-router-showcase .
docker run -p 8080:80 svelte-spa-router-showcase
```

Visit http://localhost:8080

## Project Structure

- `src/routes/` - SvelteKit file-based routing
  - `+page.svelte` - Home page
  - `getting-started/+page.svelte` - Getting started guide
  - `examples/+page.svelte` - Live examples
  - `features/*/+page.svelte` - Feature documentation pages
- `src/lib/components/` - Reusable components
- `static/` - Static assets

## Dependencies

- **@keenmate/svelte-spa-router** - The router library (linked from parent directory)
- **@keenmate/svelte-docs** - Documentation component library
- **Bootstrap 5** - Styling framework
- **SvelteKit** - Static site generator
 
