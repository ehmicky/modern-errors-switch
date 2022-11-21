<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/ehmicky/design/main/modern-errors/modern-errors_dark.svg"/>
  <img alt="modern-errors logo" src="https://raw.githubusercontent.com/ehmicky/design/main/modern-errors/modern-errors.svg" width="600"/>
</picture>

[![Node](https://img.shields.io/badge/-Node.js-808080?logo=node.js&colorA=404040&logoColor=66cc33)](https://www.npmjs.com/package/modern-errors-switch)
[![Browsers](https://img.shields.io/badge/-Browsers-808080?logo=firefox&colorA=404040)](https://unpkg.com/modern-errors-switch?module)
[![TypeScript](https://img.shields.io/badge/-Typed-808080?logo=typescript&colorA=404040&logoColor=0096ff)](/types/main.d.ts)
[![Codecov](https://img.shields.io/badge/-Tested%20100%25-808080?logo=codecov&colorA=404040)](https://codecov.io/gh/ehmicky/modern-errors-switch)
[![Minified size](https://img.shields.io/bundlephobia/minzip/modern-errors-switch?label&colorA=404040&colorB=808080&logo=webpack)](https://bundlephobia.com/package/modern-errors-switch)
[![Mastodon](https://img.shields.io/badge/-Mastodon-808080.svg?logo=mastodon&colorA=404040&logoColor=9590F9)](https://fosstodon.org/@ehmicky)
[![Medium](https://img.shields.io/badge/-Medium-808080.svg?logo=medium&colorA=404040)](https://medium.com/@ehmicky)

[`modern-errors`](https://github.com/ehmicky/modern-errors)
[plugin](https://github.com/ehmicky/modern-errors#-plugins) to execute
class-specific logic.

This adds [`BaseError.switch()`](#baseerrorswitcherror) to wrap an error
according to its class.

# Example

[Adding the plugin](https://github.com/ehmicky/modern-errors#adding-plugins) to
[`modern-errors`](https://github.com/ehmicky/modern-errors).

```js
import ModernError from 'modern-errors'
import modernErrorsSwitch from 'modern-errors-switch'

export const BaseError = ModernError.subclass('BaseError', {
  plugins: [modernErrorsSwitch],
})
// ...
```

Wrapping an error's message according to its class.

```js
try {
  // ...
} catch (error) {
  throw BaseError.switch(error)
    .case(InputError, 'The input was invalid.')
    .case(DatabaseError, 'Bug at the database layer.')
    .default('Unknown error.')
}
```

# Install

```bash
npm install modern-errors-switch
```

This package works in both Node.js >=14.18.0 and
[browsers](https://raw.githubusercontent.com/ehmicky/dev-tasks/main/src/tasks/build/browserslist).
It is an ES module and must be loaded using
[an `import` or `import()` statement](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c),
not `require()`.

# API

## modernErrorsSwitch

_Type_: `Plugin`

Plugin object to pass to the
[`plugins` option](https://github.com/ehmicky/modern-errors#adding-plugins) of
`ErrorClass.subclass()`.

## BaseError.switch(error)

`error`: `unknown`\
_Return value_: [`Switch`](#switchcasecondition-effects)

Apply logic according to `error`'s class. This must be chained with
[`.case()`](#switchcasecondition-effects) and end with
[`.default()`](#switchdefaulteffects).

Although `error` should be an `Error` instance most of the times, it can be of
any type. However, the final value returned by
[`.default()`](#switchdefaulteffects) is always an instance of `BaseError` or a
subclass of it.

## Switch.case(condition, ...effects)

`condition`: [`Condition`](#condition)\
`effect`: [`Effect`](#effect)\
_Return value_: [`Switch`](#switchcasecondition-effects)

If `error` matches the `condition`, apply the `effects`. 0, 1 or multiple
effects can be applied.

## Switch.default(...effects)

`effect`: [`Effect`](#effect)\
_Return value_: `BaseError`

If none of the [`.case()`](#switchcasecondition-effects) statements matched,
apply those default `effects`.

## Condition

The `condition` can be:

- An error class, matched with
  [`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof)
- An error
  [`name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/name)
  string
- A filtering function taking the `error` as argument and returning a boolean

## Effect

Each `effect` can be:

- A
  [new error class](https://github.com/ehmicky/modern-errors#wrap-error-class).
  It must be a
  [subclass](https://github.com/ehmicky/modern-errors#create-error-classes) of
  `BaseError`. It is ignored if `error`'s class is
  [already a subclass](https://github.com/ehmicky/modern-errors#wrap-error-class)
- A
  [message](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/message)
  string to append or (if it ends with `:` or `:\n`) prepend
- An
  [options object](https://github.com/ehmicky/modern-errors#wrap-error-options)
  to merge
- A mapping function taking the `error` as argument and returning it

# Usage

## Wrap error message

```js
BaseError.switch(error)
  // If `InputError`, then appends the following message
  .case(InputError, 'The input was invalid.')
  // If the message ends with `:` or `:\n`, it is prepended instead
  .case(DatabaseError, 'Bug at the database layer:')
  // Empty error messages are ignored
  .default('')
```

## Convert error classes

```js
// Convert `TypeError` class to `InputError`, etc. or default to `UnknownError`
BaseError.switch(error)
  .case(TypeError, InputError)
  .case(URIError, ClientError)
  .default(UnknownError)
```

## Wrap error options

```js
BaseError.switch(error)
  // If `DatabaseError`, add options for other plugins like `modern-errors-bugs`
  .case(DatabaseError, { bugs: 'https://github.com/my-name/my-project/issues' })
  .default()
```

## Map error

<!-- eslint-disable promise/prefer-await-to-callbacks -->

```js
BaseError.switch(error)
  // If `DatabaseError`, adds `error.databaseUrl`
  .case(DatabaseError, (error) => {
    error.databaseUrl = databaseUrl
    return error
  })
  .default()
```

## Multiple effects

```js
BaseError.switch(error)
  // 0 effects
  .case(TypeError)
  // Multiple effects
  .case(URIError, ClientError, 'Invalid URI.', {
    bugs: 'https://github.com/my-name/my-project/issues',
  })
  .default(UnknownError)
```

## Custom condition

```js
BaseError.switch(error)
  // If `error.type` is `database`, append the following message
  .case((error) => error.type === 'database', 'Bug at the database layer.')
  .default()
```

## Unknown errors

<!-- eslint-disable unicorn/no-null, no-throw-literal,
     promise/prefer-await-to-callbacks, no-shadow -->

```js
// Any `error` can be wrapped, even if it is not an `Error` instance
try {
  throw null
} catch (error) {
  // Therefore the filtering and mapping functions' argument might be anything
  throw BaseError.switch(error)
    .case(
      (error) => error instanceof Error && error.type === 'database',
      'Bug at the database layer.',
    )
    .default((error) => {
      if (error instanceof Error) {
        error.type = 'other'
      }

      return error
    })
}
```

# Related projects

- [`log-process-errors`](https://github.com/ehmicky/log-process-errors): Show
  some ❤ to Node.js process errors
- [`modern-errors`](https://github.com/ehmicky/modern-errors): Handle errors
  like it's 2022 🔮
- [`modern-errors-cli`](https://github.com/ehmicky/modern-errors-cli): Handle
  errors in CLI modules
- [`modern-errors-process`](https://github.com/ehmicky/modern-errors-process):
  Handle process errors
- [`modern-errors-bugs`](https://github.com/ehmicky/modern-errors-bugs): Print
  where to report bugs
- [`modern-errors-serialize`](https://github.com/ehmicky/modern-errors-serialize):
  Serialize/parse errors
- [`modern-errors-clean`](https://github.com/ehmicky/modern-errors-clean): Clean
  stack traces
- [`modern-errors-http`](https://github.com/ehmicky/modern-errors-http): Create
  HTTP error responses
- [`modern-errors-winston`](https://github.com/ehmicky/modern-errors-winston):
  Log errors with Winston

# Support

For any question, _don't hesitate_ to [submit an issue on GitHub](../../issues).

Everyone is welcome regardless of personal background. We enforce a
[Code of conduct](CODE_OF_CONDUCT.md) in order to promote a positive and
inclusive environment.

# Contributing

This project was made with ❤️. The simplest way to give back is by starring and
sharing it online.

If the documentation is unclear or has a typo, please click on the page's `Edit`
button (pencil icon) and suggest a correction.

If you would like to help us fix a bug or add a new feature, please check our
[guidelines](CONTRIBUTING.md). Pull requests are welcome!

<!-- Thanks go to our wonderful contributors: -->

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- prettier-ignore -->
<!--
<table><tr><td align="center"><a href="https://twitter.com/ehmicky"><img src="https://avatars2.githubusercontent.com/u/8136211?v=4" width="100px;" alt="ehmicky"/><br /><sub><b>ehmicky</b></sub></a><br /><a href="https://github.com/ehmicky/modern-errors-switch/commits?author=ehmicky" title="Code">💻</a> <a href="#design-ehmicky" title="Design">🎨</a> <a href="#ideas-ehmicky" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ehmicky/modern-errors-switch/commits?author=ehmicky" title="Documentation">📖</a></td></tr></table>
 -->
<!-- ALL-CONTRIBUTORS-LIST:END -->
