import test from 'ava'
import ModernError from 'modern-errors'
import modernErrorsSwitch from 'modern-errors-switch'

const BaseError = ModernError.subclass('BaseError', {
  plugins: [modernErrorsSwitch],
})

test('Dummy test', (t) => {
  t.is(typeof BaseError.switch, 'function')
})
