<script>
	import { DocLayout, CodeBlock } from '@keenmate/svelte-docs'
</script>

<DocLayout
	titleText="Callbacks & Events"
	descriptionText="Comprehensive guide to all callback functions and events fired by the router">
	<div class="py-1">
		<div class="alert alert-info mb-4">
			<strong>Live demo:</strong>
			<a href="https://history.svelte-spa-router.keenmate.dev/not-found-demo" target="_blank">
				Open <code>/not-found-demo</code> →
			</a>
			Triggers <code>onNotFound</code> and shows recovery handling. Open the browser console first to
			see the events fire. For <code>onConditionsFailed</code> behavior, try
			<a href="https://history.svelte-spa-router.keenmate.dev/admin" target="_blank">
				<code>/admin</code>
			</a> as a non-admin (use the example header's <strong>Toggle 👤</strong> button).
		</div>

		<!-- Introduction -->
		<section class="mb-5">
			<p class="lead">
				The router provides extensive callback and event mechanisms to hook into the routing
				lifecycle, implement custom logic, and respond to navigation events.
			</p>

			<div class="alert alert-info">
				<strong>Callbacks vs Events:</strong>
				<ul class="mb-0 mt-2">
					<li>
						<strong>Events</strong> are fired by the Router component
						(<code>onRouteLoading</code>, <code>onRouteLoaded</code>, <code>onConditionsFailed</code>,
						<code>onNotFound</code>) to notify your app of routing state changes
					</li>
					<li>
						<strong>Callbacks</strong> are functions you provide (<code>conditions</code>,
						<code>authorizationCallback</code>, etc.) that the router calls to make decisions
					</li>
				</ul>
			</div>

			<div class="alert alert-success">
				<strong>v5.2.0-rc02:</strong> every event payload now includes a
				<a href="#relative-location"><code>relativeLocation</code></a> field — the prefix-stripped
				path for nested routers. For root routers it equals <code>location</code>.
			</div>
		</section>

		<!-- Router Component Events -->
		<section class="mb-5">
			<h2 class="mb-4">Router Component Events</h2>
			<p>
				These event handler props are passed to the <code>&lt;Router&gt;</code> component and fire
				at specific points in the routing lifecycle.
			</p>

			<!-- onRouteLoading -->
			<div class="card mb-4">
				<div class="card-header">
					<h3 class="h5 mb-0">onRouteLoading</h3>
				</div>
				<div class="card-body">
					<p>
						Fires when a route starts loading, after route match but before conditions are
						checked and the component is loaded.
					</p>

					<h4 class="h6">Event Detail Structure</h4>
					<CodeBlock
						codeContent={`interface RouteLoadingDetail {
  route: string             // Route pattern (e.g., '/user/:id')
  location: string          // Full app path (e.g., '/user/123')
  relativeLocation: string  // Prefix-stripped path (rc02+). Equal to location on root routers.
  querystring: string       // Query string (e.g., 'tab=profile')
  params: object            // Route parameters (e.g., { id: '123' })
}`}
						languageType="typescript"
						titleText="Event Detail" />

					<h4 class="h6 mt-4">Usage Example</h4>
					<CodeBlock
						codeContent={`<script>
  import Router from '@keenmate/svelte-spa-router'

  let isLoading = $state(false)

  function handleRouteLoading(event) {
    isLoading = true
    console.log('Loading route:', event.detail.route)

    // Start performance timer
    performance.mark('route-load-start')
  }
</script>

<Router
  {routes}
  onRouteLoading={handleRouteLoading}
/>`}
						languageType="svelte"
						titleText="Basic Usage" />

					<div class="alert alert-secondary mt-3">
						<strong>Use Case:</strong> Show loading indicators, start performance timers, prepare
						UI state
					</div>
				</div>
			</div>

			<!-- onRouteLoaded -->
			<div class="card mb-4">
				<div class="card-header">
					<h3 class="h5 mb-0">onRouteLoaded</h3>
				</div>
				<div class="card-body">
					<p>
						Fires after a route successfully loads and all conditions pass. Called for both
						single-component and zone-based routes.
					</p>

					<h4 class="h6">Event Detail Structure (Single Component)</h4>
					<CodeBlock
						codeContent={`interface RouteLoadedDetail {
  route: string             // Route pattern
  location: string          // Full app path
  relativeLocation: string  // Prefix-stripped path (rc02+)
  querystring: string       // Query string
  params: object            // Route parameters
  component: function       // Loaded component
  name: string              // Component name (if available)
  routeContext: object      // Route context metadata
}`}
						languageType="typescript"
						titleText="Event Detail" />

					<h4 class="h6 mt-4">Event Detail Structure (Zone-Based Routes)</h4>
					<CodeBlock
						codeContent={`interface RouteLoadedDetailZones {
  route: string
  location: string
  relativeLocation: string
  querystring: string
  params: object
  zones: string[]  // Array of zone names (e.g., ['sidebar', 'main', 'panel'])
}`}
						languageType="typescript"
						titleText="Zone-Based Event Detail" />

					<h4 class="h6 mt-4">Usage Example</h4>
					<CodeBlock
						codeContent={`<script>
  function handleRouteLoaded(event) {
    console.log('Route loaded:', event.detail)

    // Hide loading indicator
    isLoading = false

    // Send to Google Analytics
    gtag('event', 'page_view', {
      page_path: event.detail.location,
      page_title: document.title
    })

    // Measure performance
    performance.mark('route-load-end')
    performance.measure('route-load', 'route-load-start', 'route-load-end')
  }
</script>

<Router
  {routes}
  onRouteLoaded={handleRouteLoaded}
/>`}
						languageType="svelte"
						titleText="Analytics Integration" />

					<div class="alert alert-secondary mt-3">
						<strong>Use Case:</strong> Hide loading spinners, send analytics events, update page
						title, measure performance
					</div>
				</div>
			</div>

			<!-- onConditionsFailed -->
			<div class="card mb-4">
				<div class="card-header">
					<h3 class="h5 mb-0">onConditionsFailed</h3>
				</div>
				<div class="card-body">
					<p>
						Fires when route conditions (guards) fail, preventing navigation to the requested
						route.
					</p>

					<h4 class="h6">Event Detail Structure</h4>
					<CodeBlock
						codeContent={`interface ConditionsFailedDetail {
  route: string             // Route pattern that failed
  location: string          // Attempted full path
  relativeLocation: string  // Prefix-stripped path (rc02+)
  querystring: string       // Query string
  params: object            // Route parameters
}`}
						languageType="typescript"
						titleText="Event Detail" />

					<h4 class="h6 mt-4">Usage Example</h4>
					<CodeBlock
						codeContent={`<script>
  import { push } from '@keenmate/svelte-spa-router'

  function handleConditionsFailed(event) {
    console.log('Access denied to:', event.detail.route)

    // Redirect to unauthorized page with context
    push('/unauthorized', {}, {}, {
      attemptedRoute: event.detail.location,
      attemptedParams: event.detail.params
    })
  }
</script>

<Router
  {routes}
  onConditionsFailed={handleConditionsFailed}
/>`}
						languageType="svelte"
						titleText="Redirect on Failure" />

					<div class="alert alert-secondary mt-3">
						<strong>Use Case:</strong> Redirect to login/unauthorized pages, show error messages,
						log security events
					</div>
				</div>
			</div>

			<!-- onNotFound -->
			<div class="card mb-4">
				<div class="card-header">
					<h3 class="h5 mb-0">onNotFound</h3>
				</div>
				<div class="card-body">
					<p>
						Fires when no route matches the current location (404 error) <strong>or</strong> when
						a <code>'*'</code> catch-all route matches a URL that no other route claimed.
					</p>
					<div class="alert alert-warning">
						<strong>v5.2.0-rc02 fix:</strong> previously, configuring a <code>'*': NotFound</code>
						catch-all <em>suppressed</em> this event entirely — apps that wanted to both render
						a 404 page and log the miss couldn't have both. The event now fires alongside the
						catch-all render.
					</div>

					<h4 class="h6">Event Detail Structure</h4>
					<CodeBlock
						codeContent={`interface NotFoundDetail {
  location: string          // Path that was not found
  relativeLocation: string  // Prefix-stripped path (rc02+)
  querystring: string       // Query string (if any)
}`}
						languageType="typescript"
						titleText="Event Detail" />

					<h4 class="h6 mt-4">Usage Example</h4>
					<CodeBlock
						codeContent={`<script>
  function handleNotFound(event) {
    console.log('404 Not Found:', event.detail.location)

    // Send to error tracking service
    if (window.Sentry) {
      Sentry.captureMessage('404 Not Found', {
        extra: {
          path: event.detail.location,
          querystring: event.detail.querystring,
          referrer: document.referrer
        }
      })
    }

    // Track in analytics
    gtag('event', 'page_not_found', {
      page_path: event.detail.location
    })
  }
</script>

<Router
  {routes}
  onNotFound={handleNotFound}
/>`}
						languageType="svelte"
						titleText="Error Tracking" />

					<div class="alert alert-secondary mt-3">
						<strong>Use Case:</strong> Send to Sentry/error tracking, analytics, log broken links
					</div>
				</div>
			</div>
		</section>

		<!-- Relative location for nested routers -->
		<section class="mb-5" id="relative-location">
			<h2 class="mb-4">Relative location for nested routers <span class="badge bg-success">rc02</span></h2>
			<p>
				Nested <code>&lt;Router&gt;</code> instances configured with a <code>prefix</code> define
				their routes in <em>prefix-relative</em> terms (e.g. <code>'/known'</code>, not
				<code>'/foo/bar/known'</code>). Internally the router matches against the prefix-stripped
				path. Before rc02, every event payload reported the <strong>full app URL</strong> in
				<code>location</code> — two different notions of "location" depending on whether you looked
				at route definitions or event payloads. Consumers had to strip the prefix themselves.
			</p>
			<p>In rc02, every event payload includes both:</p>
			<ul>
				<li>
					<strong><code>location</code></strong> — full app URL. Use this for logging, analytics,
					or re-navigating with <code>push()</code> (which always takes app-wide paths).
				</li>
				<li>
					<strong><code>relativeLocation</code></strong> — prefix-stripped path. Use this for
					reasoning about <em>this</em> router's routing decisions, matching against route
					patterns, etc.
				</li>
			</ul>

			<h4 class="mt-4">Relationship between the two fields</h4>
			<div class="table-responsive">
				<table class="table table-bordered">
					<thead>
						<tr>
							<th>Router setup</th>
							<th>App URL</th>
							<th><code>location</code></th>
							<th><code>relativeLocation</code></th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Root router, no <code>prefix</code></td>
							<td><code>/users/42</code></td>
							<td><code>/users/42</code></td>
							<td><code>/users/42</code> (same)</td>
						</tr>
						<tr>
							<td>Nested router with <code>prefix="/admin"</code></td>
							<td><code>/admin/users/42</code></td>
							<td><code>/admin/users/42</code></td>
							<td><code>/users/42</code></td>
						</tr>
						<tr>
							<td>Nested router with <code>prefix="/admin"</code>, prefix-only URL</td>
							<td><code>/admin</code></td>
							<td><code>/admin</code></td>
							<td><code>/</code> (stripping leaves empty → root)</td>
						</tr>
						<tr>
							<td>Nested router, URL outside its prefix (rare)</td>
							<td><code>/public</code></td>
							<td><code>/public</code></td>
							<td><code>/public</code> (no stripping)</td>
						</tr>
					</tbody>
				</table>
			</div>

			<h4 class="mt-4">Practical example</h4>
			<CodeBlock language="svelte" codeContent={`<!-- App.svelte: root router covers everything -->
<Router
  {routes}
  onRouteLoaded={(e) => {
    // location === relativeLocation here (no prefix)
    analytics.pageview(e.detail.location)
  }}
/>

<!-- Admin.svelte: nested router under /admin -->
<Router
  routes={adminRoutes}
  prefix="/admin"
  onRouteLoaded={(e) => {
    // e.detail.location          === '/admin/users/42'  (for logging)
    // e.detail.relativeLocation  === '/users/42'        (matches route key)
    console.log('Admin router landed on', e.detail.relativeLocation)
  }}
/>`} />
		</section>

		<!-- Navigation Guard Callbacks -->
		<section class="mb-5">
			<h2 class="mb-4">Navigation Guard Callbacks</h2>
			<p>
				Navigation guards allow you to prevent users from leaving a route when there are unsaved
				changes or other conditions.
			</p>

			<!-- registerBeforeLeave -->
			<div class="card mb-4">
				<div class="card-header">
					<h3 class="h5 mb-0">registerBeforeLeave</h3>
				</div>
				<div class="card-body">
					<p>
						Register a callback that runs before navigating away from the current route. Throw
						<code>NavigationCancelledError</code> to prevent navigation.
					</p>

					<h4 class="h6">Callback Signature</h4>
					<CodeBlock
						codeContent={`async function beforeLeaveHandler(context: NavigationContext): Promise<void>

interface NavigationContext {
  from: string        // Current route location
  to: string          // Destination route location
  params: object      // Current route parameters
  querystring: string // Current querystring
}`}
						languageType="typescript"
						titleText="Function Signature" />

					<h4 class="h6 mt-4">Usage Example</h4>
					<CodeBlock
						codeContent={`<script>
  import {
    registerBeforeLeave,
    unregisterBeforeLeave,
    NavigationCancelledError
  } from '@keenmate/svelte-spa-router/helpers/navigation-guard'
  import { onMount, onDestroy } from 'svelte'

  let formIsDirty = $state(false)
  let formData = $state({ name: '', email: '' })

  async function beforeLeave(ctx) {
    if (formIsDirty) {
      const confirmed = confirm(
        "You have unsaved changes. Leave anyway?"
      )

      if (!confirmed) {
        throw new NavigationCancelledError()
      }
    }
  }

  // Register on mount, unregister on destroy
  onMount(() => registerBeforeLeave(beforeLeave))
  onDestroy(() => unregisterBeforeLeave(beforeLeave))

  // Mark form as dirty when user types
  function handleInput() {
    formIsDirty = true
  }
</script>

<form>
  <input bind:value={formData.name} oninput={handleInput} />
  <input bind:value={formData.email} oninput={handleInput} />
</form>`}
						languageType="svelte"
						titleText="Prevent Navigation with Unsaved Changes" />

					<div class="alert alert-info mt-3">
						<strong>Tip:</strong> Use the <code>createDirtyCheckGuard</code> helper for simpler
						dirty state checking:
					</div>

					<CodeBlock
						codeContent={`import { createDirtyCheckGuard } from '@keenmate/svelte-spa-router/helpers/navigation-guard'

const beforeLeave = createDirtyCheckGuard(
  () => formIsDirty,
  "You have unsaved changes. Leave anyway?"
)

onMount(() => registerBeforeLeave(beforeLeave))
onDestroy(() => unregisterBeforeLeave(beforeLeave))`}
						languageType="javascript"
						titleText="Using Helper" />
				</div>
			</div>
		</section>

		<!-- Route Condition Callbacks -->
		<section class="mb-5">
			<h2 class="mb-4">Route Condition Callbacks</h2>
			<p>
				Conditions are async functions that run before a route's component loads. Return <code
					>false</code> to block navigation.
			</p>

			<div class="card mb-4">
				<div class="card-header">
					<h3 class="h5 mb-0">conditions Array</h3>
				</div>
				<div class="card-body">
					<p>
						Pass an array of condition functions to <code>wrap()</code>. Each function receives
						route details and must return a boolean.
					</p>

					<h4 class="h6">Callback Signature</h4>
					<CodeBlock
						codeContent={`async function routeCondition(detail: RouteDetail): Promise<boolean>

interface RouteDetail {
  route: string        // Route pattern (e.g., '/user/:id')
  location: string     // Actual location (e.g., '/user/123')
  querystring: string  // Query string
  params: object       // Route parameters (e.g., { id: '123' })
  userData: any        // Custom data from routeContext.userData
}`}
						languageType="typescript"
						titleText="Function Signature" />

					<h4 class="h6 mt-4">Usage Example</h4>
					<CodeBlock
						codeContent={`import { wrap } from '@keenmate/svelte-spa-router/wrap'

const routes = {
  '/admin': wrap({
    component: () => import('./Admin.svelte'),
    conditions: [
      // Check authentication
      async (detail) => {
        const user = await checkAuth()
        return user !== null
      },

      // Check admin role
      async (detail) => {
        const user = await checkAuth()
        return user.isAdmin
      },

      // Check feature flag
      async (detail) => {
        const features = await getFeatureFlags()
        return features.adminPanel === true
      }
    ]
  })
}`}
						languageType="javascript"
						titleText="Multiple Conditions" />

					<div class="alert alert-warning mt-3">
						<strong>Execution Order:</strong> In hierarchical mode, parent route conditions run
						<em>before</em> child route conditions. All conditions must pass for navigation to succeed.
					</div>
				</div>
			</div>
		</section>

		<!-- Permission System Callbacks -->
		<section class="mb-5">
			<h2 class="mb-4">Permission System Callbacks</h2>
			<p>
				The permission system requires configuration callbacks to check user permissions and handle
				unauthorized access.
			</p>

			<!-- configurePermissions -->
			<div class="card mb-4">
				<div class="card-header">
					<h3 class="h5 mb-0">configurePermissions</h3>
				</div>
				<div class="card-body">
					<p>Configure the permission system with three required callbacks:</p>

					<h4 class="h6">checkPermissions</h4>
					<CodeBlock
						codeContent={`checkPermissions: (user: any, requirements: PermissionRequirements) => boolean

interface PermissionRequirements {
  any?: string[]   // User needs at least one of these (OR)
  all?: string[]   // User needs all of these (AND)
}`}
						languageType="typescript"
						titleText="Function Signature" />

					<h4 class="h6 mt-4">getCurrentUser</h4>
					<CodeBlock
						codeContent={`getCurrentUser: () => any  // Returns current user object`}
						languageType="typescript"
						titleText="Function Signature" />

					<h4 class="h6 mt-4">onUnauthorized</h4>
					<CodeBlock
						codeContent={`onUnauthorized: (detail: RouteDetail) => void

interface RouteDetail {
  route: string
  location: string
  querystring: string
  params: object
  userData: any
  routeContext: {
    deniedRoute: string  // Route that was denied
  }
}`}
						languageType="typescript"
						titleText="Function Signature" />

					<h4 class="h6 mt-4">Complete Configuration Example</h4>
					<CodeBlock
						codeContent={`import { configurePermissions } from '@keenmate/svelte-spa-router/helpers/permissions'
import { push, location, querystring } from '@keenmate/svelte-spa-router'
import { get } from 'svelte/store'
import { currentUser } from './stores/auth'

configurePermissions({
  // Check if user has required permissions
  checkPermissions: (user, requirements) => {
    if (!user) return false

    if (requirements.any) {
      return requirements.any.some(perm =>
        user.permissions.includes(perm)
      )
    }

    if (requirements.all) {
      return requirements.all.every(perm =>
        user.permissions.includes(perm)
      )
    }

    return true
  },

  // Get current user object
  getCurrentUser: () => get(currentUser),

  // Handle unauthorized access
  onUnauthorized: (detail) => {
    console.error('Access denied:', detail.location)

    // Save return URL for post-login redirect
    const returnTo = location()
    const returnQuery = querystring()

    push('/unauthorized', {}, {}, {
      returnTo,
      returnQuery,
      attemptedRoute: detail.location,
      deniedRoute: detail.routeContext.deniedRoute
    })
  }
})`}
						languageType="javascript"
						titleText="Full Configuration" />
				</div>
			</div>

			<!-- authorizationCallback -->
			<div class="card mb-4">
				<div class="card-header">
					<h3 class="h5 mb-0">authorizationCallback</h3>
				</div>
				<div class="card-body">
					<p>
						Resource-based authorization callback for checking access to specific resources
						(e.g., documents, projects).
					</p>

					<h4 class="h6">Callback Signature</h4>
					<CodeBlock
						codeContent={`async function authorizationCallback(detail: RouteDetail): Promise<boolean>

// Same RouteDetail as conditions
interface RouteDetail {
  route: string
  location: string
  querystring: string
  params: object       // Access route params like document ID
  userData: any
}`}
						languageType="typescript"
						titleText="Function Signature" />

					<h4 class="h6 mt-4">Usage Example</h4>
					<CodeBlock
						codeContent={`import { createProtectedRoute } from '@keenmate/svelte-spa-router/helpers/permissions'
import { push } from '@keenmate/svelte-spa-router'

const routes = {
  '/document/:id': createProtectedRoute({
    component: () => import('./DocumentEditor.svelte'),

    // Role-based check (fast)
    permissions: { any: ['read'] },

    // Resource-based check (slow API call)
    authorizationCallback: async (detail) => {
      const documentId = detail.params.id

      // Check if user can access THIS specific document
      const response = await fetch(
        \`/api/documents/\${documentId}/check-access\`
      )

      if (!response.ok) {
        await push('/unauthorized', {}, {}, {
          resource: 'document',
          id: documentId
        })
        return false
      }

      return true
    },

    loadingComponent: Loading
  })
}`}
						languageType="javascript"
						titleText="Resource Authorization" />

					<div class="alert alert-info mt-3">
						<strong>Performance Tip:</strong> Permission checks run <em>before</em> authorization
						callbacks to avoid unnecessary API calls. In hierarchical mode, parent authorization runs
						before child authorization.
					</div>
				</div>
			</div>
		</section>

		<!-- Error Handler Callbacks -->
		<section class="mb-5">
			<h2 class="mb-4">Error Handler Callbacks</h2>
			<p>
				The global error handler provides callbacks for logging errors and implementing custom
				recovery strategies.
			</p>

			<!-- onError -->
			<div class="card mb-4">
				<div class="card-header">
					<h3 class="h5 mb-0">onError</h3>
				</div>
				<div class="card-body">
					<p>
						Called whenever an unhandled error occurs. Use this to send errors to monitoring
						services like Sentry.
					</p>

					<h4 class="h6">Callback Signature</h4>
					<CodeBlock
						codeContent={`onError: (
  error: Error,
  errorInfo: ErrorInfo,
  context: ErrorContext
) => void

interface ErrorInfo {
  message: string
  stack: string
  timestamp: string
  type: string           // 'error' or 'unhandledrejection'
  restartCount: number
  location: string       // Browser URL
  userAgent: string
  route: string          // Router location
}

interface ErrorContext {
  sessionErrors: ErrorInfo[]  // All errors in this session
}`}
						languageType="typescript"
						titleText="Function Signature" />

					<h4 class="h6 mt-4">Usage Example</h4>
					<CodeBlock
						codeContent={`import { configureGlobalErrorHandler } from '@keenmate/svelte-spa-router/helpers/error-handler'

configureGlobalErrorHandler({
  onError: (error, errorInfo, context) => {
    // Send to Sentry
    if (window.Sentry) {
      Sentry.captureException(error, {
        extra: errorInfo,
        contexts: {
          session: {
            errorCount: context.sessionErrors.length,
            previousErrors: context.sessionErrors.slice(-5)
          }
        }
      })
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('Unhandled error:', error)
      console.error('Error info:', errorInfo)
      console.error('Session errors:', context.sessionErrors.length)
    }

    // Send to analytics
    gtag('event', 'exception', {
      description: error.message,
      fatal: false
    })
  }
})`}
						languageType="javascript"
						titleText="Error Logging" />
				</div>
			</div>

			<!-- onRecover -->
			<div class="card mb-4">
				<div class="card-header">
					<h3 class="h5 mb-0">onRecover</h3>
				</div>
				<div class="card-body">
					<p>
						Called when using <code>strategy: 'custom'</code> to implement custom error recovery
						logic.
					</p>

					<h4 class="h6">Callback Signature</h4>
					<CodeBlock
						codeContent={`onRecover: (
  error: Error,
  errorInfo: ErrorInfo,
  context: ErrorContext,
  helpers: RecoveryHelpers
) => void

interface RecoveryHelpers {
  restart: () => boolean           // Restart app (with loop prevention)
  navigate: (route: string) => void // Navigate to safe route
  showError: () => void            // Show error component
  canRestart: () => boolean        // Check if restart is safe
  getRestartCount: () => number    // Get restart count
}`}
						languageType="typescript"
						titleText="Function Signature" />

					<h4 class="h6 mt-4">Usage Example</h4>
					<CodeBlock
						codeContent={`configureGlobalErrorHandler({
  strategy: 'custom',

  onRecover: (error, errorInfo, context, helpers) => {
    // Custom recovery based on error type

    if (error.message.includes('Network')) {
      // Network errors - show error page
      helpers.showError()

    } else if (error.message.includes('Auth')) {
      // Authentication errors - redirect to login
      helpers.navigate('/login')

    } else if (error.message.includes('ChunkLoadError')) {
      // Code splitting errors - safe to restart
      if (helpers.canRestart()) {
        helpers.restart()
      } else {
        helpers.showError()
      }

    } else if (context.sessionErrors.length > 5) {
      // Too many errors - show error page
      helpers.showError()

    } else if (helpers.canRestart()) {
      // General errors - try restart
      helpers.restart()

    } else {
      // Can't restart - show error
      helpers.showError()
    }
  }
})`}
						languageType="javascript"
						titleText="Custom Recovery Strategy" />

					<div class="alert alert-warning mt-3">
						<strong>Built-in Strategies:</strong>
						<ul class="mb-0 mt-2">
							<li><code>'navigateSafe'</code> - Navigate to safe route (default)</li>
							<li><code>'restart'</code> - Reload the page (with loop prevention)</li>
							<li><code>'showError'</code> - Display error component</li>
							<li><code>'custom'</code> - Call onRecover callback</li>
						</ul>
					</div>
				</div>
			</div>
		</section>

		<!-- Lifecycle & Execution Order -->
		<section class="mb-5">
			<h2 class="mb-4">Lifecycle & Execution Order</h2>
			<p>Understanding the order in which callbacks execute is crucial for proper routing logic.</p>

			<div class="card mb-4">
				<div class="card-header">
					<h3 class="h5 mb-0">Navigation Lifecycle</h3>
				</div>
				<div class="card-body">
					<p>When navigating to a new route, callbacks execute in this order:</p>

					<ol class="mb-4">
						<li>
							<strong>registerBeforeLeave</strong> handlers (if leaving a route)
							<ul>
								<li>All registered handlers execute</li>
								<li>Navigation cancelled if any throws NavigationCancelledError</li>
							</ul>
						</li>
						<li>
							<strong>onrouteLoading</strong> event fires
							<ul>
								<li>Route matched but not yet loaded</li>
							</ul>
						</li>
						<li>
							Route matching
							<ul>
								<li>Pattern matching against current location</li>
								<li>Parameter extraction</li>
							</ul>
						</li>
						<li>
							<strong>conditions</strong> array execution
							<ul>
								<li>In hierarchical mode: parent conditions execute first</li>
								<li>All conditions must return true to proceed</li>
							</ul>
						</li>
						<li>
							<strong>checkPermissions</strong> (if using permission system)
							<ul>
								<li>Fast role-based check</li>
								<li>In hierarchical mode: parent permissions checked first</li>
							</ul>
						</li>
						<li>
							<strong>authorizationCallback</strong> (if defined)
							<ul>
								<li>Slow resource-based check (API calls)</li>
								<li>Only runs if permissions pass</li>
								<li>In hierarchical mode: parent authorization runs first</li>
							</ul>
						</li>
						<li>
							Component loading
							<ul>
								<li>Async component import resolves</li>
								<li>Component instantiated</li>
							</ul>
						</li>
						<li>
							<strong>onrouteLoaded</strong> event fires (success path)
							<ul>
								<li>Route fully loaded and rendered</li>
							</ul>
						</li>
					</ol>

					<div class="alert alert-info">
						<strong>Alternative Paths:</strong>
						<ul class="mb-0 mt-2">
							<li>
								If no route matches → <strong>onNotFound</strong> fires
							</li>
							<li>
								If conditions/permissions fail → <strong>onconditionsFailed</strong> fires
							</li>
							<li>
								If unhandled error occurs → <strong>onError</strong> callback (if configured)
							</li>
						</ul>
					</div>
				</div>
			</div>

			<div class="card">
				<div class="card-header">
					<h3 class="h5 mb-0">Hierarchical Mode Execution</h3>
				</div>
				<div class="card-body">
					<p>
						When hierarchical routes are enabled, parent callbacks execute before child callbacks:
					</p>

					<CodeBlock
						codeContent={`// Route hierarchy:
// /documents (parent)
//   /documents/:id (child)
//     /documents/:id/logs (grandchild)

// Execution order when navigating to /documents/123/logs:
1. Parent conditions
2. Child conditions
3. Grandchild conditions
4. Parent permissions
5. Child permissions
6. Grandchild permissions
7. Parent authorization
8. Child authorization
9. Grandchild authorization

// If ANY check fails, the entire chain stops (fail-fast)`}
						languageType="javascript"
						titleText="Hierarchical Execution" />

					<p class="mt-3">
						This matches filesystem security where you need access to all parent directories to
						reach a nested file.
					</p>
				</div>
			</div>
		</section>

		<!-- Summary Table -->
		<section class="mb-5">
			<h2 class="mb-4">Quick Reference</h2>
			<p>Summary of all callbacks and events with their primary use cases.</p>

			<div class="table-responsive">
				<table class="table table-striped">
					<thead>
						<tr>
							<th>Callback/Event</th>
							<th>Type</th>
							<th>When Called</th>
							<th>Primary Use Case</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>onRouteLoading</code></td>
							<td>Event</td>
							<td>Route starts loading</td>
							<td>Show loading indicator, start timer</td>
						</tr>
						<tr>
							<td><code>onRouteLoaded</code></td>
							<td>Event</td>
							<td>Route successfully loads</td>
							<td>Analytics, hide loading, log page view</td>
						</tr>
						<tr>
							<td><code>onConditionsFailed</code></td>
							<td>Event</td>
							<td>Route conditions fail</td>
							<td>Redirect to unauthorized page</td>
						</tr>
						<tr>
							<td><code>onNotFound</code></td>
							<td>Event</td>
							<td>No route matches (404)</td>
							<td>Error tracking, analytics, logging</td>
						</tr>
						<tr>
							<td><code>registerBeforeLeave</code></td>
							<td>Callback</td>
							<td>User tries to leave route</td>
							<td>Prevent navigation with unsaved changes</td>
						</tr>
						<tr>
							<td><code>conditions</code></td>
							<td>Callback</td>
							<td>Before component loads</td>
							<td>Authentication, feature flags</td>
						</tr>
						<tr>
							<td><code>checkPermissions</code></td>
							<td>Callback</td>
							<td>Permission check needed</td>
							<td>Role-based access control</td>
						</tr>
						<tr>
							<td><code>getCurrentUser</code></td>
							<td>Callback</td>
							<td>User info needed</td>
							<td>Get current user object</td>
						</tr>
						<tr>
							<td><code>onUnauthorized</code></td>
							<td>Callback</td>
							<td>Permission denied</td>
							<td>Redirect to login/unauthorized</td>
						</tr>
						<tr>
							<td><code>authorizationCallback</code></td>
							<td>Callback</td>
							<td>Resource access check</td>
							<td>API-based authorization</td>
						</tr>
						<tr>
							<td><code>onError</code></td>
							<td>Callback</td>
							<td>Unhandled error occurs</td>
							<td>Send to Sentry, log to service</td>
						</tr>
						<tr>
							<td><code>onRecover</code></td>
							<td>Callback</td>
							<td>Custom recovery strategy</td>
							<td>Custom error recovery logic</td>
						</tr>
					</tbody>
				</table>
			</div>
		</section>

		<!-- Related Pages -->
		<section class="mb-5">
			<h2 class="mb-4">Related Documentation</h2>
			<div class="row">
				<div class="col-md-6">
					<div class="card">
						<div class="card-body">
							<h3 class="h5">Guards & Conditions</h3>
							<p>Learn more about implementing route guards and navigation protection.</p>
							<a href="/features/guards" class="btn btn-sm btn-primary">View Guards Guide</a>
						</div>
					</div>
				</div>
				<div class="col-md-6">
					<div class="card">
						<div class="card-body">
							<h3 class="h5">Permissions System</h3>
							<p>Detailed guide to role-based and resource-based access control.</p>
							<a href="/features/permissions" class="btn btn-sm btn-primary"
								>View Permissions Guide</a>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
</DocLayout>
