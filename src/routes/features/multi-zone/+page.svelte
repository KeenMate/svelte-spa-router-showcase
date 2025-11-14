<script>
import { DocLayout, CodeBlock } from '@keenmate/svelte-docs'
</script>

<DocLayout
	titleText="Multi-Zone Routing"
	descriptionText="Load different components into multiple layout areas based on the current route">

	<div class="py-1">
		<!-- Introduction -->
		<section class="mb-5">
			<h2 class="mb-4">What is Multi-Zone Routing?</h2>
			<p class="lead">
				Multi-zone routing allows you to render different components into multiple areas of your layout
				(zones) simultaneously, all controlled by a single route. This is perfect for complex layouts
				like admin dashboards, email clients, or any application with sidebars, toolbars, and main content areas.
			</p>

			<div class="alert alert-info">
				<h5>💡 Key Concept</h5>
				<p class="mb-0">
					Instead of having one component per route, you can have <strong>multiple components per route</strong>,
					each rendering in its designated zone. All zones share the same route params and querystring.
				</p>
			</div>
		</section>

		<!-- Visual Example -->
		<section class="mb-5">
			<h2 class="mb-4">Visual Example</h2>
			<p>Here's how a typical multi-zone layout looks:</p>

			<div class="layout-diagram">
				<div class="diagram-header">Header / Navigation</div>
				<div class="diagram-body">
					<div class="diagram-sidebar">
						<div class="zone-label">Zone: "sidebar"</div>
						<div class="zone-content">Menu component</div>
					</div>
					<div class="diagram-main">
						<div class="zone-label">Zone: "main"</div>
						<div class="zone-content">Main content component</div>
					</div>
					<div class="diagram-panel">
						<div class="zone-label">Zone: "panel"</div>
						<div class="zone-content">Toolbar component</div>
					</div>
				</div>
				<div class="diagram-footer">Footer</div>
			</div>

			<p class="mt-3">
				When the user navigates to <code>/products</code>, all three zones update with their
				respective components: ProductsMenu, ProductsMain, and ProductsToolbar.
			</p>
		</section>

		<!-- Basic Setup -->
		<section class="mb-5">
			<h2 class="mb-4">Basic Setup</h2>
			<p>Setting up multi-zone routing involves three steps:</p>

			<h4 class="mt-4">Step 1: Define Zone-Based Routes</h4>
			<p>Use <code>wrap()</code> with a <code>zones</code> object instead of <code>component</code>:</p>

			<CodeBlock
				codeContent={`import { wrap } from '@keenmate/svelte-spa-router/wrap'
import ProductsMenu from './zones/ProductsMenu.svelte'
import ProductsMain from './zones/ProductsMain.svelte'
import ProductsToolbar from './zones/ProductsToolbar.svelte'

const routes = {
  // Regular single-component route
  '/': Home,

  // Multi-zone route
  '/products': wrap({
    zones: {
      'sidebar': ProductsMenu,
      'main': ProductsMain,
      'panel': ProductsToolbar
    },
    title: 'Products',
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'Products' }
    ]
  }),

  // Another multi-zone route with different components
  '/users': wrap({
    zones: {
      'sidebar': UsersMenu,
      'main': UsersMain,
      'panel': UsersToolbar
    },
    title: 'Users'
  })
}`}
				languageType="javascript"
				titleText="Defining zone-based routes"
			/>

			<h4 class="mt-4">Step 2: Create Multiple Router Instances</h4>
			<p>Set up your layout with a Router for each zone, using the <code>zone</code> prop:</p>

			<CodeBlock
				codeContent={`<!-- App.svelte -->
<script>
import Router from '@keenmate/svelte-spa-router'
import { routes } from './routes'
</script>

<div class="app">
  <header>
    <h1>My Application</h1>
    <nav><!-- Navigation links --></nav>
  </header>

  <div class="layout">
    <!-- Sidebar zone -->
    <aside class="sidebar">
      <Router {routes} zone="sidebar" />
    </aside>

    <!-- Main content zone -->
    <main class="main">
      <Router {routes} zone="main" />
    </main>

    <!-- Side panel / toolbar zone -->
    <aside class="panel">
      <Router {routes} zone="panel" />
    </aside>
  </div>

  <footer>
    <p>Footer content</p>
  </footer>
</div>

<style>
.layout {
  display: grid;
  grid-template-columns: 250px 1fr 320px;
  gap: 1rem;
  min-height: calc(100vh - 120px);
}

.sidebar {
  background: #f5f5f5;
  padding: 1rem;
}

.main {
  background: white;
  padding: 2rem;
}

.panel {
  background: #f9f9f9;
  padding: 1rem;
}
</style>`}
				languageType="svelte"
				titleText="Layout with multiple routers"
			/>

			<h4 class="mt-4">Step 3: Create Zone Components</h4>
			<p>Zone components work just like regular route components - they receive props:</p>

			<CodeBlock
				codeContent={`<!-- ProductsMenu.svelte (sidebar zone) -->
<script>
let { routeParams = {}, userData = {} } = $props()
</script>

<div class="menu">
  <h3>Products</h3>
  <nav>
    <ul>
      <li>All Products</li>
      <li>Electronics</li>
      <li>Clothing</li>
      <li>Books</li>
    </ul>
  </nav>
</div>

<!-- ProductsMain.svelte (main zone) -->
<script>
let { routeParams = {} } = $props()
</script>

<div class="content">
  <h2>Product Catalog</h2>
  <table>
    <!-- Product list -->
  </table>
</div>

<!-- ProductsToolbar.svelte (panel zone) -->
<script>
let { routeParams = {} } = $props()
</script>

<div class="toolbar">
  <h3>Actions</h3>
  <button>Filter</button>
  <button>Sort</button>
  <button>Export</button>
</div>`}
				languageType="svelte"
				titleText="Zone components"
			/>
		</section>

		<!-- Dynamic Zones -->
		<section class="mb-5">
			<h2 class="mb-4">Dynamic Multi-Zone Layouts</h2>
			<p>You can conditionally show multi-zone or single-zone layouts based on the route:</p>

			<CodeBlock
				codeContent={`<!-- App.svelte -->
<script>
import Router from '@keenmate/svelte-spa-router'
import { location } from '@keenmate/svelte-spa-router/utils'
import { routes } from './routes'

// Check if current route uses zones
const isZoneRoute = $derived(
  location().startsWith('/products') ||
  location().startsWith('/users') ||
  location().startsWith('/orders')
)
</script>

<div class="app">
  <header>
    <h1>My Application</h1>
    <nav><!-- Navigation --></nav>
  </header>

  {#if isZoneRoute}
    <!-- Multi-zone layout -->
    <div class="zone-layout">
      <aside class="sidebar">
        <Router {routes} zone="sidebar" />
      </aside>
      <main class="main">
        <Router {routes} zone="main" />
      </main>
      <aside class="panel">
        <Router {routes} zone="panel" />
      </aside>
    </div>
  {:else}
    <!-- Single-component layout -->
    <main class="single-layout">
      <Router {routes} />
    </main>
  {/if}

  <footer>
    <p>Footer</p>
  </footer>
</div>`}
				languageType="svelte"
				titleText="Conditional zone layouts"
			/>
		</section>

		<!-- With Route Parameters -->
		<section class="mb-5">
			<h2 class="mb-4">Multi-Zone Routes with Parameters</h2>
			<p>All zones share the same route parameters and querystring:</p>

			<CodeBlock
				codeContent={`const routes = {
  // Multi-zone route with parameter
  '/product/:id': wrap({
    zones: {
      'sidebar': ProductSidebar,
      'main': ProductDetail,
      'panel': ProductActions
    },
    title: 'Product Details'
  })
}

// All zone components receive the same params
<!-- ProductSidebar.svelte -->
<script>
let { routeParams = {} } = $props()
const productId = routeParams.id  // Access the :id parameter
</script>

<div>
  <h3>Product {productId}</h3>
  <nav>
    <a href={\`/product/\${productId}/specs\`}>Specifications</a>
    <a href={\`/product/\${productId}/reviews\`}>Reviews</a>
  </nav>
</div>

<!-- ProductDetail.svelte -->
<script>
let { routeParams = {} } = $props()

async function loadProduct() {
  const response = await fetch(\`/api/products/\${routeParams.id}\`)
  return response.json()
}
</script>

<!-- ProductActions.svelte -->
<script>
let { routeParams = {} } = $props()
</script>

<div class="actions">
  <button>Edit Product {routeParams.id}</button>
  <button>Delete</button>
</div>`}
				languageType="svelte"
				titleText="Zones with parameters"
			/>
		</section>

		<!-- Async Loading -->
		<section class="mb-5">
			<h2 class="mb-4">Async Zone Components</h2>
			<p>Zone components support async loading with code-splitting:</p>

			<CodeBlock
				codeContent={`import Loading from './Loading.svelte'

const routes = {
  '/products': wrap({
    zones: {
      // Async components with dynamic imports
      'sidebar': () => import('./zones/ProductsMenu.svelte'),
      'main': () => import('./zones/ProductsMain.svelte'),
      'panel': () => import('./zones/ProductsToolbar.svelte')
    },
    // Optional: loading component for all zones
    loadingComponent: Loading,
    title: 'Products'
  })
}`}
				languageType="javascript"
				titleText="Async zone components"
			/>
		</section>

		<!-- With Guards and Permissions -->
		<section class="mb-5">
			<h2 class="mb-4">Multi-Zone Routes with Guards</h2>
			<p>Zone routes work with all routing features including guards and permissions:</p>

			<CodeBlock
				codeContent={`import { createProtectedRoute } from '@keenmate/svelte-spa-router/helpers/permissions'

const routes = {
  // Protected multi-zone route
  '/admin/dashboard': createProtectedRoute({
    zones: {
      'sidebar': AdminMenu,
      'main': AdminDashboard,
      'panel': AdminTools
    },
    permissions: { any: ['admin'] },
    title: 'Admin Dashboard'
  }),

  // Multi-zone route with custom conditions
  '/orders': wrap({
    zones: {
      'sidebar': OrdersMenu,
      'main': OrdersList,
      'panel': OrdersFilters
    },
    conditions: [
      (detail) => {
        const user = getCurrentUser()
        if (!user.canViewOrders) {
          push('/unauthorized')
          return false
        }
        return true
      }
    ]
  })
}`}
				languageType="javascript"
				titleText="Protected zone routes"
			/>
		</section>

		<!-- Metadata and Breadcrumbs -->
		<section class="mb-5">
			<h2 class="mb-4">Zone Routes with Metadata</h2>
			<p>Multi-zone routes support all metadata features:</p>

			<CodeBlock
				codeContent={`const routes = {
  '/products': wrap({
    zones: {
      'sidebar': ProductsMenu,
      'main': ProductsMain,
      'panel': ProductsToolbar
    },
    title: 'Products',
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'Products' }
    ],
    userData: {
      category: 'catalog',
      requiresAuth: true
    }
  })
}

// Access metadata in any zone component
<!-- ProductsMain.svelte -->
<script>
import { routeTitle, routeBreadcrumbs } from '@keenmate/svelte-spa-router/helpers/route-metadata'

const title = $derived(routeTitle())
const breadcrumbs = $derived(routeBreadcrumbs())
</script>

<div>
  <h2>{title}</h2>
  <!-- Breadcrumbs navigation -->
</div>`}
				languageType="javascript"
				titleText="Zone routes with metadata"
			/>
		</section>

		<!-- Mixing Single and Multi-Zone -->
		<section class="mb-5">
			<h2 class="mb-4">Mixing Single and Multi-Zone Routes</h2>
			<p>You can mix regular single-component routes with multi-zone routes:</p>

			<CodeBlock
				codeContent={`const routes = {
  // Regular single-component routes
  '/': Home,
  '/about': About,
  '/contact': Contact,

  // Multi-zone routes
  '/products': wrap({
    zones: {
      'sidebar': ProductsMenu,
      'main': ProductsMain,
      'panel': ProductsToolbar
    }
  }),

  '/users': wrap({
    zones: {
      'sidebar': UsersMenu,
      'main': UsersMain,
      'panel': UsersToolbar
    }
  }),

  // Back to single-component
  '/settings': Settings,

  // Catch-all
  '*': NotFound
}

// In App.svelte, conditionally render layout
{#if isZoneRoute}
  <!-- Multi-zone layout -->
{:else}
  <!-- Single-component layout -->
{/if}`}
				languageType="javascript"
				titleText="Mixed route types"
			/>
		</section>

		<!-- Use Cases -->
		<section class="mb-5">
			<h2 class="mb-4">Common Use Cases</h2>

			<div class="row g-4">
				<div class="col-md-6">
					<div class="card h-100">
						<div class="card-body">
							<h5 class="card-title">📊 Admin Dashboards</h5>
							<p class="card-text">
								Create complex admin interfaces with navigation sidebar, main content area,
								and action panels that all update based on the current section.
							</p>
							<ul class="mb-0">
								<li>Left: Navigation menu</li>
								<li>Center: Data tables/forms</li>
								<li>Right: Filters/actions</li>
							</ul>
						</div>
					</div>
				</div>

				<div class="col-md-6">
					<div class="card h-100">
						<div class="card-body">
							<h5 class="card-title">📧 Email Clients</h5>
							<p class="card-text">
								Build email-like interfaces with folder sidebar, message list, and preview pane.
							</p>
							<ul class="mb-0">
								<li>Left: Folders (Inbox, Sent, etc.)</li>
								<li>Center: Email list</li>
								<li>Right: Preview pane</li>
							</ul>
						</div>
					</div>
				</div>

				<div class="col-md-6">
					<div class="card h-100">
						<div class="card-body">
							<h5 class="card-title">🎵 Music Players</h5>
							<p class="card-text">
								Create Spotify-like layouts with playlists, main view, and playback controls.
							</p>
							<ul class="mb-0">
								<li>Left: Playlists</li>
								<li>Center: Album/artist view</li>
								<li>Right: Queue/lyrics</li>
							</ul>
						</div>
					</div>
				</div>

				<div class="col-md-6">
					<div class="card h-100">
						<div class="card-body">
							<h5 class="card-title">📝 Document Editors</h5>
							<p class="card-text">
								Build document editing interfaces with file browser, editor, and properties panel.
							</p>
							<ul class="mb-0">
								<li>Left: File tree</li>
								<li>Center: Editor</li>
								<li>Right: Properties/formatting</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Best Practices -->
		<section class="mb-5">
			<h2 class="mb-4">Best Practices</h2>

			<div class="alert alert-success">
				<h5>Consistent Zone Names</h5>
				<p class="mb-0">
					Use consistent zone names across your application (e.g., "sidebar", "main", "panel").
					This makes the code more maintainable and easier to understand.
				</p>
			</div>

			<div class="alert alert-info mt-3">
				<h5>Responsive Layouts</h5>
				<p class="mb-0">
					Use CSS Grid or Flexbox to create responsive zone layouts that adapt to different screen sizes.
					Consider hiding or stacking zones on mobile devices.
				</p>
			</div>

			<div class="alert alert-warning mt-3">
				<h5>Loading States</h5>
				<p class="mb-0">
					When using async zone components, consider showing loading indicators for each zone
					independently to provide better UX feedback.
				</p>
			</div>

			<div class="alert alert-primary mt-3">
				<h5>Shared State</h5>
				<p class="mb-0">
					Zone components can share state using Svelte stores or context. This is useful for
					communication between zones (e.g., sidebar selection affecting main content).
				</p>
			</div>
		</section>

		<!-- Complete Example -->
		<section class="mb-5">
			<h2 class="mb-4">Complete Example</h2>
			<p>Here's a full working example of multi-zone routing:</p>

			<CodeBlock
				codeContent={`// routes.js
import { wrap } from '@keenmate/svelte-spa-router/wrap'
import Home from './routes/Home.svelte'
import NotFound from './routes/NotFound.svelte'

// Zone components
import ProductsMenu from './zones/ProductsMenu.svelte'
import ProductsMain from './zones/ProductsMain.svelte'
import ProductsToolbar from './zones/ProductsToolbar.svelte'
import UsersMenu from './zones/UsersMenu.svelte'
import UsersMain from './zones/UsersMain.svelte'
import UsersToolbar from './zones/UsersToolbar.svelte'

export const routes = {
  '/': Home,

  '/products': wrap({
    zones: {
      'sidebar': ProductsMenu,
      'main': ProductsMain,
      'panel': ProductsToolbar
    },
    title: 'Products',
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'Products' }
    ]
  }),

  '/users': wrap({
    zones: {
      'sidebar': UsersMenu,
      'main': UsersMain,
      'panel': UsersToolbar
    },
    title: 'Users',
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'Users' }
    ]
  }),

  '*': NotFound
}

// App.svelte
<script>
import Router from '@keenmate/svelte-spa-router'
import { link, location } from '@keenmate/svelte-spa-router/utils'
import active from '@keenmate/svelte-spa-router/active'
import { routes } from './routes'

const isZoneRoute = $derived(
  location().startsWith('/products') ||
  location().startsWith('/users')
)
</script>

<div class="app">
  <header>
    <h1>My Application</h1>
    <nav>
      <a href="/" use:link use:active>Home</a>
      <a href="/products" use:link use:active>Products</a>
      <a href="/users" use:link use:active>Users</a>
    </nav>
  </header>

  {#if isZoneRoute}
    <div class="zone-layout">
      <aside class="sidebar">
        <div class="zone-label">Sidebar</div>
        <Router {routes} zone="sidebar" />
      </aside>
      <main class="main">
        <div class="zone-label">Main Content</div>
        <Router {routes} zone="main" />
      </main>
      <aside class="panel">
        <div class="zone-label">Toolbar</div>
        <Router {routes} zone="panel" />
      </aside>
    </div>
  {:else}
    <main class="single-layout">
      <Router {routes} />
    </main>
  {/if}
</div>

<style>
.zone-layout {
  display: grid;
  grid-template-columns: 250px 1fr 320px;
  gap: 1.5rem;
  padding: 2rem;
  min-height: calc(100vh - 120px);
}

.sidebar {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 1rem;
}

.main {
  background: white;
  border-radius: 8px;
  padding: 2rem;
}

.panel {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 1rem;
}

.zone-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 1rem;
}

/* Responsive */
@media (max-width: 900px) {
  .zone-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
  }

  .sidebar,
  .panel {
    max-height: 300px;
    overflow-y: auto;
  }
}
</style>`}
				languageType="javascript"
				titleText="Complete multi-zone example"
			/>
		</section>

		<!-- API Reference -->
		<section class="mb-5">
			<h2 class="mb-4">API Reference</h2>

			<h4 class="mt-4">wrap() with zones</h4>
			<CodeBlock
				codeContent={`interface ZoneRouteConfig {
  // Map of zone names to components
  zones: {
    [zoneName: string]: SvelteComponent | (() => Promise<SvelteComponent>)
  }

  // Optional: loading component shown while async zone components load
  loadingComponent?: SvelteComponent

  // Optional: route title
  title?: string

  // Optional: breadcrumbs array
  breadcrumbs?: BreadcrumbItem[]

  // Optional: custom metadata
  userData?: any

  // Optional: route conditions/guards
  conditions?: ((detail: RouteDetail) => boolean | Promise<boolean>)[]

  // Optional: static props passed to all zone components
  props?: Record<string, any>
}`}
				languageType="typescript"
				titleText="ZoneRouteConfig type"
			/>

			<h4 class="mt-4">Router zone prop</h4>
			<CodeBlock
				codeContent={`<Router
  {routes}
  zone="zoneName"  // Optional: render specific zone
  onrouteLoaded={...}
  onNotFound={...}
/>`}
				languageType="svelte"
				titleText="Router with zone prop"
			/>
		</section>

		<!-- Live Example -->
		<section class="mb-5">
			<h2 class="mb-4">Try It Live</h2>
			<p>See multi-zone routing in action in our example applications:</p>
			<div class="alert alert-info">
				<p class="mb-2">
					Check out the <code>example/</code> directory in the repository for a complete multi-zone demo.
				</p>
				<p class="mb-0">
					Navigate to <strong>/multi-zone-demo</strong> in the example app to try it yourself!
				</p>
			</div>
		</section>
	</div>
</DocLayout>

<style>
	.layout-diagram {
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		overflow: hidden;
		margin: 2rem 0;
	}

	.diagram-header,
	.diagram-footer {
		background: #f5f5f5;
		padding: 1rem;
		text-align: center;
		font-weight: 600;
		color: #666;
		border-bottom: 2px solid #e0e0e0;
	}

	.diagram-footer {
		border-bottom: none;
		border-top: 2px solid #e0e0e0;
	}

	.diagram-body {
		display: grid;
		grid-template-columns: 200px 1fr 250px;
		gap: 0;
		min-height: 300px;
	}

	.diagram-sidebar,
	.diagram-main,
	.diagram-panel {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-right: 2px solid #e0e0e0;
	}

	.diagram-panel {
		border-right: none;
	}

	.diagram-sidebar {
		background: #f9f9f9;
	}

	.diagram-main {
		background: white;
	}

	.diagram-panel {
		background: #fafafa;
	}

	.zone-label {
		font-size: 0.75rem;
		font-weight: 700;
		color: #2563eb;
		text-transform: uppercase;
		letter-spacing: 1px;
		background: #eff6ff;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		margin-bottom: 1rem;
		font-family: 'Courier New', monospace;
	}

	.zone-content {
		color: #666;
		font-style: italic;
	}

	@media (max-width: 768px) {
		.diagram-body {
			grid-template-columns: 1fr;
			grid-template-rows: auto auto auto;
		}

		.diagram-sidebar,
		.diagram-main,
		.diagram-panel {
			border-right: none;
			border-bottom: 2px solid #e0e0e0;
			min-height: 100px;
		}

		.diagram-panel {
			border-bottom: none;
		}
	}
</style>
