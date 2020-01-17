---
id: hashing
title: Hashing
sidebar_label: Hashing
---

## Introduction

The Octopy `Hash` provides secure Bcrypt and Argon2 hashing for storing user passwords.

> Bcrypt is a great choice for hashing passwords because its "work factor" is adjustable, which means that the time it takes to generate a hash can be increased as hardware power increases.

## Configuration

The default hashing driver for your application is configured in the `app/Config/Hashing.php` configuration file. There are currently three supported drivers: [Bcrypt](https://en.wikipedia.org/wiki/Bcrypt) and [Argon2](https://en.wikipedia.org/wiki/Argon2) (Argon2i and Argon2id variants).

> The Argon2i driver requires PHP 7.2.0 or greater and the Argon2id driver requires PHP 7.3.0 or greater.

## Basic Usage

You may hash a password by calling the `make` method on the `Hash` facade:

```php
<?php

namespace App\HTTP\Controller;

use App\DB\User;
use App\HTTP\Controller;
use Octopy\Http\Request;
use Octopy\Support\Facade\Hash;

class UpdatePasswordController extends Controller
{
    /**
     * @param  Request $request
     * @return Response
     */
    public function update(Request $request, User $user)
    {
        // Validate the new password length...

        $user = User::find($id);

        $user->update([
            'password' => Hash::make($request->password)
        ])->save();
    }
}
```

#### Adjusting The Bcrypt Work Factor

If you are using the Bcrypt algorithm, the `make` method allows you to manage the work factor of the algorithm using the `rounds` option; however, the default is acceptable for most applications:

```php
$hashed = Hash::make('password', [
    'round' => 12
]);
```

#### Adjusting The Argon2 Work Factor

If you are using the Argon2 algorithm, the `make` method allows you to manage the work factor of the algorithm using the `memory`, `time`, and `thread` options; however, the defaults are acceptable for most applications:

```php
$hashed = Hash::make('password', [
    'time'   => 2,
    'thread' => 2,
    'memory' => 1024,
]);
```

> For more information on these options, check out the [official PHP documentation](https://secure.php.net/manual/en/function.password-hash.php).

#### Verifying A Password Against A Hash

The `verify` method allows you to verify that a given plain-text string corresponds to a given hash.

```php
if (Hash::verify('plain-text', $hashedPassword)) {
    // The passwords match...
}
```

#### Checking If A Password Needs To Be Rehashed

The `needsRehash` function allows you to determine if the work factor used by the hasher has changed since the password was hashed:

```php
if (Hash::rehash($hashed)) {
    $hashed = Hash::make('plain-text');
}
```