import ModernError from 'modern-errors'
import { expectAssignable, expectNotAssignable } from 'tsd'

import modernErrorsSwitch, { Condition } from 'modern-errors-switch'

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
switchStatement.case((error: unknown) => true)
// @ts-expect-error
switchStatement.case((error: string) => true)
// @ts-expect-error
switchStatement.case((error: unknown, extra: unknown) => true)
// @ts-expect-error
switchStatement.case((error: unknown) => 'true')
expectAssignable<Condition>(() => true)
expectAssignable<Condition>((error: unknown) => true)
expectNotAssignable<Condition>((error: string) => true)
expectNotAssignable<Condition>((error: unknown, extra: unknown) => true)
expectNotAssignable<Condition>((error: unknown) => 'true')
