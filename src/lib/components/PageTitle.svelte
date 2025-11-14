<script>
/**
 * PageTitle component - Displays the current route's title
 * Updates automatically when route changes
 */
import { routeTitle } from '@keenmate/svelte-spa-router/helpers/route-metadata'

let { defaultTitle = 'My App' } = $props()

const title = $derived(routeTitle() || defaultTitle)
</script>

<!-- Update browser title -->
<svelte:head>
	<title>{title}</title>
</svelte:head>

<!-- Display title in page -->
<div class="page-title">
	<h1>{title}</h1>
</div>

<style>
.page-title {
	margin-bottom: 2rem;
	padding-bottom: 1rem;
	border-bottom: 2px solid #e5e7eb;
}

.page-title h1 {
	margin: 0;
	font-size: 2rem;
	font-weight: 700;
	color: #111827;
}
</style>
