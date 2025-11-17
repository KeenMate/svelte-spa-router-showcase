<script>
import { DocLayout, CodeBlock } from '@keenmate/svelte-docs'
</script>

<DocLayout
	titleText="Programmatic Navigation"
	descriptionText="Navigate your application programmatically with push(), replace(), and pop()">

	<div class="py-1">
		<!-- Introduction -->
		<section class="mb-5">
			<h2 class="mb-4">Overview</h2>
			<p class="lead">
				The router provides four functions for programmatic navigation: <code>push()</code>,
				<code>replace()</code>, <code>pop()</code>, and <code>goBack()</code>. The <code>push()</code>
				and <code>replace()</code> functions support multiple convenient input formats.
			</p>
		</section>

		<!-- Navigation Functions -->
		<section class="mb-5">
			<h2 class="mb-4">Navigation Functions</h2>

			<div class="row g-4">
				<div class="col-md-4">
					<div class="card h-100 border-primary">
						<div class="card-header bg-primary text-white">
							<h5 class="mb-0">push()</h5>
						</div>
						<div class="card-body">
							<p><strong>Purpose:</strong> Navigate to a new page</p>
							<p><strong>Behavior:</strong> Adds new entry to history stack</p>
							<p><strong>User can:</strong> Use back button to return</p>
							<CodeBlock
								codeContent={`import { push } from '@keenmate/svelte-spa-router'

// Navigate forward
await push('/about')`}
								languageType="javascript"
								titleText="push() example"
							/>
						</div>
					</div>
				</div>

				<div class="col-md-4">
					<div class="card h-100 border-success">
						<div class="card-header bg-success text-white">
							<h5 class="mb-0">replace()</h5>
						</div>
						<div class="card-body">
							<p><strong>Purpose:</strong> Replace current page</p>
							<p><strong>Behavior:</strong> Replaces current history entry</p>
							<p><strong>User can:</strong> NOT use back button to return to replaced page</p>
							<CodeBlock
								codeContent={`import { replace } from '@keenmate/svelte-spa-router'

// Replace current page
await replace('/login')`}
								languageType="javascript"
								titleText="replace() example"
							/>
						</div>
					</div>
				</div>

				<div class="col-md-4">
					<div class="card h-100 border-info">
						<div class="card-header bg-info text-white">
							<h5 class="mb-0">pop()</h5>
						</div>
						<div class="card-body">
							<p><strong>Purpose:</strong> Go back in history</p>
							<p><strong>Behavior:</strong> Equivalent to browser back button</p>
							<p><strong>User sees:</strong> Previous page from history</p>
							<CodeBlock
								codeContent={`import { pop } from '@keenmate/svelte-spa-router'

// Go back
await pop()`}
								languageType="javascript"
								titleText="pop() example"
							/>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Input Formats -->
		<section class="mb-5">
			<h2 class="mb-4">Link Format Examples</h2>
			<p>
				Both <code>push()</code> and <code>replace()</code> support seven flexible input formats.
				Here are code examples for each format:
			</p>

			<h4 class="mt-4">Format 1: Simple String Path</h4>
			<p>Use a plain string for direct navigation to static routes:</p>

			<CodeBlock
				codeContent={`import { push } from '@keenmate/svelte-spa-router'

// Navigate to static routes
await push('/about')
await push('/contact')
await push('/dashboard')

// Navigate with path parameters embedded
await push('/user/123')
await push('/product/abc-def')

// Include query strings manually in the string
await push('/search?q=svelte&category=frontend')`}
				languageType="javascript"
				titleText="Format 1: String path"
			/>

			<h4 class="mt-4">Format 2: Array with Route Name Only</h4>
			<p>Use an array with just the route name (requires named routes setup):</p>

			<CodeBlock
				codeContent={`import { push } from '@keenmate/svelte-spa-router'
import { registerRoutes } from '@keenmate/svelte-spa-router/routes'

// First, register your named routes
registerRoutes({
  home: '/',
  about: '/about',
  dashboard: '/dashboard'
})

// Navigate using route names only
await push(['home'])
await push(['about'])
await push(['dashboard'])`}
				languageType="javascript"
				titleText="Format 2: Array [routeName]"
			/>

			<h4 class="mt-4">Format 3: Array with Route Name and Parameters</h4>
			<p>Use an array with route name and parameters object:</p>

			<CodeBlock
				codeContent={`import { push } from '@keenmate/svelte-spa-router'
import { registerRoutes } from '@keenmate/svelte-spa-router/routes'

// Register routes with parameters
registerRoutes({
  userProfile: '/user/:userId',
  productDetail: '/product/:productId',
  blogPost: '/blog/:category/:slug'
})

// Navigate with single parameter
await push(['userProfile', { userId: 123 }])
await push(['productDetail', { productId: 'abc-123' }])

// Navigate with multiple parameters
await push(['blogPost', {
  category: 'tech',
  slug: 'svelte-5-released'
}])`}
				languageType="javascript"
				titleText="Format 3: Array [routeName, params]"
			/>

			<h4 class="mt-4">Format 4: Array with Route Name, Parameters, and Query</h4>
			<p>Use an array with route name, parameters, and query string object:</p>

			<CodeBlock
				codeContent={`import { push } from '@keenmate/svelte-spa-router'
import { registerRoutes } from '@keenmate/svelte-spa-router/routes'

registerRoutes({
  userProfile: '/user/:userId',
  productList: '/products'
})

// With parameters and query
await push(['userProfile', { userId: 123 }, { tab: 'settings', page: '2' }])

// With query only (empty params object)
await push(['productList', {}, { category: 'electronics', sort: 'price' }])

// Multiple query parameters
await push(['userProfile', { userId: 456 }, {
  tab: 'posts',
  filter: 'recent',
  limit: '10'
}])`}
				languageType="javascript"
				titleText="Format 4: Array [routeName, params, query]"
			/>

			<h4 class="mt-4">Format 5: Object with Route Name Only</h4>
			<p>Use an object with just the route property:</p>

			<CodeBlock
				codeContent={`import { push } from '@keenmate/svelte-spa-router'
import { registerRoutes } from '@keenmate/svelte-spa-router/routes'

registerRoutes({
  home: '/',
  about: '/about',
  contact: '/contact'
})

// Navigate using object with route name
await push({ route: 'home' })
await push({ route: 'about' })
await push({ route: 'contact' })`}
				languageType="javascript"
				titleText="Format 5: Object &#123; route &#125;"
			/>

			<h4 class="mt-4">Format 6: Object with Route Name and Parameters</h4>
			<p>Use an object with route and params properties:</p>

			<CodeBlock
				codeContent={`import { push } from '@keenmate/svelte-spa-router'
import { registerRoutes } from '@keenmate/svelte-spa-router/routes'

registerRoutes({
  userProfile: '/user/:userId',
  documentView: '/document/:docId',
  projectTask: '/project/:projectId/task/:taskId'
})

// Object with route and params
await push({
  route: 'userProfile',
  params: { userId: 123 }
})

// Multiple parameters
await push({
  route: 'projectTask',
  params: {
    projectId: 'alpha',
    taskId: '42'
  }
})`}
				languageType="javascript"
				titleText="Format 6: Object &#123; route, params &#125;"
			/>

			<h4 class="mt-4">Format 7: Object with All Options</h4>
			<p>Use an object with route, params, and query properties for complete control:</p>

			<CodeBlock
				codeContent={`import { push } from '@keenmate/svelte-spa-router'
import { registerRoutes } from '@keenmate/svelte-spa-router/routes'

registerRoutes({
  userProfile: '/user/:userId',
  search: '/search'
})

// Full object format with all options
await push({
  route: 'userProfile',
  params: { userId: 123 },
  query: {
    tab: 'settings',
    page: '2',
    edit: 'true'
  }
})

// Object with query only (no params)
await push({
  route: 'search',
  query: {
    q: 'svelte router',
    category: 'libraries',
    sort: 'stars'
  }
})

// Alternative: use href instead of route
await push({
  href: '/products',
  query: {
    category: 'books',
    sale: 'true'
  }
})`}
				languageType="javascript"
				titleText="Format 7: Object &#123; route, params, query &#125;"
			/>
		</section>

		<!-- Comparison -->
		<section class="mb-5">
			<h2 class="mb-4">Format Comparison</h2>
			<p>Here's the same navigation using all three formats:</p>

			<CodeBlock
				codeContent={`// Goal: Navigate to /user/123?tab=settings&page=2

// 1. String format
await push('/user/123?tab=settings&page=2')

// 2. Array format
await push(['userProfile', { userId: 123 }, { tab: 'settings', page: '2' }])

// 3. Object format
await push({
  route: 'userProfile',
  params: { userId: 123 },
  query: { tab: 'settings', page: '2' }
})`}
				languageType="javascript"
				titleText="Same navigation, three ways"
			/>

			<div class="alert alert-info mt-3">
				<h5>Which format should I use?</h5>
				<ul class="mb-0">
					<li><strong>String format:</strong> Best for simple, static routes</li>
					<li><strong>Array format:</strong> Recommended for named routes - concise and readable</li>
					<li><strong>Object format:</strong> Best for complex navigation with many parameters, or when you want maximum clarity</li>
				</ul>
			</div>
		</section>

		<!-- Practical Examples -->
		<section class="mb-5">
			<h2 class="mb-4">Practical Examples</h2>

			<h4>Form Submission</h4>
			<CodeBlock
				codeContent={`<script>
import { push } from '@keenmate/svelte-spa-router'

async function handleSubmit(event) {
  event.preventDefault()

  const formData = new FormData(event.target)
  const userId = formData.get('userId')

  try {
    // Save data...
    await saveUser(userId, data)

    // Navigate to user profile after successful save
    await push(['userProfile', { userId }])
  } catch (error) {
    console.error('Save failed:', error)
  }
}
</script>

<form onsubmit=onsubmit={#123;handleSubmit}>
  <input name="userId" type="text" />
  <button type="submit">Save and View Profile</button>
</form>`}
				languageType="svelte"
				titleText="Navigate after form submission"
			/>

			<h4 class="mt-4">Login Redirect</h4>
			<CodeBlock
				codeContent={`<script>
import { push, replace } from '@keenmate/svelte-spa-router'

async function handleLogin(event) {
  event.preventDefault()

  const credentials = {
    username: event.target.username.value,
    password: event.target.password.value
  }

  try {
    await login(credentials)

    // Replace login page with home (user can't back to login)
    await replace(['home'])
  } catch (error) {
    alert('Login failed')
  }
}
</script>

<form onsubmit=onsubmit={#123;handleLogin}>
  <input name="username" type="text" />
  <input name="password" type="password" />
  <button type="submit">Login</button>
</form>`}
				languageType="svelte"
				titleText="Replace after login"
			/>

			<h4 class="mt-4">Pagination</h4>
			<CodeBlock
				codeContent={`<script>
import { push } from '@keenmate/svelte-spa-router'
import { routeParams, querystring } from '@keenmate/svelte-spa-router'

// Get current page from query string
const qs = $derived(querystring())
const currentPage = $derived(
  qs ? parseInt(new URLSearchParams(qs).get('page') || '1') : 1
)

async function goToPage(page) {
  const params = routeParams()

  // Navigate to same route with new page number
  await push(['bookList', params, { page: page.toString() }])
}
</script>

<div class="pagination">
  {#if currentPage > 1}
    <button onclick=onclick={#123;() => goToPage(currentPage - 1)}>Previous</button>
  {/if}

  <span>Page {currentPage}</span>

  <button onclick=onclick={#123;() => goToPage(currentPage + 1)}>Next</button>
</div>`}
				languageType="svelte"
				titleText="Pagination navigation"
			/>

			<h4 class="mt-4">Conditional Navigation</h4>
			<CodeBlock
				codeContent={`<script>
import { push, replace } from '@keenmate/svelte-spa-router'

async function handleAction(user) {
  if (!user) {
    // Redirect to login if not authenticated
    await replace(['login'])
    return
  }

  if (user.isAdmin) {
    // Admins go to admin panel
    await push(['adminPanel'])
  } else if (user.hasProfile) {
    // Regular users with profile go to profile
    await push(['userProfile', { userId: user.id }])
  } else {
    // New users create profile
    await push(['createProfile'])
  }
}
</script>

<button onclick=onclick={#123;() => handleAction(currentUser)}>
  Continue
</button>`}
				languageType="svelte"
				titleText="Conditional navigation"
			/>

			<h4 class="mt-4">Back Navigation</h4>
			<CodeBlock
				codeContent={`<script>
import { pop, push } from '@keenmate/svelte-spa-router'

let canGoBack = $state(false)

// Check if user can go back
$effect(() => {
  canGoBack = window.history.length > 1
})

async function handleBack() {
  if (canGoBack) {
    // Go back in history
    await pop()
  } else {
    // No history, go to home page
    await push(['home'])
  }
}
</script>

<button onclick=onclick={#123;handleBack}>
  {canGoBack ? '← Back' : '← Home'}
</button>`}
				languageType="svelte"
				titleText="Smart back navigation"
			/>
		</section>

		<!-- Common Patterns -->
		<section class="mb-5">
			<h2 class="mb-4">Common Patterns</h2>

			<h4>Navigation after API call</h4>
			<CodeBlock
				codeContent={`async function createItem(data) {
  try {
    const result = await api.post('/items', data)

    // Navigate to newly created item
    await push(['itemDetail', { itemId: result.id }])
  } catch (error) {
    console.error('Failed to create item:', error)
  }
}`}
				languageType="javascript"
				titleText="Navigate after API call"
			/>

			<h4 class="mt-4">Navigate with preserved filters</h4>
			<CodeBlock
				codeContent={`import { push } from '@keenmate/svelte-spa-router'
import { querystring } from '@keenmate/svelte-spa-router'

async function viewItem(itemId) {
  // Get current filters from query string
  const currentQuery = querystring()
  const params = new URLSearchParams(currentQuery)

  // Preserve existing filters
  const filters = {
    category: params.get('category'),
    sort: params.get('sort'),
    view: params.get('view')
  }

  // Navigate to item with filters preserved
  await push(['itemDetail', { itemId }, filters])
}`}
				languageType="javascript"
				titleText="Preserve query parameters"
			/>

			<h4 class="mt-4">Multi-step wizard</h4>
			<CodeBlock
				codeContent={`<script>
import { push, replace, pop } from '@keenmate/svelte-spa-router'

let wizardData = $state({})
let currentStep = $state(1)

async function nextStep(stepData) {
  // Save step data
  wizardData = { ...wizardData, ...stepData }

  if (currentStep < 3) {
    // Move to next step
    currentStep++
    await replace(['wizard', {}, { step: currentStep }])
  } else {
    // Final step: submit and navigate
    await submitWizard(wizardData)
    await push(['success'])
  }
}

async function previousStep() {
  if (currentStep > 1) {
    currentStep--
    await replace(['wizard', {}, { step: currentStep }])
  }
}
</script>

<div class="wizard">
  <button onclick=onclick={#123;previousStep} disabled=disabled={#123;currentStep === 1}>
    Previous
  </button>

  <button onclick=onclick={#123;() => nextStep(currentStepData)}>
    {currentStep#123;currentStep === 3 ? 'Finish' : 'Next'}
  </button>
</div>`}
				languageType="svelte"
				titleText="Wizard navigation"
			/>
		</section>

		<!-- Best Practices -->
		<section class="mb-5">
			<h2 class="mb-4">Best Practices</h2>

			<div class="alert alert-success">
				<h5>✅ Do</h5>
				<ul>
					<li>Use <code>replace()</code> for login/logout flows to prevent back button issues</li>
					<li>Use named routes with <code>registerRoutes()</code> for maintainability</li>
					<li>Use <code>await</code> with navigation functions to handle completion</li>
					<li>Preserve query parameters when navigating between related views</li>
					<li>Use <code>pop()</code> instead of hardcoding back navigation</li>
				</ul>
			</div>

			<div class="alert alert-warning">
				<h5>⚠️ Don't</h5>
				<ul>
					<li>Don't call navigation functions in a tight loop</li>
					<li>Don't forget to handle navigation errors in try/catch</li>
					<li>Don't hardcode URLs - use named routes instead</li>
					<li>Don't use <code>push()</code> for redirects after form submission - consider <code>replace()</code></li>
				</ul>
			</div>
		</section>

		<!-- TypeScript Support -->
		<section class="mb-5">
			<h2 class="mb-4">TypeScript Support</h2>
			<p>All navigation functions are fully typed with TypeScript:</p>

			<CodeBlock
				codeContent={`import { push, replace, pop } from '@keenmate/svelte-spa-router'

// Type definitions
type NavigationInput =
  | string
  | [string, Record<string, any>?, Record<string, any>?]
  | {
      href?: string
      route?: string
      params?: Record<string, any>
      query?: Record<string, any>
    }

// All these are type-safe
await push('/about')  // string
await push(['userProfile', { userId: 123 }])  // array
await push({ route: 'home' })  // object

// Async functions return Promise<void>
await replace('/login')
await pop()`}
				languageType="typescript"
				titleText="TypeScript support"
			/>
		</section>

		<!-- Live Examples -->
		<section class="mb-5">
			<h2 class="mb-4">Try It Live</h2>
			<p>
				See programmatic navigation in action in the example application at
				<code>/links-demo</code>. The demo includes interactive buttons to test all three formats.
			</p>

			<div class="alert alert-info">
				<p class="mb-0">
					<strong>Example App:</strong> Check out
					<code>example-history/src/routes/LinksDemo.svelte</code> for a complete working example
					with all navigation formats.
				</p>
			</div>
		</section>
	</div>
</DocLayout>
