import isErrorInstance from 'is-error-instance'
import isPlainObj from 'is-plain-obj'

// Add support for `error.message` and `ErrorClass` condition to
// the conditions already supported by `switch-functional`
export const normalizeConditions = (conditions) =>
  Array.isArray(conditions)
    ? conditions.map(normalizeCondition)
    : normalizeCondition(conditions)

const normalizeCondition = (condition) => {
  if (typeof condition === 'string') {
    return matchesErrorName.bind(undefined, condition)
  }

  if (isProto.call(Error, condition)) {
    return isInstanceOf.bind(undefined, condition)
  }

  if (
    typeof condition === 'function' ||
    typeof condition === 'boolean' ||
    isPlainObj(condition)
  ) {
    return condition
  }

  throw new TypeError(
    `The condition must be an error class, an error name string, a filtering function, a boolean or a properties object, not: ${condition}`,
  )
}

const matchesErrorName = (condition, value) =>
  isErrorInstance(value) && value.name === condition

const { isPrototypeOf: isProto } = Object.prototype

const isInstanceOf = (condition, value) => value instanceof condition
