---
id: localization
title: Localization
sidebar_label: Localization
---

## Introduction

Octopy's localization features provide a convenient way to retrieve strings in various languages, allowing you to easily support multiple languages within your application. Language strings are stored in files within the `app/Language` directory. Within this directory there should be a subdirectory for each language supported by the application:

```
app
└── Language
    ├── en
    │   └── messages.php
    └── id
        └── messages.php
```

All language files return an array of keyed strings. For example:

```php
<?php

return [
    'welcome' => 'Welcome to our application'
];
```

> For languages that differ by territory, you should name the language directories according to the ISO 15897. For example, "en_GB" should be used for British English rather than "en-gb".

### Configuring The Locale

The default language for your application is stored in the `config/App.php` configuration file. You may modify this value to suit the needs of your application. You may also change the active language at runtime using the `locale` method on the `App` facade:

```php
Route::get('welcome/:locale', function ($locale) {
    App::locale($locale);
});
```

#### Determining The Current Locale

You may use the `locale` on the `App` facade to determine the current locale:
```php
$locale = App::locale();
```

## Defining Translation Strings

### Using Short Keys

Typically, translation strings are stored in files within the `app/Language` directory. Within this directory there should be a subdirectory for each language supported by the application:

```
app
└── Language
    ├── en
    │   └── messages.php
    └── id
        └── messages.php
```

All language files return an array of keyed strings. For example:

```php
<?php

// app/Language/en/messages.php

return [
    'welcome' => 'Welcome to our application'
];
```

## Retrieving Translation Strings

You may retrieve lines from language files using the `__` helper function. The `__` method accepts the file and key of the translation string as its first argument. For example, let's retrieve the `welcome` translation string from the `app/Language/en/` language file:

```php
   echo __('messages.welcome');
```

If you are using the [Octopy templating engine](/docs/templating), you may use the `{{ }}` syntax to echo the translation string or use the `@lang` directive:

    {{ __('messages.welcome') }}

    @lang('messages.welcome')

If the specified translation string does not exist, the `__` function will return the translation string key. So, using the example above, the `__` function would return `messages.welcome` if the translation string does not exist.

> {The `@lang` directive does not escape any output. You are **fully responsible** for escaping your own output when using this directive.

### Replacing Parameters In Translation Strings

If you wish, you may define placeholders in your translation strings. All placeholders are prefixed with a `:`. For example, you may define a welcome message with a placeholder name:

```php
'welcome' => 'Welcome, :name',
```

To replace the placeholders when retrieving a translation string, pass an array of replacements as the second argument to the `__` function:

```php
echo __('messages.welcome', ['name' => 'Supian M']);
```