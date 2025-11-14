<script>
import { DocLayout, ShowcaseSection, CodeBlock } from '@keenmate/svelte-docs'
</script>

<DocLayout
	titleText="API Reference"
	descriptionText="Complete API reference for @keenmate/svelte-spa-router">

	<div class="py-1">

		<!-- 🧭 Navigation Functions -->
		<ShowcaseSection
			titleText="🧭 Navigation Functions"
			subtitleText="Programmatic navigation between routes"
			demoColumnTitle="Function Reference"
			controlsColumnTitle="Usage Examples"
			descriptionColumnTitle="Navigation Details">

			{#snippet demoContent()}
				<div class="table-responsive">
					<table class="table table-hover">
						<thead class="table-dark">
							<tr>
								<th style="width: 20%">Function</th>
								<th style="width: 30%">Parameters</th>
								<th style="width: 15%">Returns</th>
								<th style="width: 35%">Description</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td><code>push()</code></td>
								<td>
									<code>location: string | array | object</code><br>
									<code>param2?: any</code><br>
									<code>param3?: Record&lt;string, any&gt;</code><br>
									<code>param4?: any</code>
								</td>
								<td><code>Promise&lt;void&gt;</code></td>
								<td>Navigate to new route, adding to browser history</td>
							</tr>
							<tr>
								<td><code>replace()</code></td>
								<td>
									<code>location: string | array | object</code><br>
									<code>param2?: any</code><br>
									<code>param3?: Record&lt;string, any&gt;</code><br>
									<code>param4?: any</code>
								</td>
								<td><code>Promise&lt;void&gt;</code></td>
								<td>Replace current route without adding to history</td>
							</tr>
							<tr>
								<td><code>pop()</code></td>
								<td>-</td>
								<td><code>Promise&lt;void&gt;</code></td>
								<td>Navigate back in history (browser back button)</td>
							</tr>
							<tr>
								<td><code>goBack()</code></td>
								<td>-</td>
								<td><code>Promise&lt;void&gt;</code></td>
								<td>Navigate to referrer with automatic scroll restoration</td>
							</tr>
						</tbody>
					</table>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`import { push, replace, pop, goBack } from '@keenmate/svelte-spa-router'

// String format
await push('/about')
await push('/user/123')

// Array format
await push(['userProfile', { userId: 123 }])
await push(['search', {}, { q: 'svelte' }])

// Object format
await push({
  route: 'userProfile',
  params: { userId: 123 },
  query: { tab: 'settings' }
})

// Multi-parameter
await push('userProfile', { userId: 123 }, { tab: 'settings' })

// Replace (no history)
await replace('/login')

// Go back (browser history)
await pop()

// Go back to referrer (with scroll restoration)
await goBack()`}
					languageType="javascript"
					titleText="Navigation Functions"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h5>📍 Multiple Formats</h5>
					<p>All navigation functions support multiple calling formats: string, array, object, and multi-parameter.</p>

					<h5>🔄 History Management</h5>
					<ul>
						<li><strong>push():</strong> Adds to browser history (user can go back)</li>
						<li><strong>replace():</strong> Replaces current entry (no back navigation)</li>
						<li><strong>pop():</strong> Browser back button equivalent</li>
						<li><strong>goBack():</strong> Navigate to referrer with automatic scroll restoration (requires referrer tracking enabled)</li>
					</ul>

					<h5>🎯 Navigation Context</h5>
					<p>Pass data between routes without showing it in URL using the navigationContext parameter.</p>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- 📊 State Accessors -->
		<ShowcaseSection
			titleText="📊 State Accessor Functions"
			subtitleText="Access current routing state"
			demoColumnTitle="Function Reference"
			controlsColumnTitle="Usage Examples"
			descriptionColumnTitle="State Details">

			{#snippet demoContent()}
				<div class="table-responsive">
					<table class="table table-hover">
						<thead class="table-dark">
							<tr>
								<th style="width: 25%">Function</th>
								<th style="width: 25%">Returns</th>
								<th style="width: 50%">Description</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td><code>location()</code></td>
								<td><code>string</code></td>
								<td>Get current location path (e.g., <code>'/about'</code>)</td>
							</tr>
							<tr>
								<td><code>querystring()</code></td>
								<td><code>string</code></td>
								<td>Get raw query string without '?' (e.g., <code>'foo=bar'</code>)</td>
							</tr>
							<tr>
								<td><code>query()<br/>query&lt;T&gt;()</code></td>
								<td><code>Record&lt;string, string | string[]&gt;<br/>T</code></td>
								<td>Get parsed querystring as object. Optional generic type for intellisense</td>
							</tr>
							<tr>
								<td><code>routeParams()<br/>routeParams&lt;T&gt;()</code></td>
								<td><code>Record&lt;string, string&gt; | undefined<br/>T | undefined</code></td>
								<td>Get current route parameters from URL pattern. Optional generic type for intellisense</td>
							</tr>
							<tr>
								<td><code>navigationContext()<br/>navigationContext&lt;T&gt;()</code></td>
								<td><code>any | null<br/>T | null</code></td>
								<td>Get navigation context data passed during navigation. Optional generic type for intellisense</td>
							</tr>
							<tr>
								<td><code>loc()</code></td>
								<td><code>Location</code></td>
								<td>Get full location object with path and querystring</td>
							</tr>
						</tbody>
					</table>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`import { location, querystring } from '@keenmate/svelte-spa-router'
import { query } from '@keenmate/svelte-spa-router/helpers/querystring'

// Get current path
const currentPath = $derived(location())
// '/user/123'

// Get raw query string
const qs = $derived(querystring())
// 'tab=settings&page=2'

// Get parsed query object
const q = $derived(query())
// { tab: 'settings', page: '2' }

// Access parameters via props (recommended)
let { routeParams = {} } = $props()
// { userId: '123' }

// Or via global function
import { routeParams, navigationContext } from '@keenmate/svelte-spa-router/utils'
const params = $derived(routeParams())
const ctx = $derived(navigationContext())`}
					languageType="javascript"
					titleText="State Accessors"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h5>⚡ Reactive State</h5>
					<p>All accessor functions return current values and work with Svelte's <code>$derived</code> for reactivity.</p>

					<h5>🔤 TypeScript Support</h5>
					<p>Use generic type parameters for type-safe route parameters and navigation context.</p>

					<h5>📦 Location Object</h5>
					<p>The <code>loc()</code> function returns both location and querystring in one call.</p>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- ⚙️ Configuration Functions -->
		<ShowcaseSection
			titleText="⚙️ Configuration Functions"
			subtitleText="Configure router behavior (must be called before app mount)"
			demoColumnTitle="Function Reference"
			controlsColumnTitle="Usage Examples"
			descriptionColumnTitle="Configuration Details">

			{#snippet demoContent()}
				<div class="table-responsive">
					<table class="table table-hover">
						<thead class="table-dark">
							<tr>
								<th style="width: 30%">Function</th>
								<th style="width: 25%">Parameters</th>
								<th style="width: 45%">Description</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td><code>setHashRoutingEnabled()</code></td>
								<td><code>value: boolean</code></td>
								<td>Enable hash mode (true) or history mode (false). Default: true</td>
							</tr>
							<tr>
								<td><code>setBasePath()</code></td>
								<td><code>value: string</code></td>
								<td>Set base path for history mode (e.g., <code>'/app'</code>)</td>
							</tr>
							<tr>
								<td><code>setParamReplacementPlaceholder()</code></td>
								<td><code>value: string</code></td>
								<td>Set placeholder for missing route parameters. Default: 'N-A'</td>
							</tr>
							<tr>
								<td><code>getHashRoutingEnabled()</code></td>
								<td>-</td>
								<td>Get current routing mode (hash or history)</td>
							</tr>
							<tr>
								<td><code>getBasePath()</code></td>
								<td>-</td>
								<td>Get current base path setting</td>
							</tr>
							<tr>
								<td><code>getParamReplacementPlaceholder()</code></td>
								<td>-</td>
								<td>Get current parameter placeholder value</td>
							</tr>
						</tbody>
					</table>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`// main.js - Configure BEFORE mounting app
import { setHashRoutingEnabled, setBasePath, setParamReplacementPlaceholder } from '@keenmate/svelte-spa-router/utils'

// Enable history mode (clean URLs)
setHashRoutingEnabled(false)
setBasePath('/my-app')

// Set custom placeholder for missing params
setParamReplacementPlaceholder('MISSING')

// Now mount your app
import App from './App.svelte'
new App({ target: document.body })`}
					languageType="javascript"
					titleText="Router Configuration"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h5>🔀 Routing Modes</h5>
					<ul>
						<li><strong>Hash mode:</strong> URLs like <code>#/about</code> (default, no server config needed)</li>
						<li><strong>History mode:</strong> Clean URLs like <code>/about</code> (requires server fallback)</li>
					</ul>

					<h5>📍 Base Path</h5>
					<p>Use when app is hosted in a subdirectory (e.g., <code>example.com/my-app/about</code>).</p>

					<h5>⚠️ Timing</h5>
					<p>All configuration functions must be called before mounting your Svelte app.</p>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- 📦 Route Wrapping -->
		<ShowcaseSection
			titleText="📦 Route Wrapping"
			subtitleText="Wrap routes with async loading, conditions, and metadata"
			demoColumnTitle="Function Reference"
			controlsColumnTitle="Usage Examples"
			descriptionColumnTitle="Wrapping Details">

			{#snippet demoContent()}
				<div class="table-responsive">
					<table class="table table-hover">
						<thead class="table-dark">
							<tr>
								<th style="width: 20%">Function</th>
								<th style="width: 30%">Parameters</th>
								<th style="width: 50%">Description</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td><code>wrap()</code></td>
								<td><code>options: WrapOptions</code></td>
								<td>Wrap component with async loading, conditions, props, and loading state</td>
							</tr>
						</tbody>
					</table>

					<div class="mt-4">
						<h6>WrapOptions Interface</h6>
						<div class="table-responsive">
							<table class="table table-hover">
								<thead class="table-secondary">
									<tr>
										<th style="width: 25%">Property</th>
										<th style="width: 25%">Type</th>
										<th style="width: 50%">Description</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td><code>component</code></td>
										<td><code>Component | AsyncComponent</code></td>
										<td>Svelte component or async loader function</td>
									</tr>
									<tr>
										<td><code>conditions</code></td>
										<td><code>Function[]</code></td>
										<td>Route guard conditions (must all return true)</td>
									</tr>
									<tr>
										<td><code>props</code></td>
										<td><code>Record&lt;string, any&gt;</code></td>
										<td>Static props to pass to component</td>
									</tr>
									<tr>
										<td><code>routeContext</code></td>
										<td><code>any</code></td>
										<td>Custom metadata for the route</td>
									</tr>
									<tr>
										<td><code>loadingComponent</code></td>
										<td><code>Component</code></td>
										<td>Component to show while loading async route</td>
									</tr>
									<tr>
										<td><code>shouldDisplayLoadingOnRouteLoad</code></td>
										<td><code>boolean</code></td>
										<td>Wait for component data before hiding loading</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`import { wrap } from '@keenmate/svelte-spa-router/wrap'
import Loading from './Loading.svelte'

const routes = {
  // Async component with loading
  '/admin': wrap({
    component: () => import('./Admin.svelte'),
    loadingComponent: Loading,
    conditions: [
      async (detail) => {
        const user = await checkAuth()
        return user.isAdmin
      }
    ]
  }),

  // With route metadata
  '/dashboard': wrap({
    component: () => import('./Dashboard.svelte'),
    routeContext: {
      title: 'Dashboard',
      breadcrumbs: [
        { label: 'Home', path: '/' },
        { label: 'Dashboard' }
      ]
    },
    shouldDisplayLoadingOnRouteLoad: true
  })
}`}
					languageType="javascript"
					titleText="Route Wrapping"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h5>🔄 Async Loading</h5>
					<p>Use dynamic imports for code splitting. Show loading component while route loads.</p>

					<h5>🛡️ Route Guards</h5>
					<p>Add conditions that must pass before showing route. Perfect for authentication checks.</p>

					<h5>📊 Route Metadata</h5>
					<p>Attach custom data like breadcrumbs, page titles, or permissions to routes.</p>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- 🏷️ Named Routes -->
		<ShowcaseSection
			titleText="🏷️ Named Routes"
			subtitleText="Register and resolve routes by name"
			demoColumnTitle="Function Reference"
			controlsColumnTitle="Usage Examples"
			descriptionColumnTitle="Named Routes Details">

			{#snippet demoContent()}
				<div class="table-responsive">
					<table class="table table-hover">
						<thead class="table-dark">
							<tr>
								<th style="width: 30%">Function</th>
								<th style="width: 30%">Parameters</th>
								<th style="width: 40%">Description</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td><code>registerRoutes()</code></td>
								<td><code>routes: Record&lt;string, string&gt;</code></td>
								<td>Register named routes for navigation</td>
							</tr>
							<tr>
								<td><code>getRegisteredRoutes()</code></td>
								<td>-</td>
								<td>Get all registered named routes</td>
							</tr>
							<tr>
								<td><code>resolveNamedRoute()</code></td>
								<td>
									<code>name: string</code><br>
									<code>params?: Record&lt;string, any&gt;</code>
								</td>
								<td>Resolve named route to path with parameters</td>
							</tr>
						</tbody>
					</table>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`import { registerRoutes, resolveNamedRoute } from '@keenmate/svelte-spa-router/routes'
import { push } from '@keenmate/svelte-spa-router'

// Register named routes
registerRoutes({
  home: '/',
  about: '/about',
  userProfile: '/user/:userId',
  blogPost: '/blog/:category/:slug'
})

// Navigate using names
await push(['userProfile', { userId: 123 }])
await push({ route: 'blogPost', params: { category: 'tech', slug: 'svelte-5' } })

// Resolve to path
const path = resolveNamedRoute('userProfile', { userId: 123 })
// Result: '/user/123'`}
					languageType="javascript"
					titleText="Named Routes"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h5>📛 Why Named Routes?</h5>
					<p>Change URL patterns without updating navigation calls throughout your app.</p>

					<h5>🔗 Type Safety</h5>
					<p>Centralize route definitions for easier refactoring and TypeScript support.</p>

					<h5>⚡ Dynamic Resolution</h5>
					<p>Build URLs with parameters at runtime using <code>resolveNamedRoute()</code>.</p>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- 🔐 Permissions & Authorization -->
		<ShowcaseSection
			titleText="🔐 Permissions & Authorization"
			subtitleText="Role-based and resource-based access control"
			demoColumnTitle="Function Reference"
			controlsColumnTitle="Usage Examples"
			descriptionColumnTitle="Permission Details">

			{#snippet demoContent()}
				<div class="table-responsive">
					<table class="table table-hover">
						<thead class="table-dark">
							<tr>
								<th style="width: 30%">Function</th>
								<th style="width: 30%">Parameters</th>
								<th style="width: 40%">Description</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td><code>configurePermissions()</code></td>
								<td><code>config: PermissionConfig</code></td>
								<td>Configure permission system with user permissions provider</td>
							</tr>
							<tr>
								<td><code>hasPermission()</code></td>
								<td><code>permission: string | string[]</code></td>
								<td>Check if user has specific permission(s)</td>
							</tr>
							<tr>
								<td><code>createProtectedRoute()</code></td>
								<td><code>options: ProtectedRouteOptions</code></td>
								<td>Create route with permission and authorization checks</td>
							</tr>
							<tr>
								<td><code>createProtectedRouteDefinition()</code></td>
								<td><code>options: ProtectedRouteOptions</code></td>
								<td>Create protected route definition for use with wrap()</td>
							</tr>
						</tbody>
					</table>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`import { configurePermissions, createProtectedRoute } from '@keenmate/svelte-spa-router/helpers/permissions'

// Configure in main.js
configurePermissions({
  getUserPermissions: () => ['read', 'write', 'admin.view']
})

// Protected route with role-based permissions
const routes = {
  '/admin': createProtectedRoute({
    component: () => import('./Admin.svelte'),
    permissions: { any: ['admin.view', 'admin.edit'] }
  }),

  // With resource-based authorization
  '/document/:id': createProtectedRoute({
    component: () => import('./Document.svelte'),
    permissions: { any: ['read'] },
    authorizationCallback: async (detail) => {
      const hasAccess = await checkDocumentAccess(detail.routeParams.id)
      return hasAccess
    }
  })
}`}
					languageType="javascript"
					titleText="Permissions"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h5>🛡️ Two-Layer Security</h5>
					<ul>
						<li><strong>Role-based:</strong> Fast permission checks (any/all)</li>
						<li><strong>Resource-based:</strong> Slow API calls for specific resources</li>
					</ul>

					<h5>⚡ Performance</h5>
					<p>Permissions checked first (fast), then authorizationCallback (slow API call) only if needed.</p>

					<h5>🎯 Flexible Checks</h5>
					<p>Use <code>any: []</code> for OR logic or <code>all: []</code> for AND logic in permission requirements.</p>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- 🎬 Actions -->
		<ShowcaseSection
			titleText="🎬 Svelte Actions"
			subtitleText="Declarative routing and active link highlighting"
			demoColumnTitle="Action Reference"
			controlsColumnTitle="Usage Examples"
			descriptionColumnTitle="Action Details">

			{#snippet demoContent()}
				<div class="table-responsive">
					<table class="table table-hover">
						<thead class="table-dark">
							<tr>
								<th style="width: 20%">Action</th>
								<th style="width: 35%">Parameters</th>
								<th style="width: 45%">Description</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td><code>use:link</code></td>
								<td><code>href?: string | array | LinkActionOptions</code></td>
								<td>Enable SPA navigation on anchor tags</td>
							</tr>
							<tr>
								<td><code>use:active</code></td>
								<td><code>className?: string</code></td>
								<td>Add CSS class to active links. Default: 'active'</td>
							</tr>
						</tbody>
					</table>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`import { link } from '@keenmate/svelte-spa-router/utils'
import active from '@keenmate/svelte-spa-router/active'

<!-- Basic link -->
<a href="/about" use:link>About</a>

<!-- With named route -->
<a use:link={{ route: 'userProfile', params: { userId: 123 } }}>
  User Profile
</a>

<!-- Array shorthand -->
<a use:link={['blogPost', { slug: 'hello' }]}>Blog</a>

<!-- Active highlighting -->
<a href="/about" use:link use:active>About</a>
<a href="/about" use:link use:active="current">About</a>`}
					languageType="svelte"
					titleText="Svelte Actions"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h5>🔗 Link Action</h5>
					<p>Prevents full page reload, enables SPA navigation. Works with modifier keys (Ctrl+Click) in history mode.</p>

					<h5>✨ Active Action</h5>
					<p>Automatically adds CSS class when link matches current route. Perfect for nav menus.</p>

					<h5>🎨 Styling</h5>
					<p>Customize the active class name to match your CSS framework or design system.</p>
				</div>
			{/snippet}
		</ShowcaseSection>

		<!-- 🧩 Components -->
		<ShowcaseSection
			titleText="🧩 Components"
			subtitleText="Main router and error handling components"
			demoColumnTitle="Component Reference"
			controlsColumnTitle="Usage Examples"
			descriptionColumnTitle="Component Details">

			{#snippet demoContent()}
				<div class="table-responsive">
					<table class="table table-hover">
						<thead class="table-dark">
							<tr>
								<th style="width: 25%">Component</th>
								<th style="width: 75%">Props</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td><code>&lt;Router&gt;</code></td>
								<td>
									<code class="text-danger">routes*: RoutesMap</code><br>
									<code>prefix?: string</code><br>
									<code>zone?: string</code><br>
									<code>restoreScrollState?: boolean</code><br>
									<code>onrouteEvent?: Function</code><br>
									<code>onRouteLoading?: Function</code><br>
									<code>onRouteLoaded?: Function</code><br>
									<code>onConditionsFailed?: Function</code><br>
									<code>onNotFound?: Function</code>
								</td>
							</tr>
							<tr>
								<td><code>&lt;GlobalErrorHandler&gt;</code></td>
								<td>No props - configure via <code>configureGlobalErrorHandler()</code></td>
							</tr>
						</tbody>
					</table>
					<div class="text-muted mt-2">
						<small>* Required props</small>
					</div>
				</div>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`import Router from '@keenmate/svelte-spa-router'
import { GlobalErrorHandler } from '@keenmate/svelte-spa-router/helpers/GlobalErrorHandler'

const routes = {
  '/': Home,
  '/about': About,
  '/user/:id': User,
  '*': NotFound
}

<GlobalErrorHandler />

<Router
  {routes}
  restoreScrollState={true}
  onRouteLoading={(e) => console.log('Loading:', e.detail)}
  onRouteLoaded={(e) => console.log('Loaded:', e.detail)}
  onConditionsFailed={() => push('/unauthorized')}
  onNotFound={() => console.log('404')}
/>`}
					languageType="svelte"
					titleText="Components"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<div class="prose">
					<h5>🎯 Router Component</h5>
					<p>Main component that renders the current route. Supports nested routers via <code>prefix</code> and multi-zone routing via <code>zone</code>.</p>

					<h5>🚨 Error Handler</h5>
					<p>Catches all unhandled errors. Configure recovery strategies with <code>configureGlobalErrorHandler()</code>.</p>

					<h5>📜 Scroll Restoration</h5>
					<p>Enable <code>restoreScrollState</code> to save/restore scroll positions on navigation.</p>
				</div>
			{/snippet}
		</ShowcaseSection>

	</div>
</DocLayout>
