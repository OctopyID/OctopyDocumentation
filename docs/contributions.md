---
id: contributions
title: Contribution Guide
sidebar_label: Contribution Guide
---
## Bug Reports

To encourage active collaboration, Octopy strongly encourages pull requests, not just bug reports. "Bug reports" may also be sent in the form of a pull request containing a failing test.

However, if you file a bug report, your issue should contain a title and a clear description of the issue. You should also include as much relevant information as possible and a code sample that demonstrates the issue. The goal of a bug report is to make it easy for yourself - and others - to replicate the bug and develop a fix.

Remember, bug reports are created in the hope that others with the same problem will be able to collaborate with you on solving it. Do not expect that the bug report will automatically see any activity or that others will jump to fix it. Creating a bug report serves to help yourself and others start on the path of fixing the problem.

## Security Vulnerability

If you discover a security vulnerability within Octopy, please send an email to Supian M at <a href="mailto:supianidz@gmail.com">supianidz@gmail.com</a>. All security vulnerabilities will be promptly addressed.

## Coding Style

Octopy follows the [PSR-2](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-2-coding-style-guide.md) coding standard and the [PSR-4](https://github.com/php-fig/fig-standards/blob/master/accepted/PSR-4-autoloader.md) autoloading standard.

### PHPDoc

Below is an example of a valid Octopy documentation block by our style. Note that the `@param` attribute is followed by two spaces, the argument type and finally the variable name, variable must be parallel with other variables:

```php
/**
 * @param  string  $abstract
 * @param  Closure $concrete
 * @param  bool    $shared
 * @return void
 * @throws Exception
 */
public function bind($abstract, $concrete = null, $shared = false)
{
    //
}
```

### StyleCI

Don't worry if your code styling isn't perfect! [StyleCI](https://styleci.io/) will automatically merge any style fixes into the Octopy repository after pull requests are merged. This allows us to focus on the content of the contribution and not the code style.
