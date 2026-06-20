<script>
import { DocLayout, CodeBlock } from '@keenmate/svelte-docs'
</script>

<DocLayout
	titleText="What's New"
	descriptionText="Highlights from the two most recent releases">

	<div class="py-1">
		<section class="mb-5">
			<p class="lead">
				This page tracks the two most recent releases. For v5.2.1 (bare-function routes unblocked on
				Svelte 5.5+ / Vite 7), v5.2.0-rc02 (reactive permissions,
				<code>revalidateCurrentRoute()</code>, error-toast removal), v5.2.0-rc01
				(<code>defineRoutes()</code>), and the full history including v5.1.x and v5.0.x, see
				<a href="https://github.com/keenmate/svelte-spa-router/blob/main/CHANGELOG.md" target="_blank">CHANGELOG.md</a>.
			</p>
		</section>

		<!-- v5.3.0-rc02 -->
		<section class="mb-5">
			<h2 class="mb-4">v5.3.0-rc02</h2>

			<h4 class="mt-4">BREAKING: <code>NavTreeNode.isHidden</code> renamed to <code>hidden</code></h4>
			<p>
				Aligns with the KeenMate web-components naming convention for data-model boolean fields,
				which use bare HTML-attribute names (<code>hidden</code>, <code>disabled</code>,
				<code>selected</code>, <code>checked</code>) on single-item shapes. Mirrors the same rename
				that landed in <code>@keenmate/web-multiselect</code>
				(<code>MultiSelectOption.isDisabled</code> → <code>disabled</code>). The helper predicate
				<code>isNodeHidden(node)</code> keeps its <code>is*</code> prefix because it's a function,
				not a field. Migration is a find-and-replace.
			</p>
			<CodeBlock
				codeContent={`// ❌ rc01
const navTree = [
  { path: '/labs', title: 'Labs', isHidden: () => !import.meta.env.DEV }
]

// ✅ rc02
const navTree = [
  { path: '/labs', title: 'Labs', hidden: () => !import.meta.env.DEV }
]`}
				languageType="javascript"
				titleText="isHidden → hidden"
			/>

			<h4 class="mt-4"><code>disabled</code> now renders forbidden in BOTH filter modes</h4>
			<p>
				Previously, <code>disabled: true</code> nodes were dropped in <code>mode: 'hide'</code> (same
				outcome as a permission failure). New semantic: <code>disabled</code> is a
				<em>product-level placeholder signal</em> ("coming soon", "in private beta"), not a
				user-permission concern — so it stays visible regardless of the consumer's hide/disable
				preference. Ancestor permission denial still hides disabled descendants (you can't see a
				placeholder in a section you can't enter).
			</p>

			<h4 class="mt-4">New <code>FilterOptions.disabledClassName</code></h4>
			<p>
				Lets consumers style "coming soon" placeholders distinctly from permission-denied items even
				though both still render through the same forbidden branch. When set, nodes whose forbidden
				state comes from <code>disabled: true</code> get this class on
				<code>_forbiddenClassName</code> instead of the default <code>forbiddenClassName</code>.
				When a node is both <code>disabled</code> AND permission-denied (rare),
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

			<h4 class="mt-4">Example: rich tooltips wired into the top navbar of <code>/nav-tree-demo</code></h4>
			<p>
				The Floating UI <code>RichTooltip</code> wrapper now also wraps the matching topbar items
				(Admin / Settings / Marketplace) with <code>placement="top-start"</code> so the popovers
				fly upwards out of the horizontal bar. Mirrors the sidebar pattern — one
				<code>richTooltipContent</code> snippet powers both layouts; nodes opt in via the
				<code>meta.docsUrl</code> convention.
			</p>

			<h4 class="mt-4">Example: route-info bar promoted to the top of the page</h4>
			<p>
				Was sitting below the blue header with <code>position: sticky; top: 70px</code>. Moved to be
				the first child of <code>.app</code> with <code>position: sticky; top: 0</code>, so it sits
				in normal flow initially and pins to the viewport top once the user scrolls past the header.
				Cosmetic-only — no consumer impact.
			</p>
		</section>

		<!-- v5.3.0-rc01 -->
		<section class="mb-5">
			<h2 class="mb-4">v5.3.0-rc01</h2>

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
				pipeline. Plus an <code>isHidden: boolean | (node) =&gt; boolean</code> getter that's
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
  { path: '/labs', title: 'Labs', isHidden: () => !import.meta.env.DEV }
]

// Inside a component:
const visibleTree = $derived(filterByPermissions(navTree, { mode: 'hide' }))
// Switching the user re-runs filterByPermissions automatically — no wiring.`}
				languageType="javascript"
				titleText="One tree drives routes + nav, with permissions"
			/>

			<h4 class="mt-4">Stacked <code>use:active</code> actions cooperate cleanly</h4>
			<p>
				Two <code>use:active</code> calls on one element used to fight each other: the last invocation
				unconditionally toggled <em>its own</em> result, so
				<code>use:active use:active={`{'/foo/*'}`}</code> silently broke on the bare path (the prefix
				action stripped the class the default action just added). Replaced the internal
				<code>toggleClasses</code> with <code>syncClassesForNode</code> that aggregates across every
				entry — an active class is present iff <em>any</em> entry's pattern matches. The new
				<code>subtree</code> option above rides on this aggregation model.
			</p>

			<h4 class="mt-4"><code>/nav-tree-demo</code> showcase + <code>&lt;NavLink&gt;</code> reference</h4>
			<p>
				The example app's new tree-driven demo (<code>/nav-tree-demo</code>) walks a permission-filtered
				tree to render its sidebar AND its navbar AND its routes — one source of truth drives all three.
				Three live toggles in the sidebar — user, hide/disable mode, and a feature-flag rune — let you
				see every filter behavior change in place with no page reload. The
				<code>&lt;NavLink&gt;</code> wrapper around <code>use:link</code> + <code>use:active</code>
				is a copy-paste reference for handling <code>subtree</code> and <code>_forbidden</code>.
				Covered end-to-end by 9 new Playwright tests.
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

		<!-- Migration nudge -->
		<section class="mb-5">
			<h2 class="mb-4">Upgrading from older versions</h2>
			<p>
				<strong>v5.3.0-rc01 → rc02</strong> has one find-and-replace: <code>isHidden:</code> →
				<code>hidden:</code> in your nav-tree definitions. Everything else is additive (the
				<code>disabled</code> semantic change and the new <code>disabledClassName</code> option don't
				require any consumer-side changes).
			</p>
			<p class="mt-3">
				<strong>v5.2.x → v5.3.0</strong> requires no code changes beyond the rc01 → rc02 rename
				above. Stacked <code>use:active</code> cooperation is backward compatible for the
				single-action-per-node case (the overwhelmingly common case). Pick up <code>subtree: true</code>
				and <code>helpers/nav-tree</code> when you're ready.
			</p>
			<p class="mt-3">
				<strong>v5.0 / v5.1 → v5.2.x</strong> introduced a breaking removal in v5.2.0-rc02: the
				built-in error toast (<code>showToast</code>) is gone from <code>GlobalErrorHandler</code> —
				wire your own toast library inside the <code>onError</code> callback. See the
				<a href="/migration">Migration Guide</a> for the rc02 details and the major v4 → v5 breakages.
			</p>
		</section>

		<!-- Install -->
		<section class="mb-5">
			<h2 class="mb-4">Install</h2>
			<CodeBlock
				codeContent="npm install @keenmate/svelte-spa-router@5.3.0-rc02"
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
