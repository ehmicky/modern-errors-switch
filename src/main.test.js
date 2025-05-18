import test from 'ava'

import {
  BaseError,
  message,
  OneError,
  returnTrue,
  suffix,
  suffixTwo,
  TwoError,
} from './helpers/main.test.js'

test('Can use case() without any effects', (t) => {
  const baseError = new BaseError(message)
  t.is(BaseError.switch(baseError).case(returnTrue).default(), baseError)
})

test('Can use default() without any effects', (t) => {
  const baseError = new BaseError(message)
  t.is(BaseError.switch(baseError).default(), baseError)
})

test('Cannot use case() without any condition', (t) => {
  const baseError = new BaseError(message)
  t.throws(BaseError.switch(baseError).case)
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
