import { expectAssignable, expectNotAssignable, expectError } from 'tsd'

import ModernError from 'modern-errors'
import modernErrorsSwitch, { Effect } from 'modern-errors-switch'

import './condition.test-d.js'

const BaseError = ModernError.subclass('BaseError', {
  plugins: [modernErrorsSwitch],
})

const error = new BaseError('')
const switchStatement = BaseError.switch(error)

switchStatement.default('message')
switchStatement.case('Error', 'message')
expectAssignable<Effect>('message')

switchStatement.default({})
switchStatement.default({ errors: [] })
switchStatement.default({ serialize: {} })
switchStatement.case('Error', {})
switchStatement.case('Error', { errors: [] })
switchStatement.case('Error', { serialize: {} })
expectAssignable<Effect>({})
expectAssignable<Effect>({ errors: [] })
expectAssignable<Effect>({ serialize: {} })

switchStatement.default(BaseError)
switchStatement.default(BaseError.subclass('BaseError'))
switchStatement.case('Error', BaseError)
switchStatement.case('Error', BaseError.subclass('BaseError'))
expectAssignable<Effect>(BaseError)
expectAssignable<Effect>(BaseError.subclass('BaseError'))

switchStatement.default(() => true)
switchStatement.default((error: unknown) => true)
expectError(switchStatement.default((error: string) => true))
expectError(switchStatement.default((error: unknown, extra: unknown) => true))
switchStatement.case('Error', () => true)
switchStatement.case('Error', (error: unknown) => true)
expectError(switchStatement.case('Error', (error: string) => true))
expectError(
  switchStatement.case('Error', (error: unknown, extra: unknown) => true),
)
expectAssignable<Effect>(() => true)
expectAssignable<Effect>((error: unknown) => true)
expectNotAssignable<Effect>((error: string) => true)
expectNotAssignable<Effect>((error: unknown, extra: unknown) => true)

switchStatement.default('message', BaseError, {}, () => true)
switchStatement.case('Error', 'message', BaseError, {}, () => true)
