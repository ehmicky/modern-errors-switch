import modernErrorsSwitch, { Options } from 'modern-errors-switch'
import { expectType, expectAssignable } from 'tsd'

expectType<object>(modernErrorsSwitch(true))

modernErrorsSwitch(true, {})
expectAssignable<Options>({})
