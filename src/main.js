import switchFunctional from 'switch-functional'

import { normalizeConditions } from './condition.js'
import { mapEffects } from './effect.js'

// `ErrorClass.switch(value)`
// Wrap `switch-functional` to add Error-specific conditions and effects
const switchMethod = ({ ErrorClass }, value) =>
  customize(normalizeConditions, mapEffects.bind(undefined, ErrorClass))(value)

const customize = (mapConditions, mapReturnValues) => (value) =>
  customizeSwitch(switchFunctional(value), mapConditions, mapReturnValues)

const customizeSwitch = (originalSwitch, mapConditions, mapReturnValues) => ({
  case: (conditions, ...returnValues) =>
    customizeSwitch(
      originalSwitch.case(
        mapConditions(conditions),
        mapReturnValues(returnValues),
      ),
      mapConditions,
      mapReturnValues,
    ),
  default: (...returnValues) =>
    originalSwitch.default(mapReturnValues(returnValues)),
})

export default {
  name: 'switch',
  staticMethods: { switch: switchMethod },
}
