# ----------------------------
# 1️⃣ Base Build Stage
# ----------------------------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first (for better layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build TypeScript
RUN npm run build

# ----------------------------
# 2️⃣ Production Stage
# ----------------------------
FROM node:20-alpine AS production

WORKDIR /app

# Copy only necessary files from build stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Install only production dependencies
RUN npm install

# Start the server
CMD ["node", "dist/server.js"]
