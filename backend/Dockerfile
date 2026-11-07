# ==========================================
# Production Dockerfile for LPK Backend API
# ==========================================
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies (utilize docker layer caching)
COPY package*.json ./
RUN npm ci --only=production || npm install --omit=dev

# Copy application source code
COPY . .

# Ensure uploads directory exists and has proper permissions
RUN mkdir -p uploads

# Expose backend port
EXPOSE 5000

# Set environment
ENV NODE_ENV=production

# Start application
CMD ["node", "server.js"]

