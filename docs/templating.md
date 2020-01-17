---
id: templating
title: Octopy Template
sidebar_label: Octopy Template
---

## Introduction

Octopy is the simple, yet powerful templating engine provided with Octopy. Unlike other popular PHP templating engines, Octopy does not restrict you from using plain PHP code in your views. In fact, all Octopy views are compiled into plain PHP code and cached until they are modified, meaning Octopy adds essentially zero overhead to your application. Octopy view files use the `.octopy.php` file extension and are typically stored in the `app/View` directory.

## Template Inheritance

### Defining A Layout

Two of the primary benefits of using Octopy are _template inheritance_ and _sections_. To get started, let's take a look at a simple example. First, we will examine a "master" page layout. Since most web applications maintain the same general layout across various pages, it's convenient to define this layout as a single Octopy view:

```php
<html>
    <head>
        <title>App Name - @yield('title')</title>
    </head>
    <body>
        @block('sidebar')
            This is the master sidebar.
        @endblock

        <div class="container">
            @yield('content')
        </div>
    </body>
</html>
```

As you can see, this file contains typical HTML mark-up. However, take note of the `@block` and `@yield` directives. The `@block` directive, as the name implies, defines a section of content, while the `@yield` directive is used to display the contents of a given section.

Now that we have defined a layout for our application, let's define a child page that inherits the layout.

### Extending A Layout

When defining a child view, use the Octopy `@parent` directive to specify which layout the child view should "inherit". Views which extend a Octopy layout may inject content into the layout's sections using `@block` directives. Remember, as seen in the example above, the contents of these sections will be displayed in the layout using `@yield`:

```php
@parent('layouts.app')

@block('title', 'Page Title')

@block('sidebar')
    <p>This is appended to the master sidebar.</p>
@endblock

@block('content')
    <p>This is my body content.</p>
@endblock
```

In this example, the `sidebar` section is utilizing the `@@parent` directive to append (rather than overwriting) content to the layout's sidebar. The `@@parent` directive will be replaced by the content of the layout when the view is rendered.

> Contrary to the previous example, this `sidebar` section ends with `@endblock` instead of `@show`. The `@endblock` directive will only define a section while `@show` will define and **immediately yield** the section.

Octopy views may be returned from routes using the global `view` helper:

```php
Route::get('octopy', function (Octopy\HTTP\Response $response) {
    return $response->view('child');
});
```

## Displaying Data

You may display data passed to your Octopy views by wrapping the variable in curly braces. For example, given the following route:

```php
Route::get('greeting', function (Octopy\HTTP\Response $response) {
    return $response->view('welcome', ['name' => 'Supian M']);
});
```

You may display the contents of the `name` variable like so:

```php
Hello, {{ $name }}.
```
> Octopy `{{ }}` statements are automatically sent through PHP's `htmlspecialchars` function to prevent XSS attacks.

You are not limited to displaying the contents of the variables passed to the view. You may also echo the results of any PHP function. In fact, you can put any PHP code you wish inside of a Octopy echo statement:

```php
    The current UNIX timestamp is {{ time() }}.
```
#### Displaying Unescaped Data

By default, Octopy `{{ }}` statements are automatically sent through PHP's `htmlspecialchars` function to prevent XSS attacks. If you do not want your data to be escaped, you may use the following syntax:

```php
Hello, {{{ $name }}}.
```

> Be very careful when echoing content that is supplied by users of your application. Always use the escaped, double curly brace syntax to prevent XSS attacks when displaying user supplied data.

#### Rendering JSON

Sometimes you may pass an array to your view with the intention of rendering it as JSON in order to initialize a JavaScript variable. For example:

```php
<script>
    var app = <?php echo json_encode($array); ?>;
</script>
```
However, instead of manually calling `json_encode`, you may use the `@json` Octopy directive:

```php
<script>
    var app = @json($array);
</script>
```

The `@json` directive is also useful for seeding Vue components or `data-*` attributes:

```php
<example-component :some-prop='@json($array)'></example-component>
```

> Using `@json` in element attributes requires that it be surrounded by single quotes.

## Control Structures

In addition to template inheritance and displaying data, Octopy also provides convenient shortcuts for common PHP control structures, such as conditional statements and loops. These shortcuts provide a very clean, terse way of working with PHP control structures, while also remaining familiar to their PHP counterparts.

### If Statements

You may construct `if` statements using the `@if`, `@elseif`, `@else`, and `@endif` directives. These directives function identically to their PHP counterparts:

```php
@if (count($records) === 1)
    I have one record!
@elseif (count($records) > 1)
    I have multiple records!
@else
    I don't have any records!
@endif
```

In addition to the conditional directives already discussed, the `@isset` and `@empty` directives may be used as convenient shortcuts for their respective PHP functions:

```php
@isset($records)
    // $records is defined and is not null...
@endisset

@empty($records)
    // $records is "empty"...
@endempty
```

#### Section Directives

```php
<div class="pull-right">
    @yield('navigation')
</div>

<div class="clearfix"></div>
```

### Switch Statements

Switch statements can be constructed using the `@switch`, `@case`, `@break`, `@default` and `@endswitch` directives:

```php
@switch($i)
    @case(1)
        First case...
        @break

    @case(2)
        Second case...
        @break

    @default
        Default case...
@endswitch
```

### Loops

In addition to conditional statements, Octopy provides simple directives for working with PHP's loop structures. Again, each of these directives functions identically to their PHP counterparts:

```php
@for ($i = 0; $i < 10; $i++)
    The current value is {{ $i }}
@endfor

@foreach ($users as $user)
    <p>This is user {{ $user->id }}</p>
@endforeach

@while (true)
    <p>I'm looping forever.</p>
@endwhile
```

> When looping, you may use the [loop variable](#the-loop-variable) to gain valuable information about the loop, such as whether you are in the first or last iteration through the loop.

When using loops you may also end the loop or skip the current iteration:

```php
@foreach ($users as $user)
    @if ($user->type == 1)
        @continue
    @endif

    <li>{{ $user->name }}</li>

    @if ($user->number == 5)
        @break
    @endif
@endforeach
```

You may also include the condition with the directive declaration in one line:


```php
@foreach ($users as $user)
    @continue($user->type == 1)

    <li>{{ $user->name }}</li>

    @break($user->number == 5)
@endforeach
```

### Comments

Octopy also allows you to define comments in your views. However, unlike HTML comments, Octopy comments are not included in the HTML returned by your application:

```php
{{-- This comment will not be present in the rendered HTML --}}
```

### PHP

In some situations, it's useful to embed PHP code into your views. You can use the Octopy `@php` directive to execute a block of plain PHP within your template:
    
```php
// Single Line...
@php($firstname = 'Supian'; $lastname = 'M')
    
// Multiple Line...
@php
    $firstname = 'Supian';
    $lastname  = 'M';
@endphp
```

> While Octopy provides this feature, using it frequently may be a signal that you have too much logic embedded within your template.

## Forms

### CSRF Field

Anytime you define an HTML form in your application, you should include a hidden CSRF token field in the form so that [the CSRF protection](/docs/csrf) middleware can validate the request. You may use the `@csrf` Octopy directive to generate the token field:

```php
<form method="POST" action="/profile">
    @csrf
    ...
</form>
```

## Including Sub-Views

Octopy's `@include` directive allows you to include a Octopy view from within another view. All variables that are available to the parent view will be made available to the included view:

```php
<div>
    @include('shared.errors')

    <form>
        <!-- Form Contents -->
    </form>
</div>
```

Even though the included view will inherit all data available in the parent view, you may also pass an array of extra data to the included view:

```php
 @include('view.name', ['some' => 'data'])
```

If you attempt to `@include` a view which does not exist, Octopy will throw an error. If you would like to include a view that may or may not be present.

> You should avoid using the `__DIR__` and `__FILE__` constants in your Octopy views, since they will refer to the location of the cached, compiled view.

## Service Injection

The `@inject` directive may be used to retrieve a service from the Octopy [service container](/docs/container). The first argument passed to `@inject` is the name of the variable the service will be placed into, while the second argument is the class or interface name of the service you wish to resolve:

```php
@inject('metrics', 'App\Service\MetricsService')

<div>
    Monthly Revenue: {{ $metrics->monthlyRevenue() }}.
</div>
```

## Extending Octopy

Octopy allows you to define your own custom directives using the `directive` method. When the Octopy compiler encounters the custom directive, it will call the provided callback with the expression that the directive contains.

The following example creates a `@datetime($var)` directive which formats a given `$var`, which should be an instance of `DateTime`:

```php
<?php

namespace App\Provider;

use Octopy\Provider\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * @return void
     */
    public function boot()
    {
        $this->app->view->directive('datetime', function ($expression) {
            return "<?php echo ($expression)->format('m/d/Y H:i'); ?>";
        });
    }

    /**
     * @return void
     */
    public function register()
    {
        //
    }
}
```

As you can see, we will chain the `format` method onto whatever expression is passed into the directive. So, in this example, the final PHP generated by this directive will be:

```php
<?php echo ($var)->format('m/d/Y H:i'); ?>
```

> After updating the logic of a Octopy directive, you will need to delete all of the cached Octopy views. The cached Octopy views may be removed using the `view:clear` Octopy command.