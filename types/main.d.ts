import type { Info, ErrorInstance, ErrorClass } from 'modern-errors'

/**
 *
 */
export type Condition =
  | string
  | (new (...args: any[]) => Error)
  | ((error: unknown) => boolean)

/**
 *
 */
export type Effect =
  | string
  | { [_: string]: unknown }
  | ErrorClass
  | ((error: unknown) => unknown)

/**
 *
 */
export interface Switch {
  case(condition: Condition, ...effects: Effect[]): Switch
  default(...effect: Effect[]): ErrorInstance
}

/**
 * `modern-errors-switch` plugin
 */
declare const plugin: {
  name: 'switch'
  staticMethods: {
    /**
     *
     * @example
     * ```js
     * ```
     */
    switch: (info: Info['staticMethods'], error: unknown) => Switch
  }
}
export default plugin
