---
id: configuration
title: Configuration
sidebar_label: Configuration
---

## Introduction

All of the configuration files for the Octopy framework are stored in the `app/Config` directory. Each option is documented, so feel free to look through the files and get familiar with the options available to you.

## Environment Configuration

It is often helpful to have different configuration values based on the environment where the application is running. For example, you may wish to use a different cache driver locally than you do on your production server.

To make this a cinch, Octopy utilizes the DotEnv. In a fresh Octopy installation, the root directory of your application will contain a `.env.example` file. If you install Octopy via Composer, this file will automatically be renamed to `.env`. Otherwise, you should rename the file manually.

Your `.env` file should not be committed to your application's source control, since each developer / server using your application could require a different environment configuration. Furthermore, this would be a security risk in the event an intruder gains access to your source control repository, since any sensitive credentials would get exposed.

> Any variable in your `.env` file can be overridden by external environment variables such as server-level or system-level environment variables.

### Environment Variable Types

All variables in your `.env` files are parsed as strings, so some reserved values have been created to allow you to return a wider range of types from the `env()` function:

`.env` Value  | `env()` Value
------------- | -------------
true 		  | (bool) true
(true) 		  | (bool) true
false 		  | (bool) false
(false) 	  | (bool) false
empty 		  | (string) ''
(empty) 	  | (string) ''
null 		  | (null) null
(null) 		  | (null) null

If you need to define an environment variable with a value that contains spaces, you may do so by enclosing the value in double quotes.

```
APP_NAME = "My Application"
```