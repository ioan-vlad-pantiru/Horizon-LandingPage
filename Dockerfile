# Use a minimal Node.js base image for the build stage
FROM node:18-slim AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application source code
COPY . .

# Build the Next.js application
RUN npm run build

# Use a minimal Node.js base image for the final stage
FROM node:18-slim

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app/next.config.js ./
COPY --from=build /app/package.json ./
COPY --from=build /app/package-lock.json ./
COPY --from=build /app/.next ./

# Install only production dependencies
RUN npm install --production

# Create a non-root user and switch to it
RUN useradd -m appuser
USER appuser

# Expose the port on which the app will run
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]