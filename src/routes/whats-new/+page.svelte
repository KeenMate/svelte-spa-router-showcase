<script>
import { DocLayout, CodeBlock } from '@keenmate/svelte-docs'
</script>

<DocLayout
	titleText="What's New"
	descriptionText="Highlights from the two most recent releases">

	<div class="py-1">
		<section class="mb-5">
			<p class="lead">
				This page tracks the two most recent releases. For v5.2.0 (reactive permissions,
				<code>revalidateCurrentRoute()</code>, <code>defineRoutes()</code>, error-toast removal),
				and the full history including v5.1.x and v5.0.x, see
				<a href="https://github.com/keenmate/svelte-spa-router/blob/main/CHANGELOG.md" target="_blank">CHANGELOG.md</a>.
			</p>
		</section>

		<!-- v5.3.0 -->
		<section class="mb-5">
			<h2 class="mb-4">v5.3.0</h2>
			<p class="lead">
				Generated navigation from a route tree: a permission-aware <code>helpers/nav-tree</code>
				module, subtree-aware <code>use:active</code> highlighting, and distinct styling for
				product-level "coming soon" placeholders. One route tree can now drive your routes, your
				sidebar, and your navbar — with permissions applied — from a single source of truth.
			</p>

			<h4 class="mt-4"><code>subtree: true</code> on <code>use:active</code> — sidebar parent/child highlighting from one action</h4>
			<p>
				Registers both an exact-<code>href</code> match <em>and</em> a <code>/href/*</code> descendants
				pattern from a single action call, derived from the link's <code>href</code>. Sidebar parents
				stay highlighted on their own index page <em>and</em> every nested URL without writing a regex
				or stacking two <code>use:active</code> calls by hand. Pair with the new
				<code>subtreeClassName</code> to style "parent of an active child" differently from "really
				active".
			</p>
			<CodeBlock
				codeContent={`<!-- One action, two truth tables: exact AND descendants -->
<a
  href="/docs"
  use:link
  use:active={{ subtree: true, className: 'link-active', subtreeClassName: 'sublink-active' }}
>Docs</a>

<!-- /docs       → 'link-active' (exact)
     /docs/intro → 'sublink-active' (descendant)
     /other      → no class -->`}
				languageType="svelte"
				titleText="One use:active call for parent + nested highlight"
			/>

			<h4 class="mt-4"><code>helpers/nav-tree</code> — permission-aware filtering for tree-shaped menus</h4>
			<p>
				New module exported at <code>@keenmate/svelte-spa-router/helpers/nav-tree</code>. Walks a route
				tree, runs <code>hasPermission()</code> per node, and either drops inaccessible nodes
				(<code>mode: 'hide'</code>) or marks them with <code>_forbidden: true</code> for styled
				disabled rendering (<code>mode: 'disable'</code>). Ancestor permissions enforced via sequential
				checks (one per level), not by merging spec objects — mirrors the router's hierarchical-mode
				pipeline. Plus a <code>hidden: boolean | (node) =&gt; boolean</code> getter that's
				always-destructive in both modes — read a <code>$state</code> rune or a feature flag inside
				the getter and the whole filter result becomes reactive.
			</p>
			<CodeBlock
				codeContent={`import { filterByPermissions } from '@keenmate/svelte-spa-router/helpers/nav-tree'

const navTree = [
  { path: '/', title: 'Home' },
  { path: '/admin', title: 'Admin', permissions: { any: ['admin'] }, children: [
    { path: '/admin/users', title: 'Users' }   // inherits admin
  ]},
  { path: '/labs', title: 'Labs', hidden: () => !import.meta.env.DEV }
]

// Inside a component:
const visibleTree = $derived(filterByPermissions(navTree, { mode: 'hide' }))
// Switching the user re-runs filterByPermissions automatically — no wiring.`}
				languageType="javascript"
				titleText="One tree drives routes + nav, with permissions"
			/>

			<h4 class="mt-4"><code>disabled</code> placeholders + distinct <code>FilterOptions.disabledClassName</code></h4>
			<p>
				A <code>disabled: true</code> node is a <em>product-level placeholder signal</em>
				("coming soon", "in private beta"), not a user-permission concern — so it renders as forbidden
				in <em>both</em> filter modes rather than being dropped like a permission failure (ancestor
				permission denial still hides disabled descendants — you can't see a placeholder in a section
				you can't enter). The new <code>disabledClassName</code> option then lets you style those
				placeholders distinctly from permission-denied items even though both render through the same
				forbidden branch. When a node is both <code>disabled</code> AND permission-denied (rare),
				<code>disabledClassName</code> wins — the product-level signal is the more permanent one.
				Cascade parents (forbidden only because every visible child is) keep
				<code>forbiddenClassName</code>. Default <code>undefined</code> → falls back to
				<code>forbiddenClassName</code>; fully backward compatible.
			</p>
			<CodeBlock
				codeContent={`const visibleTree = $derived(
  filterByPermissions(navTree, {
    mode: 'disable',
    forbiddenClassName: 'forbidden',        // red strike-through (permission denied)
    disabledClassName:  'unavailable'       // amber, no strike-through ("coming soon")
  })
)`}
				languageType="javascript"
				titleText="Distinct styling for disabled vs forbidden"
			/>

			<h4 class="mt-4">Stacked <code>use:active</code> actions cooperate cleanly</h4>
			<p>
				Two <code>use:active</code> calls on one element used to fight each other: the last invocation
				unconditionally toggled <em>its own</em> result, so
				<code>use:active use:active={`{'/foo/*'}`}</code> silently broke on the bare path (the prefix
				action stripped the class the default action just added). Replaced the internal
				<code>toggleClasses</code> with <code>syncClassesForNode</code> that aggregates across every
				entry — an active class is present iff <em>any</em> entry's pattern matches. The
				<code>subtree</code> option above rides on this aggregation model.
			</p>

			<h4 class="mt-4"><code>/nav-tree-demo</code> showcase + <code>&lt;NavLink&gt;</code> reference</h4>
			<p>
				The example app's tree-driven demo (<code>/nav-tree-demo</code>) walks a permission-filtered
				tree to render its sidebar AND its navbar AND its routes — one source of truth drives all three.
				Three live toggles in the sidebar — user, hide/disable mode, and a feature-flag rune — let you
				see every filter behavior change in place with no page reload. The
				<code>&lt;NavLink&gt;</code> wrapper around <code>use:link</code> + <code>use:active</code>
				is a copy-paste reference for handling <code>subtree</code> and <code>_forbidden</code>. The
				topbar items also opt into the Floating UI <code>RichTooltip</code> wrapper (via the
				<code>meta.docsUrl</code> convention) so one <code>richTooltipContent</code> snippet powers both
				the horizontal navbar and the vertical sidebar. Covered end-to-end by Playwright tests.
			</p>

			<h4 class="mt-4">AI-facing docs refreshed</h4>
			<p>
				The previous <code>ai/link-actions.txt</code> incorrectly claimed
				<code>&lt;a href="/docs/*" use:active&gt;</code> matched bare <code>/docs</code>. It doesn't:
				<code>regexparam@2.0.2</code> compiles <code>/docs/*</code> to a pattern requiring the slash
				after "docs", so bare <code>/docs</code> falls through. Rewritten as "descendants only" with
				the quirk explained, plus new sections covering branch matching (<code>subtree</code> vs regex
				vs stacked actions), sidebar-with-submenu, two-class parent/child pattern, generating nav from
				a route tree, and filtering by permissions. Same expansion propagated to this site's
				<a href="/features/link-actions">Link actions</a> feature page — including a Reactivity section
				explaining the <code>$derived(filterByPermissions(...))</code> chain.
			</p>
		</section>

		<!-- v5.2.1 -->
		<section class="mb-5">
			<h2 class="mb-4">v5.2.1</h2>

			<h4 class="mt-4">Bare-function routes unblocked on Svelte 5.5+ / Vite 7 / plugin-svelte 6</h4>
			<p>
				Single-issue release. <code>Router.svelte</code>'s component validator threw
				<code>Invalid component object</code> for every bare-function route
				(<code>{`{ '/': Foo }`}</code>) on newer toolchains — the Svelte 5 compiler dropped a set of
				parens in a nested boolean guard, flipping the check. <code>wrap()</code>-ed routes accidentally
				dodged it. The fix hoists the type checks into named locals
				(<code>isComponentFn</code> / <code>isWrappedRoute</code>) so the guard is single-nesting and
				immune to the compiler's paren elision. If you were workarounded with
				<code>wrap(&#123; component: Foo &#125;)</code> you can now drop it. Either way: just upgrade.
			</p>
		</section>

		<!-- Migration nudge -->
		<section class="mb-5">
			<h2 class="mb-4">Upgrading from older versions</h2>
			<p>
				<strong>v5.2.x → v5.3.0</strong> requires no code changes. Stacked <code>use:active</code>
				cooperation is backward compatible for the single-action-per-node case (the overwhelmingly
				common case). Pick up <code>subtree: true</code> and <code>helpers/nav-tree</code> when you're
				ready. (If you happened to try a <code>5.3.0-rc01</code> pre-release, rename
				<code>isHidden:</code> → <code>hidden:</code> in your nav-tree definitions — see the
				<a href="/migration">Migration Guide</a>.)
			</p>
			<p class="mt-3">
				<strong>v5.0 / v5.1 → v5.2.x</strong> introduced a breaking removal in v5.2.0: the
				built-in error toast (<code>showToast</code>) is gone from <code>GlobalErrorHandler</code> —
				wire your own toast library inside the <code>onError</code> callback. See the
				<a href="/migration">Migration Guide</a> for the details and the major v4 → v5 breakages.
			</p>
		</section>

		<!-- Install -->
		<section class="mb-5">
			<h2 class="mb-4">Install</h2>
			<CodeBlock
				codeContent="npm install @keenmate/svelte-spa-router@5.3.0"
				languageType="bash"
			/>
			<p class="mt-3">
				Then jump to the <a href="/getting-started">Getting Started</a> guide.
			</p>
		</section>

		<!-- Feedback -->
		<section class="mb-5">
			<h2 class="mb-4">Feedback</h2>
			<ul>
				<li>
					<a href="https://github.com/keenmate/svelte-spa-router/issues" target="_blank">
						Report issues on GitHub
					</a>
				</li>
				<li>
					<a href="https://github.com/keenmate/svelte-spa-router/discussions" target="_blank">
						Join discussions
					</a>
				</li>
			</ul>
		</section>
	</div>
</DocLayout>
