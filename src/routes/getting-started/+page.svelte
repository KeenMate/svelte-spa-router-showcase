<script>
import { DocLayout, ShowcaseSection, CodeBlock } from '@keenmate/svelte-docs'
</script>

<DocLayout
	titleText="Getting Started"
	descriptionText="Install and configure @keenmate/svelte-spa-router in your Svelte 5 application">

	<div class="py-1">
		<div class="alert alert-success mb-4">
			<strong>New in v5.2:</strong> for the cleanest setup with type-safe routes and
			autocomplete on navigation, see <a href="/features/define-routes"><code>defineRoutes()</code></a>.
			The pattern below still works perfectly — <code>defineRoutes()</code> is a recommended
			addition on top, not a replacement.
		</div>

		<!-- Installation -->
		<section class="mb-5">
			<h2 class="mb-4">Installation</h2>
			<p class="lead">Install the package using your preferred package manager:</p>

			<CodeBlock
				codeContent="npm install @keenmate/svelte-spa-router"
				languageType="bash"
				titleText="npm"
			/>
			<p class="mt-3"><small class="text-muted">
				Requires Node.js 22+ for production builds (Node 20 has Svelte 5 compatibility issues).
				See <a href="/whats-new">What's New</a> for the latest release highlights.
			</small></p>
		</section>

		<!-- Basic Setup -->
		<section class="mb-5">
			<h2 class="mb-4">Basic Setup</h2>
			<p>Follow these three simple steps to get your router running:</p>

			<div class="row g-4 mt-3">
				<div class="col-12">
					<h4>1. Define Your Routes</h4>
					<p>Create a routes configuration object mapping paths to Svelte components:</p>
					<CodeBlock
						codeContent={`// src/routes.js
import Home from './routes/Home.svelte'
import About from './routes/About.svelte'
import UserProfile from './routes/UserProfile.svelte'
import NotFound from './routes/NotFound.svelte'

export const routes = {
  // Exact path
  '/': Home,

  // Simple route
  '/about': About,

  // Route with parameters
  '/user/:id': UserProfile,

  // Catch-all for 404
  '*': NotFound
}`}
						languageType="javascript"
						titleText="routes.js"
					/>
				</div>

				<div class="col-12">
					<h4>2. Add the Router Component</h4>
					<p>Import and use the Router component in your main App component:</p>
					<CodeBlock
						codeContent={`<!-- src/App.svelte -->
<script>
import Router from '@keenmate/svelte-spa-router'
import { routes } from './routes'
</script>

<Router {routes} />`}
						languageType="svelte"
						titleText="App.svelte"
					/>
				</div>

				<div class="col-12">
					<h4>3. Create Navigation Links</h4>
					<p>Use the <code>link</code> action to make links work with the router:</p>
					<CodeBlock
						codeContent={`<script>
import { link } from '@keenmate/svelte-spa-router'
</script>

<nav>
  <a href="/" use:link>Home</a>
  <a href="/about" use:link>About</a>
  <a href="/user/123" use:link>User Profile</a>
</nav>`}
						languageType="svelte"
						titleText="Navigation.svelte"
					/>
				</div>
			</div>
		</section>

		<!-- Routing Mode Configuration -->
		<section class="mb-5">
			<h2 class="mb-4">Choose Your Routing Mode</h2>
			<p>The router supports two modes: <strong>Hash mode</strong> (default) and <strong>History mode</strong>.</p>

			<div class="row g-4 mt-3">
				<div class="col-md-6">
					<div class="card h-100">
						<div class="card-header bg-primary text-white">
							<h5 class="mb-0">Hash Mode (Default)</h5>
						</div>
						<div class="card-body">
							<p><strong>URLs:</strong> <code>example.com/#/about</code></p>
							<p class="mb-2"><strong>Advantages:</strong></p>
							<ul>
								<li>No server configuration needed</li>
								<li>Works on static hosting</li>
								<li>Works with file:// protocol</li>
							</ul>
							<p class="mb-2"><strong>Setup:</strong></p>
							<CodeBlock
								codeContent={`// No configuration needed!
// Hash mode is the default

import { mount } from 'svelte'
import App from './App.svelte'

mount(App, { target: document.body })`}
								languageType="javascript"
								titleText="main.js"
							/>
						</div>
					</div>
				</div>

				<div class="col-md-6">
					<div class="card h-100">
						<div class="card-header bg-success text-white">
							<h5 class="mb-0">History Mode</h5>
						</div>
						<div class="card-body">
							<p><strong>URLs:</strong> <code>example.com/about</code></p>
							<p class="mb-2"><strong>Advantages:</strong></p>
							<ul>
								<li>Clean URLs without #</li>
								<li>Better SEO</li>
								<li>Better user experience</li>
							</ul>
							<p class="mb-2"><strong>Setup:</strong></p>
							<CodeBlock
								codeContent={`import { mount } from 'svelte'
import { setHashRoutingEnabled } from '@keenmate/svelte-spa-router'
import App from './App.svelte'

// Enable history mode
setHashRoutingEnabled(false)

mount(App, { target: document.body })`}
								languageType="javascript"
								titleText="main.js"
							/>
							<div class="alert alert-warning mt-3 mb-0">
								<small><strong>Note:</strong> History mode requires server configuration. See the <a href="/features/routing-modes">Routing Modes</a> page for details.</small>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Your First Route Component -->
		<section class="mb-5">
			<h2 class="mb-4">Your First Route Component</h2>
			<p>Route components are regular Svelte components. Here's a simple example:</p>

			<CodeBlock
				codeContent={`<!-- src/routes/Home.svelte -->
<script>
import { link } from '@keenmate/svelte-spa-router'
</script>

<h1>Welcome Home!</h1>
<p>This is your first route component.</p>

<nav>
  <a href="/about" use:link>Learn More</a>
</nav>`}
				languageType="svelte"
				titleText="Home.svelte"
			/>

			<h4 class="mt-4">Route Components with Parameters</h4>
			<p>Access route parameters via props:</p>

			<CodeBlock
				codeContent={`<!-- src/routes/UserProfile.svelte -->
<script>
// Route parameters are passed as props
let { routeParams = {} } = $props()
</script>

<h1>User Profile</h1>
<p>Viewing user: {routeParams.id}</p>

<!-- URL: /user/123 -> routeParams.id = "123" -->`}
				languageType="svelte"
				titleText="UserProfile.svelte"
			/>
		</section>

		<!-- What's Next -->
		<section class="mb-5">
			<h2 class="mb-4">What's Next?</h2>
			<div class="row g-3">
				<div class="col-md-6 col-lg-4">
					<div class="card">
						<div class="card-body">
							<h5 class="card-title">Route Parameters</h5>
							<p class="card-text">Learn about dynamic routing with parameters and wildcards</p>
							<a href="/features/parameters" class="btn btn-sm btn-outline-primary">Learn More →</a>
						</div>
					</div>
				</div>
				<div class="col-md-6 col-lg-4">
					<div class="card">
						<div class="card-body">
							<h5 class="card-title">Navigation Guards</h5>
							<p class="card-text">Protect routes and prevent navigation when needed</p>
							<a href="/features/guards" class="btn btn-sm btn-outline-primary">Learn More →</a>
						</div>
					</div>
				</div>
				<div class="col-md-6 col-lg-4">
					<div class="card">
						<div class="card-body">
							<h5 class="card-title">Querystring Helpers</h5>
							<p class="card-text">Work with URL query parameters reactively</p>
							<a href="/features/querystring" class="btn btn-sm btn-outline-primary">Learn More →</a>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Live Examples -->
		<section class="mb-5">
			<h2 class="mb-4">Try the Live Examples</h2>
			<p>See the router in action — two live deploys, same source, different routing modes:</p>
			<div class="d-flex gap-3 flex-wrap">
				<a href="https://history.svelte-spa-router.keenmate.dev" target="_blank" class="btn btn-primary">
					🚀 History Mode
				</a>
				<a href="https://hash.svelte-spa-router.keenmate.dev" target="_blank" class="btn btn-outline-primary">
					🔗 Hash Mode
				</a>
			</div>
			<p class="mt-3"><small class="text-muted">
				Running locally: <code>make dev</code> (port 5050, history) or <code>make dev-hash</code>
				(port 5051, hash). See <a href="/examples">Examples</a> for the full per-feature deep-link list.
			</small></p>
		</section>
	</div>
</DocLayout>
