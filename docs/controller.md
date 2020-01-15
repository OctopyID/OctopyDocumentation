---
id: controller
title: Controller
sidebar_label: Controller
---

## Introduction

Instead of defining all of your request handling logic as Closures in route files, you may wish to organize this behavior using Controller classes. Controllers can group related request handling logic into a single class. Controllers are stored in the `app/HTTP/Controller` directory.

## Basic Controllers

### Defining Controllers

Below is an example of a basic controller class. Note that the controller extends the base controller class included with Octopy. The base class provides a few convenience methods such as the `middleware` method, which may be used to attach middleware to controller actions:

```php
<?php

namespace App\HTTP\Controller;

use App\DB\Repository;
use App\HTTP\Controller;
use Octopy\HTTP\Response;

class UserController extends Controller
{
    /**
     * @param  Response $response
     * @param  integer  $id
     * @return Response
     */
    public function show(Response $response, int $id)
    {
    	$user = Repository::where('id', $id)->first();

        return $response->view('user.profile', [
        	'user' => $user
        ]);
    }
}

```
You can define a route to this controller action like so:

```php
Route::get('user/:id', 'UserController@show');
```

Now, when a request matches the specified route URI, the `show` method on the `UserController` class will be executed. The route parameters will also be passed to the method.

> Controllers are not **required** to extend a base class. However, you will not have access to convenience features such as the `middleware`, `validate`, and `dispatch` methods.

### Controllers & Namespaces

It is very important to note that we did not need to specify the full controller namespace when defining the controller route. Since the `RouteServiceProvider` loads your route files within a route group that contains the namespace, we only specified the portion of the class name that comes after the `App\HTTP\Controller` portion of the namespace.

If you choose to nest your controllers deeper into the `App\HTTP\Controller` directory, use the specific class name relative to the `App\HTTP\Controller` root namespace. So, if your full controller class is `App\HTTP\Controller\Photos\AdminController`, you should register routes to the controller like so:

```php
Route::get('foo', 'Photos\AdminController@method');
```

### Single Action Controllers

If you would like to define a controller that only handles a single action, you may place a single `__invoke` method on the controller:

```php
<?php

namespace App\HTTP\Controller;

use App\DB\Repository;
use App\HTTP\Controller;

class ShowProfile extends Controller
{
    /**
     * @param  int  $id
     * @return View
     */
    public function __invoke($id)
    {
    	$user = Repository::where('id', $id)->first();

        return view('user.profile', [
        	'user' => $user
        ]);
    }
}
```

When registering routes for single action controllers, you do not need to specify a method:

```php
Route::get('user/:id', 'ShowProfile');
```

## Controller Middleware

[Middleware](/docs/middleware) may be assigned to the controller's routes in your route files:

```php
Route::get('profile', 'UserController@show')->middleware('auth');
```

However, it is more convenient to specify middleware within your controller's constructor. Using the `middleware` method from your controller's constructor, you may easily assign middleware to the controller's action. You may even restrict the middleware to only certain methods on the controller class:

```php
<?php

namespace App\HTTP\Controller;

use App\DB\Repository;
use App\HTTP\Controller;

class ShowProfile extends Controller
{
	/**
	 * @return void
	 */
    public function __construct()
    {
        $this->middleware('auth');

        $this->middleware('log')->only('index');

        $this->middleware('subscribed')->except('store');
    }
}
```

Controllers also allow you to register middleware using a Closure. This provides a convenient way to define a middleware for a single controller without defining an entire middleware class:

```php
$this->middleware(function ($request, $next) {
    // ...
    return $next($request);
});
```

> You may assign middleware to a subset of controller actions; however, it may indicate your controller is growing too large. Instead, consider breaking your controller into multiple, smaller controllers.

## Dependency Injection & Controllers

#### Constructor Injection

The Octopy [service container](/docs/container) is used to resolve all Octopy controllers. As a result, you are able to type-hint any dependencies your controller may need in its constructor. The declared dependencies will automatically be resolved and injected into the controller instance:

```php
<?php

namespace App\HTTP\Controller;

use App\HTTP\Controller;
use App\DB\Repository;

class UserController extends Controller
{
    /**
     * @var App\DB\Repository
     */
    protected $users;

    /**
     * @param  Repository $users
     * @return void
     */
    public function __construct(Repository $users)
    {
        $this->users = $users;
    }
}
```

You may also type-hint any class. If the container can resolve it, you can type-hint it. Depending on your application, injecting your dependencies into your controller may provide better testability.

#### Method Injection

In addition to constructor injection, you may also type-hint dependencies on your controller's methods. A common use-case for method injection is injecting the `Octopy\HTTP\Request` instance into your controller methods:

```php
<?php

namespace App\HTTP\Controller;

use Octopy\HTTP\Request;

class UserController extends Controller
{
    /**
     * @param  Request  $request
     * @return Response
     */
    public function store(Request $request)
    {
        $name = $request->name;
    }
}
```

If your controller method is also expecting input from a route parameter, list your route arguments after your other dependencies. For example, if your route is defined like so:

```php
Route::post('user/:id', 'UserController@update');
```

You may still type-hint the `Octopy\HTTP\Request` and access your `id` parameter by defining your controller method as follows:

```php
<?php

namespace App\HTTP\Controller;

use Octopy\HTTP\Request;

class UserController extends Controller
{
    /**
     * @param  Request  $request
     * @param  string  $id
     * @return Response
     */
    public function update(Request $request, $id)
    {
 		//
    }
}
```

## Route Caching

> Closure based routes cannot be cached. To use route caching, you must convert any Closure routes to controller classes.

If your application is exclusively using controller based routes, you should take advantage of Octopy's route cache. Using the route cache will drastically decrease the amount of time it takes to register all of your application's routes. In some cases, your route registration may even be up to 100x faster. To generate a route cache, just execute the `route:cache` Octopy command:

```
php octopy route:cache
```

After running this command, your cached routes file will be loaded on every request. Remember, if you add any new routes you will need to generate a fresh route cache. Because of this, you should only run the `route:cache` command during your project's deployment.

You may use the `route:clear` command to clear the route cache:

```
php octopy route:clear
```
