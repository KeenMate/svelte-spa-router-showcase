<script>
import { DocLayout, CodeBlock } from '@keenmate/svelte-docs'
</script>

<DocLayout
	titleText="Migration from v4 to v5"
	descriptionText="Complete guide to upgrading from v4.x to v5.0">

	<div class="py-1">
		<!-- Introduction -->
		<section class="mb-5">
			<h2 class="mb-4">Overview</h2>
			<p class="lead">
				Version 5.0 is a major release built for Svelte 5, featuring a complete rewrite using runes
				instead of stores. This guide covers all breaking changes and provides step-by-step upgrade instructions.
			</p>
			<div class="alert alert-warning">
				<strong>Important:</strong> v5.0 requires Svelte 5.0 or later. If you're still on Svelte 4,
				continue using svelte-spa-router v4.x.
			</div>
		</section>

		<!-- Breaking Changes Summary -->
		<section class="mb-5">
			<h2 class="mb-4">Breaking Changes Summary</h2>
			<table class="table table-bordered">
				<thead>
					<tr>
						<th>Change</th>
						<th>v4.x (Old)</th>
						<th>v5.0 (New)</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>State management</td>
						<td>Svelte stores</td>
						<td>Svelte 5 runes ($state, $derived)</td>
					</tr>
					<tr>
						<td>State access</td>
						<td><code>$location</code>, <code>$params</code></td>
						<td><code>location()</code>, <code>routeParams()</code></td>
					</tr>
					<tr>
						<td>Parameter name</td>
						<td><code>params</code></td>
						<td><code>routeParams</code></td>
					</tr>
					<tr>
						<td>Router events</td>
						<td><code>onrouteLoading</code></td>
						<td><code>onRouteLoading</code> (camelCase)</td>
					</tr>
					<tr>
						<td>Logger API</td>
						<td><code>setDebugLoggingEnabled()</code></td>
						<td><code>enableLogging()</code>, <code>setCategoryLevel()</code></td>
					</tr>
					<tr>
						<td>Unauthorized handling</td>
						<td>Hash-based navigation + <code>onUnauthorized</code></td>
						<td>Component-based + <code>configurePermissions()</code></td>
					</tr>
					<tr>
						<td>Import paths</td>
						<td><code>/stores</code> export path exists</td>
						<td>No <code>/stores</code> path - removed</td>
					</tr>
				</tbody>
			</table>
		</section>

		<!-- Step-by-Step Migration -->
		<section class="mb-5">
			<h2 class="mb-4">Step-by-Step Migration</h2>

			<h3 class="mt-4">1. Update Dependencies</h3>
			<CodeBlock
				codeContent={`// package.json
{
  "dependencies": {
    "svelte": "^5.0.0",
    "@keenmate/svelte-spa-router": "^5.0.0"
  }
}`}
				languageType="json"
			/>
			<CodeBlock
				codeContent={`npm install svelte@5 @keenmate/svelte-spa-router@5`}
				languageType="bash"
			/>

			<h3 class="mt-4">2. Update State Access Patterns</h3>
			<p>Replace store subscriptions with function calls:</p>

			<CodeBlock
				codeContent={`<!-- ❌ v4.x - Store syntax -->
<script>
import { location, params, querystring } from '@keenmate/svelte-spa-router'
<\/script>

<p>Current path: {$location}</p>
<p>User ID: {$params.id}</p>
<p>Query: {$querystring}</p>`}
				languageType="svelte"
				titleText="Old v4.x code"
			/>

			<CodeBlock
				codeContent={`<!-- ✅ v5.0 - Function calls with $derived -->
<script>
import { location, routeParams, querystring } from '@keenmate/svelte-spa-router'

const currentPath = $derived(location())
const params = $derived(routeParams())
const query = $derived(querystring())
<\/script>

<p>Current path: {currentPath}</p>
<p>User ID: {params.id}</p>
<p>Query: {query}</p>`}
				languageType="svelte"
				titleText="New v5.0 code"
			/>

			<h3 class="mt-4">3. Update Route Component Props</h3>
			<p>Route components receive params via <code>$props()</code>:</p>

			<CodeBlock
				codeContent={`<!-- ❌ v4.x - Export let -->
<script>
export let params = {}
<\/script>

<h1>User {params.id}</h1>`}
				languageType="svelte"
				titleText="Old v4.x code"
			/>

			<CodeBlock
				codeContent={`<!-- ✅ v5.0 - $props() -->
<script>
let { routeParams = {} } = $props()
<\/script>

<h1>User {routeParams.id}</h1>`}
				languageType="svelte"
				titleText="New v5.0 code"
			/>

			<h3 class="mt-4">4. Update Router Event Handlers</h3>
			<p>Event handler props are now camelCase:</p>

			<CodeBlock
				codeContent={`<!-- ❌ v4.x - lowercase -->
<Router
  {routes}
  onrouteLoading={(e) => console.log('Loading')}
  onrouteLoaded={(e) => console.log('Loaded')}
  onconditionsFailed={(e) => push('/unauthorized')}
/>`}
				languageType="svelte"
				titleText="Old v4.x code"
			/>

			<CodeBlock
				codeContent={`<!-- ✅ v5.0 - camelCase -->
<Router
  {routes}
  onRouteLoading={(e) => console.log('Loading')}
  onRouteLoaded={(e) => console.log('Loaded')}
  onConditionsFailed={(e) => push('/unauthorized')}
/>`}
				languageType="svelte"
				titleText="New v5.0 code"
			/>

			<h3 class="mt-4">5. Update Logger API</h3>
			<p>The debug logging API has been completely redesigned:</p>

			<CodeBlock
				codeContent={`// ❌ v4.x - Old API
import { setDebugLoggingEnabled } from '@keenmate/svelte-spa-router/utils'

setDebugLoggingEnabled(true)`}
				languageType="javascript"
				titleText="Old v4.x code"
			/>

			<CodeBlock
				codeContent={`// ✅ v5.0 - New category-based API
import { enableLogging, setCategoryLevel } from '@keenmate/svelte-spa-router/logger'

// Enable all logging
enableLogging()

// Or enable specific categories
setCategoryLevel('ROUTER:NAVIGATION', 'debug')
setCategoryLevel('ROUTER:PERMISSIONS', 'warn')`}
				languageType="javascript"
				titleText="New v5.0 code"
			/>

			<h3 class="mt-4">6. Update Permission System</h3>
			<p>Unauthorized handling is now component-based:</p>

			<CodeBlock
				codeContent={`// ❌ v4.x - Callback-based with hash navigation
configurePermissions({
  getCurrentUser,
  checkPermissions,
  onUnauthorized: () => {
    window.location.hash = '#/unauthorized'
  }
})`}
				languageType="javascript"
				titleText="Old v4.x code"
			/>

			<CodeBlock
				codeContent={`// ✅ v5.0 - Component-based, respects routing mode
configurePermissions({
  getCurrentUser,
  checkPermissions,
  unauthorizedBehavior: 'component',  // or 'navigate'
  unauthorizedRoute: '/unauthorized',
  unauthorizedComponent: UnauthorizedPage
})`}
				languageType="javascript"
				titleText="New v5.0 code"
			/>

			<h3 class="mt-4">7. Remove /stores Import Path</h3>
			<p>The <code>/stores</code> export path no longer exists:</p>

			<CodeBlock
				codeContent={`// ❌ v4.x - /stores path
import { params } from '@keenmate/svelte-spa-router/stores'

// ✅ v5.0 - Main module only
import { routeParams } from '@keenmate/svelte-spa-router'`}
				languageType="javascript"
			/>
		</section>

		<!-- Common Migration Issues -->
		<section class="mb-5">
			<h2 class="mb-4">Common Migration Issues</h2>

			<h4>Issue: "Cannot read properties of undefined (reading 'before')"</h4>
			<p><strong>Cause:</strong> Using sync component import with <code>createProtectedRoute()</code></p>
			<p><strong>Solution:</strong> This is fixed in v5.0.0. Both patterns now work:</p>
			<CodeBlock
				codeContent={`// Both work in v5.0.0
createProtectedRoute({ component: AdminPanel })  // Sync
createProtectedRoute({ component: () => import('./Admin.svelte') })  // Async`}
				languageType="javascript"
			/>

			<h4 class="mt-4">Issue: "enableCategory is not a function"</h4>
			<p><strong>Cause:</strong> Using old logger API name</p>
			<p><strong>Solution:</strong> Use <code>setCategoryLevel()</code> instead:</p>
			<CodeBlock
				codeContent={`// ❌ Old
enableCategory('ROUTER', 'debug')

// ✅ New
setCategoryLevel('ROUTER', 'debug')`}
				languageType="javascript"
			/>

			<h4 class="mt-4">Issue: "$params is not defined"</h4>
			<p><strong>Cause:</strong> Trying to use store syntax with v5</p>
			<p><strong>Solution:</strong> Use function call with $derived:</p>
			<CodeBlock
				codeContent={`// ❌ Old
const id = $params.id

// ✅ New
const params = $derived(routeParams())
const id = params.id`}
				languageType="javascript"
			/>

			<h4 class="mt-4">Issue: "Missing './stores' specifier"</h4>
			<p><strong>Cause:</strong> Trying to import from removed /stores path</p>
			<p><strong>Solution:</strong> Import from main module:</p>
			<CodeBlock
				codeContent={`// ❌ Old
import { routeParams } from '@keenmate/svelte-spa-router/stores'

// ✅ New
import { routeParams } from '@keenmate/svelte-spa-router'`}
				languageType="javascript"
			/>
		</section>

		<!-- Migration Checklist -->
		<section class="mb-5">
			<h2 class="mb-4">Migration Checklist</h2>
			<div class="alert alert-secondary">
				<h5>Before You Start</h5>
				<ul>
					<li>☐ Back up your project</li>
					<li>☐ Review breaking changes list</li>
					<li>☐ Ensure tests exist for critical routes</li>
				</ul>

				<h5 class="mt-3">Code Changes</h5>
				<ul>
					<li>☐ Update Svelte to v5.0+</li>
					<li>☐ Update @keenmate/svelte-spa-router to v5.0</li>
					<li>☐ Replace all <code>$location</code>, <code>$params</code>, <code>$querystring</code> with function calls</li>
					<li>☐ Rename <code>params</code> to <code>routeParams</code></li>
					<li>☐ Update Router event props to camelCase</li>
					<li>☐ Replace <code>export let params</code> with <code>let { routeParams } = $props()</code></li>
					<li>☐ Update logger API calls</li>
					<li>☐ Update permission system configuration</li>
					<li>☐ Remove /stores import paths</li>
				</ul>

				<h5 class="mt-3">Testing</h5>
				<ul>
					<li>☐ Test all routes navigate correctly</li>
					<li>☐ Test route parameters work</li>
					<li>☐ Test protected routes and permissions</li>
					<li>☐ Test navigation guards and conditions</li>
					<li>☐ Test referrer tracking (if used)</li>
					<li>☐ Test error handling (if configured)</li>
				</ul>

				<h5 class="mt-3">Cleanup</h5>
				<ul>
					<li>☐ Remove old debug logging code</li>
					<li>☐ Update documentation</li>
					<li>☐ Review and remove unused imports</li>
				</ul>
			</div>
		</section>

		<!-- New Features to Explore -->
		<section class="mb-5">
			<h2 class="mb-4">New Features to Explore</h2>
			<p>After migrating, consider adopting these new v5 features:</p>

			<ul>
				<li><strong>Category-based Logging:</strong> Fine-grained debug logging with 12 categories</li>
				<li><strong>Referrer Tracking:</strong> Automatic previous route tracking with scroll position restoration</li>
				<li><strong>goBack() Helper:</strong> Navigate to referrer with automatic scroll restoration</li>
				<li><strong>Hierarchical Routes:</strong> Automatic breadcrumb and permission inheritance</li>
				<li><strong>Global Error Handler:</strong> Comprehensive error handling with recovery strategies</li>
				<li><strong>Enhanced Permission System:</strong> Component-based unauthorized handling</li>
				<li><strong>Tree Route Structure:</strong> <code>createHierarchy()</code> for nested route definitions</li>
			</ul>

			<p class="mt-3">
				See the <a href="/whats-new">What's New in v5</a> page for detailed information about all new features.
			</p>
		</section>

		<!-- Getting Help -->
		<section class="mb-5">
			<h2 class="mb-4">Getting Help</h2>
			<p>If you encounter issues during migration:</p>
			<ul>
				<li>Check the <a href="/api">API Reference</a> for updated function signatures</li>
				<li>Review example code in the documentation</li>
				<li>Enable debug logging to troubleshoot routing issues</li>
				<li>Open an issue on <a href="https://github.com/keenmate/svelte-spa-router/issues" target="_blank">GitHub</a></li>
			</ul>
		</section>
	</div>
</DocLayout>
