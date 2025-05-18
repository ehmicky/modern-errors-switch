// Functional `switch` statement
const chain = (resolved, value) => ({
  case: addCase.bind(undefined, { resolved, value }),
  default: useDefault.bind(undefined, { resolved, value }),
})

// `switchFunctional(value)[.case(...)].case(conditions, effect)`
const addCase = ({ resolved, value }, conditions, effect) =>
  resolved || !matchesConditions(value, conditions)
    ? chain(resolved, value)
    : chain(true, applyEffect(value, effect))

// `switchFunctional(value)[.case()...].default(effect)`
const useDefault = ({ resolved, value }, effect) =>
  resolved ? value : applyEffect(value, effect)

const matchesConditions = (value, conditions) =>
  Array.isArray(conditions)
    ? conditions.some((condition) => matchesCondition(value, condition))
    : matchesCondition(value, conditions)

const matchesCondition = (value, condition) => {
  if (typeof condition === 'function') {
    return condition(value)
  }

  if (typeof condition === 'boolean') {
    return condition
  }

  return deepIncludes(value, condition)
}

// Check for deep equality. For objects (not arrays), check if deep superset.
const deepIncludes = (value, subset) => {
  if (
    !isObject(value) ||
    !isObject(subset) ||
    Array.isArray(value) !== Array.isArray(subset)
  ) {
    return Object.is(value, subset)
  }

  if (Array.isArray(subset)) {
    return (
      subset.length === value.length &&
      subset.every((item, index) => deepIncludes(value[index], item))
    )
  }

  return Object.entries(subset).every(([name, child]) =>
    deepIncludes(value[name], child),
  )
}

const isObject = (value) => typeof value === 'object' && value !== null

const applyEffect = (value, effect) =>
  typeof effect === 'function' ? effect(value) : effect

export const switchFunctional = chain.bind(undefined, false)
