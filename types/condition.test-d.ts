import { expectAssignable, expectNotAssignable, expectError } from 'tsd'

import ModernError from 'modern-errors'
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
expectError(switchStatement.case(Function))
expectError(switchStatement.case(Array))
expectAssignable<Condition>(Error)
expectAssignable<Condition>(TypeError)
expectAssignable<Condition>(BaseError)
expectNotAssignable<Condition>(Function)
expectNotAssignable<Condition>(Array)

switchStatement.case(() => true)
switchStatement.case((error: unknown) => true)
expectError(switchStatement.case((error: string) => true))
expectError(switchStatement.case((error: unknown, extra: unknown) => true))
expectError(switchStatement.case((error: unknown) => 'true'))
expectAssignable<Condition>(() => true)
expectAssignable<Condition>((error: unknown) => true)
expectNotAssignable<Condition>((error: string) => true)
expectNotAssignable<Condition>((error: unknown, extra: unknown) => true)
expectNotAssignable<Condition>((error: unknown) => 'true')
