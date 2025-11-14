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
			<p>Configure the permission system once in your <code>main.js</code> before mounting your app:</p>

			<CodeBlock
				codeContent={`// main.js
import { configurePermissions } from '@keenmate/svelte-spa-router/helpers/permissions'
import { get } from 'svelte/store'
import { currentUser } from './stores/auth'

configurePermissions({
  // Function to check if user has required permissions
  checkPermissions: (user, requirements) => {
    if (!user) return false
    if (!requirements) return true

    // Check if user has ANY of the required permissions (OR logic)
    if (requirements.any) {
      return requirements.any.some(perm =>
        user.permissions.includes(perm)
      )
    }

    // Check if user has ALL required permissions (AND logic)
    if (requirements.all) {
      return requirements.all.every(perm =>
        user.permissions.includes(perm)
      )
    }

    return true
  },

  // Function to get current user
  getCurrentUser: () => get(currentUser),

  // Handler for unauthorized access
  onUnauthorized: (detail) => {
    push('/unauthorized')
  }
})

// Now mount your app
mount(App, { target: document.body })`}
				languageType="javascript"
				titleText="Configure permissions"
			/>
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
				codeContent={`// auth.js - User store
export const currentUser = writable({
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

// main.js - Configure permissions
import { configurePermissions } from '@keenmate/svelte-spa-router/helpers/permissions'
import { push } from '@keenmate/svelte-spa-router'
import { currentUser } from './stores/auth'
import { get } from 'svelte/store'

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
  getCurrentUser: () => get(currentUser),
  onUnauthorized: () => {
    push('/unauthorized')
  }
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
  getCurrentUser: () => get(currentUser),
  onUnauthorized: () => push('/unauthorized')
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
				<h5>Unauthorized Handler</h5>
				<p class="mb-0">
					Always implement an <code>onUnauthorized</code> handler to gracefully handle
					unauthorized access attempts.
				</p>
			</div>
		</section>

		<!-- Integration with Auth -->
		<section class="mb-5">
			<h2 class="mb-4">Integration with Authentication</h2>
			<p>Combine permissions with your authentication system:</p>

			<CodeBlock
				codeContent={`// auth.js
import { writable } from 'svelte/store'

export const currentUser = writable(null)

export async function login(username, password) {
  // Call your API
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })

  if (response.ok) {
    const user = await response.json()
    currentUser.set(user)
    return true
  }

  return false
}

export function logout() {
  currentUser.set(null)
  push('/login')
}

// Check if user is authenticated
export function isAuthenticated() {
  return get(currentUser) !== null
}`}
				languageType="javascript"
				titleText="Authentication integration"
			/>
		</section>

		<!-- Live Examples -->
		<section class="mb-5">
			<h2 class="mb-4">Try It Live</h2>
			<p>See the permission system in action:</p>
			<div class="alert alert-info">
				<p class="mb-0">
					Check out the <code>example-permissions/</code> directory in the repository for a complete
					working example with mock authentication and role-based access control.
				</p>
			</div>
		</section>
	</div>
</DocLayout>
