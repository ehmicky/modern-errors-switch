import switchFunctional from 'switch-functional'

import { mapCondition } from './condition.js'
import { mapEffects } from './effect.js'

// `ErrorClass.switch(value)`
// Wrap `switch-functional` to add Error-specific conditions and effects
const switchMethod = ({ ErrorClass }, value) =>
  switchFunctional(value, {
    mapCondition,
    mapReturnValues: mapEffects.bind(undefined, ErrorClass),
  })

export default {
  name: 'switch',
  staticMethods: { switch: switchMethod },
}
