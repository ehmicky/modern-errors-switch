import test from 'ava'
import modernErrorsSwitch from 'modern-errors-switch'

test('Dummy test', (t) => {
  t.true(modernErrorsSwitch(true))
})
