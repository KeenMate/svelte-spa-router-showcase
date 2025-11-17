<script>
import { DocLayout, CodeBlock } from '@keenmate/svelte-docs'
</script>

<DocLayout
	titleText="Referrer Tracking"
	descriptionText="Automatically track and access information about the previous route">

	<div class="py-1">
		<!-- Introduction -->
		<section class="mb-5">
			<h2 class="mb-4">Overview</h2>
			<p class="lead">
				Referrer tracking automatically captures information about the previous route and makes it
				available through <code>navigationContext</code>. This provides a safer and more flexible
				alternative to <code>history.back()</code>.
			</p>
			<div class="alert alert-info">
				The router provides automatic referrer tracking with configurable modes and complete
				previous route information including parameters and route names.
			</div>
		</section>

		<!-- Configuration -->
		<section class="mb-5">
			<h2 class="mb-4">Configuration</h2>
			<p>
				Enable referrer tracking in your <code>main.js</code> or app initialization file:
			</p>

			<CodeBlock
				codeContent={`import { setIncludeReferrer } from '@keenmate/svelte-spa-router'

// Configure referrer tracking mode
setIncludeReferrer('always')

// Available modes:
// 'never'    - Disabled (default)
// 'notfound' - Only for 404/NotFound routes
// 'always'   - Track referrer for all routes`}
				languageType="javascript"
				titleText="Enable referrer tracking"
			/>
		</section>

		<!-- Tracking Modes -->
		<section class="mb-5">
			<h2 class="mb-4">Tracking Modes</h2>

			<div class="row g-4">
				<div class="col-md-4">
					<div class="card h-100 border-secondary">
						<div class="card-header bg-secondary text-white">
							<h5 class="mb-0">never</h5>
						</div>
						<div class="card-body">
							<p><strong>Behavior:</strong> Referrer tracking disabled</p>
							<p><strong>Use case:</strong> Default mode, minimal overhead</p>
							<p><strong>Performance:</strong> No tracking cost</p>
						</div>
					</div>
				</div>

				<div class="col-md-4">
					<div class="card h-100 border-warning">
						<div class="card-header bg-warning text-dark">
							<h5 class="mb-0">notfound</h5>
						</div>
						<div class="card-body">
							<p><strong>Behavior:</strong> Track only for 404 routes</p>
							<p><strong>Use case:</strong> "Go Back" on error pages</p>
							<p><strong>Performance:</strong> Minimal tracking cost</p>
						</div>
					</div>
				</div>

				<div class="col-md-4">
					<div class="card h-100 border-success">
						<div class="card-header bg-success text-white">
							<h5 class="mb-0">always</h5>
						</div>
						<div class="card-body">
							<p><strong>Behavior:</strong> Track all navigations</p>
							<p><strong>Use case:</strong> Analytics, breadcrumbs, "Go Back" everywhere</p>
							<p><strong>Performance:</strong> Small overhead per navigation</p>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Referrer Object Structure -->
		<section class="mb-5">
			<h2 class="mb-4">Referrer Object Structure</h2>
			<p>
				The referrer object contains complete information about the previous route:
			</p>

			<CodeBlock
				codeContent={`{
  location: '/documents/123',      // Previous route path
  querystring: 'tab=info&view=grid', // Previous query string
  params: {                        // Previous route parameters
    id: '123'
  },
  routeName: 'documentDetail',     // Previous route name (if using named routes)
  scrollX: 0,                      // Horizontal scroll position when leaving
  scrollY: 450                     // Vertical scroll position when leaving
}`}
				languageType="javascript"
				titleText="Referrer object structure"
			/>

			<div class="table-responsive mt-3">
				<table class="table table-bordered">
					<thead>
						<tr>
							<th>Property</th>
							<th>Type</th>
							<th>Description</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>location</code></td>
							<td>string</td>
							<td>Previous route path (e.g., '/documents/123')</td>
						</tr>
						<tr>
							<td><code>querystring</code></td>
							<td>string</td>
							<td>Previous query string without the '?' prefix</td>
						</tr>
						<tr>
							<td><code>params</code></td>
							<td>object</td>
							<td>Previous route parameters extracted from the URL pattern</td>
						</tr>
						<tr>
							<td><code>routeName</code></td>
							<td>string | null</td>
							<td>Named route identifier, or URL path as fallback</td>
						</tr>
						<tr>
							<td><code>scrollX</code></td>
							<td>number</td>
							<td>Horizontal scroll position when user left the previous route</td>
						</tr>
						<tr>
							<td><code>scrollY</code></td>
							<td>number</td>
							<td>Vertical scroll position when user left the previous route</td>
						</tr>
					</tbody>
				</table>
			</div>
		</section>

		<!-- Usage Example -->
		<section class="mb-5">
			<h2 class="mb-4">Basic Usage</h2>
			<p>
				Access referrer information in any route component through <code>navigationContext()</code>:
			</p>

			<CodeBlock
				codeContent={`<script>
import { goBack, navigationContext } from '@keenmate/svelte-spa-router'

const navContext = $derived(navigationContext())
const referrer = $derived(navContext?.referrer)

// Check if we can go back
const canGoBack = $derived(referrer?.location && referrer.location !== '/')

// Use goBack() helper - automatically restores scroll position!
function handleGoBack() {
    goBack()
}
</script>

{#if canGoBack}
    <button onclick={handleGoBack}>
        ← Go Back to {referrer.location}
    </button>
{/if}`}
				languageType="svelte"
				titleText="Component with referrer-based navigation"
			/>

			<div class="alert alert-success mt-3">
				<h5>✨ goBack() Helper</h5>
				<p class="mb-0">
					The <code>goBack()</code> helper function automatically handles:
				</p>
				<ul class="mb-0">
					<li>Building the return URL with query string</li>
					<li><strong>Restoring scroll position</strong> to where the user was before</li>
					<li>Fallback to home page if no referrer exists</li>
				</ul>
			</div>
		</section>

		<!-- Manual Pattern (Alternative) -->
		<section class="mb-5">
			<h2 class="mb-4">Manual Pattern (Alternative)</h2>
			<p>
				If you need custom logic, you can manually navigate using referrer data:
			</p>

			<CodeBlock
				codeContent={`<script>
import { push, navigationContext } from '@keenmate/svelte-spa-router'

const navContext = $derived(navigationContext())
const referrer = $derived(navContext?.referrer)

function goBackManually() {
    if (referrer?.location) {
        // Build URL with query string if present
        const url = referrer.querystring
            ? \`\${referrer.location}?\${referrer.querystring}\`
            : referrer.location

        // Note: Manual push() does NOT restore scroll position
        push(url)
    } else {
        push('/')  // Fallback
    }
}
</script>`}
				languageType="svelte"
				titleText="Manual navigation (without scroll restoration)"
			/>

			<div class="alert alert-warning mt-3">
				<strong>⚠️ Note:</strong> Manual <code>push()</code> does NOT restore scroll position.
				Use the <code>goBack()</code> helper for automatic scroll restoration.
			</div>
		</section>

		<!-- Benefits Over history.back() -->
		<section class="mb-5">
			<h2 class="mb-4">Benefits Over <code>history.back()</code></h2>

			<div class="table-responsive">
				<table class="table table-bordered">
					<thead>
						<tr>
							<th>Feature</th>
							<th>history.back()</th>
							<th>Referrer Tracking</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Works with replace()</td>
							<td><span class="text-danger">❌ Broken</span></td>
							<td><span class="text-success">✅ Works</span></td>
						</tr>
						<tr>
							<td>Access to parameters</td>
							<td><span class="text-danger">❌ No</span></td>
							<td><span class="text-success">✅ Full params object</span></td>
						</tr>
						<tr>
							<td>Access to querystring</td>
							<td><span class="text-danger">❌ No</span></td>
							<td><span class="text-success">✅ Full querystring</span></td>
						</tr>
						<tr>
							<td>Route name access</td>
							<td><span class="text-danger">❌ No</span></td>
							<td><span class="text-success">✅ Named route support</span></td>
						</tr>
						<tr>
							<td>Conditional logic</td>
							<td><span class="text-danger">❌ Blind navigation</span></td>
							<td><span class="text-success">✅ Inspect before navigating</span></td>
						</tr>
						<tr>
							<td>Custom fallback</td>
							<td><span class="text-danger">❌ May leave site</span></td>
							<td><span class="text-success">✅ Custom fallback (e.g., home)</span></td>
						</tr>
						<tr>
							<td>Scroll position restoration</td>
							<td><span class="text-warning">⚠️ Browser controlled</span></td>
							<td><span class="text-success">✅ Automatic via goBack()</span></td>
						</tr>
					</tbody>
				</table>
			</div>

			<div class="alert alert-success">
				<strong>Recommended:</strong> Use <code>goBack()</code> helper with referrer tracking for
				reliable "Go Back" functionality with automatic scroll restoration.
			</div>
		</section>

		<!-- Scroll Position Tracking -->
		<section class="mb-5">
			<h2 class="mb-4">Scroll Position Tracking</h2>

			<p>
				When referrer tracking is enabled, the router automatically captures scroll positions,
				allowing <code>goBack()</code> to restore the exact scroll position from when the user
				left the previous page.
			</p>

			<h3 class="h4 mt-4 mb-3">How It Works</h3>

			<div class="row g-4 mb-4">
				<div class="col-md-6">
					<div class="card h-100">
						<div class="card-header bg-primary text-white">
							<h5 class="mb-0">Automatic Capture</h5>
						</div>
						<div class="card-body">
							<p>When you navigate away from a route, the router automatically saves:</p>
							<ul>
								<li><code>scrollX</code> - Horizontal scroll position</li>
								<li><code>scrollY</code> - Vertical scroll position</li>
							</ul>
							<p class="mb-0">These values are stored in <code>history.state</code> and the referrer object.</p>
						</div>
					</div>
				</div>

				<div class="col-md-6">
					<div class="card h-100">
						<div class="card-header bg-success text-white">
							<h5 class="mb-0">Automatic Restoration</h5>
						</div>
						<div class="card-body">
							<p>The <code>goBack()</code> helper automatically:</p>
							<ol>
								<li>Navigates to the referrer location</li>
								<li>Restores scroll to <code>(scrollX, scrollY)</code></li>
								<li>Preserves browser history state</li>
							</ol>
							<p class="mb-0">Manual <code>push()</code> does <strong>NOT</strong> restore scroll.</p>
						</div>
					</div>
				</div>
			</div>

			<h3 class="h4 mt-4 mb-3">History.state Persistence</h3>

			<p>Referrer data (including scroll positions) is stored in the browser's <code>history.state</code>:</p>

			<div class="alert alert-info">
				<h5 class="alert-heading">What this means:</h5>
				<ul class="mb-0">
					<li><strong>Survives page refreshes</strong> - Referrer persists even if user refreshes the page</li>
					<li><strong>Browser back/forward works</strong> - Native browser navigation preserves referrers</li>
					<li><strong>Cleared on hard reload</strong> - Pressing Ctrl+Shift+R or typing new URL clears history</li>
					<li><strong>Works across sessions</strong> - History state persists as long as the tab stays open</li>
				</ul>
			</div>

			<h3 class="h4 mt-4 mb-3">Example</h3>

			<CodeBlock
				codeContent={`// User journey:
// 1. User on /documents (scrolled down to Y=450)
// 2. Clicks link to /documents/123
// 3. Router saves referrer with scrollY: 450
// 4. User clicks "Go Back" button

import { goBack, navigationContext } from '@keenmate/svelte-spa-router'

const referrer = $derived(navigationContext()?.referrer)

// Referrer object contains scroll position:
// {
//   location: '/documents',
//   querystring: '',
//   scrollX: 0,
//   scrollY: 450
// }

<button onclick={goBack}>
  ← Back (will scroll to Y=450)
</button>

// goBack() automatically:
// - Navigates to /documents
// - Scrolls to (0, 450)
// - Restores exact position from when user left`}
				languageType="javascript"
			/>
		</section>

		<!-- Use Cases -->
		<section class="mb-5">
			<h2 class="mb-4">Common Use Cases</h2>

			<div class="row g-4 mb-4">
				<div class="col-md-6">
					<div class="card h-100">
						<div class="card-header bg-primary text-white">
							<h5 class="mb-0">404 Pages</h5>
						</div>
						<div class="card-body">
							<p>Show "Go Back" button that returns to the last valid route:</p>
							<CodeBlock
								codeContent={`// main.js
setIncludeReferrer('notfound')

// NotFound.svelte
import { goBack, navigationContext } from '@keenmate/svelte-spa-router'

const navContext = $derived(navigationContext())
const referrer = $derived(navContext?.referrer)
const attemptedRoute = $derived(navContext?.attemptedRoute)

{#if referrer}
  <button onclick={goBack}>
    ← Go Back
  </button>
{/if}`}
								languageType="svelte"
							/>
						</div>
					</div>
				</div>

				<div class="col-md-6">
					<div class="card h-100">
						<div class="card-header bg-info text-white">
							<h5 class="mb-0">Analytics</h5>
						</div>
						<div class="card-body">
							<p>Track user navigation patterns:</p>
							<CodeBlock
								codeContent={`// Track navigation path
$effect(() => {
  const referrer = navigationContext()?.referrer
  if (referrer) {
    analytics.track('navigation', {
      from: referrer.routeName || referrer.location,
      to: location(),
      params: referrer.params
    })
  }
})`}
								languageType="javascript"
							/>
						</div>
					</div>
				</div>
			</div>

			<div class="row g-4">
				<div class="col-md-6">
					<div class="card h-100">
						<div class="card-header bg-success text-white">
							<h5 class="mb-0">Protected Routes</h5>
						</div>
						<div class="card-body">
							<p>Avoid going back to failed authorization routes:</p>
							<CodeBlock
								codeContent={`// Unauthorized.svelte
const referrer = $derived(navContext?.referrer)

// Referrer tracks last SUCCESSFULLY loaded route
// Won't return to routes that failed auth

const returnPath = $derived(
  referrer?.location ||
  navContext?.returnTo ||
  '/'
)`}
								languageType="svelte"
							/>
						</div>
					</div>
				</div>

				<div class="col-md-6">
					<div class="card h-100">
						<div class="card-header bg-warning text-dark">
							<h5 class="mb-0">Return URLs</h5>
						</div>
						<div class="card-body">
							<p>Return to original page after login/signup:</p>
							<CodeBlock
								codeContent={`// After successful login
import { goBack, push, navigationContext } from '@keenmate/svelte-spa-router'

const referrer = navigationContext()?.referrer

if (referrer?.location &&
    referrer.location !== '/login') {
  // Return to where user came from with scroll restoration
  goBack()
} else {
  // Default to home
  push('/')
}`}
								languageType="javascript"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Implementation Details -->
		<section class="mb-5">
			<h2 class="mb-4">Implementation Details</h2>

			<h4 class="mt-4">Timing Behavior</h4>
			<p>
				On the first navigation after referrer is updated, component <code>$effect</code>s may run twice:
			</p>
			<ol>
				<li><strong>First run:</strong> Location changes but referrer not yet injected (sees undefined)</li>
				<li><strong>Second run:</strong> navigationContext updates with referrer (sees correct value)</li>
			</ol>
			<p>
				This is expected Svelte 5 behavior and doesn't affect functionality - the UI renders correctly on the second run.
				Subsequent navigations are smooth with single <code>$effect</code> runs.
			</p>

			<div class="alert alert-info">
				<strong>Note:</strong> The double-run only happens during development when console logging.
				The UI always displays correctly because reactive updates happen before render.
			</div>

			<h4 class="mt-4">Route Name Tracking</h4>
			<p>
				The <code>routeName</code> property captures how the route was navigated to:
			</p>
			<ul>
				<li>Named route navigation: <code>push('userProfile', {'{id: 123}'})</code> → routeName = "userProfile"</li>
				<li>Path navigation: <code>push('/user/123')</code> → routeName = "/user/123"</li>
			</ul>

			<CodeBlock
				codeContent={`// Register named routes first
import { registerRoutes } from '@keenmate/svelte-spa-router/routes'

registerRoutes({
  'userProfile': '/user/:id',
  'documentDetail': '/documents/:docId'
})

// Navigate using names
await push('userProfile', { id: 123 })

// Referrer will have:
// { routeName: 'userProfile', location: '/user/123', params: { id: '123' } }`}
				languageType="javascript"
				titleText="Named route tracking example"
			/>
		</section>

		<!-- Best Practices -->
		<section class="mb-5">
			<h2 class="mb-4">Best Practices</h2>

			<div class="card mb-3 border-success">
				<div class="card-header bg-success text-white">
					<strong>✅ Do:</strong>
				</div>
				<ul class="list-group list-group-flush">
					<li class="list-group-item">Use 'notfound' mode for error pages and 'always' for full analytics</li>
					<li class="list-group-item">Check <code>referrer?.location</code> before navigating back</li>
					<li class="list-group-item">Provide fallback destinations (e.g., home) when referrer is undefined</li>
					<li class="list-group-item">Use <code>$state.snapshot()</code> when console logging referrer to see actual values</li>
					<li class="list-group-item">Prefer referrer over <code>history.back()</code> for reliable navigation</li>
				</ul>
			</div>

			<div class="card border-danger">
				<div class="card-header bg-danger text-white">
					<strong>❌ Don't:</strong>
				</div>
				<ul class="list-group list-group-flush">
					<li class="list-group-item">Don't use 'always' mode if you don't need it (slight performance cost)</li>
					<li class="list-group-item">Don't assume referrer will always be present (handle undefined cases)</li>
					<li class="list-group-item">Don't navigate back to '/' if that's your current location</li>
					<li class="list-group-item">Don't mix <code>history.back()</code> with referrer-based navigation</li>
				</ul>
			</div>
		</section>

		<!-- Related Features -->
		<section class="mb-5">
			<h2 class="mb-4">Related Features</h2>
			<ul>
				<li><a href="/features/programmatic-navigation">Programmatic Navigation</a> - Learn about push(), replace(), and pop()</li>
				<li><a href="/features/named-routes">Named Routes</a> - Use route names instead of paths</li>
				<li><a href="/features/guards">Navigation Guards</a> - Protect routes with authorization checks</li>
			</ul>
		</section>
	</div>
</DocLayout>
