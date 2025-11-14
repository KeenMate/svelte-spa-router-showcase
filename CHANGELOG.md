# Changelog

All notable changes to the svelte-spa-router showcase site will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
