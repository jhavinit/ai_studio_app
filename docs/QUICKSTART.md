# Quick Start Guide

Get the AI Studio application running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn

## Step 1: Clone or Download

If you have this as a GitHub repo:
```bash
git clone <your-repo-url>
cd ai-studio
```

If you downloaded it as a ZIP:
```bash
unzip ai-studio.zip
cd ai-studio
```

## Step 2: Install Frontend Dependencies

```bash
npm install
```

## Step 3: Install Backend Dependencies

```bash
cd backend
npm install
```

## Step 4: Set Up Backend Environment

Create backend `.env` file:
```bash
cp .env.example .env
```

The `.env` file should contain:
```
PORT=3001
JWT_SECRET=your-secret-key-here-change-in-production
NODE_ENV=development
```

## Step 5: Start Backend Server

From the `backend` directory:
```bash
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3001
✅ Database initialized
```

## Step 6: Start Frontend (New Terminal)

Open a new terminal in the project root:
```bash
npm run dev
```

You should see:
```
VITE ready in XXXms
➜  Local:   http://localhost:8080/
```

## Step 7: Open the App

Visit http://localhost:8080 in your browser!

## Next Steps

1. **Create an Account**: Click "Sign up" and create a test account
2. **Upload an Image**: Go to the studio and upload a test image (max 10MB)
3. **Generate**: Add a prompt, select a style, and click Generate
4. **View History**: See your last 5 generations in the sidebar

## Running Tests

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
npm test
```

## Troubleshooting

### Port Already in Use

**Backend (3001):**
```bash
# Find process using port 3001
lsof -i :3001  # macOS/Linux
netstat -ano | findstr :3001  # Windows

# Kill the process or change PORT in backend/.env
```

**Frontend (8080):**
```bash
# Find process using port 8080
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows
```

### Database Issues

Delete and recreate:
```bash
cd backend
rm database.sqlite
npm run dev  # Will recreate database
```

### Module Not Found

```bash
# Frontend
rm -rf node_modules package-lock.json
npm install

# Backend
cd backend
rm -rf node_modules package-lock.json
npm install
```

## Manual CI/CD Execution

To run the CI pipeline locally:

```bash
# 1. Lint everything
npm run lint
cd backend && npm run lint && cd ..

# 2. Run all tests
cd backend && npm test && cd ..
npm test

# 3. Build everything
npm run build
cd backend && npm run build && cd ..
```

## Project Structure Overview

```
ai-studio/
├── frontend/                    # React frontend (this directory)
│   ├── src/
│   │   ├── components/         # UI components
│   │   ├── contexts/           # React contexts
│   │   ├── hooks/              # Custom hooks
│   │   ├── pages/              # Page components
│   │   └── ...
│   └── package.json
├── backend/                     # Express backend
│   ├── src/
│   │   ├── controllers/        # Business logic
│   │   ├── middleware/         # Auth middleware
│   │   ├── models/             # Database models
│   │   ├── routes/             # API routes
│   │   ├── services/           # Services (JWT, generation)
│   │   └── server.ts           # Main server file
│   ├── tests/                  # Backend tests
│   └── package.json
├── .github/workflows/          # CI/CD configuration
├── README.md                   # Full documentation
├── OPENAPI.yaml               # API specification
├── EVAL.md                    # Implementation checklist
└── AI_USAGE.md                # AI usage documentation
```

## Success Checklist

- ✅ Backend running on http://localhost:3001
- ✅ Frontend running on http://localhost:8080
- ✅ Can create an account
- ✅ Can log in
- ✅ Can upload an image
- ✅ Can generate (with occasional "Model overloaded" errors)
- ✅ Can see generation history
- ✅ Tests pass

## Need Help?

See the full [README.md](./README.md) for detailed documentation!
