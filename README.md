# URL Shortener App

A URL shortening web application built with TanStack Router that integrates with the cleanURI API.

## Features

- Shorten any valid URL using the cleanURI API
- View history of shortened links (persists after browser refresh)
- Copy shortened URLs to clipboard in a single click
- Responsive design for all device sizes
- Form validation with error messaging

## Getting Started

From your terminal:

```sh
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

This starts the app in development mode, rebuilding assets on file changes.

## Building for Production

```sh
pnpm build
pnpm start
```

## Technologies Used

- TanStack Router for routing
- Server actions for data fetching
- TypeScript for type safety
- Tailwind CSS for styling
