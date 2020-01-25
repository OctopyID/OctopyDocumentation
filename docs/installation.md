---
id: installation
title: Installation
sidebar_label: Installation
---

## Server Requirement

The Octopy framework has a few system requirements. You will need to make sure your server meets the following requirements:

* PHP >= 7.3
* PDO PHP Extension
* Mbstring PHP Extension
* JSON PHP Extension

## Installing Octopy
Before using Octopy, make sure you have composer or git installed on your machine.

### Via Composer Create-Project

Alternatively, you may also install Octopy by issuing the Composer create-project command in your terminal:

```bash
composer create-project octopyid/octopyframework --stability=dev
```

### Via GIT
Or you can install manually by clone from our repository:

```bash
git clone https://github.com/SupianIDz/OctopyFramework.git

cd OctopyFramework

cp .env.example .env

php octopy key:generate
```

### Local Development Server
If you have PHP installed locally and you would like to use PHP's built-in development server to serve your application, you may use the serve Octopy command. This command will start a development server at http://localhost:1337:

```bash
php octopy serve
```

## Configuration
### Public Directory

After installing Octopy, you should configure your web server's document / web root to be the public directory. The index.php in this directory serves as the front controller for all HTTP requests entering your application.

### Configuration Files

All of the configuration files for the Octopy framework are stored in the config directory. Each option is documented, so feel free to look through the files and get familiar with the options available to you.

### Directory Permissions

After installing Octopy, you may need to configure some permissions. Directories within the storage directories should be writable by your web server or Octopy will not run.

### Application Key

The next thing you should do after installing Octopy is set your application key to a random string. If you installed Octopy via Composer, this key has already been set for you by the `php octopy key:generate` command.

Typically, this string should be 32 characters long. The key can be set in the .env environment file. If you have not renamed the .env.example file to .env, you should do that now. If the application key is not set, your user sessions and other encrypted data will not be secure!

### Additional Configuration

Octopy needs almost no other configuration out of the box. You are free to get started developing! However, you may wish to review the app/Config/App.php file and its documentation. It contains several options such as timezone and locale that you may wish to change according to your application.

## Web Server Configuration
### Pretty URLs
#### Apache

Octopy includes a public/.htaccess file that is used to provide URLs without the index.php front controller in the path. Before serving Octopy with Apache, be sure to enable the mod_rewrite module so the .htaccess file will be honored by the server.

If the .htaccess file that ships with Octopy does not work with your Apache installation, try this alternative:

```apache
# ----------------------------------------------------------------------
# UTF-8 encoding
# ----------------------------------------------------------------------
AddDefaultCharset utf-8

# Force UTF-8
<IfModule mod_mime.c>
    AddCharset utf-8 .atom .css .js .json .rss .vtt .xml
</IfModule>

# ----------------------------------------------------------------------
# Rewrite Engine
# ----------------------------------------------------------------------
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
     #   Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Handle Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>

```

#### Nginx

If you are using Nginx, the following directive in your site configuration will direct all requests to the index.php front controller:

```
location / {
    try_files $uri $uri/ /index.php?$query_string;
}
```

### Microsoft IIS
Or you are using Microsoft IIS:

```
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="Imported Rule 1" stopProcessing="true">
          <match url="^(.*)/$" ignoreCase="false" />
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" ignoreCase="false" negate="true" />
          </conditions>
          <action type="Redirect" redirectType="Permanent" url="/{R:1}" />
        </rule>
        <rule name="Imported Rule 2" stopProcessing="true">
          <match url="^" ignoreCase="false" />
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" ignoreCase="false" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsFile" ignoreCase="false" negate="true" />
          </conditions>
          <action type="Rewrite" url="index.php" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>

```