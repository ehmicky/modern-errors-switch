import switchFunctional from 'switch-functional'

import { normalizeConditions } from './condition.js'
import { normalizeEffects } from './effect.js'

// `ErrorClass.switch(value)`
const switchMethod = ({ ErrorClass }, value) =>
  patchSwitch(switchFunctional(value), ErrorClass)

// Wrap `switch-functional` to add Error-specific conditions and effects
const patchSwitch = (originalSwitch, ErrorClass) => ({
  case: (condition, ...effects) =>
    patchSwitch(
      originalSwitch.case(
        normalizeConditions(condition),
        normalizeEffects(effects, ErrorClass),
      ),
      ErrorClass,
    ),
  default: (...effects) =>
    originalSwitch.default(normalizeEffects(effects, ErrorClass)),
})

export default {
  name: 'switch',
  staticMethods: { switch: switchMethod },
}
