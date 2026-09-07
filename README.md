# Rarebridge Frontend

Rarebridge is a React + Vite frontend for a health and disease information platform. The app includes landing, directory, disease detail, research, specialists, community, and auth flows with a polished UI built from React, Tailwind-inspired styling, and reusable shadcn-style components.

## Features

- Responsive landing page and navigation
- Disease directory and disease detail experience
- Research, specialist, and community sections
- Authentication screens for sign in and sign up
- Reusable UI primitives and modular page structure
- Vite-based frontend tooling for rapid development and production builds

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS (via Vite plugin)
- Radix UI primitives and custom UI components
- MUI and Emotion utilities
- React Router + custom page state navigation

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm or pnpm

### Install dependencies

```bash
npm install
```

Or with pnpm:

```bash
pnpm install
```

### Run the development server

```bash
npm run dev
```

Then open the local URL shown in the terminal (typically http://localhost:5173).

### Build for production

```bash
npm run build
```

This creates the production bundle in the `dist` folder.

## Project Structure

```text
src/
  app/
    App.tsx
    data.ts
    components/
    pages/
    services/
    utils/
  styles/
public/
index.html
vite.config.ts
package.json
pnpm-workspace.yaml
```

## Notes

- The app is structured as a single-page frontend with view-based navigation handled in the main app component.
- The project includes custom visual effects and sound hooks for interactive UI experiences.
- If you are working with a design asset pipeline, the Vite config includes a custom asset resolver for `rarebridge:asset/...` imports.

## License

This project does not include a license file yet. Add a license if you intend to publish or distribute it publicly.
