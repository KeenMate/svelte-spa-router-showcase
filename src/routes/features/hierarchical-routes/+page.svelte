<script>
import { DocLayout, CodeBlock } from '@keenmate/svelte-docs'
</script>

<DocLayout
	titleText="Route Inheritance"
	descriptionText="Child routes inherit breadcrumbs, permissions, conditions, and authorization from parents — two APIs to define the hierarchy">

<div class="py-1">

<div class="alert alert-info mb-4">
	<strong>Live demo:</strong>
	<a href="https://history.svelte-spa-router.keenmate.dev/admin-tree" target="_blank">
		Open <code>/admin-tree</code> →
	</a>
	A tree-defined admin section using <code>createHierarchy()</code>. Inherits breadcrumbs and
	permissions down the chain. (Requires admin — use the example header's
	<strong>Toggle 👤</strong> button to switch users.)
</div>

<section class="mb-5">
	<h2>What route inheritance gives you</h2>
	<p>
		When the routes in your app form a natural hierarchy
		(<code>/documents</code> → <code>/documents/:id</code> → <code>/documents/:id/logs</code>),
		the router can compute inherited metadata for each child instead of asking you to repeat it:
	</p>
	<ul>
		<li><strong>Breadcrumbs</strong> — concatenated parent → child</li>
		<li><strong>Permissions</strong> — child permissions are added to the parent's (cumulative AND, like filesystem ACLs)</li>
		<li><strong>Conditions</strong> — parent <code>wrap(&#123; conditions &#125;)</code> run before child conditions</li>
		<li><strong>Authorization callbacks</strong> — parent callbacks execute before child callbacks (fail-fast on first <code>false</code>)</li>
	</ul>
	<p>
		Inheritance is <strong>opt-in</strong>. Without it enabled, routes stay independent and you define everything explicitly.
		Enable it once at app startup:
	</p>
	<CodeBlock language="javascript" codeContent={`import { setHierarchicalRoutesEnabled } from '@keenmate/svelte-spa-router'

setHierarchicalRoutesEnabled(true)`} />
</section>

<!-- Which API table -->
<section class="mb-5">
	<h2>Which API should I use?</h2>
	<p>
		Two ways to declare the hierarchy. <strong>Both produce identical runtime behavior</strong> —
		they're just different ergonomics for writing route definitions.
	</p>
	<div class="table-responsive">
		<table class="table table-bordered">
			<thead>
				<tr>
					<th style="width: 25%">Use…</th>
					<th>When</th>
					<th>Looks like</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td><strong>Flat definitions</strong><br><small><code>createRoute()</code> + <code>setHierarchicalRoutesEnabled(true)</code></small></td>
					<td>Mostly shallow routes (1–2 levels), or you need <code>inheritX: false</code> opt-outs on specific routes, or your route shape doesn't visually mirror your UI tree.</td>
					<td>One flat object with <code>'/a'</code>, <code>'/a/b'</code>, <code>'/a/b/c'</code> keys — child paths spelled out in full.</td>
				</tr>
				<tr>
					<td><strong>Tree definitions</strong><br><small><code>createHierarchy()</code></small></td>
					<td>Deep nesting (3+ levels) where every child inherits from its parent and the structure mirrors UI hierarchy. Most concise for admin-style apps.</td>
					<td>Single nested object with <code>children: &#123; ':id': &#123; … &#125; &#125;</code>. Child paths are relative — no repeated segments.</td>
				</tr>
			</tbody>
		</table>
	</div>
	<div class="alert alert-info" role="alert">
		<strong>Mix freely.</strong> Both forms produce plain route objects — spread them together into the routes prop:
		<code>&#123; ...adminRoutes, ...publicRoutes &#125;</code>.
	</div>
</section>

<!-- API 1: Flat -->
<section class="mb-5">
	<h2>API 1 — Flat definitions with <code>createRoute()</code></h2>
	<p>
		Standard flat-object route declarations. Inheritance triggers automatically when
		<code>setHierarchicalRoutesEnabled(true)</code> is set and the router can find a parent
		path by prefix match.
	</p>

	<h3>Breadcrumbs</h3>
	<CodeBlock language="javascript" codeContent={`import { createRoute } from '@keenmate/svelte-spa-router/wrap'

const routes = {
    '/documents': createRoute({
        component: Documents,
        breadcrumbs: [
            { label: 'Home', path: '/' },
            { label: 'Documents' }
        ]
    }),

    // Inherits parent breadcrumbs
    '/documents/:id': createRoute({
        component: DocumentDetail,
        breadcrumbs: [{ label: 'Document Detail' }]
        // Effective: [Home, Documents, Document Detail]
    }),

    // Inherits the full chain
    '/documents/:id/logs': createRoute({
        component: DocumentLogs,
        breadcrumbs: [{ label: 'Access Logs' }]
        // Effective: [Home, Documents, Document Detail, Access Logs]
    })
}`} />

	<h3>Permissions (cumulative AND)</h3>
	<p>
		Permission checks chain like filesystem permissions — to reach a nested route, you must
		pass <em>every</em> ancestor check too.
	</p>
	<CodeBlock language="javascript" codeContent={`import { createProtectedRoute } from '@keenmate/svelte-spa-router/helpers/permissions'

const routes = {
    '/documents': createProtectedRoute({
        component: Documents,
        permissions: { any: ['read'] }
    }),

    '/documents/:id': createProtectedRoute({
        component: DocumentDetail,
        permissions: { any: ['documents.view'] }
        // Must have 'read' AND 'documents.view'
    }),

    '/documents/:id/logs': createProtectedRoute({
        component: DocumentLogs,
        permissions: { any: ['logs.view'] }
        // Must have 'read' AND 'documents.view' AND 'logs.view'
    })
}`} />
	<div class="alert alert-warning" role="alert">
		<strong>Fail-fast.</strong> If the parent check fails, child checks never run.
	</div>

	<h3>Authorization callbacks chain too</h3>
	<CodeBlock language="javascript" codeContent={`const routes = {
    // Folder-level access
    '/documents': createProtectedRoute({
        component: Documents,
        permissions: { any: ['read'] },
        authorizationCallback: async (detail) => {
            return await checkFolderAccess()
        }
    }),

    // Document-level access — parent runs first
    '/documents/:id': createProtectedRoute({
        component: DocumentDetail,
        permissions: { any: ['documents.view'] },
        authorizationCallback: async (detail) => {
            return await checkDocumentAccess(detail.params.id)
        }
    })
}`} />

	<h3>Opting out of inheritance</h3>
	<p>
		The flat API supports per-route opt-out flags. The tree API doesn't — it always inherits.
		This is the main reason to choose flat over tree.
	</p>
	<CodeBlock language="javascript" codeContent={`const routes = {
    '/documents': createRoute({
        component: Documents,
        breadcrumbs: [{ label: 'Documents' }],
        permissions: { any: ['read'] }
    }),

    // Independent route that lives under /documents but isn't a child
    '/documents/public/:id': createRoute({
        component: PublicDocument,
        breadcrumbs: [{ label: 'Public Document' }],
        permissions: { any: ['guest'] },
        inheritBreadcrumbs: false,    // fresh breadcrumbs
        inheritPermissions: false,    // independent check
        inheritConditions: false,     // skip parent conditions
        inheritAuthorization: false   // skip parent callbacks
    })
}`} />
</section>

<!-- API 2: Tree -->
<section class="mb-5">
	<h2>API 2 — Tree definitions with <code>createHierarchy()</code></h2>
	<p>
		<code>createHierarchy()</code> takes a nested object and returns a flat routes object that
		<code>&lt;Router&gt;</code> can consume. Child paths are <strong>relative</strong> —
		the helper concatenates them to the parent path for you. Inheritance is always on inside the tree.
	</p>

	<h3>Side-by-side comparison</h3>
	<div class="row g-3">
		<div class="col-md-6">
			<strong>Flat</strong>
			<CodeBlock language="javascript" codeContent={`{
    '/documents': createRoute({
        component: Documents,
        breadcrumbs: [{ label: 'Documents' }]
    }),
    '/documents/:id': createRoute({
        component: DocumentDetail,
        breadcrumbs: [{ label: 'Detail' }]
    }),
    '/documents/:id/logs': createRoute({
        component: DocumentLogs,
        breadcrumbs: [{ label: 'Logs' }]
    })
}`} />
		</div>
		<div class="col-md-6">
			<strong>Tree</strong>
			<CodeBlock language="javascript" codeContent={`createHierarchy({
    '/documents': {
        component: DocumentsLayout,
        breadcrumbs: [{ label: 'Documents' }],
        children: {
            ':id': {
                component: DocumentDetail,
                breadcrumbs: [{ label: 'Detail' }],
                children: {
                    'logs': {
                        component: DocumentLogs,
                        breadcrumbs: [{ label: 'Logs' }]
                    }
                }
            }
        }
    }
})`} />
		</div>
	</div>

	<h3>Path concatenation rules</h3>
	<ul>
		<li>Child paths join with <code>/</code></li>
		<li>Leading slashes in child paths are stripped (<code>'logs'</code> and <code>'/logs'</code> both produce the same result)</li>
		<li>Parameters (<code>:id</code>) work in any position</li>
		<li>Catch-all <code>*</code> can be used as a child key</li>
	</ul>

	<h3>Optional route names</h3>
	<p>
		Add <code>name</code> only on routes you'll navigate to with <code>push(name, params)</code>.
		Unnamed children still get a path — they're just not in the named-routes registry.
	</p>
	<CodeBlock language="javascript" codeContent={`import { createHierarchy } from '@keenmate/svelte-spa-router/helpers/hierarchy'
import { push } from '@keenmate/svelte-spa-router'

const routes = createHierarchy({
    '/admin': {
        name: 'admin',           // push('admin') works
        component: AdminLayout,
        children: {
            'users': {
                name: 'adminUsers',
                component: AdminUsers,
                children: {
                    ':id': {
                        name: 'adminUserDetail',
                        component: AdminUserDetail,
                        children: {
                            'permissions': {
                                // No name — reached via UI / tabs only
                                component: UserPermissions
                            }
                        }
                    }
                }
            }
        }
    }
})

await push('adminUserDetail', { id: 123 })  // → /admin/users/123`} />

	<h3>Realistic example: admin app with permissions + authorization</h3>
	<CodeBlock language="javascript" codeContent={`import { createHierarchy } from '@keenmate/svelte-spa-router/helpers/hierarchy'
import { setHierarchicalRoutesEnabled } from '@keenmate/svelte-spa-router'

setHierarchicalRoutesEnabled(true)

const routes = createHierarchy({
    '/admin': {
        name: 'admin',
        component: AdminLayout,
        breadcrumbs: [
            { label: 'Home', path: '/' },
            { label: 'Admin' }
        ],
        permissions: { any: ['admin'] },
        children: {
            'users': {
                name: 'adminUsers',
                component: AdminUsers,
                breadcrumbs: [{ label: 'Users' }],
                permissions: { any: ['users.read'] },
                children: {
                    ':id': {
                        name: 'adminUserDetail',
                        component: AdminUserDetail,
                        breadcrumbs: [{ label: 'User Detail' }],
                        authorizationCallback: async (detail) => {
                            return await checkUserAccess(detail.params.id)
                        }
                    },
                    'new': {
                        name: 'createUser',
                        component: CreateUser,
                        breadcrumbs: [{ label: 'New User' }],
                        permissions: { any: ['users.create'] }
                    }
                }
            },
            'settings': {
                name: 'adminSettings',
                component: AdminSettings,
                breadcrumbs: [{ label: 'Settings' }]
            }
        }
    }
})

// Effective route table:
// /admin                  requires 'admin'
// /admin/users            requires 'admin' AND 'users.read'
// /admin/users/:id        requires 'admin' AND 'users.read' AND authCallback
// /admin/users/new        requires 'admin' AND 'users.read' AND 'users.create'
// /admin/settings         requires 'admin'`} />
</section>

<!-- Combining -->
<section class="mb-5">
	<h2>Combining tree + flat</h2>
	<p>Both forms return plain route objects — spread them into the routes prop:</p>
	<CodeBlock language="javascript" codeContent={`const adminRoutes = createHierarchy({
    '/admin': { component: AdminLayout, children: { /* ... */ } }
})

const publicRoutes = {
    '/': Home,
    '/about': About,
    '/contact': Contact
}

// <Router routes={ { ...adminRoutes, ...publicRoutes } } />`} />
</section>

<!-- Implementation notes -->
<section class="mb-5">
	<h2>Implementation notes</h2>
	<h3>Parent discovery</h3>
	<ul>
		<li><code>/documents/:id/logs</code> → parent is <code>/documents/:id</code></li>
		<li><code>/documents/:id</code> → parent is <code>/documents</code></li>
		<li><code>/documents</code> → no parent (root)</li>
	</ul>
	<p>
		The longest matching prefix wins. Computed once during route registration, not on every navigation.
	</p>

	<h3>Circular references</h3>
	<p>
		Built-in detection prevents infinite loops if routes somehow form a cycle. Mostly a non-issue
		with normal route definitions, but worth knowing it's caught.
	</p>
</section>

<!-- See also -->
<section class="mb-5">
	<h2>See also</h2>
	<ul>
		<li><a href="/features/permissions">Permissions</a> — role-based access control + reactive <code>hasPermission()</code></li>
		<li><a href="/features/guards">Navigation guards</a> — exit guards (separate concept from <code>wrap(&#123; conditions &#125;)</code> entry guards)</li>
		<li><a href="/features/metadata">Route metadata</a> — breadcrumbs, titles, <code>routeContext()</code></li>
		<li><a href="/features/named-routes">Named routes</a> — programmatic navigation with refactor-safe names</li>
	</ul>
</section>

</div>
</DocLayout>

<style>
	h2 {
		margin-top: 3rem;
		margin-bottom: 1rem;
	}

	h3 {
		margin-top: 2rem;
		margin-bottom: 0.75rem;
	}

	ul {
		margin-bottom: 1.5rem;
	}

	li {
		margin-bottom: 0.5rem;
	}

	code {
		background: #f8f9fa;
		padding: 0.2rem 0.4rem;
		border-radius: 3px;
		font-size: 0.9em;
	}
</style>
