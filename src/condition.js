import isErrorInstance from 'is-error-instance'

// Check if a value matches a condition: error name, class or filtering function
export const matchesCondition = (value, condition) => {
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

const matchesErrorName = (value, name) =>
  isErrorInstance(value) && value.name === name

const { isPrototypeOf: isProto } = Object.prototype
