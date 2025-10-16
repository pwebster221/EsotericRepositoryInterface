# The Esoteric Repository

## Overview

The Esoteric Repository is a sacred digital space for exploring symbolic correspondences across esoteric systems (tarot, astrology, Kabbalah, runes, typology) and storing personal spiritual work including tarot readings and astral charts. The application combines a knowledge graph backend for navigating interconnected symbolic relationships with a PostgreSQL database for personal data storage.

**Core Purpose**: Enable users to navigate a rich web of symbolic correspondences while maintaining a private collection of their tarot readings and astrological charts.

**Design Philosophy**: Mystical foundation with functional clarity - inspired by Notion and Linear, wrapped in a dark, mystical aesthetic with purple-to-teal gradient accents.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**UI Component System**: 
- shadcn/ui component library (New York style variant)
- Radix UI primitives for accessible, unstyled components
- Tailwind CSS for styling with custom design tokens
- Dark mode as default with light mode support

**Design System**:
- Dark purple-charcoal color palette (240-270 hue range)
- Typography: Inter for UI, JetBrains Mono for data, Cinzel for mystical headers
- Custom CSS variables for theming through `--background`, `--foreground`, `--primary`, etc.
- Elevation system using `hover-elevate` and `active-elevate-2` utility classes

**State Management**:
- TanStack Query (React Query) for server state and API caching
- Custom query client with credential-based authentication
- Local state for UI interactions

**Routing**: 
- Wouter for lightweight client-side routing
- Route protection based on authentication status

**Key Pages**:
- Landing: Unauthenticated entry point
- Dashboard: Overview with quick actions and recent activity
- Readings: Tarot reading collection management
- Charts: Astrological chart storage
- Explore: Neo4j graph navigation interface

### Backend Architecture

**Server Framework**: Express.js with TypeScript

**Authentication**: 
- Replit Auth using OpenID Connect (OIDC)
- Passport.js strategy for session management
- PostgreSQL session storage via connect-pg-simple
- Session-based authentication with httpOnly secure cookies (7-day TTL)

**API Design**:
- RESTful endpoints under `/api` prefix
- Authentication middleware (`isAuthenticated`) protects private routes
- Standardized error handling with status codes

**Database ORM**: 
- Drizzle ORM for type-safe PostgreSQL queries
- Schema-first approach with Zod validation
- Migration management via drizzle-kit

**Development Tools**:
- Hot module replacement via Vite in development
- Custom logging middleware for API requests
- Error overlay for runtime errors

### Data Storage

**PostgreSQL Database** (via Neon serverless):

**Core Tables**:
1. `sessions` - Authentication session storage (required for Replit Auth)
2. `users` - User profiles with extended birth data for natal charts
   - Authentication fields: id, email, firstName, lastName, profileImageUrl
   - Birth data: birthDate, birthTime, birthLocation, birthLatitude, birthLongitude
   - Preferences: houseSystem, zodiacType
3. `readings` - Tarot reading records
   - Fields: id, userId, spreadType, cards (JSONB), question, interpretation, date, isPrivate
4. `charts` - Astrological chart data
   - Fields: id, userId, name, chartType, date, time, location, latitude, longitude, chartData (JSONB), isPrivate

**Graph Database** (Neo4j):
- Connection: `repository.robin-alligator.ts.net:7687`
- Purpose: Symbolic correspondence graph (read-heavy)
- Schema-less property graph model

**Node Types**:
- TarotCard (with MajorArcana, MajesticArcana, MinorArcana labels)
- ZodiacSign
- HeavenlyBody (planets)
- HebrewLetter
- TreeOfLifePath
- MBTIType / CognitiveFunction
- EnneagramType
- Sabbat
- Element
- Rune (Futhark)

**Relationship Types**:
- ELEMENTAL_ASSOCIATION, NUMEROLOGICAL_ASSOCIATION
- CORRESPONDS_TO_LETTER, TRAVERSES_PATH
- EMBODIES_TYPE, EXPRESSES_TYPE
- ASSOCIATED_WITH_SIGN, RULED_BY_PLANET
- PRIMARY_FUNCTION, AUXILIARY, TERTIARY, INFERIOR
- And various other symbolic correspondences

**Neo4j Service**:
- Lazy connection initialization
- Connection pooling via neo4j-driver
- Query methods: getNode, getRelated, findPath, search
- Graceful error handling when Neo4j is not configured

### Authentication & Authorization

**Flow**:
1. User initiates login via `/api/login`
2. OIDC flow with Replit identity provider
3. Callback to `/api/callback` creates/updates user session
4. Session stored in PostgreSQL with 7-day expiry
5. Subsequent requests include session cookie
6. `isAuthenticated` middleware validates session

**User Management**:
- Auto-creation on first login via `upsertUser`
- Profile updates through PATCH `/api/auth/user/birth-data`
- User-scoped data access enforced at storage layer

**Privacy Model**:
- All readings and charts have `isPrivate` boolean flag
- Future-proofed for public sharing features
- User ID scoping on all personal data queries

## External Dependencies

### Third-Party Services

**Replit Infrastructure**:
- Replit Auth (OIDC provider) for authentication
- Environment variables: REPL_ID, REPLIT_DOMAINS, ISSUER_URL, SESSION_SECRET
- Development tools: @replit/vite-plugin-runtime-error-modal, @replit/vite-plugin-cartographer

**Database Services**:
- PostgreSQL (via Neon serverless: @neondatabase/serverless)
- Neo4j graph database (self-hosted at repository.robin-alligator.ts.net)

**Potential Future Integration**:
- Astrology calculation API (referenced in attached_assets/content-1760644381414.md)
- Parameters suggest Swiss Ephemeris-based service for calculating planetary positions, houses, aspects

### Key Libraries

**Frontend**:
- @tanstack/react-query: Server state management
- wouter: Routing
- react-hook-form: Form handling
- @hookform/resolvers: Zod schema validation
- date-fns: Date formatting and manipulation
- lucide-react: Icon system

**Backend**:
- express: HTTP server
- passport: Authentication middleware
- drizzle-orm: Database ORM
- neo4j-driver: Graph database client
- pg: PostgreSQL client
- express-session: Session management
- zod: Runtime validation

**Development**:
- vite: Build tool and dev server
- typescript: Type safety
- tailwindcss: Utility-first CSS
- drizzle-kit: Database migrations
- esbuild: Production server bundling

### API Structure

**Authentication Routes**:
- GET `/api/login` - Initiate OIDC flow
- GET `/api/callback` - OIDC callback handler
- GET `/api/logout` - End session
- GET `/api/auth/user` - Get current user
- PATCH `/api/auth/user/birth-data` - Update birth information

**Readings Routes**:
- GET `/api/readings` - List user's readings
- GET `/api/readings/:id` - Get single reading
- POST `/api/readings` - Create new reading
- DELETE `/api/readings/:id` - Delete reading
- PATCH `/api/readings/:id/privacy` - Toggle privacy

**Charts Routes**:
- GET `/api/charts` - List user's charts
- GET `/api/charts/:id` - Get single chart
- POST `/api/charts` - Create new chart
- DELETE `/api/charts/:id` - Delete chart
- PATCH `/api/charts/:id/privacy` - Toggle privacy

**Graph Exploration Routes** (Neo4j):
- GET `/api/graph/node/:name` - Get node by name
- GET `/api/graph/node/:name/related` - Get related nodes
- GET `/api/graph/path` - Find path between nodes (query params: from, to)
- GET `/api/graph/search` - Search nodes (query param: query)
- GET `/api/graph/stats` - Get database statistics