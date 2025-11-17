<script>
import { DocLayout, CodeBlock } from '@keenmate/svelte-docs'
</script>

<DocLayout
	titleText="Debug Logging"
	descriptionText="Category-based debug logging system for troubleshooting routing issues">

	<div class="py-1">
		<!-- Introduction -->
		<section class="mb-5">
			<h2 class="mb-4">Overview</h2>
			<p class="lead">
				The router includes a comprehensive debug logging system based on the <code>loglevel</code> library.
				It provides category-based logging with color-coded output and timestamps to help you troubleshoot
				routing issues during development.
			</p>
			<div class="alert alert-info">
				The logging system has zero overhead when disabled - logs are complete no-ops at the silent level.
				Enable it only during development for debugging purposes.
			</div>
		</section>

		<!-- Quick Start -->
		<section class="mb-5">
			<h2 class="mb-4">Quick Start</h2>
			<p>Enable all debug logging in your <code>main.js</code> before mounting your app:</p>

			<CodeBlock
				codeContent={`// main.js
import { enableLogging } from '@keenmate/svelte-spa-router/logger'

if (import.meta.env.DEV) {
  enableLogging()  // Sets all categories to debug level
}

// Mount your app...`}
				languageType="javascript"
				titleText="Enable debug logging"
			/>

			<p class="mt-3">
				This will show all router debug messages in your browser console with color-coded output:
			</p>

			<div class="alert alert-secondary">
				<code style="color: blue;">[14:23:45.123] [DEBUG] [ROUTER] Matched route: /user/:id</code><br/>
				<code style="color: green;">[14:23:45.234] [INFO] [ROUTER:NAVIGATION] Navigating to: /user/123</code><br/>
				<code style="color: darkorange;">[14:23:45.345] [WARN] [ROUTER:GUARDS] Guard failed for route</code><br/>
				<code style="color: red;">[14:23:45.456] [ERROR] [ROUTER:ERROR_HANDLER] Unhandled error</code>
			</div>
		</section>

		<!-- Logging Categories -->
		<section class="mb-5">
			<h2 class="mb-4">Logging Categories</h2>
			<p>The router uses 12 hierarchical logging categories:</p>

			<table class="table table-bordered">
				<thead>
					<tr>
						<th>Category</th>
						<th>Description</th>
						<th>Use Case</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><code>ROUTER</code></td>
						<td>Core routing pipeline and route matching</td>
						<td>Debug route matching issues and pipeline flow</td>
					</tr>
					<tr>
						<td><code>ROUTER:NAVIGATION</code></td>
						<td>push, pop, replace, goBack functions</td>
						<td>Track navigation function calls and parameters</td>
					</tr>
					<tr>
						<td><code>ROUTER:SCROLL</code></td>
						<td>Scroll restoration and position tracking</td>
						<td>Debug scroll position save/restore issues</td>
					</tr>
					<tr>
						<td><code>ROUTER:GUARDS</code></td>
						<td>Navigation guard evaluation</td>
						<td>Debug beforeLeave and route guard failures</td>
					</tr>
					<tr>
						<td><code>ROUTER:CONDITIONS</code></td>
						<td>Route condition/guard checks</td>
						<td>Debug async route condition failures</td>
					</tr>
					<tr>
						<td><code>ROUTER:HIERARCHY</code></td>
						<td>Hierarchical route inheritance</td>
						<td>Debug breadcrumb/permission inheritance</td>
					</tr>
					<tr>
						<td><code>ROUTER:PERMISSIONS</code></td>
						<td>Permission checking and authorization</td>
						<td>Debug permission failures and auth callbacks</td>
					</tr>
					<tr>
						<td><code>ROUTER:ROUTES</code></td>
						<td>Named routes and URL building</td>
						<td>Debug route registration and name resolution</td>
					</tr>
					<tr>
						<td><code>ROUTER:ZONES</code></td>
						<td>Multi-zone routing</td>
						<td>Debug zone-specific route matching</td>
					</tr>
					<tr>
						<td><code>ROUTER:METADATA</code></td>
						<td>Breadcrumbs and route metadata</td>
						<td>Debug metadata inheritance and updates</td>
					</tr>
					<tr>
						<td><code>ROUTER:ERROR_HANDLER</code></td>
						<td>Global error handling and recovery</td>
						<td>Debug error recovery strategies</td>
					</tr>
					<tr>
						<td><code>ROUTER:FILTERS</code></td>
						<td>Querystring filter parsing</td>
						<td>Debug filter extraction from querystrings</td>
					</tr>
				</tbody>
			</table>
		</section>

		<!-- Configuration API -->
		<section class="mb-5">
			<h2 class="mb-4">Configuration API</h2>

			<h4>Enable All Logging</h4>
			<CodeBlock
				codeContent={`import { enableLogging } from '@keenmate/svelte-spa-router/logger'

enableLogging()  // Sets all categories to 'debug' level`}
				languageType="javascript"
				titleText="enableLogging()"
			/>

			<h4 class="mt-4">Disable All Logging</h4>
			<CodeBlock
				codeContent={`import { disableLogging } from '@keenmate/svelte-spa-router/logger'

disableLogging()  // Sets all categories to 'silent' level`}
				languageType="javascript"
				titleText="disableLogging()"
			/>

			<h4 class="mt-4">Set Global Log Level</h4>
			<CodeBlock
				codeContent={`import { setLogLevel } from '@keenmate/svelte-spa-router/logger'

setLogLevel('warn')  // Only show warnings and errors
// Levels: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent'`}
				languageType="javascript"
				titleText="setLogLevel(level)"
			/>

			<h4 class="mt-4">Set Per-Category Log Level</h4>
			<CodeBlock
				codeContent={`import { disableLogging, setCategoryLevel } from '@keenmate/svelte-spa-router/logger'

disableLogging()  // Disable all

// Enable only specific categories
setCategoryLevel('ROUTER:SCROLL', 'debug')
setCategoryLevel('ROUTER:NAVIGATION', 'info')
setCategoryLevel('ROUTER:PERMISSIONS', 'warn')`}
				languageType="javascript"
				titleText="setCategoryLevel(category, level)"
			/>
		</section>

		<!-- Common Debugging Scenarios -->
		<section class="mb-5">
			<h2 class="mb-4">Common Debugging Scenarios</h2>

			<h4>Debug Route Not Found Issues</h4>
			<CodeBlock
				codeContent={`import { enableLogging, setCategoryLevel } from '@keenmate/svelte-spa-router/logger'

// Enable core router logging to see route matching
setCategoryLevel('ROUTER', 'debug')

// You'll see logs like:
// [DEBUG] [ROUTER] Matched route: /user/:id
// [DEBUG] [ROUTER] Route params: { id: '123' }
// [DEBUG] [ROUTER] No route matched for: /unknown-path`}
				languageType="javascript"
				titleText="Route matching debugging"
			/>

			<h4 class="mt-4">Debug Navigation Issues</h4>
			<CodeBlock
				codeContent={`import { setCategoryLevel } from '@keenmate/svelte-spa-router/logger'

// Enable navigation logging
setCategoryLevel('ROUTER:NAVIGATION', 'debug')

// Track all navigation calls
// [DEBUG] [ROUTER:NAVIGATION] push('/user/123', {...params})
// [DEBUG] [ROUTER:NAVIGATION] replace with route name: 'userDetail'
// [DEBUG] [ROUTER:NAVIGATION] Going back in history`}
				languageType="javascript"
				titleText="Navigation debugging"
			/>

			<h4 class="mt-4">Debug Permission Failures</h4>
			<CodeBlock
				codeContent={`import { setCategoryLevel } from '@keenmate/svelte-spa-router/logger'

// Enable permission logging
setCategoryLevel('ROUTER:PERMISSIONS', 'debug')

// See permission checks
// [DEBUG] [ROUTER:PERMISSIONS] Checking permissions: { any: ['admin.read'] }
// [WARN] [ROUTER:PERMISSIONS] Permission check failed
// [DEBUG] [ROUTER:PERMISSIONS] Running authorization callback`}
				languageType="javascript"
				titleText="Permission debugging"
			/>

			<h4 class="mt-4">Debug Scroll Restoration</h4>
			<CodeBlock
				codeContent={`import { setCategoryLevel } from '@keenmate/svelte-spa-router/logger'

// Enable scroll logging
setCategoryLevel('ROUTER:SCROLL', 'debug')

// Track scroll save/restore
// [DEBUG] [ROUTER:SCROLL] Saving scroll position: x=0, y=456
// [DEBUG] [ROUTER:SCROLL] Restoring scroll position: x=0, y=456
// [DEBUG] [ROUTER:SCROLL] Scroll restoration via goBack()`}
				languageType="javascript"
				titleText="Scroll debugging"
			/>
		</section>

		<!-- Output Format -->
		<section class="mb-5">
			<h2 class="mb-4">Output Format</h2>
			<p>All log messages follow a consistent format:</p>

			<div class="alert alert-secondary">
				<code>[HH:MM:SS.mmm] [LEVEL] [CATEGORY] message</code>
			</div>

			<ul>
				<li><strong>Timestamp</strong>: High-resolution time in <code>[HH:MM:SS.mmm]</code> format</li>
				<li><strong>Level</strong>: TRACE, DEBUG, INFO, WARN, ERROR</li>
				<li><strong>Category</strong>: Hierarchical category name (e.g., ROUTER:NAVIGATION)</li>
				<li><strong>Message</strong>: Descriptive log message with relevant data</li>
			</ul>

			<h4 class="mt-4">Color Coding</h4>
			<table class="table table-sm">
				<thead>
					<tr>
						<th>Level</th>
						<th>Color</th>
						<th>Use Case</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>DEBUG</td>
						<td><span style="color: blue;">■</span> Blue</td>
						<td>Detailed diagnostic information</td>
					</tr>
					<tr>
						<td>INFO</td>
						<td><span style="color: green;">■</span> Green</td>
						<td>General informational messages</td>
					</tr>
					<tr>
						<td>WARN</td>
						<td><span style="color: darkorange;">■</span> Orange</td>
						<td>Warning messages (potential issues)</td>
					</tr>
					<tr>
						<td>ERROR</td>
						<td><span style="color: red;">■</span> Red</td>
						<td>Error messages (actual problems)</td>
					</tr>
				</tbody>
			</table>
		</section>

		<!-- Best Practices -->
		<section class="mb-5">
			<h2 class="mb-4">Best Practices</h2>

			<h4>1. Enable Only in Development</h4>
			<CodeBlock
				codeContent={`// main.js
import { enableLogging } from '@keenmate/svelte-spa-router/logger'

if (import.meta.env.DEV) {
  enableLogging()
}

// Or with Vite:
if (import.meta.env.MODE === 'development') {
  enableLogging()
}`}
				languageType="javascript"
			/>

			<h4 class="mt-4">2. Use Category-Specific Logging</h4>
			<p>Instead of enabling all logging, enable only the categories you need:</p>
			<CodeBlock
				codeContent={`import { disableLogging, setCategoryLevel } from '@keenmate/svelte-spa-router/logger'

// Start with all logging disabled
disableLogging()

// Enable only what you need to debug
if (import.meta.env.DEV) {
  setCategoryLevel('ROUTER', 'debug')
  setCategoryLevel('ROUTER:NAVIGATION', 'info')
}`}
				languageType="javascript"
			/>

			<h4 class="mt-4">3. Different Levels for Different Categories</h4>
			<CodeBlock
				codeContent={`// Show everything for core router
setCategoryLevel('ROUTER', 'debug')

// Show only important navigation events
setCategoryLevel('ROUTER:NAVIGATION', 'info')

// Show only permission warnings/errors
setCategoryLevel('ROUTER:PERMISSIONS', 'warn')`}
				languageType="javascript"
			/>

			<h4 class="mt-4">4. Configuration Warnings Always Visible</h4>
			<p>
				Critical configuration warnings and errors are always displayed using <code>console.warn()</code>
				and <code>console.error()</code>, regardless of logging configuration. These indicate
				serious misconfigurations that need immediate attention.
			</p>
		</section>

		<!-- Performance Notes -->
		<section class="mb-5">
			<h2 class="mb-4">Performance</h2>
			<div class="alert alert-success">
				<strong>Zero overhead when disabled:</strong> When logging is disabled (default state or
				<code>disableLogging()</code>), all log calls are complete no-ops with negligible performance impact.
			</div>

			<p>The logger uses the lightweight <code>loglevel</code> library (~1KB minified) with the
			<code>loglevel-plugin-prefix</code> extension for timestamps and formatting.</p>

			<ul>
				<li>Library size: ~1KB (loglevel) + ~500B (prefix plugin)</li>
				<li>Runtime overhead when disabled: &lt;1μs per log call</li>
				<li>No bundle size impact - tree-shaken in production builds</li>
			</ul>
		</section>

		<!-- Implementation Details -->
		<section class="mb-5">
			<h2 class="mb-4">Implementation Details</h2>

			<h4>Library Choice</h4>
			<p>
				The router uses <code>loglevel</code> as its logging foundation because it:
			</p>
			<ul>
				<li>Is tiny (~1KB) and well-tested</li>
				<li>Has zero dependencies</li>
				<li>Supports log levels with proper filtering</li>
				<li>Works identically in all browsers</li>
				<li>Has excellent TypeScript support</li>
			</ul>

			<h4>Vendored Dependencies</h4>
			<p>
				The <code>loglevel</code> and <code>loglevel-plugin-prefix</code> libraries are vendored
				in <code>src/lib/vendor/loglevel/</code> to ensure consistent behavior across all environments.
				This follows the same pattern as <code>@keenmate/web-multiselect</code>.
			</p>

			<h4>Logger Structure</h4>
			<p>All logger instances are exported from <code>src/lib/logger.ts</code>:</p>
			<CodeBlock
				codeContent={`// logger.ts exports
export const routerLogger = log.getLogger('ROUTER')
export const navigationLogger = log.getLogger('ROUTER:NAVIGATION')
export const scrollLogger = log.getLogger('ROUTER:SCROLL')
// ... all 12 categories

// Public API
export { enableLogging, disableLogging, setLogLevel, setCategoryLevel }`}
				languageType="typescript"
			/>
		</section>

		<!-- Troubleshooting -->
		<section class="mb-5">
			<h2 class="mb-4">Troubleshooting</h2>

			<h4>Logs Not Appearing</h4>
			<ul>
				<li>Verify logging is enabled: <code>enableLogging()</code> or <code>setCategoryLevel(...)</code></li>
				<li>Check browser console filters - ensure "Debug" level is visible</li>
				<li>Verify import path: <code>@keenmate/svelte-spa-router/logger</code></li>
				<li>Check that you're calling logging config before app mount</li>
			</ul>

			<h4>Too Many Logs</h4>
			<ul>
				<li>Use <code>setLogLevel('info')</code> to reduce verbosity</li>
				<li>Enable only specific categories with <code>setCategoryLevel()</code></li>
				<li>Disable categories you don't need</li>
			</ul>

			<h4>Import Errors</h4>
			<CodeBlock
				codeContent={`// ❌ Wrong - old API
import { setDebugLoggingEnabled } from '@keenmate/svelte-spa-router/utils'

// ✅ Correct - new API
import { enableLogging, setCategoryLevel } from '@keenmate/svelte-spa-router/logger'`}
				languageType="javascript"
			/>
		</section>
	</div>
</DocLayout>
