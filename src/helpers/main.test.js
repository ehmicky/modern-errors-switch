import ModernError from 'modern-errors'
import modernErrorsSwitch from 'modern-errors-switch'

export const BaseError = ModernError.subclass('BaseError', {
  plugins: [modernErrorsSwitch],
})
export const OneError = BaseError.subclass('OneError')
export const TwoError = BaseError.subclass('TwoError')

export const message = 'test'
export const suffix = 'suffix'
export const suffixTwo = 'other'

export const returnTrue = () => true

export const unsafeFunc = () => {
  throw new Error('Unsafe')
}
