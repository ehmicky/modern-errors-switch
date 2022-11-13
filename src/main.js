import { matchesCondition } from './condition.js'
import { applyEffects } from './effect.js'

// `ErrorClass.switch(value)`
const switchMethod = function ({ ErrorClass }, value) {
  return getSwitch({ ErrorClass, value, resolved: undefined })
}

// `ErrorClass.switch(value)[.case(...)].case(condition, ...effects)`
const addCase = function (
  { ErrorClass, value, resolved },
  condition,
  ...effects
) {
  const resolvedA =
    resolved === undefined && matchesCondition(value, condition)
      ? applyEffects(value, effects, ErrorClass)
      : resolved
  return getSwitch({ ErrorClass, value, resolved: resolvedA })
}

// `ErrorClass.switch(value)[.case()...].default(...effects)`
const useDefault = function ({ ErrorClass, value, resolved }, ...effects) {
  return resolved === undefined
    ? applyEffects(value, effects, ErrorClass)
    : resolved
}

const getSwitch = function (context) {
  return {
    case: addCase.bind(undefined, context),
    default: useDefault.bind(undefined, context),
  }
}

export default {
  name: 'switch',
  staticMethods: { switch: switchMethod },
}
