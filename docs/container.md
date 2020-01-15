---
id: container
title: Service Container
sidebar_label: Service Container
---

## Introduction

The Octopy service container is a powerful tool for managing class dependencies and performing dependency injection. Dependency injection is a fancy phrase that essentially means this: class dependencies are "injected" into the class via the constructor or, in some cases, "setter" methods.

Let's look at a simple example:

```php
<?php

namespace App\HTTP\Controller;

use App\DB\Repository;
use App\HTTP\Controller;
use Octopy\HTTP\Response;

class UserController extends Controller
{
    /**
     * @var Repository
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

    /**
     * @param  integer  $id
     * @param  Response $response
     * @return Response
     */
    public function show($id, Response $response)
    {
        $user = $this->users->find($id);

        return $response->view('user.profile', ['user' => $user]);
    }
}

```

In this example, the `UserController` needs to retrieve users from a data source. So, we will **inject** a service that is able to retrieve users. In this context, our `Repository` most likely extending with model to retrieve user information from the database. However, since the repository is injected, we are able to easily swap it out with another implementation. We are also able to easily "mock", or create a dummy implementation of the `Repository` when testing our application.

A deep understanding of the Octopy service container is essential to building a powerful, large application, as well as for contributing to the Octopy core itself.

## Binding

Almost all of your service container bindings will be registered within [service providers](/docs/providers), so most of these examples will demonstrate using the container in that context.

> There is no need to bind classes into the container if they do not depend on any interfaces. The container does not need to be instructed on how to build these objects, since it can automatically resolve these objects using reflection.

You may also bind an existing object instance into the container using the `instance` method. The given instance will always be returned on subsequent calls into the container:

```php
$api = new HelpSpot\API(new HttpClient);

$this->app->instance('HelpSpot\API', $api);
```

## Resolving

#### The `make` Method

You may use the `make` method to resolve a class instance out of the container. The `make` method accepts the name of the class or interface you wish to resolve:

```php
$api = $this->app->make('HelpSpot\API');
```

If you are in a location of your code that does not have access to the `$app` variable, you may use the global `app` helper:

```php
$api = app('HelpSpot\API');
```

If some of your class' dependencies are not resolvable via the container, you may inject them by passing them as an associative array into the `make` method:

```php
$api = $this->app->make('HelpSpot\API', ['id' => 1]);
```

#### Automatic Injection

Alternatively, and importantly, you may "type-hint" the dependency in the constructor of a class that is resolved by the container, including [controllers](/docs/controllers), [event listeners](/docs/events), [middleware](/docs/middleware), and more. Additionally, you may type-hint dependencies in the `handle` method of [queued jobs](/docs/queues). In practice, this is how most of your objects should be resolved by the container.

For example, you may type-hint a repository defined by your application in a controller's constructor. The repository will automatically be resolved and injected into the class:

```php
<?php

namespace App\HTTP\Controller;

use App\DB\Repository;
use App\HTTP\Controller;
use Octopy\HTTP\Request;
use Octopy\HTTP\Response;

class UserController extends Controller
{
    /**
     * @var Repository
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

    /**
     * @param  Request  $request
     * @param  Response $response
     * @return Response
     */
    public function show(Request $request, Response $response)
    {
        //
    }
}

```