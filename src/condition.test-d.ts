import ModernError from 'modern-errors'
import { expectAssignable, expectNotAssignable } from 'tsd'

import modernErrorsSwitch, { type Condition } from 'modern-errors-switch'

const BaseError = ModernError.subclass('BaseError', {
  plugins: [modernErrorsSwitch],
})

const error = new BaseError('')
const switchStatement = BaseError.switch(error)

switchStatement.case('Error')
expectAssignable<Condition>('Error')

switchStatement.case(Error)
switchStatement.case(TypeError)
switchStatement.case(BaseError)
// @ts-expect-error
switchStatement.case(Function)
// @ts-expect-error
switchStatement.case(Array)
expectAssignable<Condition>(Error)
expectAssignable<Condition>(TypeError)
expectAssignable<Condition>(BaseError)
expectNotAssignable<Condition>(Function)
expectNotAssignable<Condition>(Array)

switchStatement.case(() => true)
switchStatement.case((errorArg: unknown) => true)
// @ts-expect-error
switchStatement.case((errorArg: string) => true)
// @ts-expect-error
switchStatement.case((errorArg: unknown, extra: unknown) => true)
// @ts-expect-error
switchStatement.case((errorArg: unknown) => 'true')
expectAssignable<Condition>(() => true)
expectAssignable<Condition>((errorArg: unknown) => true)
expectNotAssignable<Condition>((errorArg: string) => true)
expectNotAssignable<Condition>((errorArg: unknown, extra: unknown) => true)
expectNotAssignable<Condition>((errorArg: unknown) => 'true')
