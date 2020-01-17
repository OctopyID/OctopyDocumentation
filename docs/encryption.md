---
id: encryption
title: Encryption
sidebar_label: Encryption
---

## Introduction

Octopy's encrypter uses OpenSSL to provide AES-256 and AES-128 encryption. You are strongly encouraged to use Octopy's built-in encryption facilities and not attempt to roll your own "home grown" encryption algorithms. All of Octopy's encrypted values are signed using a message authentication code (MAC) so that their underlying value can not be modified once encrypted.

## Configuration

Before using Octopy's encrypter, you must set a `key` option in your `config/app.php` configuration file. You should use the `php artisan key:generate` command to generate this key since this Artisan command will use PHP's secure random bytes generator to build your key. If this value is not properly set, all values encrypted by Octopy will be insecure.

## Using The Encrypter

#### Encrypting A Value

You may encrypt a value using the `encrypt` helper. All encrypted values are encrypted using OpenSSL and the `AES-256-CBC` cipher. Furthermore, all encrypted values are signed with a message authentication code (MAC) to detect any modifications to the encrypted string:

```php
<?php

namespace App\HTTP\Controller;

use App\DB\User;
use App\HTTP\Controller;
use Octopy\HTTP\Request;

class UserController extends Controller
{
    /**
     * @param  Request $request
     * @param  int     $id
     * @return Response
     */
    public function store(Request $request, $id)
     {
        $user = User::find($id);

        $user->fill([
            'secret' => encrypt($request->secret),
        ])->save();
    }
}
```

#### Encrypting Without Serialization

Encrypted values are passed through `serialize` during encryption, which allows for encryption of objects and arrays. Thus, non-PHP clients receiving encrypted values will need to `unserialize` the data. If you would like to encrypt and decrypt values without serialization, you may use the `encrypt` and `decrypt` methods of the `Crypt` facade:

```php
use Octopy\Support\Facade\Crypt;

$encrypted = Crypt::encrypt('Hello world.');

$decrypted = Crypt::decrypt($encrypted);
```

#### Decrypting A Value

You may decrypt values using the `decrypt` helper. If the value can not be properly decrypted, such as when the MAC is invalid, an `topy\Encryption\Exceptio\DecryptExceptioon` will be thrown:

```php
use Octopy\Encryption\Exceptio\DecryptException;

try {
    $decrypted = decrypt($encrypted);
} catch (DecryptException $exception) {
    //
}
```
