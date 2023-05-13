import ModernError, { type ErrorInstance } from 'modern-errors'
import { expectType } from 'tsd'

import modernErrorsSwitch, { type Switch } from 'modern-errors-switch'

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
