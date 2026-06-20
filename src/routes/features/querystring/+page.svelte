<script>
import { DocLayout, CodeBlock } from '@keenmate/svelte-docs'
</script>

<DocLayout
	titleText="Querystring Helpers"
	descriptionText="Reactive, type-safe URL query parameter handling">

	<div class="py-1">
		<div class="alert alert-info mb-4">
			<strong>Live demo:</strong>
			<a href="https://history.svelte-spa-router.keenmate.dev/querystring-demo" target="_blank">
				Open <code>/querystring-demo</code> →
			</a>
			Built-in helpers (read, update, parse arrays) plus a fully interactive OData / Microsoft Graph
			custom-formatter playground built with <code>createQuerystringHelpers()</code>.
		</div>

		<!-- Introduction -->
		<section class="mb-5">
			<h2 class="mb-4">Working with Query Parameters</h2>
			<p class="lead">
				The router provides powerful helpers for working with URL query parameters in a reactive, type-safe way.
				Perfect for search interfaces, filters, pagination, and any URL-driven UI state.
			</p>
		</section>

		<!-- Configuration -->
		<section class="mb-5">
			<h2 class="mb-4">Configuration</h2>
			<p>Configure the querystring system once in your <code>main.js</code>:</p>

			<CodeBlock
				codeContent={`// main.js
import { configureQuerystring } from '@keenmate/svelte-spa-router/helpers/querystring'

configureQuerystring({
  arrayFormat: 'auto'  // 'auto', 'repeat', or 'comma'
})

// Now mount your app
mount(App, { target: document.body })`}
				languageType="javascript"
				titleText="Configure querystring"
			/>
		</section>

		<!-- Basic Usage -->
		<section class="mb-5">
			<h2 class="mb-4">Basic Usage</h2>
			<p>Access query parameters reactively with the <code>query()</code> function:</p>

			<CodeBlock
				codeContent={`<script>
import { query } from '@keenmate/svelte-spa-router/helpers/querystring'

// Define your query type for intellisense
interface SearchQuery {
  search?: string
  page?: number
  category?: string
}

// Access query parameters reactively
const q = $derived(query<SearchQuery>())
const search = $derived(q.search || '')
const page = $derived(q.page ? Number(q.page) : 1)
const category = $derived(q.category || 'all')
</script>

<p>Search: {search}</p>
<p>Page: {page}</p>
<p>Category: {category}</p>

<!-- URL: /products?search=laptop&page=2&category=electronics -->
<!-- Result: search="laptop", page=2, category="electronics" -->`}
				languageType="svelte"
				titleText="Reading query parameters"
			/>
		</section>

		<!-- Updating Query Parameters -->
		<section class="mb-5">
			<h2 class="mb-4">Updating Query Parameters</h2>
			<p>Use <code>updateQuerystring()</code> to modify URL query parameters:</p>

			<CodeBlock
				codeContent={`<script>
import { query } from '@keenmate/svelte-spa-router/helpers/querystring'
import { updateQuerystring } from '@keenmate/svelte-spa-router/helpers/querystring-helpers'

const q = $derived(query())
const search = $derived(q.search || '')

// Update querystring (merges with existing params)
async function handleSearch(value: string) {
  await updateQuerystring({
    search: value || undefined,  // undefined removes the param
    page: 1                      // Reset page when searching
  })
}
</script>

<input
  type="text"
  value={search}
  oninput={(e) => handleSearch(e.target.value)}
/>`}
				languageType="svelte"
				titleText="Updating query parameters"
			/>

			<div class="alert alert-info mt-3">
				<h5>undefined vs null</h5>
				<ul class="mb-0">
					<li><code>undefined</code> - Removes the parameter completely</li>
					<li><code>null</code> - Keeps parameter with empty value (by default removed, use <code>dropNull: false</code> to keep)</li>
				</ul>
			</div>
		</section>

		<!-- Array Format Support -->
		<section class="mb-5">
			<h2 class="mb-4">Array Parameters</h2>
			<p>The router automatically handles array parameters in multiple formats:</p>

			<h4 class="mt-4">Auto-Detect (Recommended)</h4>
			<p>Automatically detects and parses both comma and repeat formats:</p>

			<CodeBlock
				codeContent={`// Configure with auto-detect
configureQuerystring({ arrayFormat: 'auto' })

// Handles both formats:
// ?tags=foo&tags=bar&tags=baz → { tags: ['foo', 'bar', 'baz'] }
// ?tags=foo,bar,baz → { tags: ['foo', 'bar', 'baz'] }

// Usage
const q = $derived(query<{ tags?: string[] }>())
const tags = $derived(q.tags || [])

// Update
await updateQuerystring({ tags: ['svelte', 'router', 'spa'] })
// Result: ?tags=svelte,router,spa`}
				languageType="javascript"
				titleText="Auto-detect arrays"
			/>

			<h4 class="mt-4">Repeat Format</h4>
			<p>Each value gets its own parameter:</p>

			<CodeBlock
				codeContent={`configureQuerystring({ arrayFormat: 'repeat' })

// ?tags=foo&tags=bar&tags=baz
await updateQuerystring({ tags: ['foo', 'bar', 'baz'] })`}
				languageType="javascript"
				titleText="Repeat format"
			/>

			<h4 class="mt-4">Comma Format</h4>
			<p>Values separated by commas in a single parameter:</p>

			<CodeBlock
				codeContent={`configureQuerystring({ arrayFormat: 'comma' })

// ?tags=foo,bar,baz
await updateQuerystring({ tags: ['foo', 'bar', 'baz'] })`}
				languageType="javascript"
				titleText="Comma format"
			/>
		</section>

		<!-- TypeScript Support -->
		<section class="mb-5">
			<h2 class="mb-4">TypeScript Support</h2>
			<p>Define types for full intellisense and type safety:</p>

			<CodeBlock
				codeContent={`<script lang="ts">
import { query } from '@keenmate/svelte-spa-router/helpers/querystring'
import { updateQuerystring } from '@keenmate/svelte-spa-router/helpers/querystring-helpers'

// Define your query parameter types
interface ProductFilters {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  tags?: string[]
  inStock?: boolean
}

// Use with type parameter for full intellisense
const q = $derived(query<ProductFilters>())

// TypeScript knows these properties
const search = $derived(q.search || '')
const category = $derived(q.category || 'all')
const minPrice = $derived(q.minPrice ? Number(q.minPrice) : 0)
const tags = $derived(q.tags || [])  // TypeScript knows this is string[]

// Type-safe updates
await updateQuerystring<ProductFilters>({
  search: 'laptop',
  category: 'electronics',
  minPrice: 500,
  tags: ['gaming', 'portable']
})
</script>`}
				languageType="typescript"
				titleText="TypeScript support"
			/>
		</section>

		<!-- Practical Examples -->
		<section class="mb-5">
			<h2 class="mb-4">Practical Examples</h2>

			<h4>Search with Pagination</h4>
			<CodeBlock
				codeContent={`<script>
import { query } from '@keenmate/svelte-spa-router/helpers/querystring'
import { updateQuerystring } from '@keenmate/svelte-spa-router/helpers/querystring-helpers'

interface SearchQuery {
  search?: string
  page?: number
  limit?: number
}

const q = $derived(query<SearchQuery>())
const search = $derived(q.search || '')
const page = $derived(q.page ? Number(q.page) : 1)
const limit = $derived(q.limit ? Number(q.limit) : 10)

async function handleSearch(value: string) {
  await updateQuerystring({ search: value || undefined, page: 1 })
}

async function changePage(newPage: number) {
  await updateQuerystring({ page: newPage })
}

async function changeLimit(newLimit: number) {
  await updateQuerystring({ limit: newLimit, page: 1 })
}
</script>

<input value={search} oninput={(e) => handleSearch(e.target.value)} />

<div class="pagination">
  <button onclick={() => changePage(page - 1)} disabled={page === 1}>
    Previous
  </button>
  <span>Page {page}</span>
  <button onclick={() => changePage(page + 1)}>
    Next
  </button>
</div>`}
				languageType="svelte"
				titleText="Search with pagination"
			/>

			<h4>Multi-Select Filters</h4>
			<CodeBlock
				codeContent={`<script>
import { query } from '@keenmate/svelte-spa-router/helpers/querystring'
import { updateQuerystring } from '@keenmate/svelte-spa-router/helpers/querystring-helpers'

interface FilterQuery {
  categories?: string[]
  tags?: string[]
}

const q = $derived(query<FilterQuery>())
const selectedCategories = $derived(q.categories || [])
const selectedTags = $derived(q.tags || [])

async function toggleCategory(category: string) {
  const updated = selectedCategories.includes(category)
    ? selectedCategories.filter(c => c !== category)
    : [...selectedCategories, category]

  await updateQuerystring({
    categories: updated.length > 0 ? updated : undefined
  })
}
</script>

<div class="filters">
  {#each ['electronics', 'clothing', 'books'] as category}
    <label>
      <input
        type="checkbox"
        checked={selectedCategories.includes(category)}
        onchange={() => toggleCategory(category)}
      />
      {category}
    </label>
  {/each}
</div>`}
				languageType="svelte"
				titleText="Multi-select filters"
			/>

			<h4>Sort and Order</h4>
			<CodeBlock
				codeContent={`<script>
import { query } from '@keenmate/svelte-spa-router/helpers/querystring'
import { updateQuerystring } from '@keenmate/svelte-spa-router/helpers/querystring-helpers'

interface SortQuery {
  sortBy?: string
  order?: 'asc' | 'desc'
}

const q = $derived(query<SortQuery>())
const sortBy = $derived(q.sortBy || 'name')
const order = $derived(q.order || 'asc')

async function changeSort(field: string) {
  // Toggle order if same field, otherwise default to asc
  const newOrder = sortBy === field && order === 'asc' ? 'desc' : 'asc'

  await updateQuerystring({
    sortBy: field,
    order: newOrder
  })
}
</script>

<table>
  <thead>
    <tr>
      <th onclick={() => changeSort('name')}>
        Name {sortBy === 'name' ? (order === 'asc' ? '↑' : '↓') : ''}
      </th>
      <th onclick={() => changeSort('price')}>
        Price {sortBy === 'price' ? (order === 'asc' ? '↑' : '↓') : ''}
      </th>
    </tr>
  </thead>
</table>`}
				languageType="svelte"
				titleText="Sortable table"
			/>
		</section>

		<!-- Manual Parsing -->
		<section class="mb-5">
			<h2 class="mb-4">Manual Parsing (Without Configuration)</h2>
			<p>You can also parse querystrings manually without global configuration:</p>

			<CodeBlock
				codeContent={`import { parseQuerystring, stringifyQuerystring } from '@keenmate/svelte-spa-router/helpers/querystring-helpers'

// Parse a querystring
const parsed = parseQuerystring('search=foo&tags=a,b,c', {
  arrayFormat: 'auto'
})
// Result: { search: 'foo', tags: ['a', 'b', 'c'] }

// Stringify an object
const qs = stringifyQuerystring({
  search: 'foo',
  tags: ['a', 'b']
}, {
  arrayFormat: 'repeat'
})
// Result: 'search=foo&tags=a&tags=b'`}
				languageType="javascript"
				titleText="Manual parsing"
			/>
		</section>

		<!-- Merge Behavior -->
		<section class="mb-5">
			<h2 class="mb-4">Merge Behavior</h2>
			<p>
				By default, <code>updateQuerystring()</code> merges with existing parameters.
				Use <code>merge: false</code> to replace all parameters:
			</p>

			<CodeBlock
				codeContent={`// Current URL: ?search=laptop&page=2&category=electronics

// Merge (default) - keeps existing parameters
await updateQuerystring({ page: 3 })
// Result: ?search=laptop&page=3&category=electronics

// Replace - removes all other parameters
await updateQuerystring({ page: 1 }, { merge: false })
// Result: ?page=1`}
				languageType="javascript"
				titleText="Merge behavior"
			/>
		</section>

		<!-- Best Practices -->
		<section class="mb-5">
			<h2 class="mb-4">Best Practices</h2>

			<div class="alert alert-success">
				<h5>Use TypeScript Interfaces</h5>
				<p class="mb-0">
					Define interfaces for your query parameters to get full intellisense and catch errors early.
				</p>
			</div>

			<div class="alert alert-info mt-3">
				<h5>Reset Related Parameters</h5>
				<p class="mb-0">
					When changing filters or search, remember to reset the page number to 1.
				</p>
			</div>

			<div class="alert alert-warning mt-3">
				<h5>Handle Missing Parameters</h5>
				<p class="mb-0">
					Always provide defaults when accessing query parameters since they might not be present in the URL.
				</p>
			</div>

			<CodeBlock
				codeContent={`// ✅ Good - provides defaults
const search = $derived(q.search || '')
const page = $derived(q.page ? Number(q.page) : 1)

// ❌ Bad - will be undefined if not in URL
const search = $derived(q.search)
const page = $derived(q.page)`}
				languageType="javascript"
				titleText="Handling defaults"
			/>
		</section>

		<!-- Live Examples -->
		<section class="mb-5">
			<h2 class="mb-4">Try It Live</h2>
			<p>See querystring helpers in action with our interactive demos:</p>
			<div class="d-flex gap-3 flex-wrap">
				<a href="http://localhost:5050/querystring-demo" target="_blank" class="btn btn-primary">
					📊 Querystring Demo
				</a>
			</div>
		</section>
	</div>
</DocLayout>
