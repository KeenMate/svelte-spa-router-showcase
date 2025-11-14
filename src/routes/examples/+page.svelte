<script>
import { DocLayout, FeatureCard } from '@keenmate/svelte-docs'
</script>

<DocLayout
	titleText="Live Examples"
	descriptionText="Interactive demos showcasing router features">

	<div class="py-1">
		<!-- Introduction -->
		<section class="mb-5">
			<h2 class="mb-4">Interactive Examples</h2>
			<p class="lead">
				Explore our live example applications to see the router in action.
				Each example demonstrates different routing modes and features.
			</p>
		</section>

		<!-- Example Apps -->
		<section class="mb-5">
			<h2 class="mb-4">Example Applications</h2>

			<div class="row g-4">
				<!-- History Mode Example -->
				<div class="col-md-6">
					<div class="card h-100 border-primary">
						<div class="card-header bg-primary text-white">
							<h3 class="h5 mb-0">🚀 History Mode Example</h3>
						</div>
						<div class="card-body">
							<p class="card-text mb-3">
								Clean URLs using the History API. Perfect for production applications
								with proper server configuration.
							</p>

							<h6 class="fw-bold">Features Demonstrated:</h6>
							<ul class="small">
								<li>Clean URLs without # (<code>/about</code>)</li>
								<li>Route parameters (<code>/user/123</code>)</li>
								<li>Navigation guards</li>
								<li>Querystring helpers</li>
								<li>Filter system</li>
								<li>Named routes</li>
								<li>Active link highlighting</li>
								<li>Scroll restoration</li>
							</ul>

							<div class="mt-3">
								<a href="http://localhost:5050" target="_blank" class="btn btn-primary w-100">
									Open History Mode Example
								</a>
							</div>

							<div class="mt-2">
								<small class="text-muted">Running on port 5050</small>
							</div>
						</div>
					</div>
				</div>

				<!-- Hash Mode Example -->
				<div class="col-md-6">
					<div class="card h-100 border-success">
						<div class="card-header bg-success text-white">
							<h3 class="h5 mb-0">🔗 Hash Mode Example</h3>
						</div>
						<div class="card-body">
							<p class="card-text mb-3">
								Hash-based routing that works everywhere, including static hosting
								and local files.
							</p>

							<h6 class="fw-bold">Features Demonstrated:</h6>
							<ul class="small">
								<li>Hash URLs (<code>#/about</code>)</li>
								<li>Route parameters (<code>#/user/123</code>)</li>
								<li>Basic navigation</li>
								<li>Link actions</li>
								<li>Wildcard routes</li>
								<li>404 handling</li>
								<li>No server configuration needed</li>
								<li>Works on static hosting</li>
							</ul>

							<div class="mt-3">
								<a href="http://localhost:5054" target="_blank" class="btn btn-success w-100">
									Open Hash Mode Example
								</a>
							</div>

							<div class="mt-2">
								<small class="text-muted">Running on port 5054</small>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Example Features -->
		<section class="mb-5">
			<h2 class="mb-4">Features by Example</h2>

			<div class="accordion" id="exampleAccordion">
				<!-- History Mode Features -->
				<div class="accordion-item">
					<h2 class="accordion-header">
						<button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#historyFeatures">
							History Mode Example Routes
						</button>
					</h2>
					<div id="historyFeatures" class="accordion-collapse collapse show" data-bs-parent="#exampleAccordion">
						<div class="accordion-body">
							<div class="row g-3">
								<div class="col-md-6">
									<h6>Basic Routes</h6>
									<ul>
										<li><a href="http://localhost:5050/" target="_blank"><code>/</code> - Home</a></li>
										<li><a href="http://localhost:5050/about" target="_blank"><code>/about</code> - About page</a></li>
										<li><a href="http://localhost:5050/named" target="_blank"><code>/named</code> - Named routes demo</a></li>
									</ul>
								</div>
								<div class="col-md-6">
									<h6>Dynamic Routes</h6>
									<ul>
										<li><a href="http://localhost:5050/user/123" target="_blank"><code>/user/:id</code> - User profile</a></li>
										<li><a href="http://localhost:5050/author/John/Doe" target="_blank"><code>/author/:first/:last</code> - Author page</a></li>
										<li><a href="http://localhost:5050/book/programming/svelte" target="_blank"><code>/book/*</code> - Book viewer</a></li>
									</ul>
								</div>
								<div class="col-md-6">
									<h6>Advanced Features</h6>
									<ul>
										<li><a href="http://localhost:5050/querystring-demo" target="_blank">Querystring helpers</a></li>
										<li><a href="http://localhost:5050/filters" target="_blank">Filter system</a></li>
										<li><a href="http://localhost:5050/navigation-guard-demo" target="_blank">Navigation guards</a></li>
										<li><a href="http://localhost:5050/links-demo" target="_blank">Named routes & links</a></li>
									</ul>
								</div>
								<div class="col-md-6">
									<h6>Testing</h6>
									<ul>
										<li><a href="http://localhost:5050/wild" target="_blank">Wildcard routes</a></li>
										<li><a href="http://localhost:5050/protected" target="_blank">Protected routes</a></li>
										<li><a href="http://localhost:5050/not-found-404" target="_blank">404 page</a></li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Hash Mode Features -->
				<div class="accordion-item">
					<h2 class="accordion-header">
						<button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#hashFeatures">
							Hash Mode Example Routes
						</button>
					</h2>
					<div id="hashFeatures" class="accordion-collapse collapse" data-bs-parent="#exampleAccordion">
						<div class="accordion-body">
							<div class="row g-3">
								<div class="col-md-6">
									<h6>Basic Routes</h6>
									<ul>
										<li><a href="http://localhost:5054/#/" target="_blank"><code>#/</code> - Home</a></li>
										<li><a href="http://localhost:5054/#/about" target="_blank"><code>#/about</code> - About page</a></li>
										<li><a href="http://localhost:5054/#/named" target="_blank"><code>#/named</code> - Named routes</a></li>
									</ul>
								</div>
								<div class="col-md-6">
									<h6>Dynamic Routes</h6>
									<ul>
										<li><a href="http://localhost:5054/#/user/123" target="_blank"><code>#/user/:id</code> - User profile</a></li>
										<li><a href="http://localhost:5054/#/author/John/Doe" target="_blank"><code>#/author/:first/:last</code> - Author</a></li>
										<li><a href="http://localhost:5054/#/book/guide" target="_blank"><code>#/book/*</code> - Book viewer</a></li>
									</ul>
								</div>
								<div class="col-md-6">
									<h6>Testing</h6>
									<ul>
										<li><a href="http://localhost:5054/#/wild" target="_blank">Wildcard routes</a></li>
										<li><a href="http://localhost:5054/#/not-found" target="_blank">404 handling</a></li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Running Examples Locally -->
		<section class="mb-5">
			<h2 class="mb-4">Running Examples Locally</h2>
			<p>You can run the examples on your local machine:</p>

			<div class="row g-4">
				<div class="col-md-6">
					<h5>Using Make (Recommended)</h5>
					<pre class="bg-dark text-light p-3 rounded"><code># History mode
make dev

# Hash mode
make dev-hash</code></pre>
				</div>

				<div class="col-md-6">
					<h5>Using npm</h5>
					<pre class="bg-dark text-light p-3 rounded"><code># History mode
cd example
npm install
npm run dev

# Hash mode
cd example-hash
npm install
npm run dev</code></pre>
				</div>
			</div>
		</section>

		<!-- Source Code -->
		<section class="mb-5">
			<h2 class="mb-4">Source Code</h2>
			<p>
				All example source code is available in the router repository:
			</p>

			<div class="row g-3">
				<div class="col-md-4">
					<div class="card">
						<div class="card-body">
							<h6 class="card-title">History Mode</h6>
							<p class="card-text small">Clean URL example with all features</p>
							<a href="https://github.com/keenmate/svelte-spa-router/tree/main/example" target="_blank" class="btn btn-sm btn-outline-dark">
								View on GitHub
							</a>
						</div>
					</div>
				</div>
				<div class="col-md-4">
					<div class="card">
						<div class="card-body">
							<h6 class="card-title">Hash Mode</h6>
							<p class="card-text small">Hash-based routing example</p>
							<a href="https://github.com/keenmate/svelte-spa-router/tree/main/example-hash" target="_blank" class="btn btn-sm btn-outline-dark">
								View on GitHub
							</a>
						</div>
					</div>
				</div>
				<div class="col-md-4">
					<div class="card">
						<div class="card-body">
							<h6 class="card-title">Permissions</h6>
							<p class="card-text small">Role-based access control example</p>
							<a href="https://github.com/keenmate/svelte-spa-router/tree/main/example-permissions" target="_blank" class="btn btn-sm btn-outline-dark">
								View on GitHub
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
						descriptionText="Try all the navigation demos to understand different use cases"
						variantType="primary"
					/>
				</div>
				<div class="col-md-6 col-lg-3">
					<FeatureCard
						iconEmoji="💻"
						titleText="View Source"
						descriptionText="Check the example source code to see implementation details"
						variantType="success"
					/>
				</div>
				<div class="col-md-6 col-lg-3">
					<FeatureCard
						iconEmoji="🛠️"
						titleText="Experiment"
						descriptionText="Modify the examples locally to test different scenarios"
						variantType="info"
					/>
				</div>
				<div class="col-md-6 col-lg-3">
					<FeatureCard
						iconEmoji="📖"
						titleText="Read Docs"
						descriptionText="Refer to feature pages for detailed explanations"
						variantType="warning"
					/>
				</div>
			</div>
		</section>
	</div>
</DocLayout>
