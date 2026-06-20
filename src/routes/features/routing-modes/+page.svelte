<script>
import { DocLayout, ShowcaseSection, CodeBlock } from '@keenmate/svelte-docs'
</script>

<DocLayout
	titleText="Routing Modes"
	descriptionText="Understanding hash mode and history mode routing">

	<div class="py-1">
		<div class="alert alert-info mb-4">
			<strong>Live demos — same app, different mode:</strong>
			<ul class="mb-0 mt-2">
				<li>
					<a href="https://history.svelte-spa-router.keenmate.dev" target="_blank">History mode</a> —
					clean URLs (<code>/about</code>)
				</li>
				<li>
					<a href="https://hash.svelte-spa-router.keenmate.dev" target="_blank">Hash mode</a> —
					hash URLs (<code>#/about</code>)
				</li>
			</ul>
		</div>

		<!-- Introduction -->
		<section class="mb-5">
			<h2 class="mb-4">Two Routing Modes</h2>
			<p class="lead">
				@keenmate/svelte-spa-router supports two routing modes: <strong>Hash Mode</strong> and <strong>History Mode</strong>.
				Each has its own advantages and use cases.
			</p>
		</section>

		<!-- Hash Mode -->
		<section class="mb-5">
			<h2 class="mb-4">Hash Mode (Default)</h2>
			<p>
				Hash mode uses the URL hash fragment for routing. URLs look like <code>http://example.com/#/about</code>.
				The hash portion (<code>#/about</code>) is handled client-side and never sent to the server.
			</p>

			<div class="row g-4 mt-3">
				<div class="col-md-6">
					<h4>Advantages</h4>
					<ul>
						<li><strong>No server configuration:</strong> Works out of the box</li>
						<li><strong>Static hosting friendly:</strong> Perfect for GitHub Pages, Netlify, etc.</li>
						<li><strong>Local development:</strong> Works with <code>file://</code> protocol</li>
						<li><strong>Simple deployment:</strong> No special server rules needed</li>
					</ul>
				</div>
				<div class="col-md-6">
					<h4>Disadvantages</h4>
					<ul>
						<li><strong>URLs have #:</strong> Less aesthetically pleasing</li>
						<li><strong>SEO concerns:</strong> Though modern search engines handle it</li>
						<li><strong>Link behavior:</strong> Ctrl+Click and target attribute don't work as expected</li>
					</ul>
				</div>
			</div>

			<h4 class="mt-4">Configuration</h4>
			<p>Hash mode is the default - no configuration needed!</p>

			<CodeBlock
				codeContent={`// main.js
import { mount } from 'svelte'
import App from './App.svelte'

// No configuration needed - hash mode is default
mount(App, { target: document.body })`}
				languageType="javascript"
				titleText="Hash mode (default)"
			/>

			<CodeBlock
				codeContent={`<!-- App.svelte -->
<script>
import Router from '@keenmate/svelte-spa-router'
import { routes } from './routes'
</script>

<Router {routes} />`}
				languageType="svelte"
				titleText="App.svelte"
			/>

			<div class="alert alert-info mt-3">
				<h5>Example URLs in Hash Mode</h5>
				<ul class="mb-0">
					<li><code>http://localhost:5054/#/</code> - Home</li>
					<li><code>http://localhost:5054/#/about</code> - About page</li>
					<li><code>http://localhost:5054/#/user/123</code> - User profile</li>
					<li><code>http://localhost:5054/#/products?search=laptop</code> - Products with query</li>
				</ul>
			</div>

			<div class="mt-3">
				<a href="http://localhost:5054" target="_blank" class="btn btn-primary">
					🔗 View Hash Mode Example
				</a>
			</div>
		</section>

		<!-- History Mode -->
		<section class="mb-5">
			<h2 class="mb-4">History Mode</h2>
			<p>
				History mode uses the HTML5 History API for clean URLs like <code>http://example.com/about</code>.
				This provides a better user experience but requires server configuration.
			</p>

			<div class="row g-4 mt-3">
				<div class="col-md-6">
					<h4>Advantages</h4>
					<ul>
						<li><strong>Clean URLs:</strong> No hash symbol in URLs</li>
						<li><strong>Better SEO:</strong> Search engines prefer clean URLs</li>
						<li><strong>Better UX:</strong> More professional appearance</li>
						<li><strong>Link behavior:</strong> Ctrl+Click and target attributes work correctly</li>
					</ul>
				</div>
				<div class="col-md-6">
					<h4>Disadvantages</h4>
					<ul>
						<li><strong>Server configuration required:</strong> Must serve index.html for all routes</li>
						<li><strong>Deployment complexity:</strong> Needs proper server setup</li>
						<li><strong>No file:// support:</strong> Doesn't work with local files</li>
					</ul>
				</div>
			</div>

			<h4 class="mt-4">Configuration</h4>
			<p>Enable history mode in your main.js before mounting the app:</p>

			<CodeBlock
				codeContent={`// main.js
import { mount } from 'svelte'
import { setHashRoutingEnabled, setBasePath } from '@keenmate/svelte-spa-router'
import App from './App.svelte'

// Enable history mode
setHashRoutingEnabled(false)
setBasePath(import.meta.env.BASE_URL || '/')

mount(App, { target: document.body })`}
				languageType="javascript"
				titleText="History mode configuration"
			/>

			<div class="alert alert-info mt-3">
				<h5>Example URLs in History Mode</h5>
				<ul class="mb-0">
					<li><code>http://localhost:5050/</code> - Home</li>
					<li><code>http://localhost:5050/about</code> - About page</li>
					<li><code>http://localhost:5050/user/123</code> - User profile</li>
					<li><code>http://localhost:5050/products?search=laptop</code> - Products with query</li>
				</ul>
			</div>

			<div class="mt-3">
				<a href="http://localhost:5050" target="_blank" class="btn btn-primary">
					🚀 View History Mode Example
				</a>
			</div>
		</section>

		<!-- Server Configuration -->
		<section class="mb-5">
			<h2 class="mb-4">Server Configuration for History Mode</h2>
			<p>
				For history mode to work, your server must serve <code>index.html</code> for all routes.
				This is because the client-side router needs to handle the routing, not the server.
			</p>

			<h4 class="mt-4">Nginx</h4>
			<CodeBlock
				codeContent={`server {
    listen 80;
    server_name example.com;
    root /var/www/html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}`}
				languageType="nginx"
				titleText="nginx.conf"
			/>

			<h4 class="mt-4">Apache</h4>
			<CodeBlock
				codeContent={`<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>`}
				languageType="apache"
				titleText=".htaccess"
			/>

			<h4 class="mt-4">Express.js</h4>
			<CodeBlock
				codeContent={`const express = require('express')
const path = require('path')
const app = express()

// Serve static files
app.use(express.static('dist'))

// All routes serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(3000)`}
				languageType="javascript"
				titleText="server.js"
			/>

			<h4 class="mt-4">Vite Development Server</h4>
			<p>Vite handles this automatically in development mode. For production, configure your hosting provider.</p>
			<CodeBlock
				codeContent={`// vite.config.js
export default {
    // Vite automatically handles SPA routing in dev mode
    // For production, use appropriate server config above
}`}
				languageType="javascript"
				titleText="vite.config.js"
			/>
		</section>

		<!-- Base Path -->
		<section class="mb-5">
			<h2 class="mb-4">Base Path Configuration</h2>
			<p>
				If your app is served from a subdirectory (e.g., <code>http://example.com/app/</code>),
				you need to configure the base path.
			</p>

			<CodeBlock
				codeContent={`// main.js
import { setHashRoutingEnabled, setBasePath } from '@keenmate/svelte-spa-router'

setHashRoutingEnabled(false)
setBasePath('/app')  // Your subdirectory

// Also configure in vite.config.js
// export default {
//   base: '/app/'
// }`}
				languageType="javascript"
				titleText="Base path configuration"
			/>

			<div class="alert alert-warning mt-3">
				<strong>Important:</strong> Make sure the base path in your router configuration matches
				the base path in your build tool configuration (Vite, webpack, etc.).
			</div>
		</section>

		<!-- Choosing Between Modes -->
		<section class="mb-5">
			<h2 class="mb-4">Which Mode Should I Use?</h2>

			<div class="row g-4">
				<div class="col-md-6">
					<div class="card h-100 border-primary">
						<div class="card-header bg-primary text-white">
							<h5 class="mb-0">Use Hash Mode When:</h5>
						</div>
						<div class="card-body">
							<ul class="mb-0">
								<li>Deploying to static hosting (GitHub Pages, Netlify, S3)</li>
								<li>You don't have control over server configuration</li>
								<li>You need to support file:// protocol</li>
								<li>You want zero-configuration deployment</li>
								<li>SEO is not a primary concern</li>
							</ul>
						</div>
					</div>
				</div>

				<div class="col-md-6">
					<div class="card h-100 border-success">
						<div class="card-header bg-success text-white">
							<h5 class="mb-0">Use History Mode When:</h5>
						</div>
						<div class="card-body">
							<ul class="mb-0">
								<li>You have control over server configuration</li>
								<li>Clean URLs are important for your application</li>
								<li>SEO is important</li>
								<li>You want the best user experience</li>
								<li>You're deploying to platforms that support SPA routing (Vercel, Netlify)</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Switching Between Modes -->
		<section class="mb-5">
			<h2 class="mb-4">Switching Between Modes</h2>
			<p>
				You can easily switch between modes by changing a single line in your <code>main.js</code>.
				The rest of your application code remains unchanged!
			</p>

			<CodeBlock
				codeContent={`// Switch to hash mode
setHashRoutingEnabled(true)

// Switch to history mode
setHashRoutingEnabled(false)`}
				languageType="javascript"
				titleText="Switching modes"
			/>

			<div class="alert alert-info mt-3">
				<strong>Pro Tip:</strong> You can use environment variables to automatically choose the mode:
				<CodeBlock
					codeContent={`// Use hash mode in development, history mode in production
const isDev = import.meta.env.DEV
setHashRoutingEnabled(isDev)

// Or use an environment variable
setHashRoutingEnabled(import.meta.env.VITE_USE_HASH_ROUTING === 'true')`}
					languageType="javascript"
					titleText="Environment-based configuration"
				/>
			</div>
		</section>
	</div>
</DocLayout>
