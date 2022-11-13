import isPlainObj from 'is-plain-obj'

// Apply wrapping effect to an error: class, message, options or mapping
// function
export const applyEffects = function (value, effects, ErrorClass) {
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
