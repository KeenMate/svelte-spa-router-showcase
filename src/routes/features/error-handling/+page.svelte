<script>
import { DocLayout, CodeBlock } from '@keenmate/svelte-docs'
</script>

<DocLayout
	titleText="Global Error Handling"
	descriptionText="Catch unhandled errors with configurable recovery strategies, restart-loop prevention, and an optional full-page error UI">

	<div class="py-1">
		<!-- Intro -->
		<section class="mb-5">
			<h2 class="mb-4">Overview</h2>
			<p class="lead">
				<code>GlobalErrorHandler</code> wraps your app and catches all unhandled errors
				(<code>window.error</code> and <code>unhandledrejection</code>). On catch it runs your
				chosen recovery strategy and optionally renders a full-page error UI. SessionStorage-based
				loop prevention stops the strategy from running away.
			</p>
			<div class="alert alert-warning">
				<strong>⚠️ Breaking change in v5.2.0-rc02:</strong> the built-in error toast was removed
				entirely. The <code>showToast</code> config field is gone. Notification UI is now your
				responsibility — wire your favorite toast library inside the <code>onError</code> callback.
				See <a href="#toast-removed">below</a> for the migration recipe.
			</div>
			<div class="alert alert-info mt-3">
				<strong>Live demo:</strong>
				<a href="https://history.svelte-spa-router.keenmate.dev/error-handling-demo" target="_blank">
					Open <code>/error-handling-demo</code> →
				</a>
			</div>
		</section>

		<!-- Quick Start -->
		<section class="mb-5">
			<h2 class="mb-4">Quick Start</h2>

			<h4>1. Configure in <code>main.js</code></h4>
			<CodeBlock
				codeContent={`import { configureGlobalErrorHandler } from '@keenmate/svelte-spa-router/helpers/error-handler'

configureGlobalErrorHandler({
  strategy: 'navigateSafe',
  safeRoute: '/',
  maxRestarts: 3,
  restartWindow: 60000,
  // Wire your own toast / monitoring inside onError
  onError: (error, errorInfo, context) => {
    console.error('Caught error:', error)
    // Sentry.captureException(error)
    // toast.error(error.message)
  },
  ignoreErrors: [/ResizeObserver loop/i]
})`}
				languageType="javascript"
				titleText="Configure in main.js"
			/>

			<h4 class="mt-4">2. Wrap your app with <code>GlobalErrorHandler</code></h4>
			<p>
				<code>GlobalErrorHandler</code> is a <strong>wrapper</strong> — pass your app content as
				children, not as a sibling.
			</p>
			<CodeBlock
				codeContent={`<!-- App.svelte -->
<script>
import Router from '@keenmate/svelte-spa-router'
import GlobalErrorHandler from '@keenmate/svelte-spa-router/helpers/GlobalErrorHandler'
import { routes } from './routes'
</script>

<GlobalErrorHandler>
  <Router {routes} />
</GlobalErrorHandler>`}
				languageType="svelte"
				titleText="App.svelte"
			/>
		</section>

		<!-- Recovery Strategies -->
		<section class="mb-5">
			<h2 class="mb-4">Recovery strategies</h2>

			<h4><code>navigateSafe</code> — navigate to a known-good route (default)</h4>
			<p>Pushes <code>safeRoute</code> when an error fires. Best for most apps with a reliable landing page.</p>
			<CodeBlock
				codeContent={`configureGlobalErrorHandler({
  strategy: 'navigateSafe',
  safeRoute: '/',
  maxRestarts: 3
})`}
				languageType="javascript"
			/>

			<h4 class="mt-4"><code>restart</code> — full app reload</h4>
			<p>
				Hard-refreshes the page. Useful when errors are likely due to corrupted in-memory state.
				The <code>autoRestart</code> + <code>restartDelay</code> options control whether the reload
				is automatic or user-triggered.
			</p>
			<CodeBlock
				codeContent={`configureGlobalErrorHandler({
  strategy: 'restart',
  autoRestart: true,
  restartDelay: 5000,   // 5s before reload
  maxRestarts: 2,
  restartWindow: 60000
})`}
				languageType="javascript"
			/>

			<h4 class="mt-4"><code>showError</code> — full-page error UI</h4>
			<p>
				Renders the error component (built-in <code>ErrorDisplay</code> by default, or your own via
				the <code>errorComponent</code> snippet prop on <code>GlobalErrorHandler</code>). The user
				picks their own recovery path.
			</p>
			<CodeBlock
				codeContent={`configureGlobalErrorHandler({
  strategy: 'showError',
  showErrorComponent: true
})`}
				languageType="javascript"
			/>

			<h4 class="mt-4"><code>custom</code> — run your own recovery</h4>
			<p>
				The router catches the error, then hands it to your <code>onRecover</code> callback with
				helpers for restart / navigate / show-error so you can decide what to do.
			</p>
			<CodeBlock
				codeContent={`configureGlobalErrorHandler({
  strategy: 'custom',
  onRecover: (error, errorInfo, context, helpers) => {
    if (error.name === 'NetworkError') {
      helpers.navigate('/offline')
    } else if (context.sessionErrors.length >= 3) {
      helpers.restart()
    } else {
      helpers.showError()
    }
  }
})`}
				languageType="javascript"
			/>
		</section>

		<!-- Toast removed (rc02) -->
		<section class="mb-5" id="toast-removed">
			<h2 class="mb-4">⚠️ <code>showToast</code> removed in v5.2.0-rc02</h2>
			<p>
				Previously the library rendered a built-in <code>&lt;div class="error-toast"&gt;</code> on
				caught errors, gated by <code>showToast</code> (default <code>true</code>). The render
				guard was broken under the default <code>navigateSafe</code> strategy: it called
				<code>clearError()</code> synchronously after <code>push()</code> in the same handler tick,
				so by the time Svelte's reactive system flushed <code>toastVisible = true</code>, the
				error state was already gone and the toast never rendered.
			</p>
			<p>
				Rather than patch the broken interaction, the toast was removed. Every app already has a
				preferred toast/snackbar library — the router's job is to surface the event, not paint pixels.
			</p>
			<CodeBlock
				codeContent={`// ❌ rc01 and earlier
configureGlobalErrorHandler({
  strategy: 'navigateSafe',
  safeRoute: '/',
  showToast: true,        // ← removed
  toastDuration: 5000     // ← removed
})

// ✅ rc02 — toast lives in onError
import { toast } from 'your-toast-lib'

configureGlobalErrorHandler({
  strategy: 'navigateSafe',
  safeRoute: '/',
  onError: (error, errorInfo, context) => {
    toast.error(error.message)
  }
})`}
				languageType="javascript"
				titleText="Migration from showToast"
			/>
			<p>
				<strong>TypeScript will flag the now-unknown property</strong>, so a typecheck after upgrade
				is the easiest way to find every call site that needs updating.
			</p>
		</section>

		<!-- Configuration Options -->
		<section class="mb-5">
			<h2 class="mb-4">Configuration options</h2>
			<div class="table-responsive">
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
							<td><code>'navigateSafe' | 'restart' | 'showError' | 'custom'</code></td>
							<td><code>'navigateSafe'</code></td>
							<td>Recovery behavior on caught error</td>
						</tr>
						<tr>
							<td><code>safeRoute</code></td>
							<td><code>string</code></td>
							<td><code>'/'</code></td>
							<td>Used by <code>navigateSafe</code> strategy</td>
						</tr>
						<tr>
							<td><code>maxRestarts</code></td>
							<td><code>number</code></td>
							<td><code>3</code></td>
							<td>Max restarts allowed within <code>restartWindow</code></td>
						</tr>
						<tr>
							<td><code>restartWindow</code></td>
							<td><code>number</code> (ms)</td>
							<td><code>60000</code></td>
							<td>Sliding window for counting restarts</td>
						</tr>
						<tr>
							<td><code>autoRestart</code></td>
							<td><code>boolean</code></td>
							<td><code>false</code></td>
							<td>When <code>strategy: 'restart'</code>, restart automatically vs wait for user</td>
						</tr>
						<tr>
							<td><code>restartDelay</code></td>
							<td><code>number</code> (ms)</td>
							<td><code>5000</code></td>
							<td>Delay before auto-restart fires</td>
						</tr>
						<tr>
							<td><code>showErrorComponent</code></td>
							<td><code>boolean</code></td>
							<td><code>false</code></td>
							<td>Render the full-page error UI when an error is active</td>
						</tr>
						<tr>
							<td><code>onError</code></td>
							<td><code>(error, errorInfo, context) =&gt; void</code></td>
							<td>—</td>
							<td>Logging / monitoring hook. Fires on every catch, independent of strategy. <strong>This is where your toast library goes.</strong></td>
						</tr>
						<tr>
							<td><code>onRecover</code></td>
							<td><code>(error, errorInfo, context, helpers) =&gt; void</code></td>
							<td>—</td>
							<td>Recovery callback. Only fires when <code>strategy: 'custom'</code>.</td>
						</tr>
						<tr>
							<td><code>ignoreErrors</code></td>
							<td><code>(RegExp | string)[]</code></td>
							<td><code>[]</code></td>
							<td>Errors matching any pattern are silently dropped (no <code>onError</code>, no recovery)</td>
						</tr>
						<tr>
							<td><code>isDevelopment</code></td>
							<td><code>boolean</code></td>
							<td><code>false</code></td>
							<td>Default <code>ErrorDisplay</code> shows stack traces only when <code>true</code></td>
						</tr>
					</tbody>
				</table>
			</div>
		</section>

		<!-- Filtering -->
		<section class="mb-5">
			<h2 class="mb-4">Filtering noisy errors with <code>ignoreErrors</code></h2>
			<p>
				Pass an array of patterns. Matching errors never reach <code>onError</code> or the
				recovery strategy — they're treated as if they hadn't been thrown.
			</p>
			<CodeBlock
				codeContent={`configureGlobalErrorHandler({
  strategy: 'navigateSafe',
  ignoreErrors: [
    /ResizeObserver loop/i,           // browser quirk
    /NetworkError when attempting/,   // user offline
    'AbortError',                     // cancelled fetches
    /ChunkLoadError/                  // stale chunk, user will reload anyway
  ]
})`}
				languageType="javascript"
				titleText="Common ignore patterns"
			/>
		</section>

		<!-- Restart Loop Prevention -->
		<section class="mb-5">
			<h2 class="mb-4">Restart loop prevention</h2>
			<p>
				When an error keeps firing during recovery (e.g. a broken initialization that breaks
				<code>safeRoute</code> too), the restart counter prevents infinite loops. Counts live
				in <code>sessionStorage</code> under <code>__svelte_spa_router_restart_count</code> and
				expire after <code>restartWindow</code>.
			</p>
			<CodeBlock
				codeContent={`configureGlobalErrorHandler({
  strategy: 'restart',
  autoRestart: true,
  maxRestarts: 2,
  restartWindow: 60000
})

// After 2 restarts in 60s, restart() returns false and the next
// recovery falls through to showing the error component.`}
				languageType="javascript"
			/>
			<p class="mt-3">The counter resets when:</p>
			<ul>
				<li>The user navigates without an error</li>
				<li>The browser tab is closed (sessionStorage scope)</li>
				<li>The window passes without new restarts</li>
			</ul>
		</section>

		<!-- Helper Functions -->
		<section class="mb-5">
			<h2 class="mb-4">Helper functions</h2>
			<p>
				All exported from <code>@keenmate/svelte-spa-router/helpers/error-handler</code>. Inside
				<code>onRecover</code>, the same helpers are passed as the <code>helpers</code> argument.
			</p>

			<h4><code>restart()</code></h4>
			<p>Trigger a restart, respecting <code>maxRestarts</code>. Returns <code>true</code> if it actually restarted, <code>false</code> if rate-limited.</p>
			<CodeBlock
				codeContent={`import { restart } from '@keenmate/svelte-spa-router/helpers/error-handler'

if (!restart()) {
  console.warn('Restart limit reached — falling back to error UI')
}`}
				languageType="javascript"
			/>

			<h4 class="mt-4"><code>navigate(route)</code></h4>
			<p>Navigate to any route. Takes a path string argument (unlike <code>safeRoute</code>, which is configured once).</p>
			<CodeBlock
				codeContent={`import { navigate } from '@keenmate/svelte-spa-router/helpers/error-handler'

navigate('/offline')`}
				languageType="javascript"
			/>

			<h4 class="mt-4"><code>showError()</code></h4>
			<p>Force the full-page error UI to render (assumes <code>showErrorComponent: true</code> is configured).</p>

			<h4 class="mt-4"><code>canRestart()</code> / <code>getRestartCount()</code></h4>
			<p>Inspect the restart state — useful for gating a "Try again" button in your custom error component.</p>
			<CodeBlock
				codeContent={`import { canRestart, getRestartCount } from '@keenmate/svelte-spa-router/helpers/error-handler'

{#if canRestart()}
  <button onclick={() => restart()}>Restart ({getRestartCount()} / 3)</button>
{/if}`}
				languageType="svelte"
			/>
		</section>

		<!-- Custom Error Component -->
		<section class="mb-5">
			<h2 class="mb-4">Custom error UI via <code>errorComponent</code> snippet</h2>
			<p>
				Pass an <code>errorComponent</code> snippet to <code>GlobalErrorHandler</code>. The snippet
				receives an <code>ErrorComponentProps</code> argument with the error, the error info, and
				recovery callbacks bound to the configured strategy.
			</p>
			<CodeBlock
				codeContent={`<script>
import GlobalErrorHandler from '@keenmate/svelte-spa-router/helpers/GlobalErrorHandler'
import Router from '@keenmate/svelte-spa-router'
import { routes } from './routes'
</script>

<GlobalErrorHandler>
  {#snippet errorComponent({ error, errorInfo, onRestart, onNavigateSafe, onContinue, canRestart })}
    <div class="error-screen">
      <h1>⚠️ Something went wrong</h1>
      <p>{error.message}</p>

      {#if import.meta.env.DEV && errorInfo?.stack}
        <details>
          <summary>Stack trace</summary>
          <pre>{errorInfo.stack}</pre>
        </details>
      {/if}

      <div class="actions">
        <button onclick={onNavigateSafe}>Go home</button>
        {#if canRestart}
          <button onclick={onRestart}>Reload app</button>
        {/if}
        <button onclick={onContinue}>Continue anyway</button>
      </div>
    </div>
  {/snippet}

  <Router {routes} />
</GlobalErrorHandler>`}
				languageType="svelte"
				titleText="Custom error UI"
			/>
			<p>
				<strong>Snippet props</strong> (<code>ErrorComponentProps</code>):
				<code>error</code>, <code>errorInfo</code>, <code>onRestart</code>,
				<code>onNavigateSafe</code>, <code>onContinue</code>, <code>canRestart</code>.
			</p>
		</section>

		<!-- Integration -->
		<section class="mb-5">
			<h2 class="mb-4">Integration with error tracking</h2>

			<h4>Sentry</h4>
			<CodeBlock
				codeContent={`import * as Sentry from '@sentry/svelte'
import { configureGlobalErrorHandler } from '@keenmate/svelte-spa-router/helpers/error-handler'

configureGlobalErrorHandler({
  strategy: 'navigateSafe',
  safeRoute: '/',
  onError: (error, errorInfo, context) => {
    Sentry.captureException(error, {
      extra: {
        ...errorInfo,
        sessionErrorCount: context.sessionErrors.length
      }
    })
  }
})`}
				languageType="javascript"
			/>

			<h4 class="mt-4">Analytics + toast</h4>
			<CodeBlock
				codeContent={`import { toast } from 'svelte-french-toast'

configureGlobalErrorHandler({
  strategy: 'navigateSafe',
  safeRoute: '/',
  onError: (error, errorInfo) => {
    analytics.track('error_occurred', {
      message: error.message,
      type: error.name,
      route: errorInfo.route
    })
    toast.error(\`Oops: \${error.message}\`)
  }
})`}
				languageType="javascript"
			/>
		</section>

		<!-- Best Practices -->
		<section class="mb-5">
			<h2 class="mb-4">Best practices</h2>

			<h4>Pick the right strategy</h4>
			<ul>
				<li><strong><code>navigateSafe</code></strong> — most apps with a reliable home page</li>
				<li><strong><code>restart</code></strong> — stale-state issues that a reload would fix</li>
				<li><strong><code>showError</code></strong> — dev mode, or when you want users to choose recovery</li>
				<li><strong><code>custom</code></strong> — branching recovery logic (e.g. different routes per error type)</li>
			</ul>

			<h4 class="mt-4">Don't conflate logging and recovery</h4>
			<p>
				<code>onError</code> is for monitoring / toasts / analytics — fires on every catch
				regardless of strategy. <code>onRecover</code> is only for the <code>custom</code> strategy
				and decides what happens. Keep them separate.
			</p>

			<h4 class="mt-4">Always wrap with <code>GlobalErrorHandler</code></h4>
			<p>
				If your app content isn't inside <code>&lt;GlobalErrorHandler&gt;</code>, errors won't be
				caught. Wrapping at the root means it covers every route.
			</p>

			<h4 class="mt-4">Filter known-noisy errors</h4>
			<p>
				<code>ResizeObserver loop</code> and <code>AbortError</code> are textbook examples — neither
				is a real bug, both will trigger recovery if you don't ignore them.
			</p>
		</section>

		<!-- Troubleshooting -->
		<section class="mb-5">
			<h2 class="mb-4">Troubleshooting</h2>

			<h4>Errors aren't being caught</h4>
			<ul>
				<li>Verify your app content is <strong>inside</strong> <code>&lt;GlobalErrorHandler&gt;</code> (not a sibling)</li>
				<li>Check <code>ignoreErrors</code> — is the pattern accidentally matching the error you care about?</li>
				<li>Confirm <code>configureGlobalErrorHandler</code> ran before <code>mount(App, …)</code></li>
			</ul>

			<h4 class="mt-4"><code>onRecover</code> never fires</h4>
			<CodeBlock
				codeContent={`// ❌ Wrong — strategy isn't 'custom', so onRecover is ignored
configureGlobalErrorHandler({
  strategy: 'restart',
  onRecover: (error) => { /* never called */ }
})

// ✅ Correct
configureGlobalErrorHandler({
  strategy: 'custom',
  onRecover: (error, errorInfo, context, helpers) => { /* … */ }
})`}
				languageType="javascript"
			/>

			<h4 class="mt-4">Restart loop never stops</h4>
			<ul>
				<li>Lower <code>maxRestarts</code> (e.g. <code>2</code>)</li>
				<li>Clear sessionStorage manually during debugging: <code>delete sessionStorage.__svelte_spa_router_restart_count</code></li>
				<li>If the error fires on every route (including <code>safeRoute</code>), <code>navigateSafe</code> can't recover — switch to <code>showError</code> so the user can act</li>
			</ul>
		</section>
	</div>
</DocLayout>
