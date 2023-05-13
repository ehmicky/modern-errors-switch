import ModernError from 'modern-errors'
import modernErrorsSwitch, { type Effect } from 'modern-errors-switch'
import { expectAssignable, expectNotAssignable } from 'tsd'

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
switchStatement.default((errorArg: unknown) => true)
// @ts-expect-error
switchStatement.default((errorArg: string) => true)
// @ts-expect-error
switchStatement.default((errorArg: unknown, extra: unknown) => true)
switchStatement.case('Error', () => true)
switchStatement.case('Error', (errorArg: unknown) => true)
// @ts-expect-error
switchStatement.case('Error', (errorArg: string) => true)
// @ts-expect-error
switchStatement.case('Error', (errorArg: unknown, extra: unknown) => true)
expectAssignable<Effect>(() => true)
expectAssignable<Effect>((errorArg: unknown) => true)
expectNotAssignable<Effect>((errorArg: string) => true)
expectNotAssignable<Effect>((errorArg: unknown, extra: unknown) => true)

switchStatement.default('message', BaseError, {}, () => true)
switchStatement.case('Error', 'message', BaseError, {}, () => true)
