# replit.md

## Overview

DroneFlow is a comprehensive drone survey management system designed to handle mission planning, fleet monitoring, and analytics for autonomous drone operations. Based on the FlytBase design challenge, the application enables large organizations to plan, manage, and monitor autonomous drone surveys across multiple global sites.

**Key Requirements:**
- Mission Planning and Configuration System (survey areas, flight paths, waypoints)
- Fleet Visualization and Management Dashboard (inventory, real-time status, battery levels)
- Real-time Mission Monitoring Interface (flight paths on map, progress tracking, mission control)
- Survey Reporting and Analytics Portal (comprehensive summaries, flight statistics, org-wide data)

The system focuses on mission management and reporting aspects rather than actual data capture, live video feeds, or 3D map generation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Query (TanStack Query) for server state management with local context for UI state
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system using CSS variables for theming
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for full-stack type safety
- **API Design**: RESTful APIs with structured route handling
- **Data Layer**: In-memory storage with interface-based design for easy database integration
- **Development**: Hot module replacement and middleware-based request/response logging

### Data Storage Solutions
- **ORM**: Drizzle ORM configured for PostgreSQL with type-safe queries
- **Schema Management**: Shared schema definitions between frontend and backend
- **Validation**: Zod for runtime schema validation and type inference
- **Migration**: Drizzle Kit for database schema migrations
- **Current Implementation**: MemStorage class for development with mock data, designed for easy PostgreSQL integration

### Database Schema Design
- **Drones Table**: Comprehensive drone information including status, battery, location, flight hours, and sensor configurations
- **Missions Table**: Complete mission lifecycle tracking with flight paths, parameters, progress monitoring, and statistics
- **JSON Fields**: Flexible storage for complex data like coordinates, sensor arrays, and mission statistics
- **Relationships**: Foreign key relationships between drones and missions

### Authentication and Authorization
- **Current State**: Not implemented, ready for integration
- **Planned Approach**: Session-based authentication with connect-pg-simple for PostgreSQL session storage
- **Security**: Prepared for role-based access control and organization-level data isolation

### Component Architecture
- **Page Components**: Feature-complete pages for dashboard, monitoring, planning, reporting, and settings
- **Shared Components**: Reusable UI components for drones, missions, maps, and analytics
- **Context Providers**: React context for drone and mission state management
- **Custom Hooks**: useToast for notifications and other utility hooks

### Real-time Features
- **Mission Monitoring**: Live mission progress tracking and status updates
- **Fleet Status**: Real-time drone availability and battery monitoring
- **Mission Control**: Pause, resume, and abort mission capabilities
- **Progress Visualization**: Dynamic progress bars and status indicators

### API Structure
- **RESTful Endpoints**: CRUD operations for drones and missions
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Validation**: Request validation using shared schema definitions
- **Response Format**: Consistent JSON response structure

## External Dependencies

### Core Frontend Dependencies
- **React Ecosystem**: React 18 with TypeScript support
- **TanStack Query**: Server state management and caching
- **Wouter**: Lightweight routing solution
- **React Hook Form**: Form handling with validation

### UI and Styling
- **Radix UI**: Accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Type-safe CSS-in-JS styling utilities

### Backend Dependencies
- **Express.js**: Web application framework
- **Drizzle ORM**: Type-safe database toolkit
- **Neon Database**: Serverless PostgreSQL platform integration
- **Zod**: TypeScript-first schema validation

### Development Tools
- **Vite**: Build tool with HMR and optimized bundling
- **ESBuild**: Fast JavaScript bundler for production builds
- **TSX**: TypeScript execution for development server
- **Replit Integration**: Development environment optimization plugins

### Database and Storage
- **PostgreSQL**: Primary database (via Neon serverless)
- **Connect PG Simple**: PostgreSQL session store
- **Drizzle Kit**: Database migration and management tools

### Utilities and Helpers
- **Date-fns**: Date manipulation and formatting
- **Nanoid**: Unique ID generation
- **CLSX**: Conditional CSS class management
- **CMDK**: Command palette implementation

The system is architected for scalability and maintainability, with clear separation between frontend and backend concerns, type safety throughout the stack, and preparation for production deployment with proper database integration.