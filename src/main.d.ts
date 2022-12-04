import type { Info, ErrorInstance } from 'modern-errors'

/**
 * The `condition` can be:
 *  - An error class, matched with
 *    [`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof)
 *  - An error
 *    [`name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/name)
 *    string
 *  - A filtering function taking the `error` as argument and returning a
 *    boolean
 */
export type Condition =
  | string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | (new (...args: any[]) => Error)
  | ((error: unknown) => boolean)

/**
 * Each `effect` can be:
 *  - A
 *    [new error class](https://github.com/ehmicky/modern-errors#wrap-error-class).
 *    It must be a
 *    [subclass](https://github.com/ehmicky/modern-errors#create-error-classes)
 *    of `BaseError`. It is ignored if `error`'s class is
 *    [already a subclass](https://github.com/ehmicky/modern-errors#wrap-error-class).
 *  - A
 *    [message](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/message)
 *    string to append or (if it ends with `:` or `:\n`) prepend
 *  - An
 *    [options object](https://github.com/ehmicky/modern-errors#wrap-error-options)
 *    to merge
 *  - A mapping function taking the `error` as argument and returning it
 */
export type Effect =
  | string
  | { [_: string]: unknown }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | (new (...args: any[]) => Error)
  | ((error: unknown) => unknown)

/**
 * Return value of `BaseError.switch()` or `.case()`
 */
export interface Switch {
  /**
   * If `error` matches the `condition`, apply the `effects`.
   * 0, 1 or multiple effects can be applied.
   */
  case: (condition: Condition, ...effects: Effect[]) => Switch

  /**
   * If none of the `.case()` statements matched, apply those default `effects`.
   */
  default: (...effect: Effect[]) => ErrorInstance
}

/**
 * `modern-errors-switch` plugin
 *
 * This adds `BaseError.switch()` to wrap an error according to its class.
 */
declare const plugin: {
  name: 'switch'
  staticMethods: {
    /**
     * Apply logic according to `error`'s class. This must be chained with
     * `.case()` and end with `.default()`.
     *
     * Although `error` should be an `Error` instance most of the times, it can
     * be of any type. However, the final value returned by `.default()` is
     * always an instance of `BaseError` or a subclass of it.
     *
     * @example
     * ```js
     * try {
     *   // ...
     * } catch (error) {
     *   throw BaseError.switch(error)
     *     .case(InputError, 'The input was invalid.')
     *     .case(DatabaseError, 'Bug at the database layer.')
     *     .default('Unknown error.')
     * }
     * ```
     */
    switch: (info: Info['staticMethods'], error: unknown) => Switch
  }
}
export default plugin
