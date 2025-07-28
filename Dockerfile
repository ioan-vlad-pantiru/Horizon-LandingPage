# Use a minimal Node.js base image for the frontend
FROM node:18-slim AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package.json package-lock.json ./

# Install production dependencies
RUN npm install --only=production

# Copy the rest of the application source code
COPY . .

# Build the Next.js application
RUN npm run build

# Use a minimal Node.js base image for the final image
FROM node:18-slim

# Set the working directory
WORKDIR /app

# Copy only the built artifacts from the build stage
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules

# Create a non-root user and switch to it
RUN useradd -m appuser
USER appuser

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]