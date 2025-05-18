import isPlainObj from 'is-plain-obj'

// Apply wrapping effect to an error: class, message, options or mapping
// function
export const normalizeEffects = (effects, ErrorClass) => {
  validateEffects(effects, ErrorClass)
  return applyEffects.bind(undefined, effects, ErrorClass)
}

const validateEffects = (effects, ErrorClass) => {
  effects.forEach((effect) => {
    validateEffect(effect, ErrorClass)
  })
}

const validateEffect = (effect, ErrorClass) => {
  if (isMessage(effect) || isOptions(effect) || isMapper(effect)) {
    return
  }

  if (!isErrorClass(effect)) {
    throw new TypeError(
      `The effect must be an error class, an error message string, an options object or a mapping function, not: ${effect}`,
    )
  }

  if (ErrorClass !== effect && !isProto.call(ErrorClass, effect)) {
    throw new TypeError(
      `The error class must be "${ErrorClass.name}" or one of its subclass, not "${effect.name}".`,
    )
  }
}

const applyEffects = (effects, ErrorClass, value) => {
  const message = effects.findLast(isMessage) ?? ''
  const options = effects.findLast(isOptions) ?? {}
  const mapper = effects.findLast(isMapper) ?? identity
  const NewErrorClass = effects.findLast(isErrorClass) ?? ErrorClass

  const cause = mapper(value)
  return new NewErrorClass(message, { ...options, cause })
}

const isMessage = (effect) => typeof effect === 'string'

const isOptions = isPlainObj

const isMapper = (effect) =>
  typeof effect === 'function' && !isErrorClass(effect)

const isErrorClass = (effect) => isProto.call(Error, effect)

const identity = (value) => value

const { isPrototypeOf: isProto } = Object.prototype
