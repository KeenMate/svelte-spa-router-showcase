<script>
import { DocLayout, CodeBlock } from '@keenmate/svelte-docs'
</script>

<DocLayout
	titleText="Route Parameters"
	descriptionText="Dynamic routing with named parameters and wildcards">

	<div class="py-1">
		<div class="alert alert-info mb-4">
			<strong>Live demo:</strong>
			<a href="https://history.svelte-spa-router.keenmate.dev/route-data-demo" target="_blank">
				Open <code>/route-data-demo</code> →
			</a>
			Interactive examples with named params, optional params, wildcards, and static-prefix routes.
		</div>

		<!-- Introduction -->
		<section class="mb-5">
			<h2 class="mb-4">Dynamic Routes</h2>
			<p class="lead">
				Route parameters allow you to create dynamic routes that match patterns instead of exact paths.
				This is essential for applications with user profiles, product pages, or any content identified by an ID or slug.
			</p>
		</section>

		<!-- Named Parameters -->
		<section class="mb-5">
			<h2 class="mb-4">Named Parameters</h2>
			<p>
				Use <code>:paramName</code> syntax to define named parameters in your routes.
				Parameters are accessible in your component via props.
			</p>

			<h4 class="mt-4">Basic Example</h4>
			<CodeBlock
				codeContent={`// routes.js
import UserProfile from './routes/UserProfile.svelte'

const routes = {
  // Parameter: :id
  '/user/:id': UserProfile
}

// Matches:
// /user/123 → routeParams.id = "123"
// /user/john → routeParams.id = "john"
// /user/abc-def → routeParams.id = "abc-def"`}
				languageType="javascript"
				titleText="Route with single parameter"
			/>

			<CodeBlock
				codeContent={`<!-- UserProfile.svelte -->
<script>
// Parameters are passed as props
let { routeParams = {} } = $props()
</script>

<h1>User Profile</h1>
<p>User ID: {routeParams.id}</p>`}
				languageType="svelte"
				titleText="Accessing parameters in component"
			/>

			<h4 class="mt-4">Multiple Parameters</h4>
			<p>You can have multiple parameters in a single route:</p>

			<CodeBlock
				codeContent={`const routes = {
  // Multiple parameters
  '/blog/:category/:slug': BlogPost
}

// Matches:
// /blog/tech/svelte-5-released → params = { category: "tech", slug: "svelte-5-released" }
// /blog/news/update-2024 → params = { category: "news", slug: "update-2024" }`}
				languageType="javascript"
				titleText="Multiple parameters"
			/>

			<CodeBlock
				codeContent={`<!-- BlogPost.svelte -->
<script>
let { routeParams = {} } = $props()
</script>

<h1>Blog Post</h1>
<p>Category: {routeParams.category}</p>
<p>Slug: {routeParams.slug}</p>`}
				languageType="svelte"
				titleText="BlogPost.svelte"
			/>
		</section>

		<!-- Optional Parameters -->
		<section class="mb-5">
			<h2 class="mb-4">Optional Parameters</h2>
			<p>
				Add a <code>?</code> after the parameter name to make it optional.
				Optional parameters can be omitted from the URL.
			</p>

			<CodeBlock
				codeContent={`const routes = {
  // Optional parameter: :lastName?
  '/author/:firstName/:lastName?': Author
}

// Matches:
// /author/John/Doe → params = { firstName: "John", lastName: "Doe" }
// /author/John → params = { firstName: "John", lastName: undefined }`}
				languageType="javascript"
				titleText="Optional parameters"
			/>

			<CodeBlock
				codeContent={`<!-- Author.svelte -->
<script>
let { routeParams = {} } = $props()

// Handle optional parameter
const fullName = routeParams.lastName
  ? \`\${routeParams.firstName} \${routeParams.lastName}\`
  : routeParams.firstName
</script>

<h1>Author: {fullName}</h1>`}
				languageType="svelte"
				titleText="Handling optional parameters"
			/>
		</section>

		<!-- Wildcard Parameters -->
		<section class="mb-5">
			<h2 class="mb-4">Wildcard Parameters</h2>
			<p>
				Use <code>*</code> to match any path segment or multiple segments.
				Wildcards are perfect for file browsers, nested paths, or catch-all routes.
			</p>

			<h4 class="mt-4">Single Wildcard</h4>
			<CodeBlock
				codeContent={`const routes = {
  // Wildcard matches everything after /files/
  '/files/*': FileBrowser
}

// Matches:
// /files/documents → routeParams.wild = "documents"
// /files/photos/vacation/2024 → routeParams.wild = "photos/vacation/2024"
// /files/a/b/c/d → routeParams.wild = "a/b/c/d"`}
				languageType="javascript"
				titleText="Wildcard parameter"
			/>

			<CodeBlock
				codeContent={`<!-- FileBrowser.svelte -->
<script>
let { routeParams = {} } = $props()

// Split the path to create breadcrumbs
const pathParts = routeParams.wild ? routeParams.wild.split('/') : []
</script>

<h1>File Browser</h1>
<p>Current path: /{routeParams.wild || 'root'}</p>

{#if pathParts.length > 0}
  <nav>
    <a href="/files">Root</a>
    {#each pathParts as part, i}
      / <a href="/files/{pathParts.slice(0, i + 1).join('/')}">{part}</a>
    {/each}
  </nav>
{/if}`}
				languageType="svelte"
				titleText="Using wildcard for file browser"
			/>

			<h4 class="mt-4">Catch-All Route</h4>
			<p>Use a wildcard-only route as the last route to create a 404 page:</p>

			<CodeBlock
				codeContent={`const routes = {
  '/': Home,
  '/about': About,
  '/user/:id': UserProfile,

  // Catch-all - must be last!
  '*': NotFound
}

// Any route that doesn't match above will show NotFound`}
				languageType="javascript"
				titleText="404 catch-all route"
			/>
		</section>

		<!-- Named and Wildcard Combined -->
		<section class="mb-5">
			<h2 class="mb-4">Combining Named Parameters and Wildcards</h2>
			<p>You can combine named parameters with wildcards for complex routing patterns:</p>

			<CodeBlock
				codeContent={`const routes = {
  // Named parameter + wildcard
  '/docs/:version/*': Documentation
}

// Matches:
// /docs/v1/getting-started → params = { version: "v1", wild: "getting-started" }
// /docs/v2/api/router → params = { version: "v2", wild: "api/router" }`}
				languageType="javascript"
				titleText="Combined parameters"
			/>

			<CodeBlock
				codeContent={`<!-- Documentation.svelte -->
<script>
let { routeParams = {} } = $props()

const version = routeParams.version
const docPath = routeParams.wild || 'index'
</script>

<aside>
  <h3>Version: {version}</h3>
</aside>

<main>
  <h1>Documentation: {docPath}</h1>
</main>`}
				languageType="svelte"
				titleText="Using combined parameters"
			/>
		</section>

		<!-- Accessing Parameters -->
		<section class="mb-5">
			<h2 class="mb-4">Accessing Parameters</h2>
			<p>There are multiple ways to access route parameters in your components:</p>

			<h4 class="mt-4">1. Via Component Props (Recommended)</h4>
			<p>The simplest way - parameters are passed directly to your component:</p>

			<CodeBlock
				codeContent={`<script>
// Destructure params from props
let { routeParams = {} } = $props()
</script>

<p>ID: {routeParams.id}</p>`}
				languageType="svelte"
				titleText="Via props"
			/>

			<h4 class="mt-4">2. Via routeParams() Function</h4>
			<p>Use the global <code>routeParams()</code> function for accessing parameters anywhere:</p>

			<CodeBlock
				codeContent={`<script>
import { routeParams } from '@keenmate/svelte-spa-router'

// Get params reactively
const routeParams = $derived(routeParams())
const userId = $derived(routeParams?.id)
</script>

<p>User ID: {userId}</p>`}
				languageType="svelte"
				titleText="Via routeParams() function"
			/>
		</section>

		<!-- TypeScript Support -->
		<section class="mb-5">
			<h2 class="mb-4">TypeScript Support</h2>
			<p>Define types for your parameters to get full intellisense:</p>

			<CodeBlock
				codeContent={`<script lang="ts">
import { routeParams } from '@keenmate/svelte-spa-router'

// Define parameter type
interface UserParams {
  id: string
  tab?: string
}

// Use with type parameter
const routeParams = $derived(routeParams<UserParams>())

// TypeScript knows these properties exist
const userId = $derived(routeParams?.id)
const activeTab = $derived(routeParams?.tab || 'profile')
</script>`}
				languageType="typescript"
				titleText="TypeScript parameters"
			/>
		</section>

		<!-- Practical Examples -->
		<section class="mb-5">
			<h2 class="mb-4">Practical Examples</h2>

			<h4>E-commerce Product Page</h4>
			<CodeBlock
				codeContent={`const routes = {
  '/product/:id': ProductDetail
}

// ProductDetail.svelte
let { routeParams = {} } = $props()
const productId = routeParams.id

// Fetch product data
const product = $derived(fetchProduct(productId))`}
				languageType="javascript"
				titleText="Product detail page"
			/>

			<h4>User Dashboard with Tabs</h4>
			<CodeBlock
				codeContent={`const routes = {
  '/dashboard/:section?': Dashboard
}

// Dashboard.svelte
let { routeParams = {} } = $props()
const section = routeParams.section || 'overview'

// Show different content based on section
// /dashboard → section = "overview"
// /dashboard/settings → section = "settings"
// /dashboard/analytics → section = "analytics"`}
				languageType="javascript"
				titleText="Dashboard with sections"
			/>

			<h4>File System Browser</h4>
			<CodeBlock
				codeContent={`const routes = {
  '/browse/*': FileBrowser
}

// FileBrowser.svelte
let { routeParams = {} } = $props()
const path = routeParams.wild || ''
const files = $derived(loadFiles(path))

// /browse → path = "" (root)
// /browse/documents/2024 → path = "documents/2024"`}
				languageType="javascript"
				titleText="File browser"
			/>
		</section>

		<!-- Static Prefix Parameters -->
		<section class="mb-5">
			<h2 class="mb-4">Static Prefix Parameters</h2>
			<p>
				You can use static text prefixes before parameters in your route patterns.
				This is useful when you want to distinguish between different types of IDs or
				create more semantic URLs.
			</p>

			<h4 class="mt-4">Basic Prefix Pattern</h4>
			<CodeBlock
				codeContent={`const routes = {
  // Static prefix: "project-" before the parameter
  '/project-:code': ProjectDetail,

  // Static prefix: "user-" before the parameter
  '/user-:id': UserDetail
}

// Matches:
// /project-alpha → params = { code: "alpha" }
// /project-beta → params = { code: "beta" }
// /user-1001 → params = { id: "1001" }
// /user-2002 → params = { id: "2002" }`}
				languageType="javascript"
				titleText="Static prefix parameters"
			/>

			<CodeBlock
				codeContent={`<!-- ProjectDetail.svelte -->
<script>
let { routeParams = {} } = $props()
</script>

<h1>Project: {routeParams.code}</h1>
<p>Loading data for project code: {routeParams.code}</p>`}
				languageType="svelte"
				titleText="Accessing prefixed parameters"
			/>

			<h4 class="mt-4">Multiple Prefixed Parameters</h4>
			<p>You can combine multiple static prefix parameters in a single route:</p>

			<CodeBlock
				codeContent={`const routes = {
  // Multiple prefixed parameters
  '/project-:code/task-:taskId': TaskDetail
}

// Matches:
// /project-alpha/task-101 → params = { code: "alpha", taskId: "101" }
// /project-beta/task-202 → params = { code: "beta", taskId: "202" }`}
				languageType="javascript"
				titleText="Multiple prefixed parameters"
			/>

			<h4 class="mt-4">Route Ordering with Prefixes</h4>
			<p>
				When using static prefix parameters, <strong>route order is critical</strong>.
				More specific routes with prefixes must be defined <em>before</em> generic parameter routes:
			</p>

			<CodeBlock
				codeContent={`// ✅ Good - prefix routes before generic routes
const routes = {
  '/route-data-demo': RouteDataDemo,

  // Specific prefix routes first
  '/route-data-demo/project-:projectCode': RouteDataDemo,
  '/route-data-demo/user-:id': RouteDataDemo,
  '/route-data-demo/project-:code/task-:taskId': RouteDataDemo,

  // Generic parameter routes after
  '/route-data-demo/:projectId/:taskId/:commentId': RouteDataDemo,
  '/route-data-demo/:docId/:versionId': RouteDataDemo,
  '/route-data-demo/:userId': RouteDataDemo
}

// ❌ Bad - generic route first catches everything
const routes = {
  '/route-data-demo/:userId': RouteDataDemo,  // Too generic, catches all!
  '/route-data-demo/project-:projectCode': RouteDataDemo,  // Never reached!
}

// Example: /route-data-demo/project-gamma
// ✅ Good order: matches project-:projectCode route → { projectCode: "gamma" }
// ❌ Bad order: matches :userId route → { userId: "project-gamma" }`}
				languageType="javascript"
				titleText="Route ordering with prefixes"
			/>

			<h4 class="mt-4">Performance</h4>
			<div class="alert alert-success">
				<p class="mb-0">
					<strong>Zero Runtime Overhead:</strong> Static prefix patterns are parsed and compiled
					into regular expressions when routes are defined (at initialization time), not on every
					navigation. This ensures optimal performance with no impact on route matching speed.
				</p>
			</div>

			<h4 class="mt-4">Use Cases</h4>
			<CodeBlock
				codeContent={`// Distinguish between different entity types
const routes = {
  '/doc-:id': DocumentViewer,      // /doc-123
  '/ticket-:id': TicketViewer,     // /ticket-456
  '/invoice-:id': InvoiceViewer    // /invoice-789
}

// Versioned API endpoints
const routes = {
  '/api-v1-:endpoint': ApiV1Handler,  // /api-v1-users
  '/api-v2-:endpoint': ApiV2Handler   // /api-v2-users
}

// Namespaced resources
const routes = {
  '/org-:orgId/team-:teamId': TeamDetail  // /org-acme/team-alpha
}`}
				languageType="javascript"
				titleText="Common use cases"
			/>
		</section>

		<!-- Best Practices -->
		<section class="mb-5">
			<h2 class="mb-4">Best Practices</h2>

			<div class="alert alert-info">
				<h5>Route Order Matters</h5>
				<p class="mb-0">Routes are matched in the order they are defined. Place more specific routes before general ones:</p>
			</div>

			<CodeBlock
				codeContent={`// ✅ Good - specific routes first
const routes = {
  '/user/new': NewUser,        // Specific
  '/user/:id': UserProfile,    // Less specific
  '/user/*': UserFiles,        // Most general
  '*': NotFound                // Catch-all (always last)
}

// ❌ Bad - general routes first
const routes = {
  '/user/*': UserFiles,        // Too general, will match everything
  '/user/:id': UserProfile,    // Never reached!
  '/user/new': NewUser,        // Never reached!
}`}
				languageType="javascript"
				titleText="Route ordering"
			/>

			<div class="alert alert-warning mt-3">
				<h5>Parameter Validation</h5>
				<p class="mb-0">Always validate parameters before using them. Users can type anything in the URL!</p>
			</div>

			<CodeBlock
				codeContent={`<script>
let { routeParams = {} } = $props()

// Validate numeric ID
const userId = $derived(() => {
  const id = Number(routeParams.id)
  return isNaN(id) ? null : id
})

// Show error if invalid
{#if userId === null}
  <p>Invalid user ID</p>
{:else}
  <p>User: {userId}</p>
{/if}
</script>`}
				languageType="svelte"
				titleText="Parameter validation"
			/>
		</section>

		<!-- Live Examples -->
		<section class="mb-5">
			<h2 class="mb-4">Try It Live</h2>
			<p>Experiment with route parameters in our live examples:</p>
			<div class="d-flex gap-3 flex-wrap">
				<a href="http://localhost:5050/user/123" target="_blank" class="btn btn-primary">
					View Parameter Example
				</a>
				<a href="http://localhost:5050/files/docs/guide" target="_blank" class="btn btn-outline-primary">
					View Wildcard Example
				</a>
			</div>
		</section>
	</div>
</DocLayout>
