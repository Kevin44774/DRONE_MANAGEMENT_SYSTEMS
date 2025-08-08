# DroneFlow - Drone Survey Management System

A comprehensive drone fleet management and monitoring platform designed for autonomous drone survey operations. Built for the FlytBase design challenge.

## 🚁 Live Demo

**Hosted Application**: [Your Netlify URL will go here]

## ✨ Features

### Mission Planning & Configuration
- Define survey areas and flight paths with interactive area selection
- Configure mission parameters: altitude, speed, overlap percentage
- Support for multiple survey patterns: crosshatch, perimeter, grid, spiral, custom
- Advanced sensor configuration and data collection settings
- Mission scheduling and priority management

### Fleet Management Dashboard  
- Real-time drone inventory with status monitoring
- Battery level tracking and maintenance scheduling
- Fleet statistics: availability, utilization, flight hours
- Drone filtering and search capabilities
- Status management: available, in-mission, charging, maintenance, offline

### Real-time Mission Monitoring
- Live mission progress tracking with progress indicators
- Mission control actions: pause, resume, abort operations
- Real-time drone location and flight path visualization
- Mission status updates and estimated completion times
- Active mission overview with detailed statistics

### Reporting & Analytics
- Comprehensive survey summaries and flight statistics
- Organization-wide analytics: total surveys, flight hours, success rates
- Time-based reporting: 24h, 7d, 30d, 90d views
- Drone utilization analysis and performance metrics
- Mission type and priority distribution charts

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for responsive design
- **Shadcn/ui** component library on Radix UI primitives
- **TanStack Query** for server state management
- **React Hook Form** with Zod validation
- **Wouter** for lightweight routing
- **Recharts** for data visualization

### Backend Architecture (Development)
- **Node.js** with Express.js framework
- **TypeScript** for full-stack type safety
- **Drizzle ORM** for PostgreSQL integration
- **In-memory storage** with production-ready interfaces

### Development Tools
- **Vite** for fast development and optimized builds
- **ESBuild** for production bundling
- **TypeScript** compiler for type checking

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm package manager

### Local Development
```bash
# Install dependencies
npm install

# Start development server (full-stack)
npm run dev

# Access application
http://localhost:5000
```

### Production Build
```bash
# Build for deployment
vite build

# Output in dist/public/
```

## 📦 Deployment

### Netlify Deployment (Recommended)

This project is optimized for Netlify deployment with frontend-only operation using mock data.

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "DroneFlow - Drone survey management system"
   git push origin main
   ```

2. **Deploy to Netlify**:
   - Connect your GitHub repository
   - Build command: `vite build`
   - Publish directory: `dist/public`
   - Deploy automatically

3. **Configuration**: The included `netlify.toml` handles routing and build settings.

### Features in Demo Mode
- Full UI functionality with realistic mock data
- Real-time updates and mission control simulation
- Complete mission planning and fleet management
- Comprehensive reporting and analytics
- All FlytBase requirements demonstrated

## 🏗 Architecture Highlights

### Scalable Design
- Modular component architecture
- Interface-based storage for easy database integration
- Type-safe APIs with shared schema validation
- Production-ready authentication framework

### Real-time Capabilities
- Auto-refresh intervals for live monitoring
- Mission control with state management
- Progress tracking and status updates
- Fleet availability monitoring

### Data Management
- Comprehensive drone and mission schemas
- Advanced analytics and reporting engine
- Mission parameter validation and optimization
- Organization-wide statistics tracking

## 📋 FlytBase Requirements Compliance

✅ **Mission Planning and Configuration System**
- Survey area definition and flight path configuration
- Mission parameters: altitude, speed, overlap, sensors
- Advanced survey patterns and waypoint management

✅ **Fleet Visualization and Management Dashboard**  
- Organization-wide drone inventory display
- Real-time status monitoring and battery tracking
- Fleet statistics and utilization metrics

✅ **Real-time Mission Monitoring Interface**
- Live flight path visualization and progress tracking
- Mission control actions and status management
- Real-time updates and completion estimates

✅ **Survey Reporting and Analytics Portal**
- Comprehensive survey summaries and flight statistics
- Organization-wide analytics and performance metrics
- Time-based reporting with multiple view options

## 🎯 Technical Considerations

- **Scalability**: Designed for multiple concurrent missions
- **Safety**: Mission control actions and parameter validation
- **Adaptability**: Interface-based design for easy extension
- **Performance**: Optimized builds and efficient state management

## 📝 Project Write-up

Detailed technical documentation available in `PROJECT_WRITEUP.md` covering:
- Problem approach and solution architecture
- Development trade-offs and technical decisions  
- Safety and adaptability strategies
- Production deployment considerations

## 🤝 Development Process

This project demonstrates effective use of AI-powered development tools while maintaining high code quality, proper architecture, and comprehensive feature implementation aligned with modern web development best practices.

---

**Built for FlytBase Design Challenge** | **Powered by React + TypeScript + Tailwind CSS**