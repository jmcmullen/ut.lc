# Ultra Tiny Link Creator

A high-performance URL shortening service built as a modern monorepo, featuring analytics tracking, REST API, and a responsive web interface.

## Features

### 🔗 URL Shortening

- Automatic 7-character code generation with smart character set (excludes confusing characters)
- Custom short codes support (4-32 characters)
- URL expiration dates and active/inactive status management
- CRUD operations for URL management

### 📊 Analytics & Tracking

- Comprehensive click analytics with privacy-safe hashed IP storage
- Geographic tracking (country, region, city coordinates)
- Device and browser analytics (user agent, OS, device type)
- Referrer tracking and domain analysis
- Unique visitor counting and statistical reporting

### 🚀 REST API

- Complete RESTful API with OpenAPI documentation
- Type-safe endpoints using ORPC framework
- Paginated responses for efficient data browsing
- Input validation with detailed error messages

### 💻 Modern Tech Stack

- **Frontend**: TanStack Router, React 19, TypeScript, Tailwind CSS
- **Backend**: Node.js, ORPC, Drizzle ORM, PostgreSQL
- **Monorepo**: Turborepo, pnpm workspaces
- **Testing**: Vitest, ESLint, Prettier

## Project Structure

```
├── apps/
│   └── web/                 # TanStack Start web application
├── packages/               # Shared packages (future expansion)
├── tooling/               # Shared development tooling
│   ├── eslint/           # ESLint configurations
│   ├── prettier/         # Prettier configuration
│   ├── tailwind/         # Tailwind CSS configurations
│   └── typescript/       # TypeScript configurations
└── turbo/                # Turborepo configuration
```

## Getting Started

### Prerequisites

- Node.js 22+
- PostgreSQL database
- pnpm package manager

### Installation

1. **Clone and install dependencies:**

```bash
git clone <repository-url>
cd ultra-tiny-link-creator
pnpm install
```

2. **Configure environment:**

```bash
cd apps/web
cp .env.example .env
```

Configure your `DATABASE_URL` and other environment variables.

3. **Database setup:**

```bash
# Apply migrations
pnpm --filter web db:migrate
```

4. **Start development:**

```bash
pnpm dev
```

This starts all apps in development mode with hot reloading.

## Development

### Available Commands

```bash
# Development
pnpm dev              # Start all apps in development mode
pnpm build            # Build all apps
pnpm test             # Run tests across the monorepo
pnpm lint             # Lint all packages
pnpm format           # Format code with Prettier

# App-specific commands (from root)
pnpm --filter web dev         # Run only the web app
pnpm --filter web test        # Test only the web app
pnpm --filter web db:migrate  # Run database migrations
```

### Adding New Packages

```bash
pnpm turbo gen init
```

This will scaffold a new package with all necessary configurations.

## API Documentation

The web application provides comprehensive REST API endpoints:

- `GET /api/v1/url` - List all URLs with pagination
- `POST /api/v1/url` - Create a new shortened URL
- `PATCH /api/v1/url/{id}` - Update an existing URL
- `DELETE /api/v1/url/{id}` - Delete a URL
- `GET /api/v1/click` - List click analytics
- `GET /api/v1/click/stats/{urlId}` - Get detailed analytics for a URL

## Production Deployment

### Building for Production

```bash
pnpm build
pnpm --filter web start
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
