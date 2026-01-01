# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Paragraph splitting improvement (pattern-based auto-split)
- Deployment workflow (Vercel / GitHub Actions)
- Tag/category filtering
- Search functionality

---

## [0.2.0] - 2024-12-31

### Added
- Folder-based content structure (`contents/{slug}/meta.yaml + en.md + ko.md`)
- Centralized metadata management via `meta.yaml`
- Data structure design document (`docs/DATA_STRUCTURE_PROPOSAL.md`)

### Changed
- Language codes from `english`/`korean` to ISO 639-1 (`en`/`ko`)
- Content files no longer include date in filename (managed in `meta.yaml`)
- Removed frontmatter from language files (pure markdown only)
- Updated all components to use new type definitions

### Migration
- Existing content migrated to new folder structure
- Old files moved to `.trash/` directory

---

## [0.1.1] - 2024-12-30

### Fixed
- Bullet points (list-disc) and numbered lists (list-decimal) now display correctly in prose content

---

## [0.1.0] - 2024-12-28

### Added
- Initial release with reader interface
- Three layout modes: side-by-side, top-bottom, toggle
- Dark mode support with system preference detection
- Paragraph-level highlight synchronization
- Responsive design (layout persists regardless of screen width)
- Markdown content parsing with YAML frontmatter
- Article list page
- Individual article reader page
