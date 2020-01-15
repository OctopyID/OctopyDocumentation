---
id: deployment
title: Deployment
sidebar_label: Deployment
---

## Introduction

When you're ready to deploy your Octopy application to production, there are some important things you can do to make sure your application is running as efficiently as possible. In this document, we'll cover some great starting points for making sure your Octopy application is deployed properly.

## Server Configuration

### Nginx

If you are deploying your application to a server that is running Nginx, you may use the following configuration file as a starting point for configuring your web server. Most likely, this file will need to be customized depending on your server's configuration.

```nginx
server {
        listen 80;
        server_name example.com;
        root /example.com/public;

        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-XSS-Protection "1; mode=block";
        add_header X-Content-Type-Options "nosniff";

        index index.html index.htm index.php;

        charset utf-8;

        location / {
            try_files $uri $uri/ /index.php?$query_string;
        }

        location = /favicon.ico { access_log off; log_not_found off; }
        location = /robots.txt  { access_log off; log_not_found off; }

        error_page 404 /index.php;

        location ~ \.php$ {
            fastcgi_pass unix:/var/run/php/php7.2-fpm.sock;
            fastcgi_index index.php;
            fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
            include fastcgi_params;
        }

        location ~ /\.(?!well-known).* {
            deny all;
        }
    }
```
    

## Optimization

### Autoloader Optimization

When deploying to production, make sure that you are optimizing Composer's class autoloader map so Composer can quickly find the proper file to load for a given class:

```bash
composer create-project install --optimize-autoloader --no-dev
```

> In addition to optimizing the autoloader, you should always be sure to include a `composer.lock` file in your project's source control repository. Your project's dependencies can be installed much faster when a `composer.lock` file is present.

### Optimizing Configuration Loading

When deploying your application to production, you should make sure that you run the `octopy optimize` Octopy command during your deployment process:

```bash
php octopy optimize
```

This command will combine all of Octopy's configuration files into a single, cached file, which greatly reduces the number of trips the framework must make to the filesystem when loading your configuration values.

> If you execute the `octopy optimize` command during your deployment process, you should be sure that you are only calling the `env` function from within your configuration files. Once the configuration has been cached, the `.env` file will not be loaded and all calls to the `env` function will return `null`.

### Optimizing Route Loading

If you are building a large application with many routes, you should make sure that you are running the `route:cache` Octopy command during your deployment process:

```bash
php octopy route:cache
```

This command reduces all of your route registrations into a single method call within a cached file, improving the performance of route registration when registering hundreds of routes.

> Since this feature uses PHP serialization, you may only cache the routes for applications that exclusively use controller based routes. PHP is not able to serialize Closures.