# Changelog

All notable changes to the svelte-spa-router showcase site will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- **Router dependency bumped to `@keenmate/svelte-spa-router@^5.3.0`** (from `^5.3.0-rc02`) — tracks the published stable release.
- **Documentation refreshed for the stable v5.3.0 release** — the site previously framed 5.3.0 as an in-progress release candidate. Now that 5.3.0 is published as a single stable version, all RC version labels were rewritten to the stable version where each feature actually shipped:
  - **What's New** (`/whats-new`) — collapsed the separate `v5.3.0-rc01` / `v5.3.0-rc02` sections into one stable **v5.3.0** section, and added a **v5.2.1** section so the page shows the two most recent releases. The `isHidden → hidden` rename is no longer presented as a breaking headline (it never shipped in a stable release); it survives only as a short "pre-release adopters only" note. Install snippet updated to `@keenmate/svelte-spa-router@5.3.0`.
  - **Migration Guide** (`/migration`) — reframed "Upgrading within v5.x" to target stable **v5.3.0** (no code changes required for stable upgraders); demoted the `isHidden → hidden` note to a pre-release-only callout. Relabeled the `showToast` removal, `navigationContext()` null-return change, and the "new features worth adopting" list to their stable versions (**v5.2.0**). Cleaned up confusing internal `rc12`/`rc01` references in the `routeContext()` note.
  - **API Reference** (`/api`) — `defineRoutes()`, `setCurrentUser()`, `getCurrentUser()`, `revalidateCurrentRoute()`, and `onRevalidationFailure` badges/comments relabeled from `rc01`/`rc02` to **v5.2.0**.
  - **Permissions** (`/features/permissions`) — reactive-permissions, `setCurrentUser()`, and `revalidateCurrentRoute()` labels relabeled from `rc02` to **v5.2.0**.
  - **Callbacks & Events** (`/features/callbacks-events`) — `relativeLocation`, nested-router relative location, and the `onNotFound` catch-all fix relabeled from `rc02` to **v5.2.0**.
  - **Error Handling** (`/features/error-handling`) — `showToast` removal relabeled from `v5.2.0-rc02` to **v5.2.0**.
  - **Route Configuration** (`/features/route-configuration`) — `hideLoading()` safety-net note relabeled from `v5.2.0-rc02` to **v5.2.0**.

### Added

- **Referrer Tracking Documentation** - Comprehensive documentation page at `/features/referrer-tracking`
  - Overview of automatic previous route tracking
  - Configuration guide for `setIncludeReferrer()` with three modes: 'never', 'notfound', 'always'
  - Referrer object structure documentation (location, querystring, params, routeName)
  - `goBack()` helper function with automatic scroll position restoration
  - Manual navigation pattern examples
  - Benefits comparison table vs `history.back()`
  - Common use cases: 404 pages, analytics, protected routes, return URLs
  - Implementation details and timing behavior
  - Best practices and pitfalls

### Changed

- **Router Dependency** - Updated from local file reference to `@keenmate/svelte-spa-router@^5.0.0-rc10`
  - Enables building showcase from published package
  - Tracks latest router release with referrer tracking and debug logging features

### Navigation

- Added "Referrer Tracking" link to Features section in main navigation menu

## [1.0.0] - Initial Release

### Added

- Initial showcase site for @keenmate/svelte-spa-router
- Documentation for core features:
  - Routing Modes (hash-based and history API)
  - Route Configuration
  - Route Parameters
  - Navigation Guards
  - Named Routes
  - Programmatic Navigation
  - Querystring Handling
  - Metadata Management
  - Permissions System
  - Multi-zone Routing
  - Hierarchical Routes
  - Error Handling
  - Active Link Highlighting
  - Nested Routes
- Interactive examples and code snippets
- Built with SvelteKit and @keenmate/svelte-docs
- Bootstrap 5 styling
