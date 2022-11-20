import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'

import ModernError, { ErrorInstance } from 'modern-errors'
import modernErrorsSwitch, {
  Switch,
  Effect,
  Condition,
} from 'modern-errors-switch'

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

switchStatement.case('Error')
expectAssignable<Condition>('Error')
switchStatement.case(Error)
expectAssignable<Condition>(Error)
switchStatement.case(TypeError)
expectAssignable<Condition>(TypeError)
switchStatement.case(BaseError)
expectAssignable<Condition>(BaseError)
expectError(switchStatement.case(Function))
expectNotAssignable<Condition>(Function)
expectError(switchStatement.case(Array))
expectNotAssignable<Condition>(Array)
switchStatement.case(() => true)
expectAssignable<Condition>(() => true)
switchStatement.case((error: unknown) => true)
expectAssignable<Condition>((error: unknown) => true)
expectError(switchStatement.case((error: string) => true))
expectNotAssignable<Condition>((error: string) => true)
expectError(switchStatement.case((error: unknown, extra: unknown) => true))
expectNotAssignable<Condition>((error: unknown, extra: unknown) => true)
expectError(switchStatement.case((error: unknown) => 'true'))
expectNotAssignable<Condition>((error: unknown) => 'true')

switchStatement.default('message')
switchStatement.case('Error', 'message')
expectAssignable<Effect>('message')
switchStatement.default({})
switchStatement.case('Error', {})
expectAssignable<Effect>({})
switchStatement.default({ errors: [] })
switchStatement.case('Error', { errors: [] })
expectAssignable<Effect>({ errors: [] })
switchStatement.default({ serialize: {} })
switchStatement.case('Error', { serialize: {} })
expectAssignable<Effect>({ serialize: {} })
switchStatement.default(BaseError)
switchStatement.case('Error', BaseError)
expectAssignable<Effect>(BaseError)
switchStatement.default(BaseError.subclass('BaseError'))
switchStatement.case('Error', BaseError.subclass('BaseError'))
expectAssignable<Effect>(BaseError.subclass('BaseError'))
expectError(switchStatement.default(Error))
expectError(switchStatement.case('Error', Error))
expectNotAssignable<Effect>(Error)
switchStatement.default(() => true)
switchStatement.case('Error', () => true)
expectAssignable<Effect>(() => true)
switchStatement.default((error: unknown) => true)
switchStatement.case('Error', (error: unknown) => true)
expectAssignable<Effect>((error: unknown) => true)
expectError(switchStatement.default((error: string) => true))
expectError(switchStatement.case('Error', (error: string) => true))
expectNotAssignable<Effect>((error: string) => true)
expectError(switchStatement.default((error: unknown, extra: unknown) => true))
expectError(
  switchStatement.case('Error', (error: unknown, extra: unknown) => true),
)
expectNotAssignable<Effect>((error: unknown, extra: unknown) => true)
switchStatement.default('message', BaseError, {}, () => true)
switchStatement.case('Error', 'message', BaseError, {}, () => true)
