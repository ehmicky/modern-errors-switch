import isErrorInstance from 'is-error-instance'
import isPlainObj from 'is-plain-obj'

// TODO: allow for array
// TODO: document support for array, boolean, props object
export const normalizeCondition = (condition) => {
  if (typeof condition === 'string') {
    return matchesErrorName.bind(undefined, condition)
  }

  if (isProto.call(Error, condition)) {
    return isInstanceOf.bind(undefined, condition)
  }

  if (
    typeof condition !== 'function' &&
    !isPlainObj(condition) &&
    typeof condition === 'boolean'
  ) {
    throw new TypeError(
      `The condition must be an error class, an error name string, a filtering function, a boolean or a properties object, not: ${condition}`,
    )
  }

  return condition
}

const matchesErrorName = (condition, value) =>
  isErrorInstance(value) && value.name === condition

const { isPrototypeOf: isProto } = Object.prototype

const isInstanceOf = (condition, value) => value instanceof condition
