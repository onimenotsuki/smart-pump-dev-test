# SMART Pump Full Stack Application

A modern full-stack web application built with TypeScript, Express.js, React, and Vite for user authentication, profile management, and balance checking.

## 🚀 Features

### Backend (API)

- **Express.js REST API** with TypeScript
- **JWT Authentication** with secure token handling
- **LowDB Database** for data persistence
- **Winston Logging** with file and console outputs
- **Comprehensive Testing** with Jest
- **Input Validation** with express-validator
- **Security Middleware** (Helmet, CORS)

### Frontend (Client)

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for modern, responsive design
- **React Query** for server state management
- **React Hook Form** for form handling
- **React Router** for navigation
- **Mobile-first responsive design**

## 📁 Project Structure

```
smart-pump-full-stack/
├── api/                    # Backend Express API
│   ├── src/
│   │   ├── config/         # Database, logger configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── models/         # TypeScript interfaces
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── __tests__/      # Jest test suites
│   └── package.json
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Login, Profile pages
│   │   ├── hooks/           # Custom React hooks
│   │   ├── api/            # API client
│   │   ├── context/        # Auth context
│   │   └── types/           # TypeScript types
│   └── package.json
├── data/                   # Database files
└── assets/                 # Images and wireframes
```

## 🛠️ Tech Stack

### Backend

- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **LowDB** for JSON database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Winston** for logging
- **Jest** for testing
- **ESLint** + **Prettier** for code quality

### Frontend

- **React 18** with hooks
- **TypeScript** for type safety
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Query** for data fetching
- **React Hook Form** for forms
- **React Router** for navigation
- **Axios** for HTTP requests

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- **OR** Docker & Docker Compose

### Option 1: Docker (Recommended)

1. **Quick Start with Docker:**

```bash
git clone <repository-url>
cd smart-pump-full-stack
./scripts/docker-setup.sh
```

2. **Access the application:**

- Frontend: http://localhost:80
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health

### Option 2: Manual Installation

1. **Clone and install dependencies:**

```bash
git clone <repository-url>
cd smart-pump-full-stack
npm install
```

2. **Setup environment variables:**

```bash
# Backend (.env in api/)
PORT=3001
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
DB_PATH=./data/database.json
LOG_LEVEL=info
FRONTEND_URL=http://localhost:5173

# Frontend (.env in client/)
VITE_API_URL=http://localhost:3001/api
```

3. **Migrate user data:**

```bash
cd api
npm run migrate
```

4. **Start development servers:**

```bash
# From root directory
npm run dev

# Or start individually:
npm run dev:api    # Backend on :3001
npm run dev:client # Frontend on :5173
```

## 🧪 Testing

### Backend Tests

```bash
cd api
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

### Test Coverage

- **Unit Tests**: Services, middleware, utilities
- **Integration Tests**: API endpoints, authentication
- **Validation Tests**: Input validation, error handling

## 📱 Usage

### Demo Credentials

The application comes with pre-loaded demo users:

**User 1:**

- Email: `henderson.briggs@geeknet.net`
- Password: `23derd*334`
- Balance: `$3,585.69`

**User 2:**

- Email: `boyd.small@endipine.biz`
- Password: `_4rhododfj`
- Balance: `$3,230.56`

### Features

1. **Login**: Secure authentication with JWT tokens
2. **Profile View**: View user details and balance
3. **Profile Edit**: Update personal information (name, email, phone, address, company)
4. **Balance Check**: View current account balance
5. **Responsive Design**: Works on desktop and mobile

## 🔧 Development

### Code Quality

- **ESLint** with Airbnb configuration
- **Prettier** for code formatting
- **TypeScript** strict mode enabled
- **Husky** for git hooks (optional)

### Scripts

```bash
# Root level
npm run dev          # Start both frontend and backend
npm run build        # Build both projects
npm run lint         # Lint all code
npm run format       # Format with Prettier

# Backend (api/)
npm run dev          # Start with ts-node-dev
npm run build        # Compile TypeScript
npm run start        # Start compiled JS
npm test             # Run Jest tests

# Frontend (client/)
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🏗️ Architecture

### Backend Architecture

- **Layered Architecture**: Controllers → Services → Database
- **Middleware Pattern**: Auth, validation, error handling
- **Service Layer**: Business logic separation
- **Repository Pattern**: Database abstraction

### Frontend Architecture

- **Component-Based**: Reusable UI components
- **Context API**: Global state management
- **Custom Hooks**: Logic reuse
- **Service Layer**: API abstraction

## 🔒 Security Features

- **JWT Authentication** with secure token storage
- **Password Hashing** with bcrypt
- **Input Validation** on all endpoints
- **CORS Configuration** for cross-origin requests
- **Helmet** for security headers
- **Rate Limiting** (can be added)
- **XSS Protection** built into React

## 📊 API Endpoints

### Authentication

- `POST /api/auth/login` - User login

### User Management

- `GET /api/users/me` - Get user profile
- `GET /api/users/me/balance` - Get user balance
- `PUT /api/users/me` - Update user profile

## 🎨 UI/UX Features

- **Modern Design** inspired by mobile app aesthetics
- **Responsive Layout** for all screen sizes
- **Loading States** and error handling
- **Form Validation** with real-time feedback
- **Smooth Animations** and transitions
- **Accessibility** considerations

## 🚀 Deployment

### Backend Deployment

1. Build the TypeScript code: `npm run build`
2. Set production environment variables
3. Deploy to your preferred platform (Heroku, Railway, etc.)

### Frontend Deployment

1. Build the React app: `npm run build`
2. Deploy the `dist` folder to static hosting (Vercel, Netlify, etc.)

## 🐳 Docker Support

### Quick Start with Docker

```bash
# Setup and start all services
./scripts/docker-setup.sh

# Development mode with hot reload
./scripts/docker-dev.sh

# View logs
./scripts/docker-logs.sh

# Clean up everything
./scripts/docker-clean.sh
```

### Docker Services

- **API Backend:** Express.js + TypeScript on port 3001
- **Frontend Client:** React + Vite + Nginx on port 80
- **Database Migration:** Automatic user data migration
- **Health Checks:** Built-in monitoring for all services

### Docker Commands

```bash
# Production
docker-compose up -d

# Development
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Clean everything
docker-compose down --rmi all -v
```

For detailed Docker documentation, see [DOCKER.md](./DOCKER.md).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **SMART Pump** for the project requirements
- **Vite** for the excellent build tooling
- **Tailwind CSS** for the utility-first CSS framework
- **React Query** for server state management
- **Express.js** for the robust backend framework
- **Docker** for containerization support
