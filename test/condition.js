import test from 'ava'

import {
  BaseError,
  OneError,
  TwoError,
  suffix,
  unsafeFunc,
} from './helpers/main.js'

test('Can match by error name', (t) => {
  const oneError = new OneError('test')
  const switchStatement = BaseError.switch(oneError)
  t.false(
    switchStatement
      .case(TwoError.name, suffix)
      .default()
      .message.endsWith(suffix),
  )
  t.true(
    switchStatement
      .case(OneError.name, suffix)
      .default()
      .message.endsWith(suffix),
  )
})

test('Can only match error instances by name', (t) => {
  t.false(
    BaseError.switch({ name: 'OneError' })
      .case(TwoError.name, suffix)
      .default()
      .message.endsWith(suffix),
  )
})

test('Can match by error class', (t) => {
  const typeError = new TypeError('test')
  const switchStatement = BaseError.switch(typeError)
  t.false(
    switchStatement.case(RangeError, suffix).default().message.endsWith(suffix),
  )
  t.true(
    switchStatement.case(TypeError, suffix).default().message.endsWith(suffix),
  )
})

test('Can match by filter', (t) => {
  const switchStatement = BaseError.switch(0)
  t.false(
    switchStatement
      .case((value) => value === 1, suffix)
      .default()
      .message.endsWith(suffix),
  )
  t.true(
    switchStatement
      .case((value) => value === 0, suffix)
      .default()
      .message.endsWith(suffix),
  )
})

test('Exceptions in filters are propagated', (t) => {
  t.throws(BaseError.switch('').case.bind(undefined, unsafeFunc, suffix))
})

test('Validate invalid conditions', (t) => {
  t.throws(BaseError.switch('').case.bind(undefined, true, suffix))
})
