<script>
import { DocLayout, CodeBlock } from '@keenmate/svelte-docs'
</script>

<DocLayout
	titleText="Permission System"
	descriptionText="Role-based access control for routes and UI elements">

	<div class="py-1">
		<!-- Introduction -->
		<section class="mb-5">
			<h2 class="mb-4">Built-in Permission System</h2>
			<p class="lead">
				The router includes a flexible permission system for implementing role-based access control (RBAC).
				Protect routes, control navigation, and conditionally show/hide UI elements based on user permissions.
			</p>
		</section>

		<!-- Configuration -->
		<section class="mb-5">
			<h2 class="mb-4">Configuration</h2>
			<p>
				Configure the permission system once in your <code>main.js</code> before mounting your app.
				The minimum setup is <code>checkPermissions</code> — everything else has sensible defaults.
			</p>

			<CodeBlock
				codeContent={`// main.js
import { configurePermissions, setCurrentUser } from '@keenmate/svelte-spa-router/helpers/permissions'
import Unauthorized from './routes/Unauthorized.svelte'

configurePermissions({
  // Required: check user permissions against requirements
  checkPermissions: (user, requirements) => {
    if (!user) return false
    if (!requirements) return true

    if (requirements.any) {
      return requirements.any.some(perm => user.permissions.includes(perm))
    }
    if (requirements.all) {
      return requirements.all.every(perm => user.permissions.includes(perm))
    }
    return true
  },

  // Recommended (rc02+): show unauthorized component without URL change
  unauthorizedBehavior: 'component',
  unauthorizedComponent: Unauthorized

  // Alternative: navigate to a real /unauthorized route
  // unauthorizedBehavior: 'navigate',
  // unauthorizedRoute: '/unauthorized'
})

// On login (or app startup if user is already authenticated):
setCurrentUser({
  id: 1,
  name: 'Alice',
  permissions: ['admin.read', 'admin.write']
})

mount(App, { target: document.body })`}
				languageType="javascript"
				titleText="Configure permissions"
			/>

			<div class="alert alert-info mt-3">
				<strong>Reactive by default in v5.2.0-rc02.</strong> If you skip the
				<code>getCurrentUser</code> option and use <code>setCurrentUser()</code> to write the user
				state, <code>hasPermission()</code> updates live inside <code>&#123;#if&#125;</code> blocks
				without any subscription wiring. See the next section.
			</div>
		</section>

		<!-- Reactive Permissions -->
		<section class="mb-5">
			<h2 class="mb-4">Reactive permissions with <code>setCurrentUser()</code> <span class="badge bg-success">rc02</span></h2>
			<p>
				In v5.0–rc01, the canonical example used a custom <code>getCurrentUser</code> that read from
				a Svelte 4 store via <code>get(currentUser)</code> — a non-reactive read, so
				<code>&#123;#if hasPermission(...)&#125;</code> only updated on navigation. A websocket
				pushing a permission change wouldn't update the UI until the user clicked a link.
			</p>
			<p>
				v5.2.0-rc02 backs the default <code>currentUserGetter</code> with module-level
				<code>$state</code>. Every <code>hasPermission()</code> call in a reactive context tracks
				user changes automatically.
			</p>
			<CodeBlock language="javascript" codeContent={`import { setCurrentUser, getCurrentUser, hasPermission } from '@keenmate/svelte-spa-router/helpers/permissions'

// Login
setCurrentUser({ id: 1, name: 'Alice', permissions: ['admin.read'] })

// Logout
setCurrentUser(null)

// Mutate (read-then-write)
setCurrentUser({ ...getCurrentUser(), permissions: newPerms })

// Anywhere in a template — re-renders automatically
{#if hasPermission({ any: ['admin.read'] })}
  <a href="/admin">Admin Panel</a>
{/if}`} titleText="setCurrentUser + reactive hasPermission" />

			<h3 class="mt-4">Wiring up websocket-driven permission updates</h3>
			<CodeBlock language="javascript" codeContent={`websocket.on('permissions:changed', (newPermissions) => {
  setCurrentUser({
    ...getCurrentUser(),
    permissions: newPermissions
  })
  // Every {#if hasPermission(...)} block re-evaluates immediately
  // (For protected routes the user is sitting on, see revalidateCurrentRoute below)
})`} />

			<div class="alert alert-info mt-3">
				<strong>If you maintain your own reactive user store</strong> (your own
				<code>$state</code> rune, or any other reactive container), keep passing
				<code>configurePermissions(&#123; getCurrentUser &#125;)</code> and it'll keep working —
				the default is the new behavior, but you can override it. Pass
				<code>getCurrentUser: null</code> to explicitly reset back to the state-backed default.
			</div>
		</section>

		<!-- revalidateCurrentRoute -->
		<section class="mb-5">
			<h2 class="mb-4">Re-checking the active route with <code>revalidateCurrentRoute()</code> <span class="badge bg-success">rc02</span></h2>
			<p>
				Reactive <code>hasPermission()</code> covers <strong>UI element visibility</strong> — menu
				items, buttons, conditional sections. It <em>doesn't</em> cover the case where the user is
				<strong>sitting on a protected page</strong> when their permissions are revoked. The router
				only checks route conditions during navigation, so a user on <code>/admin</code> who loses
				admin permission would stay on <code>/admin</code> until they navigated away.
			</p>
			<p>
				<code>revalidateCurrentRoute()</code> re-runs guards and conditions against the currently
				mounted route <em>without</em> re-mounting the component. On success, nothing visible
				happens — the component keeps its state (no flicker, no scroll reset, no in-flight form data
				lost). On failure, the same unauthorized handling fires as for fresh navigation, or you can
				customize it with <code>onRevalidationFailure</code>.
			</p>
			<CodeBlock language="javascript" codeContent={`import { revalidateCurrentRoute } from '@keenmate/svelte-spa-router'
import { configurePermissions, setCurrentUser, getCurrentUser } from '@keenmate/svelte-spa-router/helpers/permissions'

// Optional: custom handler for revalidation failures
// (fires INSTEAD OF the standard unauthorized handling for revalidation)
configurePermissions({
  onRevalidationFailure: (detail) => {
    // Show a confirmation dialog, log an audit entry, soft-warn...
    notify('Your permissions changed — please reload')
    // If you don't navigate, the user stays on the current page
  }
})

websocket.on('permissions:changed', (newPerms) => {
  // 1. Update the user — covers menus, buttons, conditional UI
  setCurrentUser({ ...getCurrentUser(), permissions: newPerms })

  // 2. Re-check the active route — covers "user is on a now-forbidden page"
  revalidateCurrentRoute()
})`} titleText="Wiring rc02 reactive + revalidation together" />

			<h3 class="mt-4">Safe to call on every websocket message</h3>
			<p>
				Calls within a ~50ms window are coalesced into a single re-validation pass. Multiple
				<code>&lt;Router&gt;</code> instances (nested routers, zones) each register independently
				and re-validate their own routes.
			</p>
		</section>

		<!-- Protecting Routes -->
		<section class="mb-5">
			<h2 class="mb-4">Protecting Routes</h2>
			<p>Use <code>createProtectedRoute()</code> to protect routes with permissions - no <code>wrap()</code> needed!</p>

			<h4 class="mt-4">ANY Permission (OR Logic)</h4>
			<p>User needs at least ONE of the specified permissions:</p>

			<CodeBlock
				codeContent={`import { createProtectedRoute } from '@keenmate/svelte-spa-router/helpers/permissions'

const routes = {
  '/': Home,

  // No wrap() needed! createProtectedRoute() returns ready-to-use wrapped component
  // User needs 'admin.read' OR 'admin.write'
  '/admin': createProtectedRoute({
    component: () => import('./Admin.svelte'),
    permissions: { any: ['admin.read', 'admin.write'] },
    loadingComponent: Loading,
    title: 'Admin Panel',
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'Admin' }
    ]
  }),

  '/unauthorized': Unauthorized,
  '*': NotFound
}`}
				languageType="javascript"
				titleText="ANY permission requirement"
			/>

			<h4 class="mt-4">ALL Permissions (AND Logic)</h4>
			<p>User needs ALL of the specified permissions:</p>

			<CodeBlock
				codeContent={`const routes = {
  // User needs 'settings.read' AND 'settings.write'
  '/settings': createProtectedRoute({
    component: () => import('./Settings.svelte'),
    permissions: { all: ['settings.read', 'settings.write'] },
    title: 'Settings'
  }),
}`}
				languageType="javascript"
				titleText="ALL permissions requirement"
			/>

			<h4 class="mt-4">Advanced: Using wrap() with createProtectedRouteDefinition()</h4>
			<p>For more control or when combining with other wrap options, use <code>createProtectedRouteDefinition()</code> with <code>wrap()</code>:</p>

			<CodeBlock
				codeContent={`import { wrap } from '@keenmate/svelte-spa-router/wrap'
import { createProtectedRouteDefinition } from '@keenmate/svelte-spa-router/helpers/permissions'
import Admin from './Admin.svelte'

const routes = {
  // Advanced usage with wrap()
  '/admin': wrap(createProtectedRouteDefinition({
    component: () => import('./Admin.svelte'),
    permissions: { any: ['admin.read'] }
  }))
}`}
				languageType="javascript"
				titleText="Advanced: Manual wrapping"
			/>
		</section>

		<!-- UI Element Control -->
		<section class="mb-5">
			<h2 class="mb-4">Controlling UI Elements</h2>
			<p>Use <code>hasPermission()</code> to show/hide UI elements based on permissions:</p>

			<CodeBlock
				codeContent={`<script>
import { hasPermission } from '@keenmate/svelte-spa-router/helpers/permissions'
import { link } from '@keenmate/svelte-spa-router'
</script>

<nav>
  <a href="/" use:link>Home</a>

  {#if hasPermission({ any: ['admin.read'] })}
    <a href="/admin" use:link>Admin Panel</a>
  {/if}

  {#if hasPermission({ all: ['settings.read', 'settings.write'] })}
    <a href="/settings" use:link>Settings</a>
  {/if}

  {#if hasPermission({ any: ['reports.view'] })}
    <a href="/reports" use:link>Reports</a>
  {/if}
</nav>`}
				languageType="svelte"
				titleText="Conditional UI elements"
			/>
		</section>

		<!-- Permission Requirements -->
		<section class="mb-5">
			<h2 class="mb-4">Permission Requirements</h2>

			<div class="row g-4">
				<div class="col-md-6">
					<div class="card h-100 border-primary">
						<div class="card-header bg-primary text-white">
							<h5 class="mb-0">ANY (OR Logic)</h5>
						</div>
						<div class="card-body">
							<p><code>any: [...]</code></p>
							<p>User needs <strong>at least ONE</strong> of these permissions.</p>
							<CodeBlock
								codeContent={`permissions: {
  any: ['admin.read', 'admin.write']
}

// User with 'admin.read' → ✅ allowed
// User with 'admin.write' → ✅ allowed
// User with both → ✅ allowed
// User with neither → ❌ denied`}
								languageType="javascript"
								titleText="ANY logic"
							/>
						</div>
					</div>
				</div>

				<div class="col-md-6">
					<div class="card h-100 border-success">
						<div class="card-header bg-success text-white">
							<h5 class="mb-0">ALL (AND Logic)</h5>
						</div>
						<div class="card-body">
							<p><code>all: [...]</code></p>
							<p>User needs <strong>ALL</strong> of these permissions.</p>
							<CodeBlock
								codeContent={`permissions: {
  all: ['settings.read', 'settings.write']
}

// User with 'settings.read' only → ❌ denied
// User with 'settings.write' only → ❌ denied
// User with both → ✅ allowed
// User with neither → ❌ denied`}
								languageType="javascript"
								titleText="ALL logic"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Practical Examples -->
		<section class="mb-5">
			<h2 class="mb-4">Practical Examples</h2>

			<h4>Complete Permission Setup</h4>
			<CodeBlock
				codeContent={`// auth.svelte.js - User state with Svelte 5 runes
let currentUserState = $state({
  id: 1,
  name: 'John Doe',
  role: 'admin',
  permissions: [
    'admin.read',
    'admin.write',
    'settings.read',
    'settings.write',
    'reports.view'
  ]
})

export function getCurrentUser() {
  return currentUserState
}

export function setCurrentUser(user) {
  currentUserState = user
}

// main.js - Configure permissions
import { configurePermissions } from '@keenmate/svelte-spa-router/helpers/permissions'
import { push } from '@keenmate/svelte-spa-router'
import { getCurrentUser } from './auth.svelte.js'

configurePermissions({
  checkPermissions: (user, requirements) => {
    if (!user) return false
    if (!requirements) return true

    if (requirements.any) {
      return requirements.any.some(perm => user.permissions.includes(perm))
    }

    if (requirements.all) {
      return requirements.all.every(perm => user.permissions.includes(perm))
    }

    return true
  },
  // rc02+: setCurrentUser() provides reactive defaults — getCurrentUser is optional
  // getCurrentUser,  // only needed if you maintain your own reactive user store
  unauthorizedBehavior: 'component',
  unauthorizedComponent: Unauthorized
})`}
				languageType="javascript"
				titleText="Complete setup"
			/>

			<h4 class="mt-4">Route Configuration</h4>
			<CodeBlock
				codeContent={`import { createProtectedRoute } from '@keenmate/svelte-spa-router/helpers/permissions'
import Loading from './Loading.svelte'
import Unauthorized from './Unauthorized.svelte'
import NotFound from './NotFound.svelte'

const routes = {
  '/': Home,

  // No wrap() needed! createProtectedRoute() handles it automatically
  '/admin': createProtectedRoute({
    component: () => import('./Admin.svelte'),
    permissions: { any: ['admin.read', 'admin.write'] },
    loadingComponent: Loading,
    title: 'Admin Panel'
  }),

  '/settings': createProtectedRoute({
    component: () => import('./Settings.svelte'),
    permissions: { all: ['settings.read', 'settings.write'] },
    loadingComponent: Loading,
    title: 'Settings'
  }),

  '/reports': createProtectedRoute({
    component: () => import('./Reports.svelte'),
    permissions: { any: ['reports.view', 'reports.create'] },
    loadingComponent: Loading,
    title: 'Reports',
    breadcrumbs: [
      { label: 'Home', path: '/' },
      { label: 'Reports' }
    ]
  }),

  '/unauthorized': Unauthorized,
  '*': NotFound
}`}
				languageType="javascript"
				titleText="Route configuration"
			/>

			<h4 class="mt-4">Navigation with Permissions</h4>
			<CodeBlock
				codeContent={`<script>
import { hasPermission } from '@keenmate/svelte-spa-router/helpers/permissions'
import { link } from '@keenmate/svelte-spa-router'
import active from '@keenmate/svelte-spa-router/active'
</script>

<style>
:global(a.active) {
  font-weight: bold;
  color: var(--primary-color);
}
</style>

<nav class="sidebar">
  <a href="/" use:link use:active>
    🏠 Home
  </a>

  {#if hasPermission({ any: ['admin.read', 'admin.write'] })}
    <a href="/admin" use:link use:active>
      👑 Admin Panel
    </a>
  {/if}

  {#if hasPermission({ all: ['settings.read', 'settings.write'] })}
    <a href="/settings" use:link use:active>
      ⚙️ Settings
    </a>
  {/if}

  {#if hasPermission({ any: ['reports.view'] })}
    <a href="/reports" use:link use:active>
      📊 Reports
    </a>
  {/if}
</nav>`}
				languageType="svelte"
				titleText="Conditional navigation"
			/>

			<h4 class="mt-4">Feature Flags with Permissions</h4>
			<CodeBlock
				codeContent={`<script>
import { hasPermission } from '@keenmate/svelte-spa-router/helpers/permissions'
</script>

<div class="dashboard">
  <h1>Dashboard</h1>

  <!-- Show export button only if user can export -->
  {#if hasPermission({ any: ['data.export'] })}
    <button>Export Data</button>
  {/if}

  <!-- Show delete button only if user can delete -->
  {#if hasPermission({ any: ['data.delete'] })}
    <button class="danger">Delete Selected</button>
  {/if}

  <!-- Show admin tools only if user has full admin access -->
  {#if hasPermission({ all: ['admin.read', 'admin.write', 'admin.delete'] })}
    <div class="admin-tools">
      <h2>Admin Tools</h2>
      <!-- Admin-only features -->
    </div>
  {/if}
</div>`}
				languageType="svelte"
				titleText="Feature flags"
			/>
		</section>

		<!-- Custom Permission Logic -->
		<section class="mb-5">
			<h2 class="mb-4">Custom Permission Logic</h2>
			<p>You can implement complex permission checks in your <code>checkPermissions</code> function:</p>

			<CodeBlock
				codeContent={`configurePermissions({
  checkPermissions: (user, requirements) => {
    if (!user) return false

    // Allow super admin to access everything
    if (user.role === 'superadmin') {
      return true
    }

    // Check for required role
    if (requirements.role && user.role !== requirements.role) {
      return false
    }

    // Check for specific user IDs (e.g., beta testers)
    if (requirements.userIds && !requirements.userIds.includes(user.id)) {
      return false
    }

    // Standard permission checks
    if (requirements.any) {
      return requirements.any.some(perm => user.permissions.includes(perm))
    }

    if (requirements.all) {
      return requirements.all.every(perm => user.permissions.includes(perm))
    }

    return true
  },
  unauthorizedBehavior: 'navigate',
  unauthorizedRoute: '/unauthorized'
})`}
				languageType="javascript"
				titleText="Custom permission logic"
			/>
		</section>

		<!-- Best Practices -->
		<section class="mb-5">
			<h2 class="mb-4">Best Practices</h2>

			<div class="alert alert-success">
				<h5>Configure Early</h5>
				<p class="mb-0">
					Configure permissions in <code>main.js</code> before mounting your app to ensure the system
					is ready when routes are accessed.
				</p>
			</div>

			<div class="alert alert-info mt-3">
				<h5>Granular Permissions</h5>
				<p class="mb-0">
					Use specific permission names like <code>users.read</code>, <code>users.write</code> instead
					of broad permissions like <code>admin</code> for better control.
				</p>
			</div>

			<div class="alert alert-warning mt-3">
				<h5>Server-Side Validation</h5>
				<p class="mb-0">
					Client-side permissions are for UX only! Always validate permissions on the server
					for security. Never trust client-side checks alone.
				</p>
			</div>

			<div class="alert alert-danger mt-3">
				<h5>Configure unauthorized behavior</h5>
				<p class="mb-0">
					Set <code>unauthorizedBehavior</code> + <code>unauthorizedComponent</code> (or
					<code>unauthorizedRoute</code>) at config time so failed permission checks have a
					consistent UI. The legacy <code>onUnauthorized</code> callback still works for backward
					compatibility, but the declarative config is preferred.
				</p>
			</div>

			<div class="alert alert-info mt-3">
				<h5>Pair reactive permissions with route revalidation</h5>
				<p class="mb-0">
					<code>setCurrentUser()</code> updates UI conditionals reactively, but doesn't re-check
					the currently mounted route. Call <code>revalidateCurrentRoute()</code> after a
					permission update if the user might be sitting on a now-forbidden page.
				</p>
			</div>
		</section>

		<!-- Integration with Auth -->
		<section class="mb-5">
			<h2 class="mb-4">Integration with Authentication</h2>
			<p>Combine permissions with your authentication system:</p>

			<CodeBlock
				codeContent={`// auth.svelte.js - Svelte 5 runes-based authentication
let currentUserState = $state(null)

export function getCurrentUser() {
  return currentUserState
}

export async function login(username, password) {
  // Call your API
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })

  if (response.ok) {
    const user = await response.json()
    currentUserState = user
    return true
  }

  return false
}

export function logout() {
  currentUserState = null
  push('/login')
}

// Check if user is authenticated
export function isAuthenticated() {
  return currentUserState !== null
}`}
				languageType="javascript"
				titleText="Authentication integration"
			/>
		</section>

		<!-- Live Examples -->
		<section class="mb-5">
			<h2 class="mb-4">Try It Live</h2>
			<p>See the permission system in action:</p>
			<ul>
				<li>
					<a href="https://history.svelte-spa-router.keenmate.dev/authorization-demo" target="_blank">
						<code>/authorization-demo</code>
					</a> — async <code>authorizationCallback</code> for per-resource checks
				</li>
				<li>
					<a href="https://history.svelte-spa-router.keenmate.dev/admin" target="_blank">
						<code>/admin</code>
					</a> — permission-protected route (use the <strong>Toggle 👤</strong> button in the example header to switch users)
				</li>
				<li>
					<a href="https://history.svelte-spa-router.keenmate.dev/settings" target="_blank">
						<code>/settings</code>
					</a> — route requiring <code>settings:manage</code> permission
				</li>
			</ul>
			<p>
				Source: <a href="https://github.com/keenmate/svelte-spa-router/tree/main/example" target="_blank"><code>example/</code></a> in the main repo.
			</p>
		</section>
	</div>
</DocLayout>
