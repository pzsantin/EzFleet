# EzFleet - Fleet Management Dashboard

A modern, responsive fleet management and route optimization dashboard built with React, TypeScript, and Tailwind CSS.

## Project Overview

EzFleet is a comprehensive fleet management application designed to help organizations efficiently manage their vehicles, plan routes, and execute missions. The application provides real-time tracking, mission management, vehicle oversight, and route optimization capabilities.

## Technologies Used

This project is built with:

- **Vite** - Next generation frontend build tool
- **TypeScript** - Type-safe JavaScript
- **React 18** - Modern UI library
- **shadcn/ui** - High-quality, accessible UI components
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Supabase** - Authentication and database
- **React Query** - Server state management
- **Leaflet & React Leaflet** - Interactive maps
- **Recharts** - Data visualization
- **Sonner** - Toast notifications

## Getting Started

### Prerequisites

- Node.js (18+) and npm/bun installed

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd fleet-mapper-pro

# Install dependencies
bun install
# or
npm install
```

### Development

```sh
# Start the development server
bun dev
# or
npm run dev
```

The application will be available at `http://localhost:8080`

## Build

```sh
# Build for production
bun run build
# or
npm run build

# Preview production build
npm run preview
```

## Testing

```sh
# Run tests
bun test
# or
npm test

# Run tests in watch mode
bun test:watch
# or
npm run test:watch
```

## Linting

```sh
# Run ESLint
bun lint
# or
npm run lint
```

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── DashboardLayout  # Main layout component
│   ├── NavLink          # Navigation component
│   ├── ProtectedRoute   # Route protection wrapper
│   └── RouteMap         # Interactive map component
├── pages/
│   ├── Index            # Dashboard home page
│   ├── AuthPage         # Authentication page
│   ├── VehiclesPage     # Vehicle management
│   ├── MissionsPage     # Mission overview
│   ├── NewMissionPage   # Create new mission
│   ├── MissionDetailPage # Mission details
│   └── NotFound         # 404 page
├── contexts/
│   └── AuthContext      # Authentication context
├── integrations/
│   └── supabase/        # Supabase client configuration
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── types/               # TypeScript type definitions
└── data/                # Mock data for development
```

## Features

- **Authentication** - Secure login/signup with Supabase
- **Dashboard** - Real-time fleet overview with key metrics
- **Vehicle Management** - Track and manage fleet vehicles
- **Mission Planning** - Create and manage delivery missions
- **Route Optimization** - Interactive map-based route planning
- **Real-time Tracking** - Monitor vehicle locations and status
- **Data Visualization** - Charts and graphs for fleet analytics
- **Responsive Design** - Optimized for desktop and mobile devices

## Environment Variables

Create a `.env.local` file in the root directory:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
