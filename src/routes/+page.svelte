<script>
import { DocLayout, ShowcaseSection, FeatureCard, CodeBlock } from '@keenmate/svelte-docs'
</script>

<DocLayout
	titleText="Svelte SPA Router"
	descriptionText="A powerful dual-mode router for Svelte 5 applications">

	<!-- Hero Section -->
	<div class="py-1">
		<div class="text-center mb-5">
			<h1 class="display-4 fw-bold mb-4">
				<span class="text-primary">@keenmate/svelte-spa-router</span>
			</h1>
			<p class="lead mb-4">
				A powerful dual-mode router for Svelte 5 applications built with the new runes system. Supports both hash (#/path) and history API (/path) routing with advanced features like navigation guards, named routes, and flexible querystring handling.
			</p>
			<div class="d-flex gap-3 justify-content-center flex-wrap">
				<a href="https://history.svelte-spa-router.keenmate.dev" target="_blank" class="btn btn-primary btn-lg">
					🚀 History Mode Example
				</a>
				<a href="https://hash.svelte-spa-router.keenmate.dev" target="_blank" class="btn btn-outline-primary btn-lg">
					🔗 Hash Mode Example
				</a>
				<a href="https://github.com/keenmate/svelte-spa-router" target="_blank" class="btn btn-outline-dark btn-lg">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" class="me-2">
						<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
					</svg>
					GitHub
				</a>
			</div>
		</div>

		<!-- Key Features -->
		<div class="row g-4 mb-5">
			<div class="col-md-6 col-lg-4">
				<FeatureCard
					iconEmoji="⚡"
					titleText="Svelte 5 Native"
					descriptionText="Built with Svelte 5 runes ($state, $derived, $effect) for optimal performance"
					variantType="primary"
				/>
			</div>
			<div class="col-md-6 col-lg-4">
				<FeatureCard
					iconEmoji="🔀"
					titleText="Dual-mode Routing"
					descriptionText="Supports both hash (#/path) and history API (/path) routing modes"
					variantType="success"
				/>
			</div>
			<div class="col-md-6 col-lg-4">
				<FeatureCard
					iconEmoji="🛡️"
					titleText="Navigation Guards"
					descriptionText="Prevent navigation with beforeLeave callbacks, permission-based and resource-based route protection"
					variantType="info"
				/>
			</div>
			<div class="col-md-6 col-lg-4">
				<FeatureCard
					iconEmoji="🔗"
					titleText="Named Routes"
					descriptionText="Navigate by route name instead of path with parameter substitution"
					variantType="warning"
				/>
			</div>
			<div class="col-md-6 col-lg-4">
				<FeatureCard
					iconEmoji="📊"
					titleText="Querystring & Filters"
					descriptionText="Query strings with auto-parsing, flexible filter aggregation, and navigation context for passing data"
					variantType="danger"
				/>
			</div>
			<div class="col-md-6 col-lg-4">
				<FeatureCard
					iconEmoji="📜"
					titleText="Scroll Restoration"
					descriptionText="Remember scroll position on back navigation for better UX"
					variantType="secondary"
				/>
			</div>
		</div>

		<!-- Quick Install -->
		<ShowcaseSection
			titleText="Quick Installation"
			subtitleText="Get started in seconds"
			demoColumnTitle="Install"
			controlsColumnTitle="Configure"
			descriptionColumnTitle="Use">

			{#snippet demoContent()}
				<CodeBlock
					codeContent="npm install @keenmate/svelte-spa-router"
					languageType="bash"
					titleText="npm"
				/>
			{/snippet}

			{#snippet controlsContent()}
				<CodeBlock
					codeContent={`import { mount } from 'svelte'
import { setHashRoutingEnabled } from '@keenmate/svelte-spa-router'
import App from './App.svelte'

// For history mode (/path)
setHashRoutingEnabled(false)

// For hash mode (#/path)
// setHashRoutingEnabled(true)

mount(App, { target: document.body })`}
					languageType="javascript"
					titleText="main.js"
				/>
			{/snippet}

			{#snippet descriptionContent()}
				<CodeBlock
					codeContent={`<script>
import Router from '@keenmate/svelte-spa-router'
import Home from './routes/Home.svelte'
import About from './routes/About.svelte'

const routes = {
  '/': Home,
  '/about': About,
  '*': NotFound
}
</script>

<Router {routes} />`}
					languageType="svelte"
					titleText="App.svelte"
				/>
			{/snippet}
		</ShowcaseSection>

		<!-- Example Usage -->
		<div class="mt-5">
			<h2 class="mb-4">Key Features</h2>
			<div class="row g-4">
				<div class="col-lg-6">
					<h4>Route Parameters</h4>
					<CodeBlock
						codeContent={`const routes = {
  '/user/:id': UserDetail,
  '/blog/:category/:slug': BlogPost,
  '/files/*': FileExplorer
}`}
						languageType="javascript"
						titleText="Named & wildcard parameters"
					/>
				</div>
				<div class="col-lg-6">
					<h4>Navigation Guards</h4>
					<CodeBlock
						codeContent={`async function beforeLeave(ctx) {
  if (formIsDirty && !confirm("Unsaved changes")) {
    throw new NavigationCancelledError()
  }
}

registerBeforeLeave(beforeLeave)`}
						languageType="javascript"
						titleText="Prevent navigation"
					/>
				</div>
			</div>
		</div>
	</div>
</DocLayout>
