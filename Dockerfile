# Stage 1: Build the frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
# Using npm install instead of npm ci to be more forgiving of lockfile mismatches
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Setup the backend and serve
FROM node:20-alpine
WORKDIR /app

# Copy backend package.json and install dependencies
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install --production

# Copy backend code
COPY server/ ./

# Copy built frontend assets from Stage 1 to a 'dist' folder at the app root level
# The server logic expects '../dist' relative to itself (which is in /app/server), so we put dist in /app/dist
COPY --from=frontend-builder /app/dist ../dist

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "index.js"]
