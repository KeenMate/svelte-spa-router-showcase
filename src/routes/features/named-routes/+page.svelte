<script>
import { DocLayout, CodeBlock } from '@keenmate/svelte-docs'
</script>

<DocLayout
	titleText="Named Routes"
	descriptionText="Type-safe navigation with named routes and parameter substitution">

	<div class="py-1">
		<!-- Introduction -->
		<section class="mb-5">
			<h2 class="mb-4">What are Named Routes?</h2>
			<p class="lead">
				Named routes let you reference routes by name instead of hard-coding paths everywhere.
				This makes your code more maintainable and refactor-friendly while providing type-safe navigation.
			</p>

			<div class="row g-4 mt-3">
				<div class="col-md-6">
					<h5>Before (Hard-coded paths)</h5>
					<CodeBlock
						codeContent={`<a href="/documents/123?tab=info" use:link>
  View Document
</a>

// If you change the URL pattern,
// you have to find and update every link!`}
						languageType="svelte"
						titleText="Hard-coded approach"
					/>
				</div>
				<div class="col-md-6">
					<h5>After (Named routes)</h5>
					<CodeBlock
						codeContent={`<a use:link={['documentDetail',
  {documentId: 123},
  {tab: 'info'}]}>
  View Document
</a>

// Change the pattern once, all links update!`}
						languageType="svelte"
						titleText="Named routes approach"
					/>
				</div>
			</div>
		</section>

		<!-- Registration -->
		<section class="mb-5">
			<h2 class="mb-4">Registering Named Routes</h2>
			<p>Register your routes once in your <code>main.js</code> or a routes configuration file:</p>

			<h4 class="mt-4">Register Multiple Routes</h4>
			<CodeBlock
				codeContent={`// main.js or routes.js
import { registerRoutes } from '@keenmate/svelte-spa-router'

registerRoutes({
  home: '/',
  about: '/about',
  userProfile: '/users/:userId',
  userPosts: '/users/:userId/posts',
  documentDetail: '/documents/:documentId',
  blogPost: '/blog/:category/:slug'
})`}
				languageType="javascript"
				titleText="Registering routes"
			/>

			<h4 class="mt-4">Register Single Route</h4>
			<CodeBlock
				codeContent={`import { registerRoute } from '@keenmate/svelte-spa-router'

registerRoute('userProfile', '/users/:userId')`}
				languageType="javascript"
				titleText="Register single route"
			/>
		</section>

		<!-- Using Named Routes -->
		<section class="mb-5">
			<h2 class="mb-4">Using Named Routes</h2>
			<p>The <code>link</code> action supports multiple convenient formats:</p>

			<h4 class="mt-4">1. Legacy String Format (Still Works)</h4>
			<CodeBlock
				codeContent={`<script>
import { link } from '@keenmate/svelte-spa-router'
</script>

<!-- Old style - still supported -->
<a href="/about" use:link>About</a>`}
				languageType="svelte"
				titleText="Legacy format"
			/>

			<h4 class="mt-4">2. Object with Direct href</h4>
			<CodeBlock
				codeContent={`<a use:link=&#123;&#123; href: '/about' &#125;&#125;>About</a>`}
				languageType="svelte"
				titleText="Object with href"
			/>

			<h4 class="mt-4">3. Named Route with Parameters</h4>
			<CodeBlock
				codeContent={`<a use:link=&#123;&#123;
  route: 'documentDetail',
  params: &#123; documentId: 123 &#125;
&#125;&#125;>
  View Document
</a>`}
				languageType="svelte"
				titleText="Named route object"
			/>

			<h4 class="mt-4">4. Array Shorthand (Recommended)</h4>
			<CodeBlock
				codeContent={`<!-- Simple: just route name -->
<a use:link={['home']}>Home</a>

<!-- With single parameter -->
<a use:link={['userProfile', {userId: 123}]}>
  User Profile
</a>

<!-- With multiple parameters -->
<a use:link={['blogPost', {category: 'tech', slug: 'svelte-5'}]}>
  Blog Post
</a>

<!-- With parameters and single query -->
<a use:link={['documentDetail', {documentId: 123}, {tab: 'info'}]}>
  Document Info
</a>

<!-- With parameters and multiple query strings -->
<a use:link={['documentDetail', {documentId: 123}, {tab: 'info', edit: 'true', view: 'compact'}]}>
  Edit Document (Compact View)
</a>

<!-- Multiple params + multiple query strings -->
<a use:link={['blogPost', {category: 'tech', slug: 'svelte-5'}, {source: 'newsletter', ref: 'homepage'}]}>
  Blog Post with Tracking
</a>

<!-- Result URLs:
/
/users/123
/blog/tech/svelte-5
/documents/123?tab=info
/documents/123?tab=info&edit=true&view=compact
/blog/tech/svelte-5?source=newsletter&ref=homepage
-->`}
				languageType="svelte"
				titleText="Array shorthand examples"
			/>
		</section>

		<!-- With Query Parameters -->
		<section class="mb-5">
			<h2 class="mb-4">Named Routes with Query Parameters</h2>
			<p>Easily add query parameters to your named routes:</p>

			<h4 class="mt-4">Object Format</h4>
			<CodeBlock
				codeContent={`<a use:link=&#123;&#123;
  route: 'documentDetail',
  params: &#123; documentId: 123 &#125;,
  query: &#123; tab: 'info', edit: 'true' &#125;
&#125;&#125;>
  Edit Document Info
</a>

<!-- Result: /documents/123?tab=info&edit=true -->`}
				languageType="svelte"
				titleText="Object with query"
			/>

			<h4 class="mt-4">Array Format</h4>
			<CodeBlock
				codeContent={`<!-- [routeName, params, query] -->
<a use:link=&#123;['documentDetail', &#123;documentId: 123&#125;, &#123;tab: 'info', edit: 'true'&#125;]&#125;>
  Edit Document Info
</a>

<!-- Result: /documents/123?tab=info&edit=true -->`}
				languageType="svelte"
				titleText="Array with query"
			/>

			<h4 class="mt-4">Direct href with Query</h4>
			<CodeBlock
				codeContent={`<a use:link=&#123;&#123; href: '/documents/123', query: &#123; tab: 'info' &#125; &#125;&#125;>
  Document Info Tab
</a>

<!-- Result: /documents/123?tab=info -->`}
				languageType="svelte"
				titleText="Direct href with query"
			/>
		</section>

		<!-- Advanced Options -->
		<section class="mb-5">
			<h2 class="mb-4">Advanced Options</h2>
			<p>The object format supports additional options:</p>

			<CodeBlock
				codeContent={`<a use:link=&#123;&#123;
  route: 'userProfile',
  params: &#123; userId: 123 &#125;,
  query: &#123; tab: 'settings' &#125;,
  replace: true,      // Use replaceState instead of pushState
  disabled: false     // Disable navigation when true
&#125;&#125;>
  User Settings
</a>`}
				languageType="svelte"
				titleText="Advanced options"
			/>

			<div class="alert alert-info mt-3">
				<h5>Options Reference</h5>
				<ul class="mb-0">
					<li><code>route</code> - Named route (mutually exclusive with href)</li>
					<li><code>href</code> - Direct path (mutually exclusive with route)</li>
					<li><code>params</code> - Route parameters object</li>
					<li><code>query</code> - Query string parameters object</li>
					<li><code>replace</code> - Use replaceState instead of pushState (default: false)</li>
					<li><code>disabled</code> - Disable navigation (default: false)</li>
				</ul>
			</div>
		</section>

		<!-- Programmatic Navigation -->
		<section class="mb-5">
			<h2 class="mb-4">Programmatic Navigation</h2>
			<p>
				<code>push()</code> and <code>replace()</code> now support the same convenient formats as the <code>link</code> action!
			</p>

			<CodeBlock
				codeContent={`import { push, replace } from '@keenmate/svelte-spa-router'

// Array format (recommended)
await push(['userProfile', { userId: 456 }, { pageNo: 12 }])

// Object format
await push({
  route: 'documentDetail',
  params: { documentId: 123 },
  query: { tab: 'info', edit: 'true' }
})

// String format (legacy - still works)
await push('/about')

// Same works with replace()
await replace(['userProfile', { userId: 456 }])`}
				languageType="javascript"
				titleText="Programmatic navigation"
			/>

			<div class="alert alert-info mt-3">
				<strong>📚 Learn More:</strong> For detailed documentation on programmatic navigation,
				including practical examples and best practices, see the
				<a href="/features/programmatic-navigation">Programmatic Navigation</a> guide.
			</div>
		</section>

		<!-- Utility Functions -->
		<section class="mb-5">
			<h2 class="mb-4">Utility Functions</h2>

			<h4>hasRoute(name)</h4>
			<p>Check if a route is registered:</p>
			<CodeBlock
				codeContent={`import { hasRoute } from '@keenmate/svelte-spa-router'

if (hasRoute('documentDetail')) {
  console.log('Route exists!')
}`}
				languageType="javascript"
				titleText="Check if route exists"
			/>

			<h4 class="mt-4">getRoutes()</h4>
			<p>Get all registered routes:</p>
			<CodeBlock
				codeContent={`import { getRoutes } from '@keenmate/svelte-spa-router'

const routes = getRoutes()
console.log(routes)
// { home: '/', about: '/about', userProfile: '/users/:userId', ... }`}
				languageType="javascript"
				titleText="Get all routes"
			/>

			<h4 class="mt-4">clearRoutes()</h4>
			<p>Clear all registered routes (useful for testing):</p>
			<CodeBlock
				codeContent={`import { clearRoutes } from '@keenmate/svelte-spa-router'

clearRoutes()`}
				languageType="javascript"
				titleText="Clear routes"
			/>
		</section>

		<!-- TypeScript Support -->
		<section class="mb-5">
			<h2 class="mb-4">TypeScript Support</h2>
			<p>Full TypeScript support for type-safe navigation:</p>

			<CodeBlock
				codeContent={`<script lang="ts">
import type { LinkActionOptions } from '@keenmate/svelte-spa-router'

// Type-safe link options
const linkOptions: LinkActionOptions = {
  route: 'documentDetail',
  params: { documentId: 123 },
  query: { tab: 'info' }
}
</script>

<a use:link={linkOptions}>View Document</a>`}
				languageType="typescript"
				titleText="TypeScript support"
			/>
		</section>

		<!-- Practical Examples -->
		<section class="mb-5">
			<h2 class="mb-4">Practical Examples</h2>

			<h4>Navigation Menu</h4>
			<CodeBlock
				codeContent={`<script>
import { link } from '@keenmate/svelte-spa-router'
import { registerRoutes } from '@keenmate/svelte-spa-router'

registerRoutes({
  home: '/',
  about: '/about',
  products: '/products',
  contact: '/contact'
})
</script>

<nav>
  <a use:link={['home']}>Home</a>
  <a use:link={['about']}>About</a>
  <a use:link={['products']}>Products</a>
  <a use:link={['contact']}>Contact</a>
</nav>`}
				languageType="svelte"
				titleText="Navigation menu"
			/>

			<h4>User Profile Links</h4>
			<CodeBlock
				codeContent={`<script>
const userId = 123

registerRoutes({
  userProfile: '/users/:userId',
  userPosts: '/users/:userId/posts',
  userSettings: '/users/:userId/settings'
})
</script>

<div class="user-menu">
  <a use:link={['userProfile', {userId}]}>Profile</a>
  <a use:link={['userPosts', {userId}]}>Posts</a>
  <a use:link={['userSettings', {userId}]}>Settings</a>
</div>`}
				languageType="svelte"
				titleText="User profile links"
			/>

			<h4>Dynamic List Navigation</h4>
			<CodeBlock
				codeContent={`<script>
const documents = [
  { id: 1, title: 'Proposal' },
  { id: 2, title: 'Contract' },
  { id: 3, title: 'Invoice' }
]

registerRoute('documentDetail', '/documents/:documentId')
</script>

<ul>
  {#each documents as doc}
    <li>
      <a use:link={['documentDetail', {documentId: doc.id}]}>
        {doc.title}
      </a>
    </li>
  {/each}
</ul>`}
				languageType="svelte"
				titleText="Dynamic list"
			/>
		</section>

		<!-- Benefits -->
		<section class="mb-5">
			<h2 class="mb-4">Benefits</h2>

			<div class="row g-3">
				<div class="col-md-6 col-lg-4">
					<div class="card h-100">
						<div class="card-body">
							<h5 class="card-title">🔒 Type-safe</h5>
							<p class="card-text">Define routes once, use them everywhere with TypeScript support</p>
						</div>
					</div>
				</div>
				<div class="col-md-6 col-lg-4">
					<div class="card h-100">
						<div class="card-body">
							<h5 class="card-title">🔧 Refactor-friendly</h5>
							<p class="card-text">Change URL patterns without updating every link in your codebase</p>
						</div>
					</div>
				</div>
				<div class="col-md-6 col-lg-4">
					<div class="card h-100">
						<div class="card-body">
							<h5 class="card-title">✨ Cleaner code</h5>
							<p class="card-text">No more string concatenation for building dynamic URLs</p>
						</div>
					</div>
				</div>
				<div class="col-md-6 col-lg-4">
					<div class="card h-100">
						<div class="card-body">
							<h5 class="card-title">🎯 Flexible</h5>
							<p class="card-text">Multiple syntax options - choose what fits your use case</p>
						</div>
					</div>
				</div>
				<div class="col-md-6 col-lg-4">
					<div class="card h-100">
						<div class="card-body">
							<h5 class="card-title">🔄 Backward compatible</h5>
							<p class="card-text">Old <code>&lt;a href="/path" use:link&gt;</code> still works!</p>
						</div>
					</div>
				</div>
				<div class="col-md-6 col-lg-4">
					<div class="card h-100">
						<div class="card-body">
							<h5 class="card-title">📝 Self-documenting</h5>
							<p class="card-text">Route names make code more readable and maintainable</p>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Migration -->
		<section class="mb-5">
			<h2 class="mb-4">Migration Guide</h2>
			<p>
				No breaking changes! Your existing code continues to work.
				You can gradually adopt named routes:
			</p>

			<CodeBlock
				codeContent={`<!-- Before (still works) -->
<a href="/documents/123" use:link>View Document</a>

<!-- After (when you're ready) -->
<a use:link={['documentDetail', {documentId: 123}]}>View Document</a>

<!-- Mix and match as needed -->
<nav>
  <a href="/" use:link>Home</a>  <!-- Old style -->
  <a use:link={['about']}>About</a>  <!-- New style -->
</nav>`}
				languageType="svelte"
				titleText="Gradual migration"
			/>
		</section>

		<!-- Live Examples -->
		<section class="mb-5">
			<h2 class="mb-4">Try It Live</h2>
			<p>See named routes in action with our interactive demo:</p>
			<div class="d-flex gap-3 flex-wrap">
				<a href="http://localhost:5050/links-demo" target="_blank" class="btn btn-primary">
					🔗 Links Demo
				</a>
			</div>
		</section>
	</div>
</DocLayout>
