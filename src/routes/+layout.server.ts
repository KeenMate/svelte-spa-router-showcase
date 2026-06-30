import { readFileSync } from 'node:fs';
import type { PartialDocsConfig } from '@keenmate/svelte-docs';
import { mergeConfig, defaultConfig, generateSSRStyles } from '@keenmate/svelte-docs';

// Enable prerendering for all routes
export const prerender = true;
export const ssr = true;

// Version of the showcased library, resolved at build time (this server load runs on
// Node during prerender). Read the package.json by path rather than importing it:
// @keenmate/svelte-spa-router's "exports" map doesn't expose ./package.json, and a path
// read also resolves correctly through file:/link installs.
function showcasedVersion(): string {
	try {
		const pkg = JSON.parse(
			readFileSync('node_modules/@keenmate/svelte-spa-router/package.json', 'utf-8')
		);
		return `v${pkg.version}`;
	} catch {
		return '';
	}
}

const config: PartialDocsConfig = {
	site: {
		title: 'Svelte SPA Router',
		version: showcasedVersion(),
		description: 'Complete documentation for @keenmate/svelte-spa-router - A powerful dual-mode router for Svelte 5',
		keywords: ['svelte', 'sveltekit', 'router', 'spa', 'routing', 'navigation', 'hash', 'history', 'keenmate'],
		author: 'KeenMate',
		url: 'https://svelte-spa-router.keenmate.com',
		language: 'en'
	},
	company: {
		name: 'KeenMate',
		website: 'https://keenmate.com?utm_source=svelte-spa-router-showcase',
		social: {
			github: 'https://github.com/keenmate/svelte-spa-router'
		}
	},
	navigation: {
		main: [
			{ label: 'Home', href: '/', icon: '🏠' },
			{ label: 'Getting Started', href: '/getting-started', icon: '🚀' },
			{ label: "What's New in v5", href: '/whats-new', icon: '🎉' },
			{
				label: 'Features',
				href: '/features/routing-modes',
				icon: '✨',
				children: [
					{ label: 'Routing Modes', href: '/features/routing-modes' },
					{ label: 'Route Configuration', href: '/features/route-configuration' },
					{ label: 'Route Parameters', href: '/features/parameters' },
					{ label: 'Navigation Guards', href: '/features/guards' },
					{ label: 'Link Actions & Active Highlighting', href: '/features/link-actions' },
					{ label: 'Named Routes', href: '/features/named-routes' },
					{ label: 'defineRoutes() (type-safe)', href: '/features/define-routes' },
					{ label: 'Programmatic Navigation', href: '/features/programmatic-navigation' },
					{ label: 'Referrer Tracking', href: '/features/referrer-tracking' },
					{ label: 'Querystring', href: '/features/querystring' },
					{ label: 'Filters', href: '/features/filters' },
					{ label: 'Callbacks & Events', href: '/features/callbacks-events' },
					{ label: 'Permissions', href: '/features/permissions' },
					{ label: 'Multi-Zone Routing', href: '/features/multi-zone' },
					{ label: 'Route Inheritance', href: '/features/hierarchical-routes' },
					{ label: 'Route Metadata', href: '/features/metadata' },
					{ label: 'Debug Logging', href: '/features/logging' },
					{ label: 'Error Handling', href: '/features/error-handling' }
				]
			},
			{
				label: 'API Reference',
				href: '/api',
				icon: '📚'
			},
			{ label: 'Migration Guide', href: '/migration', icon: '⬆️' },
			{
				label: 'Examples',
				href: '/examples',
				icon: '💻',
				children: [
					{ label: 'History Mode', href: 'https://history.svelte-spa-router.keenmate.dev', external: true },
					{ label: 'Hash Mode', href: 'https://hash.svelte-spa-router.keenmate.dev', external: true }
				]
			}
		]
	},
	features: {
		search: true,
		breadcrumbs: true,
		tableOfContents: true
	}
};

export async function load() {
	const mergedConfig = mergeConfig(defaultConfig, config);
	const ssrStyles = generateSSRStyles(mergedConfig);

	return {
		config: mergedConfig,
		ssrStyles
	};
}
