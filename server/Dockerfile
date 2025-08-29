# Stage 1: Use the official Node.js image
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# The command to start the server
CMD ["pnpm", "start"]