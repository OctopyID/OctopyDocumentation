---
id: request
title: Request
sidebar_label: Request
---

## Accessing The Request

To obtain an instance of the current HTTP request via dependency injection, you should type-hint the `Octopy\HTTP\Request` class on your controller method. The incoming request instance will automatically be injected by the [service container](/docs/container):

```php
<?php

namespace App\HTTP\Controller;

use Octopy\HTTP\Request;
use Octopy\HTTP\Controller;

class UserController extends Controller
{
    /**
     * @param  Request  $request
     * @return Response
     */
    public function store(Request $request)
    {
        $name = $request->input('name');
    }
}
```

#### Dependency Injection & Route Parameters

If your controller method is also expecting input from a route parameter you should list your route parameters after your other dependencies. For example, if your route is defined like so:

```php
Route::post('user/:id', 'UserController@update');
```

You may still type-hint the `Octopy\HTTP\Request` and access your route parameter `id` by defining your controller method as follows:

```php
<?php

namespace App\HTTP\Controller;

use Octopy\HTTP\Request;
use Octopy\HTTP\Controller;

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
#### Accessing The Request Via Route Closures

You may also type-hint the `Octopy\HTTP\Request` class on a route Closure. The service container will automatically inject the incoming request into the Closure when it is executed:

```php
use Octopy\HTTP\Request;
Route::get('/', function (Request $request) {
    //
});
```

### Request Path & Method

The `Octopy\HTTP\Request` instance provides a variety of methods for examining the HTTP request for your application and extends the `Symfony\Component\HTTPFoundation\Request` class. We will discuss a few of the most important methods below.

#### Retrieving The Request Path

The `path` method returns the request's path information. So, if the incoming request is targeted at `http://domain.com/foo/bar`, the `path` method will return `foo/bar`:

```php
$uri = $request->path();
```

The `is` method allows you to verify that the incoming request path matches a given pattern. You may use the `*` character as a wildcard when utilizing this method:

```php
if ($request->is('admin/*')) {
    //
}
```

#### Retrieving The Request URL

To retrieve the full URL for the incoming request you may use the `url` method. The `url` method will return the URL without the query string:

```php
$url = $request->url();
```

#### Retrieving The Request Method

The `method` method will return the HTTP verb for the request. You passing parameter to verify that the HTTP verb matches a given string:

```php
$method = $request->method();

if ($request->method('POST')) {
    //
}
```

## Input Trimming & Normalization

By default, Octopy includes the `TrimStrings` and `ConvertEmptyStringsToNull` middleware in your application's global middleware stack. These middleware are listed in the stack by the `App\HTTP\Kernel` class. These middleware will automatically trim all incoming string fields on the request, as well as convert any empty string fields to `null`. This allows you to not have to worry about these normalization concerns in your routes and controllers.

If you would like to disable this behavior, you may remove the two middleware from your application's middleware stack by removing them from the `$middleware` property of your `App\HTTP\Kernel` class.

## Retrieving Input

#### Retrieving All Input Data

You may also retrieve all of the input data as an `array` using the `all` method:

```php
$input = $request->all();
```

#### Retrieving An Input Value

Using a few simple methods, you may access all of the user input from your `Octopy\HTTP\Request` instance without worrying about which HTTP verb was used for the request. Regardless of the HTTP verb, the `input` method may be used to retrieve user input:

```php
$name = $request->input('name');
```

You may pass a default value as the second argument to the `input` method. This value will be returned if the requested input value is not present on the request:

```php
$name = $request->input('name', 'Sally');
```

When working with forms that contain array inputs, use "dot" notation to access the arrays:

```php
    $name = $request->input('products.0.name');
```

You may call the `input` method without any arguments in order to retrieve all of the input values as an associative array:

```php
$input = $request->input();
```

#### Retrieving Input From The Query String

While the `input` method retrieves values from entire request payload (including the query string), the `query` method will only retrieve values from the query string:

```php
$name = $request->query('name');
```

If the requested query string value data is not present, the second argument to this method will be returned:

```php
$name = $request->query('name', 'Helen');
```

You may call the `query` method without any arguments in order to retrieve all of the query string values as an associative array:

```php
$query = $request->query();
```

#### Retrieving Input Via Dynamic Properties

You may also access user input using dynamic properties on the `Octopy\HTTP\Request` instance. For example, if one of your application's forms contains a `name` field, you may access the value of the field like so:

```php
$name = $request->name;
```

When using dynamic properties, Octopy will first look for the parameter's value in the request payload. If it is not present, Octopy will search for the field in the route parameters.

#### Retrieving JSON Input Values

When sending JSON requests to your application, you may access the JSON data via the `input` method as long as the `Content-Type` header of the request is properly set to `application/json`. You may even use "dot" syntax to dig into JSON arrays:

```php
    $name = $request->input('user.name');
```

You should use the `has` method to determine if a value is present on the request. The `has` method returns `true` if the value is present on the request:

```php
if ($request->has('name')) {
    //
}
```

When given an array, the `has` method will determine if all of the specified values are present:

```php
if ($request->has(['name', 'email'])) {
    //
}
```

### Cookies

#### Retrieving Cookies From Request

All cookies created by the Octopy framework are encrypted and signed with an authentication code, meaning they will be considered invalid if they have been changed by the client. To retrieve a cookie value from the request, use the `cookie` method on a `Octopy\HTTP\Request` instance:

```php
$value = $request->cookie('name');
```

## Files

### Retrieving Uploaded Files

You may access uploaded files from a `Octopy\HTTP\Request` instance using the `file` method or using dynamic properties. The `file` method returns an instance of the `Octopy\HTTP\Request\FileHandler` class, which extends the PHP `SplFileInfo` class and provides a variety of methods for interacting with the file:

```php
$file = $request->file('photo');

$file = $request->photo;
```