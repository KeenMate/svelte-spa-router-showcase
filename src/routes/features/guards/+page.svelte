<script>
import { DocLayout, CodeBlock } from '@keenmate/svelte-docs'
</script>

<DocLayout
	titleText="Navigation Guards"
	descriptionText="Prevent navigation when there's unsaved work or other conditions">

	<div class="py-1">
		<!-- Introduction -->
		<section class="mb-5">
			<h2 class="mb-4">What are Navigation Guards?</h2>
			<p class="lead">
				Navigation guards allow you to prevent or control navigation based on conditions.
				This is essential for warning users about unsaved changes, checking authentication,
				or validating state before leaving a page.
			</p>
		</section>

		<!-- Basic Usage -->
		<section class="mb-5">
			<h2 class="mb-4">Basic Usage</h2>
			<p>The navigation guard system provides three main APIs:</p>

			<ul>
				<li><code>registerBeforeLeave(handler)</code> - Register a guard function</li>
				<li><code>unregisterBeforeLeave(handler)</code> - Remove a guard function</li>
				<li><code>NavigationCancelledError</code> - Throw to cancel navigation</li>
			</ul>

			<h4 class="mt-4">Simple Example</h4>
			<CodeBlock
				codeContent={`<script>
import { registerBeforeLeave, unregisterBeforeLeave, NavigationCancelledError } from '@keenmate/svelte-spa-router/helpers/navigation-guard'
import { onMount, onDestroy } from 'svelte'

let formIsDirty = $state(false)

async function beforeLeave(ctx) {
  if (formIsDirty && !confirm("Leave with unsaved changes?")) {
    throw new NavigationCancelledError()
  }
}

onMount(() => registerBeforeLeave(beforeLeave))
onDestroy(() => unregisterBeforeLeave(beforeLeave))
</script>

<form>
  <input oninput={() => formIsDirty = true} />
</form>`}
				languageType="svelte"
				titleText="Basic navigation guard"
			/>
		</section>

		<!-- PageWrapper Pattern -->
		<section class="mb-5">
			<h2 class="mb-4">PageWrapper Pattern (Recommended)</h2>
			<p>
				Create a reusable wrapper component to simplify guard registration across your application.
			</p>

			<h4 class="mt-4">1. Create PageWrapper Component</h4>
			<CodeBlock
				codeContent={`<!-- PageWrapper.svelte -->
<script>
import { registerBeforeLeave, unregisterBeforeLeave } from '@keenmate/svelte-spa-router/helpers/navigation-guard'
import { onMount, onDestroy } from 'svelte'

let { beforeLeave = undefined, children } = $props()

onMount(() => {
  if (beforeLeave) {
    registerBeforeLeave(beforeLeave)
  }
})

onDestroy(() => {
  if (beforeLeave) {
    unregisterBeforeLeave(beforeLeave)
  }
})
</script>

{@render children?.()}`}
				languageType="svelte"
				titleText="PageWrapper.svelte"
			/>

			<h4 class="mt-4">2. Use in Your Pages</h4>
			<CodeBlock
				codeContent={`<!-- EditProfile.svelte -->
<script>
import PageWrapper from './PageWrapper.svelte'
import { NavigationCancelledError } from '@keenmate/svelte-spa-router/helpers/navigation-guard'

let formData = $state({ name: '', email: '' })
let formIsDirty = $state(false)

async function beforeLeave(ctx) {
  if (formIsDirty && !confirm(\`Leave "\${ctx.from}" with unsaved changes?\`)) {
    throw new NavigationCancelledError()
  }
}
</script>

<PageWrapper {beforeLeave}>
  <h1>Edit Profile</h1>
  <form>
    <input bind:value={formData.name} oninput={() => formIsDirty = true} />
    <input bind:value={formData.email} oninput={() => formIsDirty = true} />
  </form>
</PageWrapper>`}
				languageType="svelte"
				titleText="Using PageWrapper"
			/>
		</section>

		<!-- Navigation Context -->
		<section class="mb-5">
			<h2 class="mb-4">Navigation Context</h2>
			<p>
				The <code>beforeLeave</code> handler receives a context object with information about the navigation:
			</p>

			<CodeBlock
				codeContent={`interface NavigationContext {
  from: string       // Current route path
  to: string         // Destination route path
  params?: Record<string, string>
  querystring?: string
}

// Example usage
async function beforeLeave(ctx) {
  console.log(\`Navigating from \${ctx.from} to \${ctx.to}\`)
  console.log('Params:', ctx.params)
  console.log('Query:', ctx.querystring)

  // Make decisions based on context
  if (ctx.to === '/logout') {
    return // Allow logout navigation
  }

  if (formIsDirty) {
    throw new NavigationCancelledError()
  }
}`}
				languageType="typescript"
				titleText="Navigation context"
			/>
		</section>

		<!-- Helper Functions -->
		<section class="mb-5">
			<h2 class="mb-4">Helper Functions</h2>
			<p>
				The router provides helper functions for common guard scenarios:
			</p>

			<h4 class="mt-4">createDirtyCheckGuard</h4>
			<p>Simplifies creating guards for unsaved changes:</p>

			<CodeBlock
				codeContent={`<script>
import { registerBeforeLeave, unregisterBeforeLeave, createDirtyCheckGuard } from '@keenmate/svelte-spa-router/helpers/navigation-guard'
import { onMount, onDestroy } from 'svelte'

let formIsDirty = $state(false)

const beforeLeave = createDirtyCheckGuard(
  () => formIsDirty,
  "You have unsaved changes. Leave anyway?"
)

// Add isDirty for browser beforeunload warning
beforeLeave.isDirty = () => formIsDirty

onMount(() => registerBeforeLeave(beforeLeave))
onDestroy(() => unregisterBeforeLeave(beforeLeave))
</script>`}
				languageType="svelte"
				titleText="Using createDirtyCheckGuard"
			/>
		</section>

		<!-- Browser Navigation -->
		<section class="mb-5">
			<h2 class="mb-4">Browser Navigation & Page Close</h2>
			<p>
				Guards can also protect against browser back/forward buttons and page close events
				by adding an <code>isDirty</code> property to your guard function:
			</p>

			<CodeBlock
				codeContent={`const beforeLeave = async (ctx) => {
  if (formIsDirty && !confirm("Unsaved changes. Leave anyway?")) {
    throw new NavigationCancelledError()
  }
}

// Enable browser beforeunload warning
beforeLeave.isDirty = () => formIsDirty

// Now works with:
// - Router navigation (push, pop, link clicks)
// - Browser back/forward buttons
// - Closing tab/window
// - Refreshing page`}
				languageType="javascript"
				titleText="Browser navigation protection"
			/>

			<div class="alert alert-info mt-3">
				<strong>Note:</strong> The <code>isDirty</code> property only controls the browser's beforeunload event.
				For router navigation, the main guard function is still called.
			</div>
		</section>

		<!-- Multiple Guards -->
		<section class="mb-5">
			<h2 class="mb-4">Multiple Guards</h2>
			<p>
				You can register multiple guards on the same page. All guards must allow navigation for it to proceed:
			</p>

			<CodeBlock
				codeContent={`<script>
import { registerBeforeLeave, unregisterBeforeLeave, NavigationCancelledError } from '@keenmate/svelte-spa-router/helpers/navigation-guard'
import { onMount, onDestroy } from 'svelte'

let formIsDirty = $state(false)
let uploadInProgress = $state(false)

async function checkUnsavedChanges(ctx) {
  if (formIsDirty && !confirm("Unsaved changes. Leave anyway?")) {
    throw new NavigationCancelledError()
  }
}

async function checkUpload(ctx) {
  if (uploadInProgress) {
    alert("Upload in progress. Please wait.")
    throw new NavigationCancelledError()
  }
}

onMount(() => {
  registerBeforeLeave(checkUnsavedChanges)
  registerBeforeLeave(checkUpload)
})

onDestroy(() => {
  unregisterBeforeLeave(checkUnsavedChanges)
  unregisterBeforeLeave(checkUpload)
})
</script>`}
				languageType="svelte"
				titleText="Multiple guards"
			/>
		</section>

		<!-- Async Guards -->
		<section class="mb-5">
			<h2 class="mb-4">Async Guards</h2>
			<p>
				Guard functions can be asynchronous, allowing you to make API calls or perform
				complex validation:
			</p>

			<CodeBlock
				codeContent={`async function beforeLeave(ctx) {
  // Check if document is locked by another user
  const isLocked = await checkDocumentLock(documentId)

  if (isLocked) {
    alert("Document is locked by another user")
    throw new NavigationCancelledError()
  }

  // Save draft before leaving
  if (formIsDirty) {
    const shouldSave = confirm("Save changes before leaving?")
    if (shouldSave) {
      await saveDraft(formData)
    }
  }
}`}
				languageType="javascript"
				titleText="Async guard"
			/>
		</section>

		<!-- Conditional Guards -->
		<section class="mb-5">
			<h2 class="mb-4">Conditional Guards</h2>
			<p>
				You can conditionally apply guards based on the destination or other factors:
			</p>

			<CodeBlock
				codeContent={`async function beforeLeave(ctx) {
  // Allow navigation to logout
  if (ctx.to === '/logout') {
    return
  }

  // Allow navigation to save page
  if (ctx.to === '/save') {
    return
  }

  // Block all other navigation if dirty
  if (formIsDirty) {
    throw new NavigationCancelledError()
  }
}`}
				languageType="javascript"
				titleText="Conditional guard"
			/>
		</section>

		<!-- Practical Examples -->
		<section class="mb-5">
			<h2 class="mb-4">Practical Examples</h2>

			<h4>Form with Auto-Save</h4>
			<CodeBlock
				codeContent={`<script>
import PageWrapper from './PageWrapper.svelte'
import { NavigationCancelledError } from '@keenmate/svelte-spa-router/helpers/navigation-guard'

let formData = $state({ title: '', content: '' })
let isDirty = $state(false)
let isSaving = $state(false)

async function beforeLeave(ctx) {
  if (isDirty && !isSaving) {
    const save = confirm("Save changes before leaving?")
    if (save) {
      isSaving = true
      await saveForm(formData)
      isSaving = false
      isDirty = false
    }
  }
}

beforeLeave.isDirty = () => isDirty
</script>

<PageWrapper {beforeLeave}>
  <form>
    <input bind:value={formData.title} oninput={() => isDirty = true} />
    <textarea bind:value={formData.content} oninput={() => isDirty = true} />
  </form>
</PageWrapper>`}
				languageType="svelte"
				titleText="Auto-save on navigate"
			/>

			<h4>Multi-Step Form</h4>
			<CodeBlock
				codeContent={`<script>
import PageWrapper from './PageWrapper.svelte'
import { NavigationCancelledError } from '@keenmate/svelte-spa-router/helpers/navigation-guard'

let currentStep = $state(1)
let formStarted = $state(false)

async function beforeLeave(ctx) {
  if (formStarted && currentStep < 3) {
    const leave = confirm(\`You're on step \${currentStep} of 3. Leave anyway?\`)
    if (!leave) {
      throw new NavigationCancelledError()
    }
  }
}
</script>

<PageWrapper {beforeLeave}>
  <h1>Multi-Step Form - Step {currentStep}</h1>
  <!-- Form steps here -->
</PageWrapper>`}
				languageType="svelte"
				titleText="Multi-step form guard"
			/>
		</section>

		<!-- Best Practices -->
		<section class="mb-5">
			<h2 class="mb-4">Best Practices</h2>

			<div class="alert alert-warning">
				<h5>Always Unregister Guards</h5>
				<p class="mb-0">
					Make sure to unregister guards in <code>onDestroy</code> to prevent memory leaks
					and unexpected behavior when the component unmounts.
				</p>
			</div>

			<div class="alert alert-info mt-3">
				<h5>Use untrack() in $effect</h5>
				<p class="mb-0">
					If registering guards in a <code>$effect</code>, wrap the registration in <code>untrack()</code>
					to prevent infinite loops from reactive dependencies.
				</p>
			</div>

			<CodeBlock
				codeContent={`import { untrack } from 'svelte'

$effect(() => {
  if (demoMode === 'direct') {
    untrack(() => registerBeforeLeave(beforeLeave))
    return () => untrack(() => unregisterBeforeLeave(beforeLeave))
  }
})`}
				languageType="javascript"
				titleText="Using untrack() in effects"
			/>

			<div class="alert alert-success mt-3">
				<h5>Provide Clear Messages</h5>
				<p class="mb-0">
					Always explain to users why navigation is being blocked and what they need to do.
					Generic "Are you sure?" messages provide poor UX.
				</p>
			</div>
		</section>

		<!-- Live Demo -->
		<section class="mb-5">
			<h2 class="mb-4">Try It Live</h2>
			<p>See navigation guards in action with our interactive demo:</p>
			<div class="d-flex gap-3 flex-wrap">
				<a href="http://localhost:5050/navigation-guard-demo" target="_blank" class="btn btn-primary">
					🛡️ Navigation Guard Demo
				</a>
			</div>
		</section>
	</div>
</DocLayout>
