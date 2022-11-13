import test from 'ava'

import {
  BaseError,
  OneError,
  TwoError,
  message,
  suffix,
  unsafeFunc,
} from './helpers/main.js'

test('Keeps the error class by default', (t) => {
  const oneError = new OneError(message)
  t.is(BaseError.switch(oneError).default().constructor, OneError)
})

test('Normalizes using the error class', (t) => {
  t.is(BaseError.switch('').default().constructor, BaseError)
})

test('Can set the error class', (t) => {
  const oneError = new OneError(message)
  t.is(BaseError.switch(oneError).default(TwoError).constructor, TwoError)
})

test('Does not set the error class if parent', (t) => {
  const oneError = new OneError(message)
  t.is(BaseError.switch(oneError).default(BaseError).constructor, OneError)
})

test('Validate that the error class is a subclass', (t) => {
  t.throws(OneError.switch('').default.bind(undefined, TwoError))
})

test('Keeps the error message by default', (t) => {
  t.is(BaseError.switch(message).default().message, message)
})

test('Can wrap the error message', (t) => {
  t.is(
    BaseError.switch(message).default(suffix).message,
    `${message}\n${suffix}`,
  )
})

test('Keeps the options by default', (t) => {
  const baseError = new BaseError(message, { errors: [message] })
  t.is(BaseError.switch(baseError).default().errors.length, 1)
})

test('Can wrap the options', (t) => {
  t.is(
    BaseError.switch(new BaseError(message, { errors: [message] })).default({
      errors: [message],
    }).errors.length,
    2,
  )
})

test('Cannot wrap the cause', (t) => {
  const baseError = new BaseError(message)
  t.is(BaseError.switch(baseError).default({ cause: '' }), baseError)
})

const mapError = function () {
  return 'mapper'
}

test('Can use mappers', (t) => {
  t.true(BaseError.switch('').default(mapError).message.includes('mapper'))
})

const double = function (value) {
  return value * 2
}

test('Un-normalized error is passed to mapper', (t) => {
  t.true(BaseError.switch(2).default(double).message.endsWith('4'))
})

test('Exceptions in mapper are propagated', (t) => {
  t.throws(BaseError.switch('').default.bind(undefined, unsafeFunc))
})

test('Validate invalid effects', (t) => {
  t.throws(BaseError.switch('').default.bind(undefined, true))
})
