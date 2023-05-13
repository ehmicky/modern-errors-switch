import ModernError, { type ErrorInstance } from 'modern-errors'
import modernErrorsSwitch, { type Switch } from 'modern-errors-switch'
import { expectType } from 'tsd'

const BaseError = ModernError.subclass('BaseError', {
  plugins: [modernErrorsSwitch],
})

const error = new BaseError('')
const switchStatement = BaseError.switch(error)
BaseError.switch('')
expectType<Switch>(switchStatement)
// @ts-expect-error
BaseError.switch()

expectType<Switch>(switchStatement.case('Error'))

expectType<ErrorInstance>(switchStatement.default())
