# Use an official Node.js runtime as the base image for the frontend
FROM node:18-alpine AS frontend-build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Build the Next.js application
RUN npm install
RUN npm run build

# Use an official PHP runtime as the base image for the backend
FROM php:8.2-apache AS backend

# Install PHP extensions and Composer
RUN docker-php-ext-install mysqli && \
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set working directory
WORKDIR /var/www/html

# Copy PHP backend files
COPY backend/ ./

# Install backend dependencies
RUN composer install

# Copy the built Next.js application to the Apache document root
COPY --from=frontend-build /app/.next /var/www/html/.next

# Copy static assets if any
COPY --from=frontend-build /app/public /var/www/html/public

# Expose the HTTP port
EXPOSE 80

# RUN AS NON-ROOT USER
RUN chown -R www-data:www-data /var/www/html
USER www-data

# Start Apache server
CMD ["apache2-foreground"]