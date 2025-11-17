<script>
import { DocLayout, CodeBlock } from '@keenmate/svelte-docs'
</script>

<DocLayout
	titleText="What's New in v5"
	descriptionText="Discover the powerful new features in svelte-spa-router v5.0">

	<div class="py-1">
		<!-- Introduction -->
		<section class="mb-5">
			<h2 class="mb-4">Welcome to v5.0</h2>
			<p class="lead">
				Version 5.0 is a complete rewrite for Svelte 5, bringing modern runes-based reactivity,
				powerful new features, and significant improvements to the developer experience.
			</p>
			<div class="alert alert-success">
				This is the first stable release of svelte-spa-router for Svelte 5, providing enterprise-grade
				routing with comprehensive features for building complex single-page applications.
			</div>
		</section>

		<!-- Svelte 5 Runes -->
		<section class="mb-5">
			<h2 class="mb-4">🎯 Built for Svelte 5 with Runes</h2>
			<p>
				The entire router has been rewritten using Svelte 5's new runes system (<code>$state</code>,
				<code>$derived</code>, <code>$effect</code>), providing better performance and more predictable reactivity.
			</p>

			<CodeBlock
				codeContent={`import { location, routeParams, querystring } from '@keenmate/svelte-spa-router'

// Access state with $derived
const currentPath = $derived(location())
const params = $derived(routeParams())
const query = $derived(querystring())

// React to changes with $effect
$effect(() => {
  console.log('Route changed:', currentPath)
})`}
				languageType="javascript"
				titleText="Modern runes-based API"
			/>
		</section>

		<!-- Referrer Tracking -->
		<section class="mb-5">
			<h2 class="mb-4">🔄 Automatic Referrer Tracking</h2>
			<p>
				The router now automatically tracks where users came from, including route parameters,
				query strings, route names, and scroll positions.
			</p>

			<CodeBlock
				codeContent={`import { navigationContext, goBack } from '@keenmate/svelte-spa-router'

const navContext = $derived(navigationContext())
const referrer = $derived(navContext?.referrer)

// Referrer contains:
// - location: '/previous/route'
// - querystring: 'tab=settings'
// - params: { id: '123' }
// - routeName: 'documentDetail'
// - scrollX: 0
// - scrollY: 456

// Navigate back with automatic scroll restoration
function handleBack() {
  goBack()  // Restores exact scroll position!
}`}
				languageType="javascript"
				titleText="Referrer tracking with scroll restoration"
			/>

			<p class="mt-3">
				<a href="/features/referrer-tracking">Learn more about referrer tracking →</a>
			</p>
		</section>

		<!-- Category-Based Logging -->
		<section class="mb-5">
			<h2 class="mb-4">🐛 Category-Based Debug Logging</h2>
			<p>
				A comprehensive logging system with 12 hierarchical categories, color-coded output,
				and timestamps makes debugging routing issues easier than ever.
			</p>

			<CodeBlock
				codeContent={`import { enableLogging, setCategoryLevel } from '@keenmate/svelte-spa-router/logger'

// Enable all debug logging
if (import.meta.env.DEV) {
  enableLogging()
}

// Or enable specific categories
setCategoryLevel('ROUTER:NAVIGATION', 'debug')
setCategoryLevel('ROUTER:PERMISSIONS', 'warn')
setCategoryLevel('ROUTER:SCROLL', 'info')`}
				languageType="javascript"
				titleText="Fine-grained logging control"
			/>

			<p class="mt-3">Categories include: ROUTER, ROUTER:NAVIGATION, ROUTER:SCROLL, ROUTER:GUARDS,
			ROUTER:PERMISSIONS, and 7 more for comprehensive debugging.</p>

			<p>
				<a href="/features/logging">Learn more about debug logging →</a>
			</p>
		</section>

		<!-- Global Error Handling -->
		<section class="mb-5">
			<h2 class="mb-4">⚠️ Global Error Handling</h2>
			<p>
				Catch and recover from unhandled errors automatically with configurable recovery strategies,
				restart loop prevention, and beautiful error UI.
			</p>

			<CodeBlock
				codeContent={`import { configureGlobalErrorHandler } from '@keenmate/svelte-spa-router/helpers/error-handler'
import { GlobalErrorHandler } from '@keenmate/svelte-spa-router/helpers/GlobalErrorHandler'

// Configure error handling
configureGlobalErrorHandler({
  strategy: 'navigateSafe',  // or 'restart', 'showError', 'custom'
  safeRoute: '/',
  maxRestarts: 3,
  showToast: true
})

// Add to App.svelte
<GlobalErrorHandler />
<Router {routes} />`}
				languageType="javascript"
				titleText="Automatic error recovery"
			/>

			<p class="mt-3">
				<a href="/features/error-handling">Learn more about error handling →</a>
			</p>
		</section>

		<!-- Hierarchical Routes -->
		<section class="mb-5">
			<h2 class="mb-4">🌳 Hierarchical Route Inheritance</h2>
			<p>
				Child routes can now automatically inherit breadcrumbs, permissions, conditions, and
				authorization callbacks from parent routes, reducing code duplication.
			</p>

			<CodeBlock
				codeContent={`import { setHierarchicalRoutesEnabled } from '@keenmate/svelte-spa-router'
import { createRoute } from '@keenmate/svelte-spa-router/wrap'

setHierarchicalRoutesEnabled(true)

const routes = {
  '/documents': createRoute({
    component: Documents,
    breadcrumbs: [{ label: 'Home' }, { label: 'Documents' }],
    permissions: { any: ['read'] }
  }),

  // Child automatically inherits parent breadcrumbs + permissions
  '/documents/:id': createRoute({
    component: DocumentDetail,
    breadcrumbs: [{ label: 'Detail' }],
    // Effective: [Home, Documents, Detail]
    // Must have both 'read' (parent) AND 'documents.view' (child)
    permissions: { any: ['documents.view'] }
  })
}`}
				languageType="javascript"
				titleText="Route inheritance system"
			/>

			<p class="mt-3">
				<a href="/features/hierarchical-routes">Learn more about hierarchical routes →</a>
			</p>
		</section>

		<!-- Tree Route Structure -->
		<section class="mb-5">
			<h2 class="mb-4">📁 Tree/Nested Route Structure</h2>
			<p>
				Define deeply nested routes using a tree structure instead of flat definitions,
				perfect for complex applications with many levels of nesting.
			</p>

			<CodeBlock
				codeContent={`import { createHierarchy } from '@keenmate/svelte-spa-router/helpers/hierarchy'

const routes = createHierarchy({
  '/admin': {
    component: AdminLayout,
    permissions: { any: ['admin'] },
    children: {
      'users': {
        component: AdminUsers,
        children: {
          ':id': {
            component: AdminUserDetail,
            children: {
              'permissions': { component: UserPermissions },
              'activity': { component: UserActivity }
            }
          }
        }
      }
    }
  }
})

// Creates: /admin, /admin/users, /admin/users/:id,
//          /admin/users/:id/permissions, /admin/users/:id/activity`}
				languageType="javascript"
				titleText="Nested route definitions"
			/>

			<p class="mt-3">
				<a href="/features/nested-routes">Learn more about tree structure →</a>
			</p>
		</section>

		<!-- Enhanced Permissions -->
		<section class="mb-5">
			<h2 class="mb-4">🔐 Enhanced Permission System</h2>
			<p>
				The unauthorized handling system has been redesigned to respect routing modes and
				support component-based display without changing URLs.
			</p>

			<CodeBlock
				codeContent={`import { configurePermissions } from '@keenmate/svelte-spa-router/helpers/permissions'
import UnauthorizedPage from './UnauthorizedPage.svelte'

configurePermissions({
  getCurrentUser,
  checkPermissions,

  // Component-based (NEW) - show without URL change
  unauthorizedBehavior: 'component',
  unauthorizedComponent: UnauthorizedPage,

  // OR navigate to route (respects hash/history mode)
  unauthorizedBehavior: 'navigate',
  unauthorizedRoute: '/unauthorized'
})`}
				languageType="javascript"
				titleText="Improved unauthorized handling"
			/>

			<p class="mt-3">
				<a href="/features/permissions">Learn more about permissions →</a>
			</p>
		</section>

		<!-- Other Improvements -->
		<section class="mb-5">
			<h2 class="mb-4">✨ Additional Improvements</h2>

			<h4>goBack() Helper</h4>
			<p>
				Simplified navigation to previous route with automatic scroll position restoration:
			</p>
			<CodeBlock
				codeContent={`import { goBack } from '@keenmate/svelte-spa-router'

// Automatically navigates to referrer with scroll restoration
<button onclick={goBack}>← Go Back</button>`}
				languageType="javascript"
			/>

			<h4 class="mt-4">Strict Parameter Replacement</h4>
			<p>
				Missing route parameters are now replaced with a configurable placeholder (default: "N-A")
				instead of being silently removed, making it easier to spot missing data:
			</p>
			<CodeBlock
				codeContent={`import { setParamReplacementPlaceholder } from '@keenmate/svelte-spa-router'

setParamReplacementPlaceholder('N-A')

// Route: /users/:userId/:section
push('userProfile', { userId: 123 })  // Missing section
// Result: /users/123/N-A (easy to spot!)

// Also triggers onNotFound callback for tracking`}
				languageType="javascript"
			/>

			<h4 class="mt-4">Consistent API Naming</h4>
			<p>All Router event props now use camelCase for consistency with JavaScript conventions:</p>
			<ul>
				<li><code>onRouteLoading</code> (was <code>onrouteLoading</code>)</li>
				<li><code>onRouteLoaded</code> (was <code>onrouteLoaded</code>)</li>
				<li><code>onConditionsFailed</code> (was <code>onconditionsFailed</code>)</li>
			</ul>

			<h4 class="mt-4">Improved TypeScript Support</h4>
			<p>
				Enhanced type definitions with better generics support for typed route params,
				query strings, and navigation context.
			</p>
		</section>

		<!-- Performance -->
		<section class="mb-5">
			<h2 class="mb-4">⚡ Performance</h2>
			<ul>
				<li><strong>Lighter weight:</strong> Runes-based implementation is more efficient than stores</li>
				<li><strong>Zero overhead logging:</strong> Debug logging has negligible impact when disabled</li>
				<li><strong>Better tree-shaking:</strong> Improved bundle size in production builds</li>
				<li><strong>Faster route matching:</strong> Optimized pattern matching with regexparam</li>
			</ul>
		</section>

		<!-- Developer Experience -->
		<section class="mb-5">
			<h2 class="mb-4">🛠️ Developer Experience</h2>

			<h4>Better Error Messages</h4>
			<p>Clear, actionable error messages help you identify and fix issues quickly:</p>
			<div class="alert alert-danger">
				<code>Route "unknownRoute" not found in registry. Registered routes: [ 'home', 'about', 'user' ]</code>
			</div>

			<h4>Comprehensive Documentation</h4>
			<ul>
				<li>Complete API reference with all functions documented</li>
				<li>Detailed feature guides with real-world examples</li>
				<li>Migration guide from v4 to v5</li>
				<li>Troubleshooting sections for common issues</li>
			</ul>

			<h4>Live Examples</h4>
			<p>
				Two full example applications demonstrate all features:
			</p>
			<ul>
				<li>
					<a href="https://hash.svelte-spa-router.keenmate.dev" target="_blank">Hash mode demo</a> -
					Traditional #/path routing
				</li>
				<li>
					<a href="https://history.svelte-spa-router.keenmate.dev" target="_blank">History mode demo</a> -
					Clean URL routing
				</li>
			</ul>
		</section>

		<!-- Backwards Compatibility -->
		<section class="mb-5">
			<h2 class="mb-4">⚠️ Breaking Changes</h2>
			<p>
				While v5.0 includes breaking changes, the core routing API remains familiar.
				Most changes are straightforward find-and-replace operations:
			</p>
			<ul>
				<li><code>$location</code> → <code>location()</code></li>
				<li><code>$params</code> → <code>routeParams()</code></li>
				<li><code>onrouteLoaded</code> → <code>onRouteLoaded</code></li>
				<li><code>setDebugLoggingEnabled()</code> → <code>enableLogging()</code></li>
			</ul>

			<p class="mt-3">
				See the <a href="/migration">Migration Guide</a> for complete upgrade instructions.
			</p>
		</section>

		<!-- Getting Started -->
		<section class="mb-5">
			<h2 class="mb-4">🚀 Get Started</h2>
			<p>Ready to try v5.0? Install it now:</p>

			<CodeBlock
				codeContent={`npm install @keenmate/svelte-spa-router@5`}
				languageType="bash"
			/>

			<p class="mt-3">Then check out the <a href="/getting-started">Getting Started guide</a> to build your first route!</p>
		</section>

		<!-- Feedback -->
		<section class="mb-5">
			<h2 class="mb-4">💬 Feedback Welcome</h2>
			<p>
				Found a bug? Have a feature request? We'd love to hear from you:
			</p>
			<ul>
				<li>
					<a href="https://github.com/keenmate/svelte-spa-router/issues" target="_blank">
						Report issues on GitHub
					</a>
				</li>
				<li>
					<a href="https://github.com/keenmate/svelte-spa-router/discussions" target="_blank">
						Join discussions
					</a>
				</li>
			</ul>
		</section>
	</div>
</DocLayout>
