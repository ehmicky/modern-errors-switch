/* eslint-disable max-lines */
import test from 'ava'
import ModernError from 'modern-errors'
import modernErrorsSwitch from 'modern-errors-switch'

const BaseError = ModernError.subclass('BaseError', {
  plugins: [modernErrorsSwitch],
})
const OneError = BaseError.subclass('OneError')
const TwoError = BaseError.subclass('TwoError')

const message = 'test'
const suffix = 'suffix'
const suffixTwo = 'other'

const returnTrue = function () {
  return true
}

test('Can use default without any effects', (t) => {
  const baseError = new BaseError(message)
  t.is(BaseError.switch(baseError).default(), baseError)
})

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

const unsafeFunc = function () {
  throw new Error('Unsafe')
}

test('Exceptions in mapper are propagated', (t) => {
  t.throws(BaseError.switch('').default.bind(undefined, unsafeFunc))
})

test('Can pass multiple effects to case()', (t) => {
  const oneError = BaseError.switch('')
    .case(returnTrue, OneError, suffix)
    .default()
  t.is(oneError.constructor, OneError)
  t.true(oneError.message.endsWith(suffix))
})

test('Can pass multiple effects to default()', (t) => {
  const oneError = BaseError.switch('').default(OneError, suffix)
  t.is(oneError.constructor, OneError)
  t.true(oneError.message.endsWith(suffix))
})

test('Last effect has priority', (t) => {
  t.is(BaseError.switch('').default(TwoError, OneError).constructor, OneError)
})

test('Validate invalid effects', (t) => {
  t.throws(BaseError.switch('').default.bind(undefined, true))
})

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

test('Can only match errors by error name', (t) => {
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

test('case() is a noop if already matched', (t) => {
  const baseError = BaseError.switch('')
    .case(returnTrue, suffixTwo)
    .case(returnTrue, suffix)
    .default()
  t.false(baseError.message.endsWith(suffix))
  t.true(baseError.message.endsWith(suffixTwo))
})

test('default() is a noop if already matched', (t) => {
  const baseError = BaseError.switch('')
    .case(returnTrue, suffixTwo)
    .default(suffix)
  t.false(baseError.message.endsWith(suffix))
  t.true(baseError.message.endsWith(suffixTwo))
})

test('case() context is bound', (t) => {
  const baseError = new BaseError(message)
  const { switch: switchStatement } = BaseError
  t.is(switchStatement(baseError).default(), baseError)
})

test('default() context is bound', (t) => {
  const baseError = new BaseError(message)
  const { default: defaultStatement } = BaseError.switch(baseError)
  t.is(defaultStatement(), baseError)
})
