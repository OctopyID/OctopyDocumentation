---
id: validation
title: Validation
sidebar_label: Validation
---

## Introduction

Octopy provides several different approaches to validate your application's incoming data. By default, Octopy's base controller class uses a `ValidatesRequests` trait which provides a convenient method to validate incoming HTTP request with a variety of powerful validation rules.

## Validation Quickstart

To learn about Octopy's powerful validation features, let's look at a complete example of validating a form and displaying the error messages back to the user.

### Defining The Routes

First, let's assume we have the following routes defined in our `app/Route/Web.php` file:

```php
Route::get('post/create', 'PostController@create');

Route::post('post', 'PostController@store');
```

The `GET` route will display a form for the user to create a new blog post, while the `POST` route will store the new blog post in the database.

### Creating The Controller

Next, let's take a look at a simple controller that handles these routes. We'll leave the `store` method empty for now:

```php
<?php

namespace App\HTTP\Controller;

use App\HTTP\Controller;
use Octopy\HTTP\Request;

class PostController extends Controller
{
    /**
     * @return Response
     */
    public function create()
    {
        return view('post.create');
    }

    /**
     * @param  Request  $request
     * @return Response
    */
    public function store(Request $request)
    {
        // validate and store the blog post...
    }
}
```

### Writing The Logic

Now we are ready to fill in our `store` method with the logic to validate the new blog post. To do this, we will use the `validate` method provided by the `Octopy\HTTP\Request` object. If the validation rules pass, your code will keep executing normally; however, if validation fails, an exception will be thrown and the proper error response will automatically be sent back to the user. In the case of a traditional HTTP request, a redirect response will be generated, while a JSON response will be sent for AJAX requests.

To get a better understanding of the `validate` method, let's jump back into the `store` method:

```php
/**
 * @param  Request  $request
 * @return Response
 */
public function store(Request $request)
{
    $request->validate([
        'title' => 'required|unique:posts|max:255',
        'body'  => 'required',
    ]);

    // the blog post is valid...
}
```

As you can see, we pass the desired validation rules into the `validate` method. Again, if the validation fails, the proper response will automatically be generated. If the validation passes, our controller will continue executing normally.

Alternatively, validation rules may be specified as arrays of rules instead of a single `|` delimited string:

```php
$request->validate([
    'title' => ['required', 'unique:posts', 'max:255'],
    'body'  => ['required'],
]);
```
### Stopping On First Failure

Sometimes you may wish to stop running validation rules on an attribute after the first validation failure. To do so, assign the `bail` rule to the attribute:

```php
$request->validate([
    'title' => 'bail|required|unique:posts|max:255',
    'body'  => 'required',
]);
```

In this example, if the `unique` rule on the `title` attribute fails, the `max` rule will not be checked. Rules will be validated in the order they are assigned.

### Displaying The Errors

So, what if the incoming request parameters do not pass the given validation rules? As mentioned previously, Octopy will automatically redirect the user back to their previous location. In addition, all of the validation errors will automatically be [flashed to the session](/docs/session#flash-data).

Again, notice that we did not have to explicitly bind the error messages to the view in our `GET` route. This is because Octopy will check for errors in the session data, and automatically bind them to the view if they are available.
So, in our example, the user will be redirected to our controller's `create` method when validation fails, allowing us to display the error messages in the view:

```php
<!-- /app/View/post/create.octopy.php -->

<h1>Create Post</h1>

@if ($app->session->has('error'))
    <div class="alert alert-danger">
        <ul>
            @foreach ($app->session->pull('error') as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif
```

### AJAX Requests & Validation

In this example, we used a traditional form to send data to the application. However, many applications use AJAX requests. When using the `validate` method during an AJAX request, Octopy will not generate a redirect response. Instead, Octopy generates a JSON response containing all of the validation errors. This JSON response will be sent with a 422 HTTP status code.

### Specifying Custom Messages

In most cases, you will probably specify your custom messages in a language file instead of passing them directly to the `Validator`. To do so, add your messages to `custom` array in the `app/Language/xx/Validation.php` language file.

```php
'custom' => [
    'email' => [
        'required' => 'We need to know your e-mail address!',
    ],
],
```