import { expectType, expectError } from 'tsd'

import ModernError, { ErrorInstance } from 'modern-errors'
import modernErrorsSwitch, { Switch } from 'modern-errors-switch'

import './condition.test-d.js'
import './effect.test-d.js'

const BaseError = ModernError.subclass('BaseError', {
  plugins: [modernErrorsSwitch],
})

const error = new BaseError('')
const switchStatement = BaseError.switch(error)
BaseError.switch('')
expectType<Switch>(switchStatement)
expectError(BaseError.switch())

expectType<Switch>(switchStatement.case('Error'))

expectType<ErrorInstance>(switchStatement.default())
