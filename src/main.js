import { normalizeCondition } from './condition.js'
import { normalizeEffects } from './effect.js'
import { switchFunctional } from './switch.js'

// `ErrorClass.switch(value)`
const switchMethod = ({ ErrorClass }, value) =>
  patchSwitch(switchFunctional(value), ErrorClass)

const patchSwitch = (originalSwitch, ErrorClass) => ({
  case: (condition, ...effects) =>
    patchSwitch(
      originalSwitch.case(
        normalizeCondition(condition),
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
