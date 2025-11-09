# 🎨 AI Studio - AI-Powered Image Generation Platform

A full-stack application that enables users to generate AI images, manage their generations, and track history. Built with modern web technologies and best practices.


# Quick Start Guide

Get the AI Studio application running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm
- docker and docker compose

## Option 1: Docker based Installation

1. Clone the repository
2. cd deployment
3. chmod +x deploy.sh
4. ./deploy.sh


## Option 2: Manual Installation
1. Clone the repository
2. cd frontend
3. npm i
4. npm run dev
5. cd backend
6. create .env based on you env (connect to docker compose db for postgres)
7. npm i
8. npm run dev
9. Open http://localhost:8080 in your browser!



## ✨ Features

- 🔐 User Authentication (Signup/Login)
- 🖼️ AI Image Generation with style selection
- 📚 Generation History
- ⚡ Real-time Updates
- 🔄 Responsive Design
- 🔒 Secure JWT Authentication
- 🚀 Optimized Build & Deployment

## 🚀 Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Context API
- **Routing**: React Router v6
- **Form Handling**: React Hook Form
- **Testing**: React Testing Library, Cypress

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Authentication**: JWT
- **Database**: PostgreSQL
- **File Storage**: Local File System (with Multer)
- **Validation**: Zod
- **Testing**: Jest + Supertest

### DevOps
- **Containerization**: Docker
- **Web Server**: Nginx (for production)
- **CI/CD**: GitHub Actions (example configuration included)

## 🏗️ Project Structure

```
ai-studio/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React contexts (Auth, etc.)
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   └── config/         # App configuration
│   └── public/             # Static assets
│
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── configs/        # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── entities/       # TypeScript interfaces
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── server.ts       # Entry point
│   └── uploads/            # Generated images storage
│
└── deployment/             # Deployment configurations
    └── nginx/              # Nginx configuration
        └── nginx.conf      # Production web server config
│   │   ├── hooks/           # Custom hooks (useGenerate, useRetry)
│   │   ├── pages/           # Page components
│   │   └── ...
│   ├── tests/               # Frontend tests
│   └── package.json
├── backend/                  # Node.js backend
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Business logic
│   │   ├── models/          # Database models
│   │   ├── middleware/      # Auth middleware
│   │   ├── services/        # JWT and generation services
│   │   └── server.ts        # Main server file
│   ├── tests/               # Backend tests
│   ├── uploads/             # Uploaded images
│   ├── database.sqlite      # SQLite database
│   └── package.json
├── frontend/cypress/e2e/                      # End-to-end tests
├── .github/workflows/        # CI/CD workflows
├── README.md
├── OPENAPI.yaml
├── EVAL.md
└── AI_USAGE.md
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Frontend will run on http://localhost:8080
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start backend server
npm run dev

# Backend will run on http://localhost:3001
```

## 🧪 Running Tests

### Backend Tests
```bash
cd backend
modify .env for test env if needed
npm test                    # Run all tests
```

### Frontend Tests
```bash
cd frontend
npm test                    # Run all frontend tests
```

### E2E Tests
```bash
# Make sure both frontend and backend are running
npx cypress run --browser chrome       # Run Cypress tests
```

## 🔧 Environment Variables

### Backend (.env) example file attached

## 📝 API Documentation

See [OPENAPI.yaml](./OPENAPI.yaml) for complete API documentation.

### Key Endpoints

**Authentication:**
- `POST /auth/signup` - Create new account
- `POST /auth/login` - Login to existing account

**Generations:**
- `POST /generations` - Create new generation (requires auth)
- `GET /generations?limit=5` - Get recent generations (requires auth)

## 🎯 Features

- ✅ User authentication (signup/login)
- ✅ JWT-based session management
- ✅ Image upload with validation (max 10MB, JPEG/PNG)
- ✅ Live image preview
- ✅ AI generation simulation with 20% error rate
- ✅ Automatic retry logic (up to 3 attempts with exponential backoff)
- ✅ Abort in-flight requests
- ✅ Generation history (last 5)
- ✅ Responsive design
- ✅ Accessible UI (ARIA labels, keyboard navigation)
- ✅ Comprehensive testing

## 🔐 Security

- Passwords hashed with bcrypt
- JWT tokens for authentication
- Input validation with Zod
- File upload restrictions (size, type)
- CORS enabled for frontend
- SQL injection prevention

## 📊 CI/CD

GitHub Actions workflow included (`.github/workflows/ci.yml`):
- Runs on every push and PR
- Installs dependencies
- Runs linting
- Executes all tests
- Generates coverage reports

To run manually:
```bash
# Install dependencies for all projects
npm install
cd backend && npm install && cd ..

# Run linting
npm run lint

# Run all tests
cd backend && npm test && cd ..
npm test

# For E2E tests, start servers first
npm run dev &              # Start frontend
cd backend && npm run dev & # Start backend
npm run test:e2e           # Run E2E tests
```

## 🐛 Troubleshooting

**Backend not starting:**
- Check if port 3001 is available
- Verify JWT_SECRET is set in backend/.env
- Ensure all dependencies are installed

**Frontend can't connect to backend:**
- Ensure backend is running on http://localhost:3001
- Check CORS settings in backend
- Verify FRONTEND_URL in backend/.env

**Tests failing:**
- Run `npm install` in both frontend and backend
- Ensure all dependencies are installed
- Check that test database is accessible
- Make sure ports 3001 and 8080 are available

**Database issues:**
- Delete `volume postgres` and restart backend server
- It will auto-create tables on startup

## 🚀 Production Deployment Notes

For production deployment, consider:

1. **Environment Variables**: Use environment-specific values
2. **Database**: Migrate from SQLite to PostgreSQL
3. **File Storage**: Use cloud storage (AWS S3, Cloudinary) instead of local filesystem
4. **API Keys**: Store in secure secrets management
5. **HTTPS**: Enable SSL/TLS
6. **Rate Limiting**: Add rate limiting middleware
7. **Monitoring**: Add logging and error tracking (Sentry, LogRocket)
8. **CI/CD**: GitHub Actions workflow is ready to use

## 📄 License

MIT

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## 📚 Additional Documentation

- [EVAL.md](./EVAL.md) - Implementation checklist
- [AI_USAGE.md](./AI_USAGE.md) - AI tools usage documentation
- [OPENAPI.yaml](./OPENAPI.yaml) - API specification
