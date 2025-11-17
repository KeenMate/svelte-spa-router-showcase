<script>
import { DocLayout, CodeBlock } from '@keenmate/svelte-docs'
</script>

<DocLayout
    titleText="Nested Routes (Tree Structure)"
    descriptionText="Define routes in a hierarchical tree structure with automatic path concatenation and inheritance">

<div class="py-1">

<div class="alert alert-info" role="alert">
    <strong>Alternative API:</strong> This is an optional alternative to flat route definitions. Both approaches can be used together in the same application.
</div>

<h2>What are Nested Routes?</h2>

<p>
    Nested routes allow you to define your route structure as a tree rather than a flat object.
    Child paths are automatically concatenated to parent paths, and metadata automatically inherits
    from parent to child.
</p>

<h3>Key Benefits</h3>

<ul>
    <li><strong>Concise</strong> - No need to repeat parent path segments</li>
    <li><strong>Readable</strong> - Structure mirrors your UI hierarchy</li>
    <li><strong>DRY</strong> - Shared metadata defined once in parent</li>
    <li><strong>Automatic Inheritance</strong> - Children inherit breadcrumbs, permissions, etc.</li>
</ul>

<h2>Basic Example</h2>

<p>Compare flat vs nested route definitions:</p>

<h3>Flat Route Definition</h3>
<CodeBlock language="javascript" codeContent={`import { wrap } from '@keenmate/svelte-spa-router/wrap'

const routes = {
    '/documents': wrap({
        component: DocumentsLayout,
        breadcrumbs: [{ label: 'Documents' }]
    }),
    '/documents/:id': wrap({
        component: DocumentDetail,
        breadcrumbs: [{ label: 'Detail' }]
    }),
    '/documents/:id/logs': wrap({
        component: DocumentLogs,
        breadcrumbs: [{ label: 'Logs' }]
    })
}`} />

<h3>Nested Route Definition</h3>
<CodeBlock language="javascript" codeContent={`import { createHierarchy } from '@keenmate/svelte-spa-router/helpers/hierarchy'

const routes = createHierarchy({
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

<div class="alert alert-success" role="alert">
    Notice how child paths are <strong>relative</strong> - no need to repeat <code>/documents</code>!
</div>

<h2>Path Concatenation</h2>

<p>Child paths are automatically concatenated to parent paths:</p>

<CodeBlock language="javascript" codeContent={`createHierarchy({
    '/users': {
        component: UsersList,
        children: {
            ':id': {              // → /users/:id
                component: UserDetail,
                children: {
                    'settings': {  // → /users/:id/settings
                        component: UserSettings
                    },
                    'activity': {  // → /users/:id/activity
                        component: UserActivity
                    }
                }
            },
            'new': {              // → /users/new
                component: CreateUser
            }
        }
    }
})`} />

<h3>Concatenation Rules</h3>
<ul>
    <li>Child paths are joined with <code>/</code></li>
    <li>Leading slashes in child paths are stripped</li>
    <li>Parameters (<code>:id</code>) work in any position</li>
    <li>Catch-all routes (<code>*</code>) can be used as children</li>
</ul>

<h2>Named Routes</h2>

<p>
    Add <code>name</code> property to routes you want to navigate to programmatically.
    Names are <strong>optional</strong> - only add them when needed.
</p>

<CodeBlock language="javascript" codeContent={`import { createHierarchy } from '@keenmate/svelte-spa-router/helpers/hierarchy'
import { push } from '@keenmate/svelte-spa-router'

const routes = createHierarchy({
    '/admin': {
        name: 'admin',  // Named - can navigate via push('admin')
        component: AdminLayout,
        children: {
            'users': {
                name: 'adminUsers',  // Named
                component: AdminUsers,
                children: {
                    ':id': {
                        name: 'adminUserDetail',  // Named
                        component: AdminUserDetail,
                        children: {
                            'permissions': {
                                // No name - accessed via tabs/UI only
                                component: UserPermissions
                            }
                        }
                    }
                }
            }
        }
    }
})

// Navigate using names
await push('adminUserDetail', { id: 123 })
// Results in: /admin/users/123`} />

<div class="alert alert-warning" role="alert">
    <strong>Guideline:</strong> Add <code>name</code> if you use <code>push(name, params)</code> to navigate to the route. Otherwise, omit it.
</div>

<h2>Automatic Inheritance</h2>

<p>
    When hierarchical mode is enabled, child routes automatically inherit from parents:
</p>

<ul>
    <li><strong>Breadcrumbs</strong> - Concatenated (parent + child)</li>
    <li><strong>Permissions</strong> - Sequential checks (parent AND child)</li>
    <li><strong>Conditions</strong> - Parent conditions run first</li>
    <li><strong>Authorization</strong> - Parent callbacks execute before child callbacks</li>
</ul>

<h3>Enabling Hierarchical Mode</h3>
<CodeBlock language="javascript" codeContent={`// main.js - before mounting app
import { setHierarchicalRoutesEnabled } from '@keenmate/svelte-spa-router'

setHierarchicalRoutesEnabled(true)`} />

<h3>Inheritance Example</h3>
<CodeBlock language="javascript" codeContent={`import { createHierarchy } from '@keenmate/svelte-spa-router/helpers/hierarchy'
import { setHierarchicalRoutesEnabled } from '@keenmate/svelte-spa-router'

// Enable hierarchical inheritance
setHierarchicalRoutesEnabled(true)

const routes = createHierarchy({
    '/documents': {
        component: DocumentsLayout,
        breadcrumbs: [
            { label: 'Home', path: '/' },
            { label: 'Documents' }
        ],
        permissions: { any: ['read'] }
    },
    children: {
        ':id': {
            component: DocumentDetail,
            breadcrumbs: [{ label: 'Detail' }],
            permissions: { any: ['documents.view'] }
            // Effective breadcrumbs: [Home, Documents, Detail]
            // Effective permissions: Must have 'read' AND 'documents.view'
        }
    }
})`} />

<h2>Combining with Flat Routes</h2>

<p>Tree and flat route definitions can coexist seamlessly:</p>

<CodeBlock language="javascript" codeContent={`import { createHierarchy } from '@keenmate/svelte-spa-router/helpers/hierarchy'

// Nested routes
const adminRoutes = createHierarchy({
    '/admin': {
        component: AdminLayout,
        children: {
            'users': {
                component: AdminUsers,
                children: {
                    ':id': {
                        component: AdminUserDetail
                    }
                }
            }
        }
    }
})

// Flat routes
const publicRoutes = {
    '/': Home,
    '/about': About,
    '/contact': Contact
}

// Combine both
const routes = {
    ...adminRoutes,
    ...publicRoutes
}`} />

<h2>Complex Example</h2>

<p>Here's a real-world example with permissions, authorization, and nested routes:</p>

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
                            // Check if current user can access this specific user
                            return await checkUserAccess(detail.routeParams.id)
                        },
                        children: {
                            'permissions': {
                                component: UserPermissions,
                                breadcrumbs: [{ label: 'Permissions' }],
                                permissions: { any: ['users.manage-permissions'] }
                            },
                            'activity': {
                                component: UserActivity,
                                breadcrumbs: [{ label: 'Activity Log' }]
                            }
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

// Route structure:
// /admin                          (requires 'admin')
// /admin/users                    (requires 'admin' AND 'users.read')
// /admin/users/:id                (requires 'admin' AND 'users.read' AND passes authorizationCallback)
// /admin/users/:id/permissions    (requires all above AND 'users.manage-permissions')
// /admin/users/:id/activity       (requires 'admin' AND 'users.read' AND passes authorizationCallback)
// /admin/users/new                (requires 'admin' AND 'users.read' AND 'users.create')
// /admin/settings                 (requires 'admin')`} />

<h2>When to Use Nested Routes</h2>

<h3>✅ Use Nested Routes When</h3>
<ul>
    <li>You have deeply nested route structures (3+ levels)</li>
    <li>Child routes always inherit from parents</li>
    <li>Route structure mirrors UI hierarchy</li>
    <li>You want concise, readable route definitions</li>
</ul>

<h3>✅ Use Flat Routes When</h3>
<ul>
    <li>Routes are mostly shallow (1-2 levels)</li>
    <li>You need fine-grained control over inheritance (opt-out flags)</li>
    <li>Route structure doesn't match visual hierarchy</li>
    <li>You prefer explicit path definitions</li>
</ul>

<div class="alert alert-info" role="alert">
    <strong>Best Practice:</strong> Use whichever approach makes your code more readable. You can mix both in the same application!
</div>

<h2>TypeScript Support</h2>

<p>Full TypeScript support with type inference:</p>

<CodeBlock language="typescript" codeContent={`import type { HierarchyNode } from '@keenmate/svelte-spa-router/helpers/hierarchy'

const routes = createHierarchy({
    '/users': {
        component: UsersList,
        breadcrumbs: [{ label: 'Users' }],
        children: {
            ':id': {
                name: 'userDetail',
                component: UserDetail,
                breadcrumbs: [{ label: 'Detail' }]
            }
        }
    } satisfies HierarchyNode
})`} />

<h2>See Also</h2>
<ul>
    <li><a href="/features/hierarchical-routes">Hierarchical Routes</a> - Automatic parent-child inheritance</li>
    <li><a href="/features/named-routes">Named Routes</a> - Refactor-safe navigation</li>
    <li><a href="/features/permissions">Permissions</a> - Role-based access control</li>
    <li><a href="/features/route-configuration">Route Configuration</a> - Using wrap() for route setup</li>
</ul>

</div>
</DocLayout>

<style>
    .lead {
        font-size: 1.25rem;
        margin-bottom: 2rem;
        color: #6c757d;
    }

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
