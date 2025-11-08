# AI Studio - Full Stack Application

A complete AI image generation studio with user authentication, image upload, and generation history tracking.

## 🚀 Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- React Router v6
- React Testing Library

**Backend:**
- Node.js + TypeScript
- Express.js
- JWT Authentication
- SQLite Database
- bcrypt for password hashing
- Multer for file uploads
- Zod for validation

**Testing:**
- Jest + Supertest (Backend)
- React Testing Library (Frontend)
- Playwright (E2E)

## 📦 Project Structure

```
ai-studio/
├── frontend/                 # React frontend (this directory)
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React contexts (AuthContext)
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
├── e2e/                      # End-to-end tests
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
npm test                    # Run all tests
npm run test:coverage      # Run with coverage
```

### Frontend Tests
```bash
npm test                    # Run all frontend tests
npm run test:coverage      # Run with coverage
```

### E2E Tests
```bash
# Make sure both frontend and backend are running
npm run test:e2e           # Run Playwright tests
```

## 🔧 Environment Variables

### Backend (.env)
```
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

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
- Delete `backend/database.sqlite` and restart backend server
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

## 📦 Extracting for Submission

This project is ready to be extracted and submitted! Here's what to include:

```bash
# 1. Create a clean copy
git init
git add .
git commit -m "Initial commit: AI Studio application"

# 2. Create GitHub repository
# Follow GitHub instructions to push to your new repo

# 3. Create Pull Requests
# Create at least 2 feature branches and PRs as per assignment requirements
```

**Required Files for Submission:**
- ✅ Complete codebase (frontend + backend)
- ✅ README.md (setup instructions)
- ✅ OPENAPI.yaml (API specification)
- ✅ EVAL.md (implementation checklist)
- ✅ AI_USAGE.md (AI tools documentation)
- ✅ .github/workflows/ci.yml (CI/CD pipeline)
- ✅ All test files

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
