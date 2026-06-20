<script>
/**
 * Breadcrumbs component - Displays navigation breadcrumbs
 * Updates automatically when route changes
 */
import { routeBreadcrumbs } from '@keenmate/svelte-spa-router/helpers/route-metadata'

const breadcrumbs = $derived(routeBreadcrumbs())
const hasBreadcrumbs = $derived(breadcrumbs.length > 0)
</script>

{#if hasBreadcrumbs}
<nav aria-label="breadcrumb" class="breadcrumbs">
	<ol>
		{#each breadcrumbs as crumb, i}
			<li class:active={i === breadcrumbs.length - 1}>
				{#if crumb.path && i < breadcrumbs.length - 1}
					<a href={crumb.path}>{crumb.label}</a>
				{:else}
					<span>{crumb.label}</span>
				{/if}
				{#if i < breadcrumbs.length - 1}
					<span class="separator">/</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>
{/if}

<style>
.breadcrumbs {
	margin-bottom: 1.5rem;
	font-size: 0.875rem;
}

.breadcrumbs ol {
	display: flex;
	flex-wrap: wrap;
	list-style: none;
	padding: 0;
	margin: 0;
	gap: 0.5rem;
}

.breadcrumbs li {
	display: flex;
	align-items: center;
	gap: 0.5rem;
}

.breadcrumbs a {
	color: #3b82f6;
	text-decoration: none;
	transition: color 0.2s;
}

.breadcrumbs a:hover {
	color: #2563eb;
	text-decoration: underline;
}

.breadcrumbs li.active span {
	color: #6b7280;
	font-weight: 500;
}

.breadcrumbs .separator {
	color: #9ca3af;
}
</style>
