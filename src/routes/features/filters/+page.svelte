<script>
import { DocLayout, CodeBlock } from '@keenmate/svelte-docs'
</script>

<DocLayout
	titleText="Filter Helpers"
	descriptionText="Flexible filter system for URL-driven UI state">

	<div class="py-1">
		<div class="alert alert-info mb-4">
			<strong>Live demo:</strong>
			<a href="https://history.svelte-spa-router.keenmate.dev/filters-demo" target="_blank">
				Open <code>/filters-demo</code> →
			</a>
			The example app runs filters in <strong>structured (OData-style)</strong> mode — see
			<code>example/src/main.js</code> for the <code>configureFilters()</code> call.
		</div>

		<!-- Introduction -->
		<section class="mb-5">
			<h2 class="mb-4">URL-Based Filtering</h2>
			<p class="lead">
				The filter system provides a flexible way to manage filters in your URL, supporting both
				flat (separate parameters) and structured (single parameter with custom syntax) modes.
			</p>
		</section>

		<!-- Configuration -->
		<section class="mb-5">
			<h2 class="mb-4">Configuration</h2>
			<p>Configure the filter system once in your <code>main.js</code>:</p>

			<CodeBlock
				codeContent={`// main.js
import { configureFilters } from '@keenmate/svelte-spa-router/helpers/filters'

configureFilters({
  mode: 'flat'  // 'flat' or 'structured'
})

// Now mount your app
mount(App, { target: document.body })`}
				languageType="javascript"
				titleText="Configure filters"
			/>
		</section>

		<!-- Flat Mode -->
		<section class="mb-5">
			<h2 class="mb-4">Flat Mode (Default)</h2>
			<p>
				In flat mode, each filter is a separate query parameter. This is the simplest and most common approach.
			</p>

			<h4 class="mt-4">Basic Usage</h4>
			<CodeBlock
				codeContent={`<script>
import { filters, updateFilters } from '@keenmate/svelte-spa-router/helpers/filters'

// Define filter type for intellisense
interface ProductFilters {
  search?: string
  category?: string
  status?: 'active' | 'discontinued'
  minPrice?: number
  maxPrice?: number
}

// Access filters reactively
const f = $derived(filters<ProductFilters>())
const search = $derived(f.search || '')
const category = $derived(f.category || 'all')
const status = $derived(f.status || 'active')
</script>

<p>Search: {search}</p>
<p>Category: {category}</p>
<p>Status: {status}</p>

<!-- URL: ?search=laptop&category=electronics&status=active -->`}
				languageType="svelte"
				titleText="Reading filters"
			/>

			<h4 class="mt-4">Updating Filters</h4>
			<CodeBlock
				codeContent={`<script>
import { filters, updateFilters } from '@keenmate/svelte-spa-router/helpers/filters'

const f = $derived(filters<ProductFilters>())

// Update single filter (merges with existing)
async function handleSearchChange(value: string) {
  await updateFilters<ProductFilters>({
    search: value || undefined  // undefined removes it
  })
}

// Update multiple filters
async function applyFilters(category: string, minPrice: number) {
  await updateFilters<ProductFilters>({
    category,
    minPrice,
    search: undefined  // Clear search when changing category
  })
}

// Clear all filters
async function clearAllFilters() {
  await updateFilters<ProductFilters>({
    search: undefined,
    category: undefined,
    status: undefined,
    minPrice: undefined,
    maxPrice: undefined
  }, { merge: false })  // Replace instead of merge
}
</script>`}
				languageType="svelte"
				titleText="Updating filters"
			/>
		</section>

		<!-- Structured Mode -->
		<section class="mb-5">
			<h2 class="mb-4">Structured Mode (OData-style)</h2>
			<p>
				In structured mode, all filters are combined into a single query parameter with custom syntax.
				This is useful when integrating with APIs that expect OData-style filters.
			</p>

			<h4 class="mt-4">Configuration</h4>
			<CodeBlock
				codeContent={`// main.js
import { configureFilters } from '@keenmate/svelte-spa-router/helpers/filters'

configureFilters({
  mode: 'structured',
  paramName: '$filter',  // Query parameter name
  parse: (filterString) => {
    // Parse "displayName eq 'john' AND status eq 'active'"
    const parts = filterString.split(' AND ')
    const result = {}
    parts.forEach(part => {
      const [field, , value] = part.split(' ')
      result[field] = value.replace(/'/g, '')
    })
    return result
  },
  stringify: (filters) => {
    // Convert object to OData filter string
    return Object.entries(filters)
      .filter(([, v]) => v !== null && v !== undefined)
      .map(([k, v]) => \`\${k} eq '\${v}'\`)
      .join(' AND ')
  }
})`}
				languageType="javascript"
				titleText="Structured mode configuration"
			/>

			<h4 class="mt-4">Usage</h4>
			<p>The API remains the same regardless of mode:</p>

			<CodeBlock
				codeContent={`<script>
import { filters, updateFilters } from '@keenmate/svelte-spa-router/helpers/filters'

// Same API as flat mode!
const f = $derived(filters())
const search = $derived(f.search || '')

await updateFilters({ search: 'java', status: 'active' })
// Result URL: ?$filter=search eq 'java' AND status eq 'active'
</script>`}
				languageType="svelte"
				titleText="Using structured mode"
			/>
		</section>

		<!-- undefined vs null -->
		<section class="mb-5">
			<h2 class="mb-4">undefined vs null</h2>
			<p>Understanding the difference is important for controlling URL parameters:</p>

			<CodeBlock
				codeContent={`// undefined: Removes the parameter completely
await updateFilters({ search: undefined })
// Result: parameter removed from URL

// null: Keeps parameter with empty value (or removes based on config)
await updateFilters({ search: null })
// Flat mode: Removes it by default
// Structured mode: Behavior depends on stringify function`}
				languageType="javascript"
				titleText="undefined vs null"
			/>
		</section>

		<!-- Practical Examples -->
		<section class="mb-5">
			<h2 class="mb-4">Practical Examples</h2>

			<h4>Product Search & Filter</h4>
			<CodeBlock
				codeContent={`<script>
import { filters, updateFilters } from '@keenmate/svelte-spa-router/helpers/filters'

interface ProductFilters {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
}

const f = $derived(filters<ProductFilters>())
const search = $derived(f.search || '')
const category = $derived(f.category || 'all')
const minPrice = $derived(f.minPrice ? Number(f.minPrice) : 0)
const maxPrice = $derived(f.maxPrice ? Number(f.maxPrice) : Infinity)
const inStock = $derived(f.inStock === 'true')

// Apply search
async function handleSearch(value: string) {
  await updateFilters({ search: value || undefined })
}

// Toggle in-stock filter
async function toggleInStock() {
  await updateFilters({
    inStock: !inStock ? true : undefined
  })
}
</script>

<input
  type="text"
  value={search}
  placeholder="Search products..."
  oninput={(e) => handleSearch(e.target.value)}
/>

<select onchange={(e) => updateFilters({ category: e.target.value })}>
  <option value="">All Categories</option>
  <option value="electronics">Electronics</option>
  <option value="clothing">Clothing</option>
  <option value="books">Books</option>
</select>

<label>
  <input
    type="checkbox"
    checked={inStock}
    onchange={toggleInStock}
  />
  In Stock Only
</label>`}
				languageType="svelte"
				titleText="Product filters"
			/>

			<h4>Multi-Select Category Filter</h4>
			<CodeBlock
				codeContent={`<script>
import { filters, updateFilters } from '@keenmate/svelte-spa-router/helpers/filters'

interface FilterParams {
  categories?: string[]
  tags?: string[]
}

const f = $derived(filters<FilterParams>())
const selectedCategories = $derived(f.categories || [])
const selectedTags = $derived(f.tags || [])

async function toggleCategory(category: string) {
  const updated = selectedCategories.includes(category)
    ? selectedCategories.filter(c => c !== category)
    : [...selectedCategories, category]

  await updateFilters({
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
</div>

<!-- URL: ?categories=electronics&categories=books -->`}
				languageType="svelte"
				titleText="Multi-select filters"
			/>

			<h4>Date Range Filter</h4>
			<CodeBlock
				codeContent={`<script>
import { filters, updateFilters } from '@keenmate/svelte-spa-router/helpers/filters'

interface DateFilters {
  startDate?: string
  endDate?: string
}

const f = $derived(filters<DateFilters>())
const startDate = $derived(f.startDate || '')
const endDate = $derived(f.endDate || '')

async function updateDateRange(start: string, end: string) {
  await updateFilters({
    startDate: start || undefined,
    endDate: end || undefined
  })
}
</script>

<input
  type="date"
  value={startDate}
  onchange={(e) => updateDateRange(e.target.value, endDate)}
/>

<input
  type="date"
  value={endDate}
  onchange={(e) => updateDateRange(startDate, e.target.value)}
/>`}
				languageType="svelte"
				titleText="Date range filter"
			/>
		</section>

		<!-- Merge Behavior -->
		<section class="mb-5">
			<h2 class="mb-4">Merge Behavior</h2>
			<p>
				By default, <code>updateFilters()</code> merges with existing filters.
				Use <code>merge: false</code> to replace all filters:
			</p>

			<CodeBlock
				codeContent={`// Current URL: ?search=laptop&category=electronics&inStock=true

// Merge (default) - keeps existing filters
await updateFilters({ category: 'books' })
// Result: ?search=laptop&category=books&inStock=true

// Replace - removes all other filters
await updateFilters({ category: 'books' }, { merge: false })
// Result: ?category=books`}
				languageType="javascript"
				titleText="Merge behavior"
			/>
		</section>

		<!-- TypeScript Support -->
		<section class="mb-5">
			<h2 class="mb-4">TypeScript Support</h2>
			<p>Define types for full intellisense and type safety:</p>

			<CodeBlock
				codeContent={`<script lang="ts">
import { filters, updateFilters } from '@keenmate/svelte-spa-router/helpers/filters'

// Define filter types
interface ProductFilters {
  search?: string
  category?: 'electronics' | 'clothing' | 'books'
  minPrice?: number
  maxPrice?: number
  sort?: 'price' | 'name' | 'date'
  order?: 'asc' | 'desc'
}

// Type-safe filter access
const f = $derived(filters<ProductFilters>())
const category = $derived(f.category || 'electronics')  // TypeScript knows valid values

// Type-safe updates
await updateFilters<ProductFilters>({
  category: 'electronics',  // ✅ Valid
  sort: 'price',            // ✅ Valid
  // category: 'invalid'    // ❌ TypeScript error
})
</script>`}
				languageType="typescript"
				titleText="TypeScript filters"
			/>
		</section>

		<!-- Best Practices -->
		<section class="mb-5">
			<h2 class="mb-4">Best Practices</h2>

			<div class="alert alert-success">
				<h5>Provide Default Values</h5>
				<p class="mb-0">
					Always provide defaults when reading filters to handle missing values gracefully.
				</p>
			</div>

			<CodeBlock
				codeContent={`// ✅ Good - provides defaults
const search = $derived(f.search || '')
const category = $derived(f.category || 'all')
const page = $derived(f.page ? Number(f.page) : 1)

// ❌ Bad - will be undefined if not in URL
const search = $derived(f.search)
const category = $derived(f.category)`}
				languageType="javascript"
				titleText="Providing defaults"
			/>

			<div class="alert alert-info mt-3">
				<h5>Reset Related Filters</h5>
				<p class="mb-0">
					When changing major filters like category, consider resetting pagination or other related filters.
				</p>
			</div>

			<CodeBlock
				codeContent={`// When changing category, reset page to 1
await updateFilters({
  category: newCategory,
  page: 1  // Reset pagination
})`}
				languageType="javascript"
				titleText="Resetting related filters"
			/>

			<div class="alert alert-warning mt-3">
				<h5>Use undefined to Remove</h5>
				<p class="mb-0">
					Set filter values to <code>undefined</code> (not empty string) to remove them from the URL.
				</p>
			</div>

			<CodeBlock
				codeContent={`// ✅ Good - removes from URL
await updateFilters({ search: undefined })

// ❌ Bad - keeps in URL as empty value
await updateFilters({ search: '' })`}
				languageType="javascript"
				titleText="Removing filters"
			/>
		</section>

		<!-- Filters vs Querystring -->
		<section class="mb-5">
			<h2 class="mb-4">Filters vs Querystring</h2>
			<p>When should you use filters vs querystring helpers?</p>

			<div class="row g-4">
				<div class="col-md-6">
					<div class="card h-100">
						<div class="card-header bg-primary text-white">
							<h5 class="mb-0">Use Filters When:</h5>
						</div>
						<div class="card-body">
							<ul class="mb-0">
								<li>Building search/filter UIs</li>
								<li>Need structured mode (OData)</li>
								<li>Want semantic separation from routing</li>
								<li>Integrating with backend filter APIs</li>
							</ul>
						</div>
					</div>
				</div>

				<div class="col-md-6">
					<div class="card h-100">
						<div class="card-header bg-success text-white">
							<h5 class="mb-0">Use Querystring When:</h5>
						</div>
						<div class="card-body">
							<ul class="mb-0">
								<li>General query parameters</li>
								<li>Don't need structured mode</li>
								<li>Simple key-value parameters</li>
								<li>Prefer standard query format</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			<div class="alert alert-info mt-3">
				<strong>Note:</strong> Both systems work with the same underlying URL query parameters.
				Choose based on your API requirements and preference.
			</div>
		</section>

		<!-- Live Examples -->
		<section class="mb-5">
			<h2 class="mb-4">Try It Live</h2>
			<p>See filters in action with our interactive demo:</p>
			<div class="d-flex gap-3 flex-wrap">
				<a href="http://localhost:5050/filters" target="_blank" class="btn btn-primary">
					🔍 Filter Demo
				</a>
			</div>
		</section>
	</div>
</DocLayout>
