---
id: middleware
title: Middleware
sidebar_label: Middleware
---

## Introduction

Middleware provide a convenient mechanism for filtering HTTP requests entering your application. For example, Octopy includes a middleware that verifies the user of your application is authenticated. If the user is not authenticated, the middleware will redirect the user to the login screen. However, if the user is authenticated, the middleware will allow the request to proceed further into the application.

Additional middleware can be written to perform a variety of tasks besides authentication. A CORS middleware might be responsible for adding the proper headers to all responses leaving your application. A logging middleware might log all incoming requests to your application.

There are several middleware included in the Octopy framework, including middleware for authentication and CSRF protection. All of these middleware are located in the `app/HTTP/Middleware` directory.

## Defining Middleware

To create a new middleware, use the `make:middleware` Artisan command:

```bash
php octopy make:middleware CheckAge
```

This command will place a new `CheckAge` class within your `app/HTTP/Middleware` directory. In this middleware, we will only allow access to the route if the supplied `age` is greater than 200. Otherwise, we will redirect the users back to the `home` URI:

```php
<?php

namespace App\HTTP\Middleware;

use Closure;
use Octopy\HTTP\Request;

class CheckAge
{
    /**
     * @param  Request $request
     * @param  Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if ($request->age <= 200) {
            return redirect('home');
        }

        return $next($request);
    }
}
```

As you can see, if the given `age` is less than or equal to `200`, the middleware will return an HTTP redirect to the client; otherwise, the request will be passed further into the application. To pass the request deeper into the application (allowing the middleware to "pass"), call the `$next` callback with the `$request`.

It's best to envision middleware as a series of "layers" HTTP requests must pass through before they hit your application. Each layer can examine the request and even reject it entirely.

> All middleware are resolved via the [service container](/docs/container), so you may type-hint any dependencies you need within a middleware's constructor.

### Before Middleware

Whether a middleware runs before or after a request depends on the middleware itself. For example, the following middleware would perform some task **before** the request is handled by the application:

```php
<?php

namespace App\HTTP\Middleware;

use Closure;
use Octopy\HTTP\Request;

class BeforeMiddleware
{
    /**
     * @param  Request $request
     * @param  Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Perform action

        return $next($request);
    }
}
```

### After Middleware
However, this middleware would perform its task **after** the request is handled by the application:

```php
<?php

namespace App\HTTP\Middleware;

use Closure;
use Octopy\HTTP\Request;

class BeforeMiddleware
{
    /**
     * @param  Request  $request
     * @param  Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);
        
        // Perform action

        return $response;
    }
}
```

## Registering Middleware

### Global Middleware

If you want a middleware to run during every HTTP request to your application, list the middleware class in the `$middleware` property of your `app/HTTP/Kernel.php` class.

### Assigning Middleware To Routes

If you would like to assign middleware to specific routes, you should first assign the middleware a key in your `app/HTTP/Kernel.php` file. By default, the `$routemiddleware` property of this class contains entries for the middleware included with Octopy. To add your own, append it to this list and assign it a key of your choosing:

```php
// Within App\HTTP\Kernel Class...

protected $routeMiddleware = [
    'auth' => \App\HTTP\Middleware\Authenticate::class,
    'guest' => \App\HTTP\Middleware\RedirectIfAuthenticated::class,
];
```

Once the middleware has been defined in the HTTP kernel, you may use the `middleware` method to assign middleware to a route:

```php
Route::get('admin/profile', function () {
    //
})->middleware('auth');
```

You may also assign multiple middleware to the route:

```php
Route::get('/', function () {
    //
})->middleware('first', 'second');
```

When assigning middleware, you may also pass the fully qualified class name:

```php
use App\HTTP\Middleware\CheckAge;

Route::get('admin/profile', function () {
    //
})->middleware(CheckAge::class);
```
