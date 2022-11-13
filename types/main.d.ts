import type { Info, ErrorInstance } from 'modern-errors'

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
    switch: (info: Info['staticMethods'], error: unknown) => ErrorInstance
  }
}
export default plugin
