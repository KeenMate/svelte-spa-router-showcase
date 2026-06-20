<script>
import { DocLayout, CodeBlock } from '@keenmate/svelte-docs'
</script>

<DocLayout
	titleText="Link Actions & Active Highlighting"
	descriptionText="use:link for SPA navigation and use:active for highlighting — including sidebar/submenu patterns and the regexparam wildcard quirk">

	<div class="py-1">
		<div class="alert alert-info mb-4">
			<strong>Live demos:</strong>
			<ul class="mb-0 mt-2">
				<li>
					<a href="https://history.svelte-spa-router.keenmate.dev/nav-tree-demo" target="_blank">
						<code>/nav-tree-demo</code>
					</a>
					— ONE tree drives both the sidebar and the routes (recommended starting point).
				</li>
				<li>
					<a href="https://history.svelte-spa-router.keenmate.dev/test/links/sidebar" target="_blank">
						<code>/test/links/sidebar</code>
					</a>
					— compares all parent-active patterns side-by-side.
				</li>
				<li>
					<a href="https://history.svelte-spa-router.keenmate.dev/test/links" target="_blank">
						<code>/test/links</code>
					</a>
					— link-action fundamentals.
				</li>
			</ul>
		</div>

		<!-- use:link -->
		<section class="mb-5">
			<h2 class="mb-4">use:link — SPA navigation</h2>
			<p class="lead">
				The <code>use:link</code> action turns a regular <code>&lt;a&gt;</code> into an SPA
				link: it intercepts the click, prevents a full page reload, and calls <code>push()</code>
				internally. Modifier keys (Ctrl/Cmd-click, middle-click) and <code>target="_blank"</code>
				are respected — the browser still handles those.
			</p>

			<CodeBlock
				codeContent={`<script>
import { link } from '@keenmate/svelte-spa-router'
<\/script>

<a href="/about" use:link>About</a>
<a href="/user/123" use:link>User 123</a>

<!-- Open in a new tab — link action lets the browser do it -->
<a href="/external" target="_blank" use:link>New tab</a>`}
				languageType="svelte"
				titleText="Basic use:link"
			/>

			<p class="mt-3">
				For programmatic navigation, named routes, and the array/object call forms,
				see <a href="/features/named-routes">Named Routes</a> and
				<a href="/features/programmatic-navigation">Programmatic Navigation</a>.
			</p>
		</section>

		<!-- use:active basics -->
		<section class="mb-5">
			<h2 class="mb-4">use:active — adding a CSS class to the matching link</h2>
			<p>
				<code>use:active</code> adds a CSS class to the element whenever its
				configured path matches the current location. With no argument, the path
				defaults to the link's <code>href</code> and the class is <code>active</code>.
			</p>

			<CodeBlock
				codeContent={`<script>
import { link } from '@keenmate/svelte-spa-router'
import active from '@keenmate/svelte-spa-router/active'
<\/script>

<a href="/about" use:link use:active>About</a>

<!-- Custom class name (string shorthand) -->
<a href="/about" use:link use:active={'current'}>About</a>

<!-- Custom class name (options form) -->
<a href="/about" use:link use:active={{ className: 'is-current' }}>About</a>`}
				languageType="svelte"
				titleText="Default and custom class"
			/>

			<div class="alert alert-secondary mt-3">
				<strong>How it works:</strong> <code>use:active</code> listens to
				<code>hashchange</code> and <code>popstate</code> directly on
				<code>window</code>. It is NOT a reactive store — you can't <code>$derived</code>
				off it. Read <code>location()</code> if you need that in JS.
			</div>
		</section>

		<!-- Explicit path -->
		<section class="mb-5">
			<h2 class="mb-4">Explicit path — string prefix or regex</h2>
			<p>
				Pass an explicit <code>path</code> to match something other than the link's
				own href. A string is run through <code>regexparam</code>, so you get the same
				<code>:param</code> and <code>*</code> syntax used in route definitions.
			</p>

			<CodeBlock
				codeContent={`<!-- String pattern with wildcard -->
<a href="/docs" use:link use:active={'/docs/*'}>Docs</a>

<!-- Regex pattern -->
<a href="/docs" use:link use:active={/^\\/docs(\\/|$)/}>Docs</a>

<!-- Options form (lets you set className alongside) -->
<a href="/docs" use:link use:active={{ path: '/docs/*', className: 'is-current' }}>Docs</a>`}
				languageType="svelte"
				titleText="Explicit path patterns"
			/>
		</section>

		<!-- The wildcard quirk -->
		<section class="mb-5">
			<h2 class="mb-4">Wildcard quirk: <code>/docs/*</code> matches descendants only</h2>
			<div class="alert alert-warning">
				<strong>The string pattern <code>/foo/*</code> does NOT match the bare path <code>/foo</code>.</strong>
				It only matches descendants like <code>/foo/anything</code>.
			</div>

			<p>
				<code>regexparam</code> compiles <code>/foo/*</code> to
				<code>/^\/foo\/(.*)\/?$/i</code> — the trailing slash after
				<code>foo</code> is mandatory. So a sidebar parent using
				<code>use:active=&#123;'/foo/*'&#125;</code> goes dark the moment the user
				lands on the bare <code>/foo</code> index page.
			</p>

			<CodeBlock
				codeContent={`// regexparam@2.0.2
parse('/docs/*').pattern  // /^\\/docs\\/(.*)\\/?$/i

// Matches:
//   /docs/           ✓
//   /docs/guide      ✓
//   /docs/api/intro  ✓

// Does NOT match:
//   /docs            ✗ ← trailing slash after "docs" required
`}
				languageType="javascript"
				titleText="Why /foo/* misses /foo"
			/>

			<p class="mt-3">
				Use this deliberately when you want a link UNHIGHLIGHTED on the index page
				and only lit on descendants — that's a legitimate UX choice. For the
				common "parent stays lit on its own index AND on every child" case,
				see the next section.
			</p>
		</section>

		<!-- Branch matching -->
		<section class="mb-5">
			<h2 class="mb-4">Branch matching — bare path + descendants</h2>
			<p>
				For sidebar parents that should stay highlighted on <code>/docs</code> AND every child,
				you have three equivalent options.
			</p>

			<h4 class="mt-4">1. subtree option (recommended)</h4>
			<p>
				No path string, no regex. The action reads the link's <code>href</code> and
				internally registers both an exact match AND a <code>/docs/*</code>
				descendants pattern. Best fit when the href is a variable in a generated nav.
			</p>
			<CodeBlock
				codeContent={`<a href="/docs" use:link use:active={{ subtree: true }}>Docs</a>`}
				languageType="svelte"
				titleText="Branch active via subtree option"
			/>

			<h4 class="mt-4">2. Regex form</h4>
			<p>Useful when you can't or don't want to depend on the link's href.</p>
			<CodeBlock
				codeContent={`<a href="/docs" use:link use:active={/^\\/docs(\\/|$)/}>Docs</a>`}
				languageType="svelte"
				titleText="Branch active via regex"
			/>

			<h4 class="mt-4">3. Stack two use:active calls (long form of subtree)</h4>
			<p>
				The default action catches the bare path; the prefix action catches
				descendants. Both add the same <code>active</code> class. Library aggregates
				per <code>(node, className)</code> so the two actions cooperate instead of
				fighting.
			</p>
			<CodeBlock
				codeContent={`<a href="/docs"
   use:link
   use:active
   use:active={'/docs/*'}>Docs</a>`}
				languageType="svelte"
				titleText="Branch active via stacked actions"
			/>

			<p>All three yield:</p>
			<ul>
				<li><code>/docs</code> → active</li>
				<li><code>/docs/guide</code> → active</li>
				<li><code>/docs/api/intro</code> → active</li>
				<li><code>/about</code> → not active</li>
			</ul>
		</section>

		<!-- Sidebar with submenu -->
		<section class="mb-5">
			<h2 class="mb-4">Sidebar with submenu</h2>
			<p>
				Parent stays active on its own index page AND when any child route is open;
				children only highlight on their exact path.
			</p>

			<CodeBlock
				codeContent={`<nav class="sidebar">
    <a href="/" use:link use:active>Home</a>

    <div class="group">
        <!-- Parent: regex matches /users AND /users/anything -->
        <a href="/users" use:link use:active={/^\\/users(\\/|$)/}>Users</a>
        <div class="submenu">
            <!-- Children: default exact match -->
            <a href="/users" use:link use:active>All users</a>
            <a href="/users/new" use:link use:active>Create user</a>
        </div>
    </div>
</nav>`}
				languageType="svelte"
				titleText="Sidebar with submenu"
			/>

			<p class="mt-3">Behavior across URLs:</p>
			<div class="table-responsive">
				<table class="table table-sm table-bordered">
					<thead>
						<tr>
							<th>Current URL</th>
							<th>Parent "Users"</th>
							<th>Submenu "All users"</th>
							<th>Submenu "Create user"</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>/users</code></td>
							<td>active</td>
							<td>active</td>
							<td>—</td>
						</tr>
						<tr>
							<td><code>/users/new</code></td>
							<td>active</td>
							<td>—</td>
							<td>active</td>
						</tr>
						<tr>
							<td><code>/users/123</code></td>
							<td>active</td>
							<td>—</td>
							<td>—</td>
						</tr>
						<tr>
							<td><code>/</code></td>
							<td>—</td>
							<td>—</td>
							<td>—</td>
						</tr>
					</tbody>
				</table>
			</div>
		</section>

		<!-- Two-class pattern -->
		<section class="mb-5">
			<h2 class="mb-4">Two-class pattern — distinguish "really active" from "parent of active"</h2>
			<p>
				Style the link that exactly matches the current URL differently from a
				parent whose descendant is active. The cleanest way is the
				<code>subtree</code> + <code>subtreeClassName</code> pair — one action
				call covers both cases.
			</p>

			<CodeBlock
				codeContent={`<style>
    .link-active     { color: red; font-weight: bold; }    /* really active */
    .sublink-active  { color: orange; }                     /* parent of active */
</style>

<nav>
    <!-- Parent: ONE use:active call with subtree + subtreeClassName -->
    <a
        href="/users"
        use:link
        use:active={{
            subtree: true,
            className: 'link-active',
            subtreeClassName: 'sublink-active'
        }}
    >
        Users
    </a>

    <div class="submenu">
        <!-- Children: ONE use:active each -->
        <a href="/users" use:link use:active={{ className: 'link-active' }}>All users</a>
        <a href="/users/new" use:link use:active={{ className: 'link-active' }}>Create</a>
        <a href="/users/123" use:link use:active={{ className: 'link-active' }}>User 123</a>
    </div>
</nav>`}
				languageType="svelte"
				titleText="Two-class parent/child via subtree"
			/>

			<details class="mt-3">
				<summary>Long form: stacked use:active calls (equivalent)</summary>
				<CodeBlock
					codeContent={`<a
    href="/users"
    use:link
    use:active={{ className: 'link-active' }}
    use:active={{ path: '/users/*', className: 'sublink-active' }}
>
    Users
</a>`}
					languageType="svelte"
					titleText="Two-class parent/child (long form)"
				/>
			</details>

			<p class="mt-3">Behavior across URLs:</p>
			<div class="table-responsive">
				<table class="table table-sm table-bordered">
					<thead>
						<tr>
							<th>Current URL</th>
							<th>Parent "Users"</th>
							<th>Child "All users"</th>
							<th>Child "Create"</th>
							<th>Child "User 123"</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>/users</code></td>
							<td><code>link-active</code> (red)</td>
							<td><code>link-active</code></td>
							<td>—</td>
							<td>—</td>
						</tr>
						<tr>
							<td><code>/users/new</code></td>
							<td><code>sublink-active</code> (orange)</td>
							<td>—</td>
							<td><code>link-active</code></td>
							<td>—</td>
						</tr>
						<tr>
							<td><code>/users/123</code></td>
							<td><code>sublink-active</code></td>
							<td>—</td>
							<td>—</td>
							<td><code>link-active</code></td>
						</tr>
						<tr>
							<td><code>/about</code></td>
							<td>—</td>
							<td>—</td>
							<td>—</td>
							<td>—</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div class="alert alert-secondary mt-3">
				<strong>Why this works:</strong> the regexparam wildcard quirk is on your
				side here. The exact-match action only matches the bare <code>/users</code>;
				the <code>/users/*</code> action only matches descendants. The two
				classes never collide, so the parent is unambiguously either "really active"
				or "branch active" — never both.
			</div>

			<h4 class="mt-4">Three-level menu</h4>
			<p>Repeat the pattern at each ancestor depth.</p>
			<CodeBlock
				codeContent={`<a href="/admin"
   use:link
   use:active={{ subtree: true, className: 'link-active', subtreeClassName: 'sublink-active' }}>Admin</a>

<a href="/admin/users"
   use:link
   use:active={{ subtree: true, className: 'link-active', subtreeClassName: 'sublink-active' }}>Users</a>

<a href="/admin/users/123"
   use:link
   use:active={{ className: 'link-active' }}>User 123</a>`}
				languageType="svelte"
				titleText="Three-level menu"
			/>
			<p class="mt-2">
				On <code>/admin/users/123</code>: grandparent and parent both get
				<code>sublink-active</code>, the leaf gets <code>link-active</code>.
			</p>
		</section>

		<!-- Generating nav from a route tree -->
		<section class="mb-5">
			<h2 class="mb-4">Generating nav from a route tree</h2>
			<p>
				Once you can decide "parent or leaf?" at render time, you can drive
				the entire sidebar from a single data structure — the same one you
				pass to <code>createHierarchy()</code> for route registration.
			</p>

			<h4 class="mt-4">A reusable NavLink helper</h4>
			<p>
				Wraps <code>use:link</code> + <code>use:active</code> so the menu
				walker stays small. Pass <code>subtree=&#123;true&#125;</code> for parent
				nodes; default behavior for leaves.
			</p>
			<CodeBlock
				codeContent={`<!-- NavLink.svelte -->
<script>
import { link } from '@keenmate/svelte-spa-router'
import active from '@keenmate/svelte-spa-router/active'

let {
    href,
    subtree = false,
    className = 'active',
    subtreeClassName = undefined,
    children,
    ...rest
} = $props()
<\/script>

<a
    {href}
    use:link
    use:active={subtree
        ? { subtree: true, className, subtreeClassName }
        : { className }}
    {...rest}
>{@render children?.()}</a>`}
				languageType="svelte"
				titleText="NavLink helper component"
			/>

			<h4 class="mt-4">Walk the tree to render the menu</h4>
			<CodeBlock
				codeContent={`<script>
import NavLink from './NavLink.svelte'

const navTree = [
    { path: '/users', title: 'Users', children: [
        { path: '/users/list', title: 'All users' },
        { path: '/users/new',  title: 'Create' }
    ]},
    { path: '/orders', title: 'Orders', children: [
        { path: '/orders/list', title: 'All orders' }
    ]}
]
<\/script>

{#each navTree as item}
    {#if item.children}
        <NavLink
            href={item.path}
            subtree={true}
            className="link-active"
            subtreeClassName="sublink-active"
        >{item.title}</NavLink>
        <div class="submenu">
            {#each item.children as child}
                <NavLink href={child.path} className="link-active">
                    {child.title}
                </NavLink>
            {/each}
        </div>
    {:else}
        <NavLink href={item.path} className="link-active">{item.title}</NavLink>
    {/if}
{/each}`}
				languageType="svelte"
				titleText="Tree walker"
			/>

			<h4 class="mt-4">Same tree drives the routes too</h4>
			<CodeBlock
				codeContent={`function* walkTree(tree) {
    for (const item of tree) {
        yield item
        if (item.children) yield* walkTree(item.children)
    }
}

// Register one route per tree node, all pointing at the same component
const routes = Object.fromEntries(
    Array.from(walkTree(navTree)).map((node) => [node.path, PageContent])
)`}
				languageType="javascript"
				titleText="Route registration from the same tree"
			/>

			<div class="alert alert-info mt-3">
				<strong>Live demo:</strong>
				<a href="https://history.svelte-spa-router.keenmate.dev/nav-tree-demo" target="_blank">
					Open <code>/nav-tree-demo</code>
				</a>
				— see <code>example/src/routes/NavTreeDemo.svelte</code> and
				<code>example/src/routes/nav-tree.js</code> for the full source.
			</div>
		</section>

		<!-- Permission filtering -->
		<section class="mb-5">
			<h2 class="mb-4">Permission-filtered nav (<code>helpers/nav-tree</code>)</h2>
			<p>
				The <code>filterByPermissions(tree)</code> helper from
				<code>@keenmate/svelte-spa-router/helpers/nav-tree</code> walks a
				route tree and either hides nodes the current user can't reach (default)
				or keeps them in place with a <code>_forbidden</code> flag for
				styled disabled rendering.
			</p>

			<h4 class="mt-4">Two modes</h4>
			<CodeBlock
				codeContent={`import { filterByPermissions } from '@keenmate/svelte-spa-router/helpers/nav-tree'

// Mode A — hide (default): inaccessible nodes vanish
const visibleTree = $derived(filterByPermissions(navTree))

// Mode B — disable: inaccessible nodes stay, marked _forbidden: true
const visibleTree = $derived(filterByPermissions(navTree, {
    mode: 'disable',
    forbiddenClassName: 'forbidden',     // permission-denied (red strike-through)
    disabledClassName:  'unavailable'    // product-level "coming soon" (amber)
}))`}
				languageType="javascript"
				titleText="filterByPermissions modes"
			/>

			<h4 class="mt-4">NavTree node schema</h4>
			<CodeBlock
				codeContent={`{
    path: '/admin',
    title: 'Admin',
    permissions: { any: ['admin'] },      // same shape as wrap() guards
    hidden: false,                         // OR a getter — see below
    disabled: false,                       // product-level "coming soon" flag
    children: [...],
    keepIfEmpty: false                     // optional — force render when no
                                            //   children survive filtering
}`}
				languageType="javascript"
				titleText="Per-node options"
			/>
			<p class="text-muted small mt-2">
				<strong>Naming note:</strong> the boolean fields use bare HTML-attribute names
				(<code>hidden</code>, <code>disabled</code>) to align with the KeenMate
				web-components convention. The helper predicate <code>isNodeHidden(node)</code>
				keeps its <code>is*</code> prefix because it's a function, not a field.
			</p>

			<h4 class="mt-4"><code>hidden</code> — static boolean or reactive getter</h4>
			<p>
				Either form works. The getter is called every filter pass, so anything
				it reads — environment variables, <code>$state</code>, feature flags —
				participates in the reactive update chain automatically.
			</p>
			<CodeBlock
				codeContent={`{
    // Static — always hidden
    path: '/secret-ops',
    hidden: true
}

{
    // Reactive — dev-only feature
    path: '/labs/beta',
    hidden: () => !import.meta.env.DEV
}

{
    // Reactive to a feature-flag rune
    path: '/beta',
    hidden: () => !$betaEnabled
}

{
    // Reactive to user state
    path: '/admin/labs',
    hidden: () => !isInternalUser()
}`}
				languageType="javascript"
				titleText="hidden patterns"
			/>

			<h4 class="mt-4"><code>disabled</code> — "coming soon" placeholder</h4>
			<p>
				<code>disabled: true</code> marks a node as a <em>product-level placeholder</em> —
				"coming soon", "in private beta", "Q3 roadmap". It renders forbidden in
				<strong>both</strong> filter modes (it never simply disappears in hide mode like
				<code>hidden</code> does), because the intent is to advertise the item, not gate
				it on user permissions. Ancestor permission denial still cascades — you can't see
				a placeholder in a section you can't enter.
			</p>
			<p>
				Pair with the new <code>disabledClassName</code> filter option to style
				placeholders distinctly from permission-denied items (amber "unavailable" vs.
				red "forbidden"). When a node is both <code>disabled</code> AND permission-denied
				(rare combo), <code>disabledClassName</code> wins — the product-level signal is
				the more permanent one.
			</p>

			<h4 class="mt-4">Hierarchical permission inheritance</h4>
			<p>
				When <code>inheritPermissions: true</code> (default), child accessibility
				requires every ancestor's permission check to also pass. The filter
				chains sequential <code>hasPermission()</code> calls — one per level —
				which matches how the router's own hierarchical-mode pipeline checks
				routes. Set <code>inheritPermissions: false</code> if your nav structure
				doesn't mirror an access hierarchy.
			</p>

			<h4 class="mt-4">Behavior matrix</h4>
			<div class="table-responsive">
				<table class="table table-sm table-bordered">
					<thead>
						<tr>
							<th>Node state</th>
							<th>Mode <code>'hide'</code></th>
							<th>Mode <code>'disable'</code></th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><code>hidden: true</code> or getter returns true</td>
							<td>gone</td>
							<td>gone (same — explicit "never in nav")</td>
						</tr>
						<tr>
							<td>User has access</td>
							<td>shown</td>
							<td>shown</td>
						</tr>
						<tr>
							<td>User lacks access</td>
							<td>gone</td>
							<td>shown + <code>_forbidden: true</code> + <code>.forbidden</code> class</td>
						</tr>
						<tr>
							<td><code>disabled: true</code> (product-level placeholder)</td>
							<td>shown + <code>_forbidden: true</code> + <code>.unavailable</code> class<sup>*</sup></td>
							<td>shown + <code>_forbidden: true</code> + <code>.unavailable</code> class<sup>*</sup></td>
						</tr>
						<tr>
							<td>All visible children forbidden</td>
							<td>parent gone</td>
							<td>parent forbidden (cascading; keeps <code>.forbidden</code>)</td>
						</tr>
					</tbody>
				</table>
				<p class="text-muted small">
					<sup>*</sup> When <code>disabledClassName</code> is set on the filter options. Defaults
					to <code>forbiddenClassName</code> if omitted (backward compatible).
				</p>
			</div>

			<h4 class="mt-4">Reactivity</h4>
			<p>
				<code>filterByPermissions()</code> calls <code>hasPermission()</code>
				internally, which reads through the reactive user state. Calling
				the filter inside a <code>$derived</code> makes the entire sidebar
				update live when:
			</p>
			<ul>
				<li><code>setCurrentUser()</code> fires (login, logout, role change, websocket permission update)</li>
				<li>Any <code>hidden</code> getter reads <code>$state</code> that mutates</li>
				<li>Any inherited reactive state changes</li>
			</ul>
			<p>No subscription wiring, no manual invalidation — same model as the rest of the runes-based router.</p>

			<h4 class="mt-4">NavLink — forbidden rendering</h4>
			<p>
				When the filter returns a node with <code>_forbidden: true</code>,
				<code>NavLink</code> renders a non-interactive <code>&lt;span&gt;</code> with the
				configured class and <code>aria-disabled="true"</code> instead of an
				<code>&lt;a&gt;</code>. No <code>use:link</code>, no navigation, no <code>use:active</code>.
			</p>
			<CodeBlock
				codeContent={`{#each visibleTree as item}
    <NavLink
        href={item.path}
        subtree={!!item.children}
        forbidden={item._forbidden}
        forbiddenClassName={item._forbiddenClassName}
        className="link-active"
        subtreeClassName="sublink-active"
    >{item.title}</NavLink>
{/each}`}
				languageType="svelte"
				titleText="NavLink with forbidden state"
			/>

			<div class="alert alert-info mt-3">
				<strong>Live demo:</strong>
				<a href="https://history.svelte-spa-router.keenmate.dev/nav-tree-demo" target="_blank">
					<code>/nav-tree-demo</code>
				</a>
				ships with a user toggle (Donna with limited permissions ↔ Audrey
				with full access) and a mode toggle (hide ↔ disable) — flip both
				and watch the sidebar re-render live, with no page reload.
			</div>
		</section>

		<!-- inactiveClassName -->
		<section class="mb-5">
			<h2 class="mb-4">inactiveClassName — class while NOT matching</h2>
			<p>
				The options form also accepts <code>inactiveClassName</code> for a class
				that's applied while the pattern does NOT match. Useful for muted/disabled
				visual states.
			</p>

			<CodeBlock
				codeContent={`<a href="/users"
   use:link
   use:active={{ className: 'link-active', inactiveClassName: 'is-dim' }}>
    Users
</a>`}
				languageType="svelte"
				titleText="Inactive class"
			/>

			<p>
				When multiple <code>use:active</code> actions share the same
				<code>inactiveClassName</code>, the class is present only when NO
				controlling entry matches — the element is treated as "fully inactive."
			</p>
		</section>

		<!-- Pitfalls -->
		<section class="mb-5">
			<h2 class="mb-4">Pitfalls</h2>
			<ul>
				<li>
					Path strings must start with <code>/</code> or <code>*</code>. Anything
					else throws — internal locations always start with <code>/</code>, so
					a path like <code>'foo'</code> could never match.
				</li>
				<li>
					The pattern is compiled <strong>once</strong> at mount. Changing
					<code>opts.path</code> reactively won't re-parse — Svelte would need
					to tear the element down and remount it.
				</li>
				<li>
					<code>use:active</code> is browser-only. The module has a
					<code>typeof window !== 'undefined'</code> guard for SSR.
				</li>
				<li>
					Don't use <code>use:link</code> on external URLs (use a plain
					<code>&lt;a&gt;</code>). The action would attempt SPA navigation and break.
				</li>
			</ul>
		</section>
	</div>
</DocLayout>
