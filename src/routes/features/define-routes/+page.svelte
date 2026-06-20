<script>
import { DocLayout, CodeBlock } from '@keenmate/svelte-docs'
</script>

<DocLayout
	titleText="Type-safe routes with defineRoutes()"
	descriptionText="Single source of truth for routes, navigation helpers, and URL builders — with full TypeScript inference">

<div class="py-1">

<section class="mb-5">
	<h2>What it gives you</h2>
	<p class="lead">
		<code>defineRoutes()</code> takes a single route definitions object and returns three things:
	</p>
	<ul>
		<li><strong><code>routes</code></strong> — the routes object for <code>&lt;Router&gt;</code></li>
		<li><strong><code>nav</code></strong> — navigation helpers (<code>nav.X.push(params)</code>, <code>nav.X.replace(params)</code>, <code>nav.X.link(params)</code>) with IDE autocomplete on route names <em>and</em> parameter names</li>
		<li><strong><code>paths</code></strong> — URL builders (<code>paths.X(params)</code>) for <code>href</code> attributes</li>
	</ul>
	<p>
		Parameter names are extracted from the path pattern <em>at the type level</em> —
		<code>'/user/:id'</code> infers <code>&#123; id: string | number &#125;</code>, and <code>paths.user(&#123; di: 1 &#125;)</code>
		(typo) fails at compile time. Calls <code>registerRoutes()</code> for you, so named navigation
		via <code>push('routeName')</code> still works.
	</p>
	<div class="alert alert-info" role="alert">
		<strong>Live demo:</strong>
		<a href="https://history.svelte-spa-router.keenmate.dev/define-routes-demo" target="_blank">
			Open <code>/define-routes-demo</code> →
		</a>
		Interactive playground showing path builders, nav helpers, and the link action format.
	</div>
</section>

<!-- Quick start -->
<section class="mb-5">
	<h2>Quick start</h2>
	<CodeBlock language="javascript" codeContent={`import { defineRoutes } from '@keenmate/svelte-spa-router/routes'
import Home from './routes/Home.svelte'
import User from './routes/User.svelte'

const { routes, nav, paths } = defineRoutes({
    home: {
        path: '/',
        component: Home
    },
    user: {
        path: '/user/:id',
        component: () => import('./routes/User.svelte')
    },
    documentDetail: {
        path: '/documents/:docId',
        component: () => import('./routes/DocumentDetail.svelte'),
        breadcrumbs: [
            { label: 'Home', path: '/' },
            { label: 'Documents', path: '/documents' },
            { label: 'Detail' }
        ]
    }
})

export { routes, nav, paths }`} titleText="routes.js" />

	<p>Then in your app shell:</p>
	<CodeBlock language="svelte" codeContent={`<script>
import Router from '@keenmate/svelte-spa-router'
import { routes } from './routes.js'
</script>

<Router {routes} />`} titleText="App.svelte" />
</section>

<!-- Type safety -->
<section class="mb-5">
	<h2>Compile-time safety</h2>
	<p>
		The big payoff is in TypeScript / TSX-strict JS. Mistyped route names and mistyped parameter
		names both become errors at the call site, not runtime <code>undefined</code>s.
	</p>
	<CodeBlock language="typescript" codeContent={`// ✅ Works
nav.user.push({ id: 123 })
paths.documentDetail({ docId: 'abc' })

// ❌ Type error — 'documentid' isn't a registered route
nav.documentid.push({ docId: 'abc' })

// ❌ Type error — parameter is 'docId', not 'documentId'
paths.documentDetail({ documentId: 'abc' })

// ❌ Type error — 'user' route requires { id }, not no args
nav.user.push()

// ❌ Type error — 'home' route accepts no params
paths.home({ extra: 'oops' })`} titleText="What the compiler catches" />

	<p>
		Inferred parameter types come from the <code>:slug</code> tokens in the path pattern.
		<code>'/orders/:orderId/items/:itemId'</code> infers
		<code>&#123; orderId: string | number; itemId: string | number &#125;</code>.
	</p>
</section>

<!-- nav helpers -->
<section class="mb-5">
	<h2>Navigation helpers (<code>nav</code>)</h2>
	<p>
		Each entry in <code>nav</code> exposes <code>push</code>, <code>replace</code>, and
		<code>link</code> — the same operations you'd call manually on <code>push</code>/<code>replace</code>
		from the main module, but with autocomplete bound to that specific route.
	</p>
	<CodeBlock language="javascript" codeContent={`// Push (adds history entry)
await nav.user.push({ id: 123 })
await nav.user.push({ id: 123 }, { tab: 'orders' })          // + query
await nav.user.push({ id: 123 }, {}, { from: 'sidebar' })    // + nav context

// Replace (no new history entry)
await nav.user.replace({ id: 123 }, { tab: 'orders' })

// link() — returns the object for use:link action
const linkOpts = nav.user.link({ id: 123 }, { tab: 'orders' })
// → { route: 'user', params: { id: 123 }, query: { tab: 'orders' } }`} />

	<h3 class="mt-4">Using <code>link()</code> in templates</h3>
	<CodeBlock language="svelte" codeContent={`<script>
import { link } from '@keenmate/svelte-spa-router'
import { nav } from './routes.js'
</script>

<a href={paths.user({ id: 123 })} use:link={nav.user.link({ id: 123 })}>
    View user 123
</a>`} />
	<p>
		Or, more concisely, just pass the params shape directly via the array shorthand the
		<code>link</code> action already supports — <code>defineRoutes()</code> doesn't replace
		that path, it just gives you a type-checked alternative.
	</p>
</section>

<!-- paths -->
<section class="mb-5">
	<h2>Path builders (<code>paths</code>)</h2>
	<p>
		<code>paths.X(params, query?)</code> returns the URL string for that route. Useful for
		<code>href</code> attributes (the <code>link</code> action will pick up the path),
		analytics, deep-link logging, or anywhere you need the URL without navigating.
	</p>
	<CodeBlock language="javascript" codeContent={`paths.home()
// → '/'

paths.user({ id: 123 })
// → '/user/123'

paths.user({ id: 123 }, { tab: 'orders', sort: 'date' })
// → '/user/123?tab=orders&sort=date'

paths.documentDetail({ docId: 'abc-123' })
// → '/documents/abc-123'`} />
</section>

<!-- Smart optimization -->
<section class="mb-5">
	<h2>Smart optimization</h2>
	<p>
		<code>defineRoutes()</code> chooses the right runtime form per route:
	</p>
	<ul>
		<li>
			<strong>Sync component, no options</strong> (<code>&#123; path, component &#125;</code> only) — used directly,
			skipping <code>wrap()</code> overhead.
		</li>
		<li>
			<strong>Async component</strong> (<code>component: () =&gt; import(...)</code>) or
			<strong>any option set</strong> (conditions, breadcrumbs, permissions, etc.) — automatically routed
			through <code>createRoute()</code> with the right configuration.
		</li>
	</ul>
	<p>You don't need to think about it — pass the same definition shape regardless of complexity.</p>
</section>

<!-- All supported options -->
<section class="mb-5">
	<h2>All supported route options</h2>
	<p>Every option you'd normally pass to <code>wrap()</code> or <code>createRoute()</code>:</p>
	<CodeBlock language="typescript" codeContent={`interface RouteDefinition {
    path: string
    component: any                      // sync or async (() => import(...))
    loadingComponent?: any
    loadingParams?: Record<string, any>
    conditions?: Function | Function[]  // entry guards (return false to block)
    props?: Record<string, any>         // static props for the component
    routeContext?: Record<string, any>  // accessible via routeContext()
    title?: string                      // accessible via routeTitle()
    breadcrumbs?: Array<{ label, path?, id? }>
    shouldDisplayLoadingOnRouteLoad?: boolean
    permissions?: { any?: string[]; all?: string[] }
    authorizationCallback?: Function
    inheritBreadcrumbs?: boolean
    inheritPermissions?: boolean
    inheritConditions?: boolean
    inheritAuthorization?: boolean
}`} />
</section>

<!-- When to use -->
<section class="mb-5">
	<h2>When to use it</h2>

	<h3>✅ Use <code>defineRoutes()</code> when</h3>
	<ul>
		<li>You're starting a new app — the cleanest default for v5.2+</li>
		<li>You want compile-time errors on route name / param typos</li>
		<li>You're navigating programmatically in many places — autocomplete pays off</li>
		<li>You'd otherwise be juggling separate <code>const routes = …</code> and <code>registerRoutes(&#123; … &#125;)</code> calls</li>
	</ul>

	<h3>⏸ Stick with plain routes + <code>registerRoutes()</code> when</h3>
	<ul>
		<li>You're maintaining an existing app and the type safety isn't worth a rewrite</li>
		<li>Routes are mostly flat and you rarely call <code>push(name)</code> programmatically</li>
		<li>You're already happy with <code>createHierarchy()</code> for tree-structured routes (the two compose — <code>createHierarchy()</code> output can sit alongside <code>defineRoutes()</code> output in the same routes prop)</li>
	</ul>
</section>

<!-- See also -->
<section class="mb-5">
	<h2>See also</h2>
	<ul>
		<li><a href="/features/named-routes">Named routes</a> — the lower-level <code>registerRoutes()</code> API that <code>defineRoutes()</code> calls internally</li>
		<li><a href="/features/programmatic-navigation"><code>push</code> / <code>replace</code> / <code>goBack</code></a> — what <code>nav.X.push()</code> wraps</li>
		<li><a href="/features/hierarchical-routes">Route inheritance</a> — combine with <code>defineRoutes()</code> for the best of both</li>
		<li><a href="/features/route-configuration"><code>wrap()</code></a> — manual route configuration when you don't want the auto-detection</li>
	</ul>
</section>

</div>
</DocLayout>

<style>
	h2 {
		margin-top: 3rem;
		margin-bottom: 1rem;
	}

	h3 {
		margin-top: 2rem;
		margin-bottom: 0.75rem;
	}

	ul {
		margin-bottom: 1.5rem;
	}

	li {
		margin-bottom: 0.5rem;
	}

	code {
		background: #f8f9fa;
		padding: 0.2rem 0.4rem;
		border-radius: 3px;
		font-size: 0.9em;
	}
</style>
