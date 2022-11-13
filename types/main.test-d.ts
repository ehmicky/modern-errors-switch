import { expectType, expectAssignable } from 'tsd'

import ModernError, { ErrorInstance } from 'modern-errors'
import modernErrorsSwitch from 'modern-errors-switch'

const BaseError = ModernError.subclass('BaseError', {
  plugins: [modernErrorsSwitch],
})

expectType<ErrorInstance>(BaseError.switch(''))
