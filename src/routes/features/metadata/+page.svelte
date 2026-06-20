<script>
import { DocLayout, CodeBlock } from '@keenmate/svelte-docs'
</script>

<DocLayout
	titleText="Route Metadata & Breadcrumbs"
	descriptionText="Dynamic titles, breadcrumbs, and custom metadata for your routes">

	<div class="py-1">
		<div class="alert alert-info mb-4">
			<strong>Live demos:</strong>
			<a href="https://history.svelte-spa-router.keenmate.dev/metadata-demo" target="_blank">
				Open <code>/metadata-demo</code> →
			</a>
			Static route metadata. For dynamic updates after data load (titles, breadcrumbs), try
			<a href="https://history.svelte-spa-router.keenmate.dev/document/1" target="_blank">
				<code>/document/1</code>
			</a> — watch the breadcrumb update from "Loading…" to the document filename.
		</div>

		<!-- Introduction -->
		<section class="mb-5">
			<h2 class="mb-4">Route Metadata System</h2>
			<p class="lead">
				Enhance your routes with dynamic titles, breadcrumb navigation, and custom metadata.
				Perfect for building hierarchical navigation, improving SEO, and managing route-specific data.
			</p>
		</section>

		<!-- Basic Usage -->
		<section class="mb-5">
			<h2 class="mb-4">Basic Usage</h2>
			<p>Define metadata directly in your route configuration:</p>

			<CodeBlock
				codeContent={`import { wrap } from '@keenmate/svelte-spa-router/wrap'
import Home from './Home.svelte'
import About from './About.svelte'
import UserProfile from './UserProfile.svelte'

const routes = {
  '/': Home,

  '/about': wrap({
    component: About,
    title: 'About Us',
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'About' }
    ]
  }),

  '/user/:id': wrap({
    component: UserProfile,
    title: 'User Profile',
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'Users', path: '/users' },
      { id: 'userDetail', label: 'Loading...', path: '/user/:id' }
    ]
  })
}`}
				languageType="javascript"
				titleText="Route configuration with metadata"
			/>
		</section>

		<!-- Accessing Metadata -->
		<section class="mb-5">
			<h2 class="mb-4">Accessing Metadata</h2>
			<p>Use the metadata helpers to access route data in your components:</p>

			<CodeBlock
				codeContent={`<script>
import {
  routeTitle,
  routeBreadcrumbs,
  routeUserData
} from '@keenmate/svelte-spa-router/helpers/route-metadata'

// Reactive metadata values
const title = $derived(routeTitle())
const breadcrumbs = $derived(routeBreadcrumbs())
const userData = $derived(routeUserData())
</script>

<header>
  <h1>{title}</h1>

  <nav aria-label="breadcrumb">
    {#each breadcrumbs as crumb, i}
      {#if crumb.path && i < breadcrumbs.length - 1}
        <a href={crumb.path} use:link>{crumb.label}</a>
        <span> / </span>
      {:else}
        <span>{crumb.label}</span>
      {/if}
    {/each}
  </nav>
</header>`}
				languageType="svelte"
				titleText="Displaying metadata"
			/>
		</section>

		<!-- Dynamic Updates -->
		<section class="mb-5">
			<h2 class="mb-4">Dynamic Updates</h2>
			<p>Update metadata after loading data - essential for detail pages:</p>

			<h4 class="mt-4">Pattern 1: Full Metadata Update</h4>
			<CodeBlock
				codeContent={`<script>
import { onMount } from 'svelte'
import { routeParams } from '@keenmate/svelte-spa-router'
import { updateRouteMetadata } from '@keenmate/svelte-spa-router/helpers/route-metadata'

let user = $state(null)

onMount(async () => {
  const userId = routeParams().id
  const response = await fetch(\`/api/users/\${userId}\`)
  user = await response.json()

  // Update title and breadcrumbs with actual data
  updateRouteMetadata({
    title: user.name,
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'Users', path: '/users' },
      { label: user.name }
    ]
  })
})
</script>`}
				languageType="svelte"
				titleText="Full metadata update"
			/>

			<h4 class="mt-4">Pattern 2: Partial Updates (Recommended)</h4>
			<p>Update only specific breadcrumb segments by ID - cleaner and more efficient:</p>

			<CodeBlock
				codeContent={`<script>
import { onMount } from 'svelte'
import { routeParams } from '@keenmate/svelte-spa-router'
import {
  updateTitle,
  updateBreadcrumb
} from '@keenmate/svelte-spa-router/helpers/route-metadata'

let document = $state(null)

onMount(async () => {
  const docId = routeParams().id
  const response = await fetch(\`/api/documents/\${docId}\`)
  document = await response.json()

  // Update just the title
  updateTitle(document.filename)

  // Update only the document breadcrumb (by ID)
  updateBreadcrumb('documentDetail', {
    label: document.filename,
    path: \`/document/\${docId}\`
  })
})
</script>

<!-- Route config for this pattern:
'/document/:id': wrap({
  component: DocumentDetail,
  title: 'Document Detail',
  breadcrumbs: [
    { label: 'Home', path: '/' },
    { label: 'Documents', path: '/documents' },
    { id: 'documentDetail', label: 'Loading...', path: '/document/:id' }
  ]
})
-->`}
				languageType="svelte"
				titleText="Partial breadcrumb updates"
			/>
		</section>

		<!-- Nested Routes -->
		<section class="mb-5">
			<h2 class="mb-4">Nested Route Breadcrumbs</h2>
			<p>Handle deeply nested routes with multiple dynamic segments:</p>

			<CodeBlock
				codeContent={`// Route configuration
const routes = {
  '/document/:id': wrap({
    component: DocumentDetail,
    title: 'Document Detail',
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'Documents', path: '/documents' },
      { id: 'documentDetail', label: 'Loading...', path: '/document/:id' }
    ]
  }),

  '/document/:id/logs': wrap({
    component: DocumentLogs,
    title: 'Document Logs',
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'Documents', path: '/documents' },
      { id: 'documentDetail', label: 'Loading...', path: '/document/:id' },
      { id: 'documentLogs', label: 'Logs', path: '/document/:id/logs' }
    ]
  })
}

// Component: DocumentLogs.svelte
<script>
import { onMount } from 'svelte'
import { routeParams } from '@keenmate/svelte-spa-router'
import { updateTitle, updateBreadcrumb } from '@keenmate/svelte-spa-router/helpers/route-metadata'

let document = $state(null)
let logs = $state([])

onMount(async () => {
  const docId = routeParams().id
  const response = await fetch(\`/api/documents/\${docId}\`)
  document = await response.json()

  // Update title
  updateTitle(\`\${document.filename} - Logs\`)

  // Update BOTH breadcrumb segments
  updateBreadcrumb('documentDetail', {
    label: document.filename,
    path: \`/document/\${docId}\`
  })
  updateBreadcrumb('documentLogs', {
    label: 'Logs',
    path: \`/document/\${docId}/logs\`
  })

  // Load logs...
})
</script>`}
				languageType="javascript"
				titleText="Nested route breadcrumbs"
			/>
		</section>

		<!-- Custom Metadata -->
		<section class="mb-5">
			<h2 class="mb-4">Custom Metadata (userData)</h2>
			<p>Store any custom data you need for the current route:</p>

			<CodeBlock
				codeContent={`// Route configuration
'/product/:id': wrap({
  component: ProductDetail,
  title: 'Product',
  userData: {
    requiresAuth: true,
    analytics: {
      category: 'products',
      action: 'view'
    },
    theme: 'dark'
  }
})

// In your component
<script>
import { routeUserData } from '@keenmate/svelte-spa-router/helpers/route-metadata'

const userData = $derived(routeUserData())
const theme = $derived(userData?.theme || 'light')
const analytics = $derived(userData?.analytics)

// Track page view with custom analytics data
$effect(() => {
  if (analytics) {
    trackPageView(analytics.category, analytics.action)
  }
})
</script>

<div class="product-detail" data-theme={theme}>
  <!-- Your component -->
</div>`}
				languageType="svelte"
				titleText="Custom metadata usage"
			/>
		</section>

		<!-- Loading States -->
		<section class="mb-5">
			<h2 class="mb-4">Loading States</h2>
			<p>Three patterns for handling loading states with metadata:</p>

			<h4 class="mt-4">Pattern 1: Router-Managed Loading (Zone-specific)</h4>
			<p>Router shows loading component until you call <code>hideLoading()</code>. Perfect for multi-zone layouts:</p>

			<CodeBlock
				codeContent={`import { wrap } from '@keenmate/svelte-spa-router/wrap'
import Loading from './Loading.svelte'

const routes = {
  '/document/:id': wrap({
    component: () => import('./DocumentDetail.svelte'),
    loadingComponent: Loading,
    shouldDisplayLoadingOnRouteLoad: true,  // ← Keep loading visible until component signals ready
    title: 'Document Detail',
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'Documents', path: '/documents' },
      { id: 'documentDetail', label: 'Loading...', path: '/document/:id' }
    ]
  })
}

// DocumentDetail.svelte
<script>
import { onMount } from 'svelte'
import { routeParams } from '@keenmate/svelte-spa-router'
import { hideLoading, updateTitle, updateBreadcrumb } from '@keenmate/svelte-spa-router/helpers/route-metadata'

let document = $state(null)

onMount(async () => {
  const docId = routeParams().id
  const response = await fetch(\`/api/documents/\${docId}\`)
  document = await response.json()

  updateTitle(document.filename)
  updateBreadcrumb('documentDetail', {
    label: document.filename,
    path: \`/document/\${docId}\`
  })

  hideLoading()  // ← Signal router to show component
})
</script>

<div class="document">
  <h1>{document.filename}</h1>
  <!-- ... -->
</div>`}
				languageType="svelte"
				titleText="Router-managed loading"
			/>

			<h4 class="mt-4">Pattern 2: Component-Managed Loading (Default)</h4>
			<p>Component manages its own loading state - no special configuration needed:</p>

			<CodeBlock
				codeContent={`// Route configuration (no shouldDisplayLoadingOnRouteLoad)
'/product/:id': wrap({
  component: () => import('./ProductDetail.svelte'),
  title: 'Product Detail',
  breadcrumbs: [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Product Detail' }
  ]
})

// ProductDetail.svelte
<script>
import { onMount } from 'svelte'
import { routeParams } from '@keenmate/svelte-spa-router'
import { updateRouteMetadata } from '@keenmate/svelte-spa-router/helpers/route-metadata'

let product = $state(null)
let loading = $state(true)

onMount(async () => {
  const productId = routeParams().id
  const response = await fetch(\`/api/products/\${productId}\`)
  product = await response.json()

  updateRouteMetadata({
    title: product.name,
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'Products', path: '/products' },
      { label: product.name }
    ]
  })

  loading = false
})
</script>

{#if loading}
  <div class="skeleton-loader">
    <div class="skeleton-title"></div>
    <div class="skeleton-content"></div>
  </div>
{:else}
  <div class="product">
    <h1>{product.name}</h1>
    <p>{product.description}</p>
  </div>
{/if}`}
				languageType="svelte"
				titleText="Component-managed loading"
			/>

			<h4 class="mt-4">Pattern 3: Global Loading Overlay (User-defined)</h4>
			<p>Define a global loading overlay that reacts to route loading state:</p>

			<CodeBlock
				codeContent={`<!-- App.svelte -->
<script>
import { routeIsLoading } from '@keenmate/svelte-spa-router/helpers/route-metadata'
import Router from '@keenmate/svelte-spa-router'

const isLoading = $derived(routeIsLoading())
</script>

{#if isLoading}
<div class="global-loading-overlay">
  <div class="spinner"></div>
  <p>Loading...</p>
</div>
{/if}

<Router {routes} />

<!-- ProductDetail.svelte -->
<script>
import { showLoading, hideLoading } from '@keenmate/svelte-spa-router/helpers/route-metadata'

async function loadData() {
  showLoading()  // Show global overlay
  try {
    const data = await fetchProduct(routeParams.id)
    updateTitle(data.name)
  } finally {
    hideLoading()  // Hide global overlay
  }
}
</script>`}
				languageType="svelte"
				titleText="Global loading overlay"
			/>
		</section>

		<!-- Breadcrumb Component -->
		<section class="mb-5">
			<h2 class="mb-4">Reusable Breadcrumb Component</h2>
			<p>Create a reusable breadcrumb component:</p>

			<CodeBlock
				codeContent={`<!-- Breadcrumbs.svelte -->
<script>
import { link } from '@keenmate/svelte-spa-router'
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
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.breadcrumbs a {
  color: #0066cc;
  text-decoration: none;
}

.breadcrumbs a:hover {
  text-decoration: underline;
}

.breadcrumbs .active {
  color: #666;
  font-weight: 500;
}

.separator {
  color: #999;
}
</style>`}
				languageType="svelte"
				titleText="Breadcrumbs component"
			/>
		</section>

		<!-- API Reference -->
		<section class="mb-5">
			<h2 class="mb-4">API Reference</h2>

			<h4 class="mt-4">Metadata Functions</h4>
			<div class="table-responsive">
				<table class="table">
					<thead>
						<tr>
							<th>Function</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>routeTitle()</code></td>
							<td>Get current route title as reactive value</td>
						</tr>
						<tr>
							<td><code>routeBreadcrumbs()</code></td>
							<td>Get current breadcrumbs array as reactive value</td>
						</tr>
						<tr>
							<td><code>routeUserData()</code></td>
							<td>Get custom userData object as reactive value</td>
						</tr>
						<tr>
							<td><code>updateRouteMetadata(metadata)</code></td>
							<td>Update full metadata (title, breadcrumbs, userData)</td>
						</tr>
						<tr>
							<td><code>updateTitle(title)</code></td>
							<td>Update only the title</td>
						</tr>
						<tr>
							<td><code>updateBreadcrumb(id, updates)</code></td>
							<td>Update specific breadcrumb by ID</td>
						</tr>
						<tr>
							<td><code>hideLoading()</code></td>
							<td>Signal router that route is ready (when using shouldDisplayLoadingOnRouteLoad)</td>
						</tr>
						<tr>
							<td><code>showLoading()</code></td>
							<td>Manually show loading state (triggers global overlay if defined)</td>
						</tr>
						<tr>
							<td><code>routeIsLoading()</code></td>
							<td>Check if route is currently loading (reactive)</td>
						</tr>
					</tbody>
				</table>
			</div>

			<h4 class="mt-4">BreadcrumbItem Interface</h4>
			<CodeBlock
				codeContent={`interface BreadcrumbItem {
  /** Optional ID for partial updates */
  id?: string

  /** Label to display */
  label: string

  /** Optional path for the breadcrumb link */
  path?: string
}`}
				languageType="typescript"
				titleText="BreadcrumbItem type"
			/>
		</section>

		<!-- Best Practices -->
		<section class="mb-5">
			<h2 class="mb-4">Best Practices</h2>

			<div class="alert alert-success">
				<h5>Use Partial Updates</h5>
				<p class="mb-0">
					Prefer <code>updateBreadcrumb(id, updates)</code> over <code>updateRouteMetadata()</code>
					when you only need to update dynamic segments. It's cleaner and more maintainable.
				</p>
			</div>

			<div class="alert alert-info mt-3">
				<h5>Add IDs to Dynamic Breadcrumbs</h5>
				<p class="mb-0">
					Always add an <code>id</code> property to breadcrumb items that will be updated dynamically:
					<code>&#123; id: 'documentDetail', label: 'Loading...', path: '/document/:id' &#125;</code>
				</p>
			</div>

			<div class="alert alert-warning mt-3">
				<h5>Update Document Title</h5>
				<p class="mb-0">
					Remember to update the browser's document title for SEO and better UX:
					<code>document.title = routeTitle()</code>
				</p>
			</div>

			<div class="alert alert-primary mt-3">
				<h5>Accessibility</h5>
				<p class="mb-0">
					Use proper ARIA attributes for breadcrumb navigation:
					<code>&lt;nav aria-label="breadcrumb"&gt;</code>
				</p>
			</div>
		</section>

		<!-- Live Examples -->
		<section class="mb-5">
			<h2 class="mb-4">Try It Live</h2>
			<p>See route metadata in action:</p>
			<div class="alert alert-info">
				<p class="mb-0">
					Check out the <code>example-history/</code> directory in the repository for complete
					working examples with metadata, breadcrumbs, and dynamic updates.
				</p>
			</div>
		</section>
	</div>
</DocLayout>
