import isErrorInstance from 'is-error-instance'
import isPlainObj from 'is-plain-obj'

const switchMethod = function ({ ErrorClass }, value) {
  return getSwitch({ ErrorClass, value, resolved: undefined })
}

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

const matchesCondition = function (value, condition) {
  if (typeof condition === 'string') {
    return matchesErrorName(value, condition)
  }

  if (typeof condition !== 'function') {
    throw new TypeError(
      `The condition must be an error class, an error name string or a filtering function, not: ${condition}`,
    )
  }

  if (isProto.call(Error, condition)) {
    return value instanceof condition
  }

  return Boolean(condition(value))
}

const matchesErrorName = function (value, name) {
  return isErrorInstance(value) && value.name === name
}

const applyEffects = function (value, effects, ErrorClass) {
  const defaultEffects = {
    ErrorClass,
    message: '',
    options: {},
    mapper: identity,
  }
  const {
    ErrorClass: ErrorClassA,
    message,
    options,
    mapper,
  } = Object.assign(
    {},
    defaultEffects,
    ...effects.map((effect) => parseEffect(effect, ErrorClass)),
  )
  const cause = mapper(value)
  return new ErrorClassA(message, { ...options, cause })
}

const identity = function (value) {
  return value
}

const parseEffect = function (effect, ErrorClass) {
  const type = getEffectType(effect, ErrorClass)
  return { [type]: effect }
}

const getEffectType = function (effect, ErrorClass) {
  if (typeof effect === 'string') {
    return 'message'
  }

  if (isPlainObj(effect)) {
    return 'options'
  }

  if (typeof effect === 'function') {
    return getFuncEffectType(effect, ErrorClass)
  }

  throw new TypeError(
    `The effect must be an error class, an error message string, an options object or a mapping function, not: ${effect}`,
  )
}

const getFuncEffectType = function (effect, ErrorClass) {
  if (!isProto.call(Error, effect)) {
    return 'mapper'
  }

  if (ErrorClass !== effect && !isProto.call(ErrorClass, effect)) {
    throw new TypeError(
      `The error class must be "${ErrorClass.name}" or one of its subclass, not "${effect.name}".`,
    )
  }

  return 'ErrorClass'
}

const { isPrototypeOf: isProto } = Object.prototype

export default {
  name: 'switch',
  staticMethods: { switch: switchMethod },
}
