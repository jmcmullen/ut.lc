# URL Shortener App

A full-stack URL shortening web application built with TanStack Router featuring a complete REST API, analytics tracking, and database persistence.

## Features

### Core URL Shortening

- Create shortened URLs with automatic 7-character code generation
- Custom short codes support (4-32 characters) with validation
- URL expiration dates and active/inactive status management
- Smart character set (excludes confusing characters like 0, O, I, l)
- CRUD operations for URL management

### Analytics & Tracking

- Comprehensive click analytics with privacy-safe hashed IP storage
- Geographic tracking (country, region, city coordinates)
- Device and browser analytics (user agent, OS, device type)
- Referrer tracking and domain analysis
- Unique visitor counting and statistical reporting
- Real-time click tracking on URL redirects

### REST API

- Complete RESTful API with OpenAPI documentation
- Type-safe endpoints using ORPC framework
- Paginated responses for efficient data browsing
- Input validation with detailed error messages
- Comprehensive analytics endpoints

### Frontend Features

- Responsive design for all device sizes
- Copy shortened URLs to clipboard in a single click
- Form validation with error messaging
- Real-time URL shortening interface

### Database & Infrastructure

- PostgreSQL database with Drizzle ORM

## Getting Started

### Prerequisites

- Node.js 22+
- PostgreSQL database
- pnpm package manager

### Setup

1. **Clone and install dependencies:**

```sh
git clone <repository-url>
cd terem-url-test
pnpm install
```

2. **Environment configuration:**

```sh
cp .env.example .env
```

Configure your `DATABASE_URL` and other environment variables.

3. **Database setup:**

```sh
# Apply migrations
pnpm db:migrate
```

4. **Start development server:**

```sh
pnpm dev
```

This starts the app in development mode, rebuilding assets on file changes.

### API Endpoints

The application provides REST API endpoints:

- `GET /api/v1/url` - List all URLs with pagination
- `POST /api/v1/url` - Create a new shortened URL
- `PATCH /api/v1/url/{id}` - Update an existing URL
- `DELETE /api/v1/url/{id}` - Delete a URL
- `GET /api/v1/click` - List click analytics
- `GET /api/v1/click/stats/{urlId}` - Get detailed analytics for a URL

## Building for Production

```sh
pnpm build
pnpm start
```

## Testing

```sh
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run linting
pnpm lint
```

## Technologies Used

### Frontend

- **TanStack Router** - Type-safe routing
- **TanStack Start** - Full-stack React framework
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first styling
- **Zod** - Runtime type validation

### Backend & API

- **oRPC** - Type-safe RPC framework with OpenAPI support
- **Drizzle ORM** - Type-safe database operations
- **PostgreSQL** - Primary database
- **Node.js** - Runtime environment

### Development & Testing

- **Vitest** - Unit testing framework
- **ESLint & Prettier** - Code quality and formatting
- **GitHub Actions** - CI/CD pipeline
- **Drizzle Kit** - Database migration management
