# The Esoteric Repository: Design Guidelines

## Design Approach

**Hybrid Approach**: Mystical Foundation + Functional Clarity
- **Primary Inspiration**: Notion (knowledge management), Linear (data-dense clarity), with mystical/esoteric visual layer
- **Design Philosophy**: Create a sacred digital space that feels both ancient and modern - where complex symbolic relationships are navigable and personal spiritual work is honored

## Core Design Elements

### A. Color Palette

**Dark Mode Primary** (default):
- Background Base: 240 8% 8% (deep charcoal-purple)
- Surface Layer: 250 12% 12% (elevated panels)
- Surface Elevated: 250 14% 16% (cards, modals)
- Text Primary: 250 10% 95%
- Text Secondary: 250 8% 70%
- Primary Accent: 270 60% 65% (mystical purple)
- Secondary Accent: 280 50% 75% (lighter violet for graph nodes)
- Success/Confirmation: 160 50% 60% (muted green)
- Warning: 30 65% 65% (amber)
- Graph Relationships: Use purple-to-teal gradient spectrum (270→180 hue range)

**Light Mode**:
- Background: 250 25% 98%
- Surface: 250 20% 100%
- Text Primary: 250 20% 12%
- Text Secondary: 250 15% 40%
- Primary Accent: 270 55% 50%
- Graph on light: Use deeper saturations

### B. Typography

**Font Stack**:
- Headings: "Inter" (clean, modern) - weights 600-700
- Body: "Inter" - weights 400-500
- Monospace (data/coordinates): "JetBrains Mono" - weight 400
- Display/Mystical Headers: "Cinzel" (for section titles like "The Hermetic Path") - weight 600

**Scale**:
- H1: text-4xl md:text-5xl font-semibold (hero headers)
- H2: text-2xl md:text-3xl font-semibold (section titles)
- H3: text-xl font-semibold (card titles)
- Body: text-base leading-relaxed
- Caption: text-sm text-secondary
- Graph Labels: text-xs font-medium

### C. Layout System

**Spacing Primitives**: Use Tailwind units 2, 4, 6, 8, 12, 16
- Component padding: p-4 to p-8
- Section spacing: py-12 to py-16
- Card gaps: gap-4 to gap-6
- Max widths: max-w-7xl (main content), max-w-2xl (forms/readings)

**Grid Strategy**:
- Dashboard: 12-column responsive grid
- Reading Lists: Single column on mobile, 2-column md:, 3-column lg:
- Graph Explorer: Full-width panels with collapsible sidebars

### D. Component Library

**Navigation**:
- Top nav: Sticky header with logo, main nav links, user profile dropdown
- Sidebar: Collapsible left sidebar for quick access (Readings, Charts, Explore, Profile)
- Breadcrumbs: For deep graph exploration to maintain context

**Forms (Critical for Mobile)**:
- Tarot Input: Card selector with visual thumbnail grid, orientation toggle (upright/reversed)
- Birth Data: Date/time/location inputs with location autocomplete
- Large touch targets (min 44px height)
- Clear field labels above inputs
- Multi-step forms with progress indicators

**Data Display**:
- Reading Cards: Card image thumbnail, date, spread type, preview text
- Chart Cards: Birth data summary, chart wheel thumbnail, date
- Graph Nodes: Circular nodes with icon/symbol, colored by type (card=purple, planet=blue, element=red)
- Aspect Grid: Traditional table with colored aspect glyphs

**Graph Visualization**:
- Force-directed layout using react-force-graph-2d
- Node colors by domain (Tarot: purple, Astrology: blue, Runes: green)
- Relationship lines: Curved paths with subtle glow effect
- Hover states: Expand node with relationship labels
- Zoom/pan controls with reset button

**Overlays**:
- Modals: Centered with backdrop blur, rounded-2xl
- Side panels: Slide from right for details (reading/chart detail view)
- Tooltips: On graph nodes and relationship lines (context property display)

**Unique Components**:
- Tarot Spread Visualizer: SVG layout of spread positions (Celtic Cross, 3-card, etc.)
- Natal Chart Wheel: Circular SVG chart with houses, planets, aspects
- Path Finder Results: Tree/list hybrid showing relationship chains
- Pattern Search Builder: Tag-based query builder with AND/OR logic

### E. Animations

**Minimal Motion**:
- Page transitions: Subtle fade (150ms)
- Modal entry: Scale from 0.95 to 1 (200ms) with fade
- Graph node hover: Scale 1.1 with glow (150ms)
- Card hover: Lift with shadow (100ms)
- NO parallax, NO scroll animations, NO autoplay carousels

## Interface-Specific Design

### Authentication Pages
- Centered card layout on dark background
- Replit Auth button prominent with gradient border
- "Sign in to access your spiritual repository" tagline
- Minimal decoration: subtle celestial background pattern

### Dashboard (Post-Login)
- Top: Welcome + Today's lunar/solar summary card (from /today endpoint)
- Quick Actions: "New Reading", "New Chart", "Explore Graph" buttons
- Recent Activity: Timeline of last 5 readings/charts
- Statistics: Reading count, most-drawn cards, chart count

### Tarot Reading Input
- Step 1: Select spread template (grid of spread cards)
- Step 2: For each position, tap to select card from visual grid
- Step 3: Toggle orientation, add interpretation (expandable text area)
- Step 4: Overall synthesis + tags
- Progress bar at top
- Save as Private (default) or Share to Repository toggle

### Reading Library
- Filter bar: Date range, card name, spread type, tags
- Grid of reading cards (3 columns desktop, 1 mobile)
- Each card: Spread thumbnail, date, key cards highlighted
- Click to open detail side panel

### Astral Chart Input
- Single-page form with sections:
  - Birth Data (date/time/location with map preview)
  - Calculation Options (house system, zodiac type)
  - Name/Description
- "Calculate Chart" button calls Swiss Ephemeris API
- Loading state with celestial animation
- Display chart wheel + data table on success

### Chart Library
- Similar to reading library but with chart wheel thumbnails
- Filter by date, chart type (natal/transit)
- Detail view: Full chart wheel, aspect grid, planet positions table

### Graph Explorer (Main Feature)
- Left sidebar: Domain filter (Tarot, Astrology, Kabbalah, etc.)
- Center: Force-directed graph canvas
- Right panel (collapsible): Selected node details + immediate connections
- Search bar: Quick node lookup
- Mode toggle: Node Explorer / Path Finder / Pattern Search

**Path Finder Mode**:
- Two search inputs: "From" and "To" nodes
- Depth slider (1-5)
- Results: List of paths with relationship chains
- Click path to highlight in graph

**Pattern Search Mode**:
- Query builder: "Find cards WHERE element = Fire AND planet = Mars"
- Tag selection interface
- Results grid: Matching nodes with preview cards

## Images

**Hero Section**: NO traditional hero image
**Dashboard Cards**: Use astrological/tarot symbolism as background patterns (subtle, low opacity)
**Reading Cards**: Tarot card thumbnails (user-selected cards during reading)
**Chart Cards**: Generated natal chart wheel thumbnails
**Graph Nodes**: Icon-based (Font Awesome celestial icons: fa-star, fa-moon, fa-sun, etc.)
**Empty States**: Minimalist illustrations (e.g., "No readings yet" with open book icon)

## Accessibility & Polish

- Dark mode default with light mode toggle (persistent user preference)
- All form inputs maintain consistent dark styling
- Focus indicators: Purple outline ring
- Skip navigation links for keyboard users
- Graph zoom/pan keyboard controls (arrow keys)
- Reading time estimates for long interpretations
- Export buttons (Markdown/JSON) on readings/charts
- Private/shared status badge on all cards
- Responsive breakpoints: sm (640), md (768), lg (1024), xl (1280)