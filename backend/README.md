# AI Studio Backend

Express + TypeScript backend API for AI Studio application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```
PORT=3001
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

## Running

Development mode:
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

## Testing

Run all tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

Watch mode:
```bash
npm run test:watch
```

## API Endpoints

See [OPENAPI.yaml](../OPENAPI.yaml) in the root directory for complete API documentation.

### Authentication
- `POST /auth/signup` - Create account
- `POST /auth/login` - Login

### Generations
- `POST /generations` - Create generation (requires auth)
- `GET /generations?limit=5` - Get recent generations (requires auth)

## Database

Uses SQLite for local development. Database file: `database.sqlite`

Tables:
- `users` - User accounts
- `generations` - Generation history

## File Uploads

Uploaded images are stored in `uploads/` directory.

Max file size: 10MB
Allowed types: JPEG, PNG

## Environment Variables

- `PORT` - Server port (default: 3001)
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production/test)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:8080)
