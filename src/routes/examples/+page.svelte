<script>
import { DocLayout, FeatureCard } from '@keenmate/svelte-docs'
</script>

<DocLayout
	titleText="Live Examples"
	descriptionText="Interactive demos showcasing router features">

	<div class="py-1">
		<!-- Introduction -->
		<section class="mb-5">
			<h2 class="mb-4">Example Applications</h2>
			<p class="lead">
				The example app ships in both routing modes — same source, mode picked by the
				<code>VITE_ROUTING_MODE</code> environment variable. Two live deploys are kept current
				with <code>main</code>:
			</p>

			<div class="row g-4 mt-3">
				<!-- History Mode -->
				<div class="col-md-6">
					<div class="card h-100 border-primary">
						<div class="card-header bg-primary text-white">
							<h3 class="h5 mb-0">🚀 History Mode</h3>
						</div>
						<div class="card-body">
							<p class="card-text mb-3">
								Clean URLs via the History API. Requires server fallback to <code>index.html</code>
								in production (nginx, Apache, etc.).
							</p>
							<div class="mt-3">
								<a href="https://history.svelte-spa-router.keenmate.dev" target="_blank" class="btn btn-primary w-100">
									Open History Mode Example
								</a>
							</div>
							<div class="mt-2">
								<small class="text-muted">Locally: <code>make dev</code> → <code>localhost:5050</code></small>
							</div>
						</div>
					</div>
				</div>

				<!-- Hash Mode -->
				<div class="col-md-6">
					<div class="card h-100 border-success">
						<div class="card-header bg-success text-white">
							<h3 class="h5 mb-0">🔗 Hash Mode</h3>
						</div>
						<div class="card-body">
							<p class="card-text mb-3">
								Hash-based <code>#/path</code> routing. No server config needed — works on
								static hosting, file://, anywhere.
							</p>
							<div class="mt-3">
								<a href="https://hash.svelte-spa-router.keenmate.dev" target="_blank" class="btn btn-success w-100">
									Open Hash Mode Example
								</a>
							</div>
							<div class="mt-2">
								<small class="text-muted">Locally: <code>make dev-hash</code> → <code>localhost:5051</code></small>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Demos by category -->
		<section class="mb-5">
			<h2 class="mb-4">Demos by Category</h2>
			<p>
				Every demo below links to the history-mode deploy. For hash mode, swap
				<code>https://history…</code> for <code>https://hash.svelte-spa-router.keenmate.dev/#</code>
				and prepend <code>#</code> to the path.
			</p>

			<div class="accordion" id="demoAccordion">
				<!-- Navigation -->
				<div class="accordion-item">
					<h2 class="accordion-header">
						<button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#navDemos">
							Navigation
						</button>
					</h2>
					<div id="navDemos" class="accordion-collapse collapse show" data-bs-parent="#demoAccordion">
						<div class="accordion-body">
							<ul>
								<li><a href="https://history.svelte-spa-router.keenmate.dev/links-demo" target="_blank"><code>/links-demo</code></a> — link action formats (string, object, named, array)</li>
								<li><a href="https://history.svelte-spa-router.keenmate.dev/navigation-guard-demo" target="_blank"><code>/navigation-guard-demo</code></a> — three exit-guard modes (wrapper, direct, dirty-check)</li>
								<li><a href="https://history.svelte-spa-router.keenmate.dev/navigation-context-demo" target="_blank"><code>/navigation-context-demo</code></a> — passing data between routes without URL pollution</li>
								<li><a href="https://history.svelte-spa-router.keenmate.dev/referrer-demo" target="_blank"><code>/referrer-demo</code></a> — automatic referrer tracking + scroll restoration via <code>goBack()</code></li>
							</ul>
						</div>
					</div>
				</div>

				<!-- URL & Data -->
				<div class="accordion-item">
					<h2 class="accordion-header">
						<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#urlDemos">
							URL &amp; Data
						</button>
					</h2>
					<div id="urlDemos" class="accordion-collapse collapse" data-bs-parent="#demoAccordion">
						<div class="accordion-body">
							<ul>
								<li><a href="https://history.svelte-spa-router.keenmate.dev/querystring-demo" target="_blank"><code>/querystring-demo</code></a> — built-in helpers + custom formatter (OData / Microsoft Graph)</li>
								<li><a href="https://history.svelte-spa-router.keenmate.dev/filters-demo" target="_blank"><code>/filters-demo</code></a> — flat and structured filter modes</li>
								<li><a href="https://history.svelte-spa-router.keenmate.dev/route-data-demo" target="_blank"><code>/route-data-demo</code></a> — typed params, optional and wildcard segments</li>
								<li><a href="https://history.svelte-spa-router.keenmate.dev/tabs/1" target="_blank"><code>/tabs/:id</code></a> — tab UI with querystring state preserving breadcrumbs</li>
								<li><a href="https://history.svelte-spa-router.keenmate.dev/user/John/Doe" target="_blank"><code>/user/:first/:last</code></a> — multi-segment params</li>
								<li><a href="https://history.svelte-spa-router.keenmate.dev/book/svelte/runes" target="_blank"><code>/book/*</code></a> — wildcard catch-all routes</li>
							</ul>
						</div>
					</div>
				</div>

				<!-- Routing -->
				<div class="accordion-item">
					<h2 class="accordion-header">
						<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#routingDemos">
							Routing &amp; Layout
						</button>
					</h2>
					<div id="routingDemos" class="accordion-collapse collapse" data-bs-parent="#demoAccordion">
						<div class="accordion-body">
							<ul>
								<li><a href="https://history.svelte-spa-router.keenmate.dev/define-routes-demo" target="_blank"><code>/define-routes-demo</code></a> — type-safe <code>defineRoutes()</code> with <code>nav</code>/<code>paths</code> helpers</li>
								<li><a href="https://history.svelte-spa-router.keenmate.dev/route-context-demo" target="_blank"><code>/route-context-demo</code></a> — <code>routeContext()</code> for per-route static data</li>
								<li><a href="https://history.svelte-spa-router.keenmate.dev/metadata-demo" target="_blank"><code>/metadata-demo</code></a> — page titles + breadcrumbs via <code>routeBreadcrumbs()</code></li>
								<li><a href="https://history.svelte-spa-router.keenmate.dev/loading-demo" target="_blank"><code>/loading-demo</code></a> — <code>shouldDisplayLoadingOnRouteLoad</code> + <code>hideLoading()</code></li>
								<li><a href="https://history.svelte-spa-router.keenmate.dev/multi-zone-demo" target="_blank"><code>/multi-zone-demo</code></a> — independent zones (sidebar / main / panel) sharing a router</li>
								<li><a href="https://history.svelte-spa-router.keenmate.dev/admin-tree" target="_blank"><code>/admin-tree</code></a> — tree-structured routes via <code>createHierarchy()</code></li>
							</ul>
						</div>
					</div>
				</div>

				<!-- Errors -->
				<div class="accordion-item">
					<h2 class="accordion-header">
						<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#errorDemos">
							Errors
						</button>
					</h2>
					<div id="errorDemos" class="accordion-collapse collapse" data-bs-parent="#demoAccordion">
						<div class="accordion-body">
							<ul>
								<li><a href="https://history.svelte-spa-router.keenmate.dev/error-handling-demo" target="_blank"><code>/error-handling-demo</code></a> — <code>GlobalErrorHandler</code> + recovery strategies</li>
								<li><a href="https://history.svelte-spa-router.keenmate.dev/not-found-demo" target="_blank"><code>/not-found-demo</code></a> — <code>onNotFound</code> tracking + catch-all behavior</li>
							</ul>
						</div>
					</div>
				</div>

				<!-- Security -->
				<div class="accordion-item">
					<h2 class="accordion-header">
						<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#securityDemos">
							Security
						</button>
					</h2>
					<div id="securityDemos" class="accordion-collapse collapse" data-bs-parent="#demoAccordion">
						<div class="accordion-body">
							<ul>
								<li><a href="https://history.svelte-spa-router.keenmate.dev/authorization-demo" target="_blank"><code>/authorization-demo</code></a> — async <code>authorizationCallback</code> for per-resource checks</li>
								<li><a href="https://history.svelte-spa-router.keenmate.dev/admin" target="_blank"><code>/admin</code></a> — permission-protected route (toggle user in the header to test)</li>
								<li><a href="https://history.svelte-spa-router.keenmate.dev/settings" target="_blank"><code>/settings</code></a> — protected route requiring <code>settings:manage</code></li>
							</ul>
							<p class="mt-2 mb-0"><small class="text-muted">Tip: the example header has a <strong>Toggle 👤</strong> button to switch between users with different permission sets.</small></p>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Running Examples Locally -->
		<section class="mb-5">
			<h2 class="mb-4">Running Examples Locally</h2>
			<p>
				One example app, two modes. Mode is picked via the <code>VITE_ROUTING_MODE</code> env var
				(<code>cross-env</code> handles cross-platform).
			</p>

			<div class="row g-4">
				<div class="col-md-6">
					<h5>Using Make (Recommended)</h5>
<pre class="bg-dark text-light p-3 rounded"><code># History mode (port 5050)
make dev

# Hash mode (port 5051)
make dev-hash</code></pre>
				</div>

				<div class="col-md-6">
					<h5>Using npm</h5>
<pre class="bg-dark text-light p-3 rounded"><code>cd example
npm install

# History mode
npm run dev:history

# Hash mode
npm run dev:hash</code></pre>
				</div>
			</div>
		</section>

		<!-- Source Code -->
		<section class="mb-5">
			<h2 class="mb-4">Source Code</h2>
			<p>
				The example app source lives in the main router repository under <code>example/</code>.
				Both routing modes share the same source — the mode is selected at build time.
			</p>

			<div class="row g-3">
				<div class="col-md-6">
					<div class="card">
						<div class="card-body">
							<h6 class="card-title">Example app</h6>
							<p class="card-text small">Full demo source — every feature shown above.</p>
							<a href="https://github.com/keenmate/svelte-spa-router/tree/main/example" target="_blank" class="btn btn-sm btn-outline-dark">
								View example/ on GitHub
							</a>
						</div>
					</div>
				</div>
				<div class="col-md-6">
					<div class="card">
						<div class="card-body">
							<h6 class="card-title">E2E test fixtures</h6>
							<p class="card-text small">Minimal Playwright fixtures kept separate from the user-facing demos. Useful when reading the spec suite.</p>
							<a href="https://github.com/keenmate/svelte-spa-router/tree/main/example/src/routes/test" target="_blank" class="btn btn-sm btn-outline-dark">
								View fixtures on GitHub
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Quick Tips -->
		<section class="mb-5">
			<h2 class="mb-4">Quick Tips</h2>

			<div class="row g-3">
				<div class="col-md-6 col-lg-3">
					<FeatureCard
						iconEmoji="🔍"
						titleText="Explore Features"
						descriptionText="Open every demo at least once — many have multiple sections covering edge cases"
						variantType="primary"
					/>
				</div>
				<div class="col-md-6 col-lg-3">
					<FeatureCard
						iconEmoji="💻"
						titleText="View Source"
						descriptionText="The example/ files are the canonical reference — feature pages are written from them"
						variantType="success"
					/>
				</div>
				<div class="col-md-6 col-lg-3">
					<FeatureCard
						iconEmoji="🛠️"
						titleText="Experiment"
						descriptionText="Run locally with make dev and edit example/src/routes/ to test changes"
						variantType="info"
					/>
				</div>
				<div class="col-md-6 col-lg-3">
					<FeatureCard
						iconEmoji="📖"
						titleText="Read Docs"
						descriptionText="Each Features page on the left has a deep-link to its matching demo"
						variantType="warning"
					/>
				</div>
			</div>
		</section>
	</div>
</DocLayout>
