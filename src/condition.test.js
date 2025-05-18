import test from 'ava'

import {
  BaseError,
  OneError,
  suffix,
  TwoError,
  unsafeFunc,
} from './helpers/main.test.js'

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

test('Can match by boolean', (t) => {
  const switchStatement = BaseError.switch(0)
  t.false(
    switchStatement.case(false, suffix).default().message.endsWith(suffix),
  )
  t.true(switchStatement.case(true, suffix).default().message.endsWith(suffix))
})

test('Can match by properties', (t) => {
  const typeError = new OneError('test', { props: { one: 1 } })
  const switchStatement = BaseError.switch(typeError)
  t.false(
    switchStatement.case({ one: 2 }, suffix).default().message.endsWith(suffix),
  )
  t.true(
    switchStatement.case({ one: 1 }, suffix).default().message.endsWith(suffix),
  )
})

test('Can match by multiple booleans', (t) => {
  const switchStatement = BaseError.switch(0)
  t.false(
    switchStatement
      .case([false, false], suffix)
      .default()
      .message.endsWith(suffix),
  )
  t.true(
    switchStatement
      .case([false, true], suffix)
      .default()
      .message.endsWith(suffix),
  )
  t.true(
    switchStatement
      .case([true, false], suffix)
      .default()
      .message.endsWith(suffix),
  )
  t.true(
    switchStatement
      .case([true, true], suffix)
      .default()
      .message.endsWith(suffix),
  )
})

test('Can match by multiple error names', (t) => {
  const oneError = new OneError('test')
  const switchStatement = BaseError.switch(oneError)
  t.false(
    switchStatement
      .case(['.', TwoError.name], suffix)
      .default()
      .message.endsWith(suffix),
  )
  t.true(
    switchStatement
      .case(['.', OneError.name], suffix)
      .default()
      .message.endsWith(suffix),
  )
})

test('Can match by mixed conditions', (t) => {
  const oneError = new OneError('test')
  const switchStatement = BaseError.switch(oneError)
  t.false(
    switchStatement
      .case([false, TwoError.name], suffix)
      .default()
      .message.endsWith(suffix),
  )
  t.true(
    switchStatement
      .case([false, OneError.name], suffix)
      .default()
      .message.endsWith(suffix),
  )
})

test('Exceptions in filters are propagated', (t) => {
  t.throws(BaseError.switch('').case.bind(undefined, unsafeFunc, suffix))
})

test('Validate invalid conditions', (t) => {
  t.throws(BaseError.switch('').case.bind(undefined, 0, suffix))
})
