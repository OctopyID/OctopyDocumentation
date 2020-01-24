---
id: session
title: Session
sidebar_label: Session
---

## Introduction

Since HTTP driven applications are stateless, sessions provide a way to store information about the user across multiple requests. Octopy ships with a variety of session backends that are accessed through an expressive, unified API.

### Configuration

The session configuration file is stored at `app/Config/Session.php`. Be sure to review the options available to you in this file. By default, Octopy is configured to use the `cookie` session driver, which will work well for many applications.

The session `driver` configuration option defines where session data will be stored for each request. Octopy ships with several great drivers out of the box:

- `file` - sessions are stored in `storage/session`.
- `array` - sessions are stored in a PHP array and will not be persisted.

> The array driver is used during [testing](/docs/testing) and prevents the data stored in the session from being persisted.

## Using The Session

### Retrieving Data

There are two primary ways of working with session data in Octopy: the global `session` helper and via a `Session` instance. First, let's look at accessing the session via a `Session` instance, which can be type-hinted on a controller method. Remember, controller method dependencies are automatically injected via the Octopy [service container](/docs/container):

```php
<?php

namespace App\HTTP\Controller;

use Octopy\Session;
use App\HTTP\Controller;

class UserController extends Controller
{
    /**
     * @param  Session  $request
     * @param  int  $id
     * @return Response
     */
        public function show(Session $session, $id)
        {
            $value = $session->get('key');

            //
        }
    }
```

When you retrieve an item from the session, you may also pass a default value as the second argument to the `get` method. This default value will be returned if the specified key does not exist in the session. If you pass a `Closure` as the default value to the `get` method and the requested key does not exist, the `Closure` will be executed and its result returned:

```php
$value = $session->get('key', 'default');

$value = $session->get('key', function () {
    return 'default';
});
```

#### The Global Session Helper

You may also use the global `session` PHP function to retrieve and store data in the session. When the `session` helper is called with a single, string argument, it will return the value of that session key. When the helper is called with an array of key / value pairs, those values will be stored in the session:

```php
Route::get('home', function () {
    // Retrieve a piece of data from the session...
    $value = session('key');

    // Specifying a default value...
    $value = session('key', 'default');

    // Store a piece of data in the session...
    session(['key' => 'value']);
});
```

#### Retrieving All Session Data

If you would like to retrieve all the data in the session, you may use the `all` method:

```php
$data = $session->all();
```

#### Determining If An Item Exists In The Session

To determine if an item is present in the session, you may use the `has` method. The `has` method returns `true` if the item is present and is not `null`:

```php
if ($session->has('users')) {
    //
}
```

To determine if an item is present in the session, even if its value is `null`, you may use the `exists` method. The `exists` method returns `true` if the item is present:

```php
if ($session->exists('users')) {
    //
}
```

### Storing Data

To store data in the session, you will typically use the `set` method or the `session` helper:

```php
// via a Session instance...
$session->set('key', 'value');

// via the global helper...
session(['key' => 'value']);
```

#### Retrieving & Deleting An Item

The `pull` method will retrieve and delete an item from the session in a single statement:

```php
$value = $session->pull('key', 'default');
```

### Flash Data

Sometimes you may wish to store items in the session only for the next request. You may do so using the `flash` method. Data stored in the session using this method will be available immediately and during the subsequent HTTP request. After the subsequent HTTP request, the flashed data will be deleted. Flash data is primarily useful for short-lived status messages:

```php
$session->flash('status', 'Task was successful!');

// or via Response instance...
$response->flash('status', 'Task was successful!');
```

### Deleting Data

The `forget` method will remove a piece of data from the session. If you would like to remove all data from the session, you may use the `flush` method:

```php
// Forget a single key...
$session->forget('key');

// Forget multiple keys...
$session->forget(['key1', 'key2']);

$session->flush();
```

### Regenerating The Session ID

Regenerating the session ID is often done in order to prevent malicious users from exploiting a [session fixation](HTTPs://en.wikipedia.org/wiki/Session_fixation) attack on your application.

If you need to manually regenerate the session ID, you may use the `regenerate` method.

```php
$session->regenerate();
```

## Adding Custom Session Drivers

#### Implementing The Driver

Your custom session driver should implement the `SessionHandlerInterface`. This interface contains just a few simple methods we need to implement. A stubbed MongoDB implementation looks something like this:

```php
<?php

namespace App\Extension;

class MongoSessionHandler implements \SessionHandlerInterface
{
    public function open($path, $name) {}
    public function close() {}
    public function read($id) {}
    public function write($id, $data) {}
    public function destroy($id) {}
    public function gc($lifetime) {}
}
```

> Octopy does not ship with a directory to contain your extensions. You are free to place them anywhere you like. In this example, we have created an `Extension` directory to house the `MongoSessionHandler`.

Since the purpose of these methods is not readily understandable, let's quickly cover what each of the methods do:

- The `open` method would typically be used in file based session store systems. Since Octopy ships with a `file` session driver, you will almost never need to put anything in this method. You can leave it as an empty stub. It is a fact of poor interface design (which we'll discuss later) that PHP requires us to implement this method.
- The `close` method, like the `open` method, can also usually be disregarded. For most drivers, it is not needed.
- The `read` method should return the string version of the session data associated with the given `$id`. There is no need to do any serialization or other encoding when retrieving or storing session data in your driver, as Octopy will perform the serialization for you.
- The `write` method should write the given `$data` string associated with the `$id` to some persistent storage system, such as MongoDB, Dynamo, etc.  Again, you should not perform any serialization - Octopy will have already handled that for you.
- The `destroy` method should remove the data associated with the `$id` from persistent storage.
- The `gc` method should destroy all session data that is older than the given `$lifetime`, which is a UNIX timestamp. For self-expiring systems like Memcached and Redis, this method may be left empty.

#### Registering The Driver

Once your driver has been implemented, you are ready to register it with the framework. To add additional drivers to Octopy's session backend, you may use the `extend` method on the `Session` [facade](/docs/{{version}}/facades). You should call the `extend` method from the `boot` method of a [service provider](/docs/{{version}}/providers). You may do this from the existing `AppServiceProvider` or create an entirely new provider:

```php
<?php

namespace App\Providers;

use App\Extension\MongoSessionHandler;
use Octopy\Provider\ServiceProvide;

class SessionServiceProvider extends ServiceProvider
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
        $this->app->session->extend('mongo', function ($app) {
            // Return implementation of SessionHandlerInterface...
            return new MongoSessionHandler;
        });
    }
}
```

Once the session driver has been registered, you may use the `mongo` driver in your `app/Config/Session.php` configuration file.
