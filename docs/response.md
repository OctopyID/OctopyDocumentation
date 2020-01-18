---
id: response
title: HTTP Response
sidebar_label: Response
---

## Creating Responses

#### Strings & Arrays

All routes and controllers should return a response to be sent back to the user's browser. Laravel provides several different ways to return responses. The most basic response is returning a string from a route or controller. The framework will automatically convert the string into a full HTTP response:

```php
Route::get('/', function () {
    return 'Hello World';
});
```

In addition to returning strings from your routes and controllers, you may also return arrays. The framework will automatically convert the array into a JSON response:

```php
Route::get('/', function () {
    return [1, 2, 3];
});
```

> Did you know you can also return [Tentacle collections](/docs//tentacle-collections) from your routes or controllers? They will automatically be converted to JSON. Give it a shot!

#### Response Objects

Typically, you won't just be returning simple strings or arrays from your route actions. Instead, you will be returning full `Octopy\HTTP\Response` instances or [views](/docs/views).

Returning a full `Response` instance allows you to customize the response's HTTP status code and headers for building HTTP responses:

```php
Route::get('home', function (Octopy\HTTP\Response $response) {
    return $response->body('Hello World')
                    ->status(200)
                    ->header([
                        'Content-Type' => 'text/plain'
                    ]);
});

// or you can use the `make` method to shorten it

Route::get('home', function (Octopy\HTTP\Response $response) {
    return $response->make('Hello World', 200, [
        'Content-Type' => 'text/plain'
    ]);
});
```

#### Attaching Headers To Responses

Keep in mind that most response methods are chainable, allowing for the fluent construction of response instances. For example, you may use the `header` method to add a series of headers to the response before sending it back to the user:

```php
return $response->body($content)
                ->header('Content-Type', $type)
                ->header('X-Header-One', 'Header Value')
                ->header('X-Header-Two', 'Header Value');

// or

return $response->body($content)
            ->header([
                'Content-Type' => $type,
                'X-Header-One' => 'Header Value',
                'X-Header-Two' => 'Header Value',
            ]);
```

## Redirects

Redirect responses are instances of the `Octopy\HTTP\RedirectResponse` class, and contain the proper headers needed to redirect the user to another URL. There are several ways to generate a `RedirectResponse` instance.

```php
    Route::get('dashboard', function (Octopy\HTTP\Response $response) {
        return $response->redirect('home/dashboard', 301, [
            'X-Header-One' => 'Header Value',
                'X-Header-Two' => 'Header Value',
        ]);
    });
```

Sometimes you may wish to redirect the user to their previous location, such as when a submitted form is invalid. You may do so by using the global `back` helper function. Since this feature utilizes the [session](/docs/session), make sure the route calling the `back` function is using the `web` middleware group or has all of the session middleware applied:

```php
Route::post('user/profile', function (Octopy\HTTP\Response $respons) {
    // Validate the request...

    return $response->redirect()->back();
});
```

### Redirecting To Named Routes

When you call the `redirect` helper with no parameters, an instance of `Octopy\Routing\Redirector` is returned, allowing you to call any method on the `Redirector` instance. For example, to generate a `RedirectResponse` to a named route, you may use the `route` method:

```php
    return $response->redirect()->route('login');
```

If your route has parameters, you may pass them as the second argument to the `route` method:

```php
// for a route with the following URI: profile/:id
return $response->redirect()->route('profile', ['id' => 1]);
```

### Redirecting With Flashed Session Data

Redirecting to a new URL and [flashing data to the session](/docs/session#flash-data) are usually done at the same time. Typically, this is done after successfully performing an action when you flash a success message to the session. For convenience, you may create a `RedirectResponse` instance and flash data to the session in a single, fluent method chain:

```php
Route::post('user/profile', function () {
    // update the user's profile...

    return $response->redirect('dashboard')->flash('status', 'Profile updated!');
});
```

After the user is redirected, you may display the flashed message from the [session](/docs/{{version}}/session). For example, using [Octopy syntax](/docs/Octopy):

```php
@if ($app->session->has('status'))
    <div class="alert alert-success">
        {{ $app->session->pull('status') }}
    </div>
@endif
```

### View Responses

If you need control over the response's status and headers but also need to return a [view](/docs/{{version}}/views) as the response's content, you should use the `view` method:

```php
return $response->view('hello', $data, 200)
                ->header('Content-Type', $type);
```
### JSON Responses

The `json` method will automatically set the `Content-Type` header to `application/json`, as well as convert the given array to JSON using the `json_encode` PHP function:

```php
return $response->json([
    'name'  => 'Supian',
    'state' => 'ID'
]);
```

### File Downloads

The `download` method may be used to generate a response that forces the user's browser to download the file at the given path. The `download` method accepts a file name as the second argument to the method, which will determine the file name that is seen by the user downloading the file. Finally, you may pass an array of HTTP headers as the third argument to the method:

```php
return $response->download($path);

return $response->download($path, $name, $disposition);
```

## Response Macros

If you would like to define a custom response that you can re-use in a variety of your routes and controllers, you may use the `macro` method on the `Response` facade. For example, from a [service provider's](/docs/{{version}}/providers) `boot` method:


```php
<?php

namespace App\Provider;

use Octopy\Support\Facades\Response;
use Octopy\Provider\ServiceProvider;

class ResponseMacroServiceProvider extends ServiceProvider
{
    /**
     * @return void
     */
    public function boot()
    {
        Response::macro('caps', function ($value) {
             return Response::make(strtoupper($value));
        });
    }
}
```

The `macro` function accepts a name as its first argument, and a Closure as its second. The macro's Closure will be executed when calling the macro name from a `Response` instance:

```php
return $response->caps('foo');
```