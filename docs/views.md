---
id: views
title: Views
sidebar_label: Views
---

## Creating Views

> Looking for more information on how to write Octopy templates? Check out the full [Octopy documentation](/docs/templating) to get started.

Views contain the HTML served by your application and separate your controller / application logic from your presentation logic. Views are stored in the `app/View` directory. A simple view might look something like this:

```html
<!-- View stored in app/View/greeting.octopy.php -->

<html>
    <body>
        <h1>Hello, {{ $name }}</h1>
    </body>
</html>
```

Since this view is stored at `app/View/greeting.octopy.php`, we may return it using the global `view` helper like so:

```php
Route::get('/', function () {
    return view('greeting', ['name' => 'Supian M']);
});
```

As you can see, the first argument passed to the `view` helper corresponds to the name of the view file in the `app/View` directory. The second argument is an array of data that should be made available to the view. In this case, we are passing the `name` variable, which is displayed in the view using [Octopy syntax](/docs/template).

Views may also be nested within subdirectories of the `app/View` directory. "Dot" notation may be used to reference nested views. For example, if your view is stored at `app/View/admin/profile.octopy.php`, you may reference it like so:

```php
return view('admin.profile', $data);
```

## Passing Data To Views

As you saw in the previous examples, you may pass an array of data to views:

```php
    return view('greetings', ['name' => 'Victoria']);
```

When passing information in this manner, the data should be an array with key / value pairs. Inside your view, you can then access each value using its corresponding key, such as `<?php echo $key; ?>`.

#### Sharing Data With All Views

Occasionally, you may need to share a piece of data with all views that are rendered by your application. You may do so using the view facade's `share` method. Typically, you should place calls to `share` within a service provider's `boot` method. You are free to add them to the `AppServiceProvider` or generate a separate service provider to house them:

```php
<?php

namespace App\Provider;

use Octopy\Provider\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * @return void
     */
    public function boot()
    {
        $this->app->view->share('key', 'value');
    }
}

```