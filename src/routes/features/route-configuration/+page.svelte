<script>
  import { DocLayout, CodeBlock } from "@keenmate/svelte-docs";
</script>

<DocLayout
  titleText="Route Configuration"
  descriptionText="Convenient API for creating routes with metadata, loading states, and conditions"
>
  <div class="py-1">
    <!-- Introduction -->
    <section class="mb-5">
      <h2 class="mb-4">Convenient Route Creation API</h2>
      <p class="lead">
        The router provides convenient functions for creating routes with all
        the features you need: async loading, loading components, metadata
        (title & breadcrumbs), and conditions.
      </p>
      <p>Choose the method that fits your needs:</p>
      <ul>
        <li>
          <code>createRoute()</code> - Returns wrapped component (most
          convenient, no <code>wrap()</code> needed)
        </li>
        <li>
          <code>createRouteDefinition()</code> - Returns definition for use with
          <code>wrap()</code> (advanced use)
        </li>
      </ul>
    </section>

    <!-- createRoute() - Recommended -->

    <!-- Component Types: Sync vs Async -->
    <section class="mb-5">
      <h2 class="mb-4">Component Types: Sync vs Async</h2>

      <div class="alert alert-info">
        <h5 class="mb-3">📦 Understanding Component Loading</h5>
        <p class="mb-0">
          The router supports both synchronous (immediate) and asynchronous
          (lazy-loaded) components. Choosing the right approach impacts your
          app's performance and user experience.
        </p>
      </div>

      <h4 class="mt-4">Synchronous Components (Direct Import)</h4>
      <p>
        Use direct component references for routes that should be <strong
          >immediately available</strong
        >. These components are included in the initial bundle.
      </p>

      <CodeBlock
        codeContent={`import Home from './routes/Home.svelte'
import About from './routes/About.svelte'

const routes = {
  // Synchronous - component loaded immediately
  '/': Home,
  '/about': About,
  
  // Also synchronous with createRoute()
  '/contact': createRoute({
    component: Contact,  // Direct reference
    title: 'Contact'
  })
`}
        languageType="javascript"
        titleText="Synchronous components"
      />

      <div class="row mt-3">
        <div class="col-md-6">
          <div class="card border-success h-100">
            <div class="card-header bg-success text-white">
              <strong>✅ Best For:</strong>
            </div>
            <div class="card-body">
              <ul class="mb-0">
                <li>Home page / landing page</li>
                <li>Frequently visited routes</li>
                <li>Small components (&lt;10KB)</li>
                <li>Routes needing instant navigation</li>
                <li>Components with no heavy dependencies</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card border-danger h-100">
            <div class="card-header bg-danger text-white">
              <strong>⚠️ Drawbacks:</strong>
            </div>
            <div class="card-body">
              <ul class="mb-0">
                <li>Increases initial bundle size</li>
                <li>Slower initial page load</li>
                <li>All code loaded even if never used</li>
                <li>Not ideal for admin panels or rare routes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <h4 class="mt-5">Asynchronous Components (Dynamic Import)</h4>
      <p>
        Use <code>() =&gt; import()</code> syntax for routes that should be
        <strong>lazy-loaded</strong>. These components are split into separate
        chunks and loaded on-demand.
      </p>

      <CodeBlock
        codeContent={`const routes = {
  '/': Home,  // Sync - needed immediately
  
  // Async - loaded only when user visits these routes
  '/admin': createRoute({
    component: () => import('./routes/Admin.svelte'),  // Function returning Promise
    title: 'Admin Panel',
    loadingComponent: Loading  // Show while loading
  }),
  
  '/reports': createRoute({
    component: () => import('./routes/Reports.svelte'),
    title: 'Reports'
  }),
  
  '/settings': createRoute({
    component: () => import('./routes/Settings.svelte'),
    title: 'Settings'
  })        `}
        languageType="javascript"
        titleText="Asynchronous components (code-splitting)"
      />

      <div class="row mt-3">
        <div class="col-md-6">
          <div class="card border-success h-100">
            <div class="card-header bg-success text-white">
              <strong>✅ Best For:</strong>
            </div>
            <div class="card-body">
              <ul class="mb-0">
                <li>Admin panels</li>
                <li>Rarely visited routes</li>
                <li>Large components (&gt;50KB)</li>
                <li>Routes with heavy dependencies (charts, editors)</li>
                <li>Conditional features (paid tiers)</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="card border-info h-100">
            <div class="card-header bg-info text-white">
              <strong>💡 Benefits:</strong>
            </div>
            <div class="card-body">
              <ul class="mb-0">
                <li>
                  <strong>Smaller initial bundle</strong> - Faster first load
                </li>
                <li>
                  <strong>On-demand loading</strong> - Load only what's needed
                </li>
                <li>
                  <strong>Better caching</strong> - Chunks cached separately
                </li>
                <li>
                  <strong>Parallel loading</strong> - Multiple routes can load at
                  once
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="alert alert-warning mt-4">
        <h5>⚡ Performance Tip</h5>
        <p class="mb-2">
          <strong>Hybrid approach works best:</strong> Use sync components for common
          routes (home, about) and async components for specialized features (admin,
          reports, settings).
        </p>
        <p class="mb-0">
          <strong>Example:</strong> If your admin panel is 200KB but only 10% of
          users visit it, lazy-loading saves 180KB for 90% of your users!
        </p>
      </div>
    </section>
    <section class="mb-5">
      <h2 class="mb-4">createRoute() - Recommended</h2>
      <p>
        The most convenient way to create routes. It returns a ready-to-use
        wrapped component, so you don't need to call <code>wrap()</code> manually.
      </p>

      <h4 class="mt-4">Basic Usage</h4>
      <CodeBlock
        codeContent={`import { createRoute } from '@keenmate/svelte-spa-router/wrap'
import Home from './routes/Home.svelte'
import Loading from './routes/Loading.svelte'

const routes = {
  '/': Home,

  // No wrap() needed! createRoute() handles it for you
  '/about': createRoute({
    component: () => import('./routes/About.svelte'),
    title: 'About Us',
    loadingComponent: Loading
  }),

  '/contact': createRoute({
    component: () => import('./routes/Contact.svelte'),
    title: 'Contact',
    loadingComponent: Loading,
    loadingParams: { message: 'Loading contact page...' }
  })
`}
        languageType="javascript"
        titleText="Basic route creation"
      />

      <h4 class="mt-4">With Breadcrumbs</h4>
      <p>Add breadcrumb navigation to your routes:</p>

      <CodeBlock
        codeContent={`const routes = {
  '/': Home,

  '/products': createRoute({
    component: () => import('./routes/Products.svelte'),
    title: 'Products',
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'Products' }
    ]
  }),

  '/products/:id': createRoute({
    component: () => import('./routes/ProductDetail.svelte'),
    title: 'Product Details',
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'Products', path: '/products' },
      { label: 'Details' }
    ]
  })
`}
        languageType="javascript"
        titleText="Routes with breadcrumbs"
      />

      <h4 class="mt-4">With Conditions</h4>
      <p>Add route guards to protect routes:</p>

      <CodeBlock
        codeContent={`// Auth check function
const requireAuth = (detail) => {
  const user = getCurrentUser()
  if (!user) {
    push('/login')
    return false
  }
  return true
}

const routes = {
  '/': Home,

  '/dashboard': createRoute({
    component: () => import('./routes/Dashboard.svelte'),
    title: 'Dashboard',
    conditions: [requireAuth],
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'Dashboard' }
    ]
  }),

  // Multiple conditions
  '/admin': createRoute({
    component: () => import('./routes/Admin.svelte'),
    title: 'Admin Panel',
    conditions: [
      requireAuth,
      (detail) => {
        const user = getCurrentUser()
        return user.role === 'admin'
      }
    ]
  })
`}
        languageType="javascript"
        titleText="Routes with conditions"
      />

      <h4 class="mt-4">With Static Props</h4>
      <p>Pass static props to your route components:</p>

      <CodeBlock
        codeContent={`const routes = {
  '/help': createRoute({
    component: () => import('./routes/Help.svelte'),
    title: 'Help Center',
    props: {
      category: 'general',
      showSearch: true
    }
  }),

  '/settings': createRoute({
    component: () => import('./routes/Settings.svelte'),
    title: 'Settings',
    props: {
      theme: 'light',
      enableNotifications: true
    }
  })
`}
        languageType="javascript"
        titleText="Routes with static props"
      />
    </section>

    <!-- Accessing Metadata -->
    <section class="mb-5">
      <h2 class="mb-4">Accessing Route Metadata</h2>
      <p>
        There are two ways to access route metadata: via component props or via
        reactive helpers.
      </p>

      <h4 class="mt-4">Method 1: Reactive Helpers (Recommended)</h4>
      <p>
        The router provides reactive helpers that automatically update when
        routes change. This is perfect for displaying title/breadcrumbs in your
        app layout.
      </p>

      <CodeBlock
        codeContent={`<!-- App.svelte (or layout component) -->
<script>
import Router from '@keenmate/svelte-spa-router'
import { routeTitle, routeBreadcrumbs } from '@keenmate/svelte-spa-router/helpers/route-metadata'
import routes from './routes'

// Reactive - updates automatically on route change
const title = $derived(routeTitle() || 'My App')
const breadcrumbs = $derived(routeBreadcrumbs())
</script>

<!-- Browser title -->
<svelte:head>
  <title>{title}</title>
</svelte:head>

<div class="app">
  <header>
    <h1>{title}</h1>
  </header>

  <!-- Breadcrumbs -->
  {#if breadcrumbs.length > 0}
  <nav class="breadcrumbs">
    {#each breadcrumbs as crumb, i}
      {#if crumb.path && i < breadcrumbs.length - 1}
        <a href={crumb.path} use:link>{crumb.label}</a>
      {:else}
        <span>{crumb.label}</span>
      {/if}
      {#if i < breadcrumbs.length - 1}<span>/</span>{/if}
    {/each}
  </nav>
  {/if}

  <!-- Router renders content here -->
  <Router {routes} />
</div>`}
        languageType="svelte"
        titleText="Using reactive helpers (recommended)"
      />

      <h4 class="mt-4">Method 2: Component Props</h4>
      <p>
        Access metadata directly in your route components via <code
          >userData</code
        > prop:
      </p>

      <CodeBlock
        codeContent={`<!-- ProductDetail.svelte -->
<script>
import { link } from '@keenmate/svelte-spa-router'

let { routeParams = {}, userData = {} } = $props()

// Access metadata from props
const title = userData.title
const breadcrumbs = userData.breadcrumbs || []
</script>

<svelte:head>
  <title>{title || 'My App'}</title>
</svelte:head>

{#if breadcrumbs.length > 0}
<nav>
  {#each breadcrumbs as crumb, i}
    {#if crumb.path}
      <a href={crumb.path} use:link>{crumb.label}</a>
    {:else}
      {crumb.label}
    {/if}
  {/each}
</nav>
{/if}

<h1>{title}</h1>
<p>Product ID: {routeParams.id}</p>`}
        languageType="svelte"
        titleText="Using component props"
      />

      <h4 class="mt-4">Reusable Components</h4>
      <p>Create reusable components that automatically display metadata:</p>

      <CodeBlock
        codeContent={`<!-- PageTitle.svelte -->
<script>
import { routeTitle } from '@keenmate/svelte-spa-router/helpers/route-metadata'

let { defaultTitle = 'My App' } = $props()
const title = $derived(routeTitle() || defaultTitle)
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<h1>{title}</h1>

<!-- Breadcrumbs.svelte -->
<script>
import { link } from '@keenmate/svelte-spa-router'
import { routeBreadcrumbs } from '@keenmate/svelte-spa-router/helpers/route-metadata'

const breadcrumbs = $derived(routeBreadcrumbs())
</script>

{#if breadcrumbs.length > 0}
<nav class="breadcrumbs">
  {#each breadcrumbs as crumb, i}
    {#if crumb.path && i < breadcrumbs.length - 1}
      <a href={crumb.path} use:link>{crumb.label}</a>
    {:else}
      <span>{crumb.label}</span>
    {/if}
  {/each}
</nav>
{/if}

<!-- Usage in App.svelte -->
<script>
import Router from '@keenmate/svelte-spa-router'
import PageTitle from './PageTitle.svelte'
import Breadcrumbs from './Breadcrumbs.svelte'
import routes from './routes'
</script>

<PageTitle defaultTitle="My App" />
<Breadcrumbs />
<Router {routes} />`}
        languageType="svelte"
        titleText="Reusable metadata components"
      />
    </section>

    <!-- createRouteDefinition() - Advanced -->
    <section class="mb-5">
      <h2 class="mb-4">createRouteDefinition() - Advanced</h2>
      <p>
        For more control or when you need to combine with other wrap options,
        use <code>createRouteDefinition()</code> which returns a plain object
        that you pass to <code>wrap()</code>.
      </p>

      <CodeBlock
        codeContent={`import { wrap, createRouteDefinition } from '@keenmate/svelte-spa-router/wrap'

const routes = {
  '/': Home,

  // Advanced usage with wrap()
  '/about': wrap(createRouteDefinition({
    component: () => import('./routes/About.svelte'),
    title: 'About Us',
    loadingComponent: Loading
  })),

  // You can also use wrap() directly for full control
  '/contact': wrap({
    asyncComponent: () => import('./routes/Contact.svelte'),
    loadingComponent: Loading,
    userData: {
      title: 'Contact',
      breadcrumbs: [
        { label: 'Home', path: '/' },
        { label: 'Contact' }
      ]
    }
  })
`}
        languageType="javascript"
        titleText="Advanced route configuration"
      />
    </section>

    <!-- Comparison -->
    <section class="mb-5">
      <h2 class="mb-4">API Comparison</h2>

      <div class="row g-4">
        <div class="col-lg-6">
          <div class="card h-100 border-success">
            <div class="card-header bg-success text-white">
              <h5 class="mb-0">Recommended: createRoute()</h5>
            </div>
            <div class="card-body">
              <p><strong>Best for:</strong> Most use cases</p>
              <ul>
                <li>Returns wrapped component</li>
                <li>No wrap() needed</li>
                <li>Clean, simple syntax</li>
                <li>Automatic async detection</li>
                <li>Built-in title & breadcrumbs support</li>
              </ul>
              <CodeBlock
                codeContent={`// Simple and clean
'/about': createRoute({
  component: () => import('./About.svelte'),
  title: 'About',
  breadcrumbs: [...]
`}
                languageType="javascript"
                titleText="createRoute()"
              />
            </div>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="card h-100 border-primary">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">Advanced: createRouteDefinition()</h5>
            </div>
            <div class="card-body">
              <p><strong>Best for:</strong> Advanced scenarios</p>
              <ul>
                <li>Returns plain object</li>
                <li>Requires wrap()</li>
                <li>More control over wrapping</li>
                <li>Combining with other options</li>
              </ul>
              <CodeBlock
                codeContent={`// More explicit
'/about': wrap(createRouteDefinition({
  component: () => import('./About.svelte'),
  title: 'About',
  breadcrumbs: [...]
}))
                `}
                languageType="javascript"
                titleText="createRouteDefinition()"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Complete Example -->
    <section class="mb-5">
      <h2 class="mb-4">Complete Example</h2>
      <p>Here's a complete example showing all the features:</p>

      <CodeBlock
        codeContent={`// routes.js
import { createRoute } from '@keenmate/svelte-spa-router/wrap'
import Home from './routes/Home.svelte'
import Loading from './routes/Loading.svelte'
import NotFound from './routes/NotFound.svelte'

// Auth check
const requireAuth = (detail) => {
  const user = getCurrentUser()
  if (!user) {
    push('/login')
    return false
  }
  return true
}

export const routes = {
  // Simple route (no async loading)
  '/': Home,

  // Route with title and loading component
  '/about': createRoute({
    component: () => import('./routes/About.svelte'),
    title: 'About Us',
    loadingComponent: Loading
  }),

  // Route with breadcrumbs
  '/products': createRoute({
    component: () => import('./routes/Products.svelte'),
    title: 'Products',
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'Products' }
    ],
    loadingComponent: Loading
  }),

  // Route with parameters and breadcrumbs
  '/products/:id': createRoute({
    component: () => import('./routes/ProductDetail.svelte'),
    title: 'Product Details',
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'Products', path: '/products' },
      { label: 'Details' }
    ],
    loadingComponent: Loading
  }),

  // Protected route with condition
  '/dashboard': createRoute({
    component: () => import('./routes/Dashboard.svelte'),
    title: 'Dashboard',
    conditions: [requireAuth],
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'Dashboard' }
    ],
    loadingComponent: Loading
  }),

  // Route with static props
  '/help': createRoute({
    component: () => import('./routes/Help.svelte'),
    title: 'Help Center',
    props: {
      showSearch: true,
      category: 'general'
    },
    loadingComponent: Loading
  }),

  // Catch-all 404
  '*': NotFound
`}
        languageType="javascript"
        titleText="Complete route configuration"
      />
    </section>

    <!-- Data Loading with shouldDisplayLoadingOnRouteLoad -->
    <section class="mb-5">
      <h2 class="mb-4">Data Loading with shouldDisplayLoadingOnRouteLoad</h2>
      <p>
        For routes that fetch data and need dynamic titles, use the <code
          >shouldDisplayLoadingOnRouteLoad</code
        > flag to keep the loading component visible until data loads.
      </p>

      <h4 class="mt-4">Pattern 1: Router-Managed Loading (Zone-specific)</h4>
      <p>
        Set <code>shouldDisplayLoadingOnRouteLoad: true</code> to let the router
        handle loading state. Component just fetches data and calls
        <code>hideLoading()</code>. Perfect for multi-zone layouts.
      </p>

      <CodeBlock
        codeContent={`import { createRoute } from '@keenmate/svelte-spa-router/wrap'
import Spinner from './Spinner.svelte'

const routes = {
  '/documents/:id': createRoute({
    component: () => import('./DocumentDetail.svelte'),
    loadingComponent: Spinner,
    shouldDisplayLoadingOnRouteLoad: true,  // Keep spinner visible until data loads
    title: 'Document'   // Generic title initially
  })
}

// In DocumentDetail.svelte
import { onMount } from 'svelte'
import { hideLoading, updateRouteMetadata } from '@keenmate/svelte-spa-router/helpers/route-metadata'

let { routeParams } = $props()
let document = null

onMount(async () => {
  document = await fetchDocument(routeParams.id)

  // Update with real data
  updateRouteMetadata({
    title: document.filename,  // "Invoice template.pdf"
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'Documents', path: '/documents' },
      { label: document.filename }
    ]
  })

  hideLoading()  // Hide loading, show component
})

// No loading UI needed - router handles it!
<h1>{document?.filename}</h1>
<p>Size: {document?.size}</p>`}
        languageType="javascript"
        titleText="Router-managed loading"
      />

      <h4 class="mt-4">Pattern 2: Component-Managed Loading (Default)</h4>
      <p>
        Default behavior - component handles its own loading state internally.
      </p>

      <CodeBlock
        codeContent={`const routes = {
  '/documents/:id': createRoute({
    component: () => import('./DocumentDetail.svelte'),
    title: 'Document'
    // No shouldDisplayLoadingOnRouteLoad - component handles loading
  })
}

// In DocumentDetail.svelte
import { onMount } from 'svelte'
import { updateRouteMetadata } from '@keenmate/svelte-spa-router/helpers/route-metadata'

let { routeParams } = $props()
let loading = true
let document = null

onMount(async () => {
  document = await fetchDocument(routeParams.id)
  updateRouteMetadata({ title: document.filename })
  loading = false
})

{#if loading}
  <div class="loading">
    <Spinner />
    <p>Loading document...</p>
  </div>
{:else}
  <h1>{document.filename}</h1>
  <p>Size: {document.size}</p>
{/if}`}
        languageType="javascript"
        titleText="Component-managed loading"
      />
    </section>

    <!-- Best Practices -->
    <section class="mb-5">
      <h2 class="mb-4">Best Practices</h2>

      <div class="alert alert-success">
        <h5>Use createRoute() by default</h5>
        <p class="mb-0">
          Use <code>createRoute()</code> for most cases - it's simpler and
          cleaner. Only use
          <code>createRouteDefinition()</code> when you need explicit control over
          wrapping.
        </p>
      </div>

      <div class="alert alert-info mt-3">
        <h5>Dynamic Titles</h5>
        <p class="mb-0">
          For detail pages that load data, use <code
            >shouldDisplayLoadingOnRouteLoad: true</code
          >
          and
          <code>updateRouteMetadata()</code> to show specific titles like "Invoice.pdf"
          instead of generic "Document".
        </p>
      </div>

      <div class="alert alert-info mt-3">
        <h5>Consistent Breadcrumbs</h5>
        <p class="mb-0">
          Keep breadcrumb structure consistent across related pages. Include
          paths for all navigable breadcrumb items except the current page.
        </p>
      </div>

      <div class="alert alert-warning mt-3">
        <h5>Loading Components</h5>
        <p class="mb-0">
          Always provide a loading component for async routes to improve user
          experience during route transitions. Use <code
            >shouldDisplayLoadingOnRouteLoad: true</code
          > for data-driven routes.
        </p>
      </div>

      <div class="alert alert-primary mt-3">
        <h5>Page Titles</h5>
        <p class="mb-0">
          Set descriptive titles for all routes. Use them in your components
          with <code>&lt;svelte:head&gt;</code>
          for proper SEO and browser history.
        </p>
      </div>
    </section>

    <!-- Related Features -->
    <section class="mb-5">
      <h2 class="mb-4">Related Features</h2>
      <p>Learn about related routing features:</p>
      <ul>
        <li>
          <a href="/features/permissions">Permission System</a> - Use
          <code>createProtectedRoute()</code>
          for permission-based routing
        </li>
        <li>
          <a href="/features/guards">Navigation Guards</a> - Implement complex route
          conditions
        </li>
        <li>
          <a href="/features/programmatic-navigation">Programmatic Navigation</a
          >
          - Navigate with
          <code>push()</code> and <code>replace()</code>
        </li>
      </ul>
    </section>
  </div>
</DocLayout>
