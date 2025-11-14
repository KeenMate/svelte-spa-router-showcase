<script>
import { DocLayout, CodeBlock } from '@keenmate/svelte-docs'
</script>

<DocLayout
    titleText="Hierarchical Routes"
    descriptionText="Automatically inherit breadcrumbs, permissions, and conditions from parent routes in nested route structures">

<div class="py-1">

<div class="alert alert-info" role="alert">
    <strong>Optional Feature:</strong> Hierarchical routes are an <strong>opt-in feature</strong>, disabled by default. Enable with <code>setHierarchicalRoutesEnabled(true)</code> before mounting your app.
</div>

<h2>What is Hierarchical Mode?</h2>

<p>
    In hierarchical mode, child routes automatically inherit metadata from parent routes based on their path structure.
    For example, <code>/documents/:id/logs</code> will inherit from <code>/documents/:id</code>, which in turn
    inherits from <code>/documents</code>.
</p>

<h3>What Gets Inherited</h3>

<ul>
    <li><strong>Breadcrumbs</strong> - Concatenated from parent to child (additive)</li>
    <li><strong>Permissions</strong> - Parent and child checks both execute (cumulative AND)</li>
    <li><strong>Conditions</strong> - Parent conditions run before child conditions</li>
    <li><strong>Authorization Callbacks</strong> - Parent callbacks execute before child callbacks</li>
</ul>

<h2>Enabling Hierarchical Mode</h2>

<p>Enable hierarchical routes in your <code>main.js</code> before mounting the app:</p>

<CodeBlock language="javascript" codeContent={`import { mount } from 'svelte'
import { setHierarchicalRoutesEnabled } from '@keenmate/svelte-spa-router/utils'
import App from './App.svelte'

// Enable hierarchical routes
setHierarchicalRoutesEnabled(true)

mount(App, { target: document.body })`} />

<h2>Basic Example</h2>

<p>With hierarchical mode enabled, define parent and child routes with shared metadata:</p>

<CodeBlock language="javascript" codeContent={`import { createRoute } from '@keenmate/svelte-spa-router/wrap'

const routes = {
    // Parent route
    '/documents': createRoute({
        component: Documents,
        breadcrumbs: [
            { label: 'Home', path: '/' },
            { label: 'Documents' }
        ]
    }),

    // Child route - automatically inherits parent breadcrumbs
    '/documents/:id': createRoute({
        component: DocumentDetail,
        breadcrumbs: [
            { label: 'Document Detail' }
        ]
        // Effective breadcrumbs: [Home, Documents, Document Detail]
    }),

    // Grandchild route - inherits entire chain
    '/documents/:id/logs': createRoute({
        component: DocumentLogs,
        breadcrumbs: [
            { label: 'Access Logs' }
        ]
        // Effective breadcrumbs: [Home, Documents, Document Detail, Access Logs]
    })
}`} />

<h2>Permission Inheritance</h2>

<p>
    Permissions work like filesystem security - users must pass <strong>all</strong> permission checks
    in the hierarchy (cumulative AND behavior). This matches how Linux/Windows handle nested directory access.
</p>

<CodeBlock language="javascript" codeContent={`import { createProtectedRoute } from '@keenmate/svelte-spa-router/helpers/permissions'

const routes = {
    // Parent requires 'read' permission
    '/documents': createProtectedRoute({
        component: Documents,
        permissions: { any: ['read'] }
    }),

    // Child requires 'documents.view' permission
    '/documents/:id': createProtectedRoute({
        component: DocumentDetail,
        permissions: { any: ['documents.view'] }
        // User must have BOTH 'read' AND 'documents.view'
    }),

    // Grandchild requires 'logs.view' permission
    '/documents/:id/logs': createProtectedRoute({
        component: DocumentLogs,
        permissions: { any: ['logs.view'] }
        // User must have 'read' AND 'documents.view' AND 'logs.view'
    })
}`} />

<div class="alert alert-warning" role="alert">
    <strong>Sequential Execution:</strong> Permission checks execute in order from parent to child. If the parent check fails,
    the child checks are <strong>never executed</strong> (fail-fast behavior).
</div>

<h2>Authorization Callback Chaining</h2>

<p>
    Authorization callbacks also chain from parent to child, enabling both role-based
    and resource-based access control at multiple levels:
</p>

<CodeBlock language="javascript" codeContent={`const routes = {
    // Parent checks folder-level access
    '/documents': createProtectedRoute({
        component: Documents,
        permissions: { any: ['read'] },
        authorizationCallback: async (detail) => {
            return await checkFolderAccess()
        }
    }),

    // Child checks document-level access
    '/documents/:id': createProtectedRoute({
        component: DocumentDetail,
        permissions: { any: ['documents.view'] },
        authorizationCallback: async (detail) => {
            return await checkDocumentAccess(detail.params.id)
        }
        // Both parent and child authorization callbacks run
        // Parent callback executes first
    })
}`} />

<h2>Opting Out of Inheritance</h2>

<p>
    Use inheritance flags to selectively break the inheritance chain for specific routes:
</p>

<CodeBlock language="javascript" codeContent={`const routes = {
    '/documents': createRoute({
        component: Documents,
        breadcrumbs: [{ label: 'Documents' }],
        permissions: { any: ['read'] }
    }),

    // This route opts out of all inheritance
    '/documents/public/:id': createRoute({
        component: PublicDocument,
        breadcrumbs: [{ label: 'Public Document' }],
        permissions: { any: ['guest'] },
        inheritBreadcrumbs: false,  // Start fresh breadcrumbs
        inheritPermissions: false,  // Independent permission check
        inheritConditions: false,   // Skip parent conditions
        inheritAuthorization: false // Skip parent authorization
    })
}`} />

<h2>When to Use Hierarchical Mode</h2>

<h3>✅ Good Use Cases</h3>
<ul>
    <li>Deep route structures with natural parent-child relationships</li>
    <li>Shared security requirements across route families</li>
    <li>Complex breadcrumb trails that follow route hierarchy</li>
    <li>DRY (Don't Repeat Yourself) route definitions</li>
</ul>

<h3>❌ When to Use Flat Mode (Default)</h3>
<ul>
    <li>Routes are independent with no hierarchical relationship</li>
    <li>You prefer explicit, visible metadata in each route</li>
    <li>Route security requirements don't follow parent-child patterns</li>
    <li>Simpler applications with shallow route structures</li>
</ul>

<h2>Comparison: Flat vs Hierarchical</h2>

<h3>Flat Mode (Default)</h3>
<CodeBlock language="javascript" codeContent={`// Every route defines everything explicitly
const routes = {
    '/documents/:id/logs': wrap({
        component: DocumentLogs,
        breadcrumbs: [
            { label: 'Home', path: '/' },
            { label: 'Documents', path: '/documents' },
            { label: 'Document Detail', path: '/documents/:id' },
            { label: 'Access Logs' }  // Repetitive! 😞
        ]
    })
}`} />

<h3>Hierarchical Mode</h3>
<CodeBlock language="javascript" codeContent={`// Parent defines base metadata once
const routes = {
    '/documents': createRoute({
        breadcrumbs: [
            { label: 'Home', path: '/' },
            { label: 'Documents' }
        ]
    }),

    '/documents/:id': createRoute({
        breadcrumbs: [{ label: 'Document Detail' }]
    }),

    '/documents/:id/logs': createRoute({
        component: DocumentLogs,
        breadcrumbs: [{ label: 'Access Logs' }]  // Clean! 😊
        // Automatically inherits all parent breadcrumbs
    })
}`} />

<h2>Implementation Details</h2>

<h3>Parent Discovery</h3>
<p>
    Parent routes are discovered automatically by path matching. The router finds the longest
    matching parent path:
</p>
<ul>
    <li><code>/documents/:id/logs</code> → parent: <code>/documents/:id</code></li>
    <li><code>/documents/:id</code> → parent: <code>/documents</code></li>
    <li><code>/documents</code> → no parent (root of hierarchy)</li>
</ul>

<h3>Circular Reference Protection</h3>
<p>
    The router includes built-in circular reference detection to prevent infinite loops
    if routes accidentally reference each other.
</p>

<h3>Performance</h3>
<p>
    Parent discovery happens once during route setup, not on every navigation. The performance
    impact is negligible even for large route hierarchies.
</p>

<h2>See Also</h2>
<ul>
    <li><a href="/features/permissions">Permissions</a> - Role-based access control</li>
    <li><a href="/features/guards">Route Guards</a> - Navigation guards and conditions</li>
    <li><a href="/features/metadata">Route Metadata</a> - Breadcrumbs and titles</li>
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
