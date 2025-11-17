<script>
import { DocLayout, CodeBlock } from '@keenmate/svelte-docs'
</script>

<DocLayout
	titleText="Global Error Handling"
	descriptionText="Comprehensive error handling system with automatic recovery strategies">

	<div class="py-1">
		<!-- Introduction -->
		<section class="mb-5">
			<h2 class="mb-4">Overview</h2>
			<p class="lead">
				The router provides a global error handling system that catches unhandled errors throughout
				your application and executes configured recovery strategies. It includes restart loop prevention,
				error filtering, and customizable error UI.
			</p>
			<div class="alert alert-info">
				The error handler uses sessionStorage to track restart attempts and prevent infinite loops.
				It automatically resets after successful navigation.
			</div>
		</section>

		<!-- Quick Start -->
		<section class="mb-5">
			<h2 class="mb-4">Quick Start</h2>

			<h4>1. Configure Error Handler</h4>
			<CodeBlock
				codeContent={`// main.js
import { configureGlobalErrorHandler } from '@keenmate/svelte-spa-router/helpers/error-handler'

configureGlobalErrorHandler({
  maxRestarts: 3,
  strategy: 'navigateSafe',
  safeRoute: '/',
  showToast: true
})`}
				languageType="javascript"
				titleText="Configure in main.js"
			/>

			<h4 class="mt-4">2. Add GlobalErrorHandler Component</h4>
			<CodeBlock
				codeContent={`<!-- App.svelte -->
<script>
import Router from '@keenmate/svelte-spa-router'
import { GlobalErrorHandler } from '@keenmate/svelte-spa-router/helpers/GlobalErrorHandler'
import { routes } from './routes'
<\/script>

<GlobalErrorHandler />
<Router {routes} />

<style>
/* Your styles */
<\/style>`}
				languageType="svelte"
				titleText="Add to App.svelte"
			/>

			<p class="mt-3">
				The <code>GlobalErrorHandler</code> component listens for all unhandled errors and executes
				the configured recovery strategy.
			</p>
		</section>

		<!-- Recovery Strategies -->
		<section class="mb-5">
			<h2 class="mb-4">Recovery Strategies</h2>

			<h4>navigateSafe - Navigate to Safe Route (Default)</h4>
			<p>Attempts to navigate to a known-good route when an error occurs:</p>
			<CodeBlock
				codeContent={`configureGlobalErrorHandler({
  strategy: 'navigateSafe',
  safeRoute: '/',  // Navigate to home page
  maxRestarts: 3,
  showToast: true  // Show error toast notification
})`}
				languageType="javascript"
				titleText="Navigate to safe route"
			/>
			<div class="alert alert-secondary mt-2">
				<strong>Use when:</strong> You have a reliable landing page that always works
			</div>

			<h4 class="mt-4">restart - Full Application Restart</h4>
			<p>Reloads the entire application (hard refresh):</p>
			<CodeBlock
				codeContent={`configureGlobalErrorHandler({
  strategy: 'restart',
  maxRestarts: 2,  // Prevent infinite restart loops
  showToast: true
})`}
				languageType="javascript"
				titleText="Restart application"
			/>
			<div class="alert alert-secondary mt-2">
				<strong>Use when:</strong> Errors are likely due to stale state that a refresh would fix
			</div>

			<h4 class="mt-4">showError - Display Error UI</h4>
			<p>Shows a full-page error display with recovery options:</p>
			<CodeBlock
				codeContent={`configureGlobalErrorHandler({
  strategy: 'showError',
  maxRestarts: 3,
  ErrorComponent: CustomErrorDisplay  // Optional custom error component
})`}
				languageType="javascript"
				titleText="Show error UI"
			/>
			<div class="alert alert-secondary mt-2">
				<strong>Use when:</strong> You want users to see the error and choose their own recovery action
			</div>

			<h4 class="mt-4">custom - Custom Error Handler</h4>
			<p>Implement your own error handling logic:</p>
			<CodeBlock
				codeContent={`configureGlobalErrorHandler({
  strategy: 'custom',
  customHandler: (error, errorInfo) => {
    // Log to error tracking service
    console.error('Application error:', error, errorInfo)

    // Send to analytics
    analytics.track('error', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    })

    // Navigate to error page
    push('/error', {}, { error: error.message })
  }
})`}
				languageType="javascript"
				titleText="Custom error handler"
			/>
		</section>

		<!-- Configuration Options -->
		<section class="mb-5">
			<h2 class="mb-4">Configuration Options</h2>

			<table class="table table-bordered">
				<thead>
					<tr>
						<th>Option</th>
						<th>Type</th>
						<th>Default</th>
						<th>Description</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td><code>strategy</code></td>
						<td>string</td>
						<td>'navigateSafe'</td>
						<td>Recovery strategy: 'navigateSafe', 'restart', 'showError', or 'custom'</td>
					</tr>
					<tr>
						<td><code>maxRestarts</code></td>
						<td>number</td>
						<td>3</td>
						<td>Maximum restart attempts before showing error UI</td>
					</tr>
					<tr>
						<td><code>safeRoute</code></td>
						<td>string</td>
						<td>'/'</td>
						<td>Route to navigate to when using 'navigateSafe' strategy</td>
					</tr>
					<tr>
						<td><code>showToast</code></td>
						<td>boolean</td>
						<td>true</td>
						<td>Show toast notification when error occurs</td>
					</tr>
					<tr>
						<td><code>ErrorComponent</code></td>
						<td>Component</td>
						<td>ErrorDisplay</td>
						<td>Custom error display component</td>
					</tr>
					<tr>
						<td><code>customHandler</code></td>
						<td>Function</td>
						<td>undefined</td>
						<td>Custom error handler function (required for 'custom' strategy)</td>
					</tr>
					<tr>
						<td><code>errorFilter</code></td>
						<td>RegExp | string</td>
						<td>undefined</td>
						<td>Only handle errors matching this pattern</td>
					</tr>
				</tbody>
			</table>
		</section>

		<!-- Error Filtering -->
		<section class="mb-5">
			<h2 class="mb-4">Error Filtering</h2>
			<p>Filter which errors trigger the error handler:</p>

			<h4>Filter by Error Message</h4>
			<CodeBlock
				codeContent={`// Only handle network errors
configureGlobalErrorHandler({
  strategy: 'navigateSafe',
  safeRoute: '/offline',
  errorFilter: /network|fetch|connection/i
})`}
				languageType="javascript"
			/>

			<h4 class="mt-4">Filter by String Match</h4>
			<CodeBlock
				codeContent={`// Only handle specific error type
configureGlobalErrorHandler({
  strategy: 'showError',
  errorFilter: 'TypeError'
})`}
				languageType="javascript"
			/>

			<h4 class="mt-4">Ignore Specific Errors</h4>
			<CodeBlock
				codeContent={`// Handle all errors except ResizeObserver
configureGlobalErrorHandler({
  strategy: 'restart',
  errorFilter: (error) => {
    // Return false to ignore this error
    if (error.message.includes('ResizeObserver')) {
      return false
    }
    return true
  }
})`}
				languageType="javascript"
			/>
		</section>

		<!-- Restart Loop Prevention -->
		<section class="mb-5">
			<h2 class="mb-4">Restart Loop Prevention</h2>
			<p>
				The error handler uses sessionStorage to track restart attempts and prevent infinite loops:
			</p>

			<CodeBlock
				codeContent={`// When restart limit is reached, strategy switches to 'showError'
configureGlobalErrorHandler({
  strategy: 'restart',
  maxRestarts: 2  // After 2 restarts, show error UI instead
})`}
				languageType="javascript"
			/>

			<div class="alert alert-warning mt-3">
				<strong>Important:</strong> The restart counter is stored in sessionStorage under the key
				<code>__svelte_spa_router_restart_count</code>. It resets when:
				<ul class="mb-0">
					<li>User successfully navigates without errors</li>
					<li>User closes the browser tab</li>
					<li>User manually calls <code>canRestart()</code> and gets true</li>
				</ul>
			</div>
		</section>

		<!-- Helper Functions -->
		<section class="mb-5">
			<h2 class="mb-4">Helper Functions</h2>

			<h4>restart()</h4>
			<p>Manually trigger an application restart (respects maxRestarts limit):</p>
			<CodeBlock
				codeContent={`import { restart } from '@keenmate/svelte-spa-router/helpers/error-handler'

function handleCriticalError() {
  // Try to restart app
  if (restart()) {
    // Restart initiated
  } else {
    // Restart limit reached
    console.error('Cannot restart - limit reached')
  }
}`}
				languageType="javascript"
			/>

			<h4 class="mt-4">navigate()</h4>
			<p>Navigate to safe route (uses configured safeRoute):</p>
			<CodeBlock
				codeContent={`import { navigate } from '@keenmate/svelte-spa-router/helpers/error-handler'

function handleRecoverableError() {
  navigate()  // Go to safe route
}`}
				languageType="javascript"
			/>

			<h4 class="mt-4">showError()</h4>
			<p>Display the error UI component:</p>
			<CodeBlock
				codeContent={`import { showError } from '@keenmate/svelte-spa-router/helpers/error-handler'

function handleError(error) {
  showError(error, { componentStack: '...' })
}`}
				languageType="javascript"
			/>

			<h4 class="mt-4">canRestart()</h4>
			<p>Check if restart is still allowed:</p>
			<CodeBlock
				codeContent={`import { canRestart } from '@keenmate/svelte-spa-router/helpers/error-handler'

if (canRestart()) {
  // Show "Restart App" button
} else {
  // Hide restart option
}`}
				languageType="javascript"
			/>

			<h4 class="mt-4">getRestartCount()</h4>
			<p>Get current restart attempt count:</p>
			<CodeBlock
				codeContent={`import { getRestartCount } from '@keenmate/svelte-spa-router/helpers/error-handler'

const count = getRestartCount()
console.log(\`Restart attempts: \${count}\`)`}
				languageType="javascript"
			/>
		</section>

		<!-- Custom Error Component -->
		<section class="mb-5">
			<h2 class="mb-4">Custom Error Component</h2>
			<p>Create a custom error display component:</p>

			<CodeBlock
				codeContent={`<!-- CustomErrorDisplay.svelte -->
<script>
import { restart, navigate, canRestart } from '@keenmate/svelte-spa-router/helpers/error-handler'

let { error, errorInfo } = $props()
<\/script>

<div class="error-container">
  <h1>⚠️ Something Went Wrong</h1>
  <p>{error.message}</p>

  {#if import.meta.env.DEV}
    <details>
      <summary>Error Details</summary>
      <pre>{error.stack}</pre>
      <pre>{errorInfo.componentStack}</pre>
    </details>
  {/if}

  <div class="actions">
    <button onclick={() => navigate()}>Go Home</button>

    {#if canRestart()}
      <button onclick={() => restart()}>Restart App</button>
    {/if}
  </div>
</div>

<style>
.error-container {
  padding: 2rem;
  text-align: center;
  max-width: 600px;
  margin: 4rem auto;
}
.actions {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
}
</style>`}
				languageType="svelte"
				titleText="Custom error display component"
			/>

			<p class="mt-3">Use it in configuration:</p>
			<CodeBlock
				codeContent={`import { configureGlobalErrorHandler } from '@keenmate/svelte-spa-router/helpers/error-handler'
import CustomErrorDisplay from './CustomErrorDisplay.svelte'

configureGlobalErrorHandler({
  strategy: 'showError',
  ErrorComponent: CustomErrorDisplay
})`}
				languageType="javascript"
			/>
		</section>

		<!-- Integration with Error Tracking -->
		<section class="mb-5">
			<h2 class="mb-4">Integration with Error Tracking Services</h2>

			<h4>Sentry Integration</h4>
			<CodeBlock
				codeContent={`import * as Sentry from '@sentry/svelte'
import { configureGlobalErrorHandler } from '@keenmate/svelte-spa-router/helpers/error-handler'

configureGlobalErrorHandler({
  strategy: 'custom',
  customHandler: (error, errorInfo) => {
    // Send to Sentry
    Sentry.captureException(error, {
      contexts: {
        svelte: {
          componentStack: errorInfo.componentStack
        }
      }
    })

    // Then show error UI
    import { showError } from '@keenmate/svelte-spa-router/helpers/error-handler'
    showError(error, errorInfo)
  }
})`}
				languageType="javascript"
			/>

			<h4 class="mt-4">Custom Analytics</h4>
			<CodeBlock
				codeContent={`configureGlobalErrorHandler({
  strategy: 'navigateSafe',
  safeRoute: '/',
  customHandler: (error) => {
    // Log to analytics before recovery
    analytics.track('error_occurred', {
      error_message: error.message,
      error_type: error.name,
      stack_trace: error.stack,
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString()
    })
  }
})`}
				languageType="javascript"
			/>
		</section>

		<!-- Default Error Display -->
		<section class="mb-5">
			<h2 class="mb-4">Default Error Display</h2>
			<p>
				The router includes a default <code>ErrorDisplay.svelte</code> component with:
			</p>
			<ul>
				<li>Beautiful full-page error UI</li>
				<li>Error message and stack trace (dev mode only)</li>
				<li>Recovery action buttons (Go Home, Reload, Continue)</li>
				<li>Warning when multiple errors detected</li>
				<li>Responsive design</li>
			</ul>

			<div class="alert alert-info">
				The default error display automatically hides technical details (stack traces, component stack)
				in production mode to avoid leaking implementation details.
			</div>
		</section>

		<!-- Best Practices -->
		<section class="mb-5">
			<h2 class="mb-4">Best Practices</h2>

			<h4>1. Choose the Right Strategy</h4>
			<ul>
				<li><strong>navigateSafe</strong>: Best for most applications with a reliable home page</li>
				<li><strong>restart</strong>: Good for state corruption issues</li>
				<li><strong>showError</strong>: Best for development or when users need to report errors</li>
				<li><strong>custom</strong>: When you need full control (e.g., error tracking integration)</li>
			</ul>

			<h4 class="mt-4">2. Set Appropriate Restart Limits</h4>
			<CodeBlock
				codeContent={`// Too low - users might see error UI too quickly
maxRestarts: 1

// Good balance - allows retry but prevents loops
maxRestarts: 3

// Too high - might create frustrating restart loops
maxRestarts: 10`}
				languageType="javascript"
			/>

			<h4 class="mt-4">3. Filter Noise</h4>
			<p>Some errors are expected and shouldn't trigger recovery:</p>
			<CodeBlock
				codeContent={`configureGlobalErrorHandler({
  strategy: 'navigateSafe',
  errorFilter: (error) => {
    // Ignore ResizeObserver loop errors (browser quirk)
    if (error.message.includes('ResizeObserver loop')) {
      return false
    }

    // Ignore cancelled fetch requests
    if (error.name === 'AbortError') {
      return false
    }

    return true  // Handle all other errors
  }
})`}
				languageType="javascript"
			/>

			<h4 class="mt-4">4. Always Use GlobalErrorHandler Component</h4>
			<p>
				Don't forget to add <code>&lt;GlobalErrorHandler /&gt;</code> to your app root,
				otherwise errors won't be caught!
			</p>
		</section>

		<!-- Troubleshooting -->
		<section class="mb-5">
			<h2 class="mb-4">Troubleshooting</h2>

			<h4>Errors Not Being Caught</h4>
			<ul>
				<li>Verify <code>&lt;GlobalErrorHandler /&gt;</code> is in your App.svelte</li>
				<li>Check if errorFilter is blocking the error</li>
				<li>Ensure error handler is configured before app mount</li>
			</ul>

			<h4>Restart Loop</h4>
			<ul>
				<li>Lower maxRestarts value</li>
				<li>Check sessionStorage for <code>__svelte_spa_router_restart_count</code></li>
				<li>Verify the error isn't occurring on every route</li>
				<li>Consider using 'navigateSafe' instead of 'restart'</li>
			</ul>

			<h4>Custom Handler Not Called</h4>
			<CodeBlock
				codeContent={`// ❌ Wrong - strategy doesn't match
configureGlobalErrorHandler({
  strategy: 'restart',  // Won't call customHandler!
  customHandler: (error) => { ... }
})

// ✅ Correct
configureGlobalErrorHandler({
  strategy: 'custom',
  customHandler: (error) => { ... }
})`}
				languageType="javascript"
			/>
		</section>
	</div>
</DocLayout>
