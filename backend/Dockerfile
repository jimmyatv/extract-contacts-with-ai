# Use official PHP image with Apache
FROM php:8.2-apache

# Install required PHP extensions and utilities
RUN apt-get update && apt-get install -y \
    libzip-dev zip unzip git libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql pdo_mysql zip

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Change Apache to listen on port 8080 (Cloud Run expects this)
RUN sed -i 's/Listen 80/Listen 8080/' /etc/apache2/ports.conf

# Copy custom Apache config
COPY docker/apache/000-default.conf /etc/apache2/sites-available/000-default.conf

# Copy project files
COPY . /var/www/html

# Working directory
WORKDIR /var/www/html

# Install Composer globally
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Create writable SQLite file in /tmp and set permissions
# RUN touch /tmp/database.sqlite && chmod 777 /tmp/database.sqlite

# Install PHP dependencies
RUN composer install --no-interaction --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Expose port 8080
EXPOSE 8080

# Start Apache
CMD ["apache2-foreground"]
