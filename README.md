# The5ers Stock Management Application

A modern web application for managing stock portfolios and viewing real-time stock information. This application allows users to manage their personal stock portfolios, view detailed stock information, and track market performance.

## 🚀 Features

### Core Functionality
- **Portfolio Management**: Add and remove stocks from your personal portfolio
- **Stock Details**: View comprehensive stock information including latest quotes and daily percentage changes
- **Real-time Data**: Get up-to-date stock market information
- **Seamless Navigation**: Move freely between portfolio and individual stock pages
- **User Authentication**: Secure sign-in and sign-up functionality

### User Stories Implemented
- ✅ Users can save and edit their portfolio (add/remove stocks)
- ✅ Users can navigate freely between portfolio and stock detail pages
- ✅ Users can view latest stock quotes and daily percentage changes
- ✅ Responsive design for optimal user experience

## 📄 Application Pages

The application includes the following main pages:

### Authentication Pages
- **`/sign-in`** - User authentication page
  - Secure login with email and password
  - JWT token-based authentication
  - Redirect to portfolio after successful login

- **`/sign-up`** - User registration page
  - New user account creation
  - Input validation and error handling
  - Automatic redirect to sign-in after registration

### Stock Management Pages
- **`/stocks`** - Stock browsing and filtering page
  - Browse available stocks with search and filtering
  - Real-time stock data display
  - Add stocks to personal portfolio
  - Responsive table with sorting capabilities

- **`/stocks/[symbol]`** - Individual stock details page
  - Detailed company information and metrics
  - Real-time stock quotes and price changes
  - Daily percentage changes and trends
  - Historical data visualization
  - Add/remove from portfolio functionality
  - Example: `/stocks/QVCGB` for QVC Group company details

### Portfolio Page
- **`/portfolio`** - Personal portfolio management
  - View all saved stocks in one place
  - Quick access to individual stock details
  - Portfolio performance overview
  - Remove stocks from portfolio

## 🛠 Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **Next.js 15** - Full-stack React framework
- **MobX** - State management
- **Ant Design** - Enterprise-class UI component library
- **TypeScript** - Type safety and better developer experience

### Backend  
- **NestJS** - Scalable Node.js server-side framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication and authorization

### Development Tools
- **Nx 21.1.2** - Monorepo development toolkit for scalable development
- **Storybook** - Component development and testing
- **Docker** - Containerization
- **ESLint & Prettier** - Code quality and formatting

## 🏗️ Nx Monorepo Architecture

This project is built using **Nx**, a powerful development toolkit for monorepos. Nx provides:

### Key Benefits
- **Unified Development**: Manage frontend, backend, and shared types in one repository
- **Code Sharing**: Shared TypeScript types between client and server
- **Efficient Builds**: Smart rebuilds and caching for faster development
projects
- **Scalable Architecture**: Easy to add new applications and libraries

### Nx Project Structure
```
workspace/
├── frontend/          # Next.js application
├── backend/           # NestJS application  
├── shared-types/      # Shared TypeScript definitions
├── nx.json           # Nx workspace configuration
└── package.json      # Root package.json with workspace scripts
```

### Nx Commands Used
- `nx run-many --target=dev --parallel` - Start multiple projects simultaneously
- `nx run-many --target=build --all` - Build all projects
- `nx storybook frontend` - Run Storybook for component development
- `nx lint` - Run linting across all projects

## 🎨 Ant Design UI Framework

The application uses **Ant Design** as the primary UI component library, providing:

### Key Features
- **Enterprise-Grade Components**: Professional and polished UI components
- **Consistent Design Language**: Unified visual design across the application
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Accessibility**: Built-in accessibility features and ARIA support
- **Theming Support**: Customizable theme and styling options

### Components Used
- **Tables**: For displaying stock data with sorting and filtering
- **Forms**: Authentication forms (sign-in, sign-up) with validation
- **Buttons**: Primary and secondary actions throughout the app
- **Navigation**: Header navigation and routing components
- **Cards**: Stock information display and portfolio items
- **Inputs**: Search, filters, and form input fields
- **Notifications**: Success/error messages and user feedback

### Design Benefits
- **Professional Appearance**: Clean, modern interface suitable for financial applications
- **User Experience**: Intuitive interactions and familiar UI patterns
- **Development Speed**: Pre-built components reduce development time
- **Cross-browser Compatibility**: Consistent appearance across different browsers
- **Mobile Optimization**: Responsive components that work on all device sizes

## 📋 Prerequisites

- **Node.js** >= 22.0.0 < 23.0.0
- **Yarn** >= 4.9.1 (package manager)
- **Docker** (optional, for database)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
yarn install
```

### 2. Start the Application
```bash
yarn start
```

This command will start both frontend and backend services in parallel:
- Frontend: http://localhost:3000
- Backend: http://localhost:4000

## 🗄️ Database Setup

### Option 1: Use Docker (Recommended)
Start MongoDB using Docker Compose:
```bash
docker-compose up mongodb
```

### Option 2: Custom Database
If you need to use a different database or credentials, modify the `.env` files in the project. All environment configuration files are included in the repository for easy setup.

## 🛠 Development Commands

### Development Mode
```bash
yarn dev
```
Starts all services in development mode with hot reload

### Individual Services
```bash
yarn dev:frontend    # Start only frontend
yarn dev:backend     # Start only backend  
yarn dev:types       # Start only shared types
```

### Component Development
```bash
yarn storybook
```
Launch Storybook to browse and develop UI components in isolation

### Code Quality
```bash
yarn lint           # Run linting
yarn lint:fix       # Fix linting issues automatically
yarn format        # Format code with Prettier
yarn test          # Run tests
```

### Production Build
```bash
yarn build                 # Build all projects
yarn start:production      # Start in production mode
```

## 📁 Project Structure

```
The5ers/
├── backend/               # NestJS backend application
│   ├── src/
│   │   ├── controllers/   # API controllers
│   │   ├── services/      # Business logic
│   │   ├── schemas/       # Database schemas
│   │   └── ...
├── frontend/              # Next.js frontend application
│   ├── src/
│   │   ├── app/          # Next.js app router pages
│   │   ├── components/   # Reusable UI components
│   │   ├── services/     # API services
│   │   └── stores/       # MobX stores
├── shared-types/          # Shared TypeScript types
└── docker-compose.yml     # Docker configuration
```

## 🔧 Environment Configuration

All necessary `.env` files are included in the repository for immediate setup. The application is configured to work out-of-the-box with the provided environment variables.

If you need to customize the configuration:
- Database connection strings
- JWT secrets
- API endpoints
- Port configurations

Simply modify the relevant `.env` files in the project.

## 📱 Stock API Integration

The application integrates with Financial Modeling Prep API for real-time stock data. The API provides:
- Real-time stock quotes
- Daily percentage changes
- Company information
- Market data

## 🎨 Component Library

Explore the component library using Storybook:
```bash
yarn storybook
```

This provides an interactive catalog of all UI components used in the application, making it easy to:
- View component variations
- Test component states
- Understand component APIs
- Develop components in isolation

## 🚀 Deployment

The application is containerized and ready for deployment:

```bash
docker-compose up
```

This will start:
- MongoDB database on port 27018