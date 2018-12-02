import { expect } from 'chai'
import { propOr, ternaryValueFromProp } from '../../../src/utils/component.utils'

describe('-- Utils --', () => {
  describe('ternaryValueFromProp', () => {
    const obj = { truthy: true, falsy: false, stringy: 'hello', func: () => false }

    it('should return the truthy or falsy value based on the property', () => {
      expect(ternaryValueFromProp('truthy', 'yolo', 'oh no')(obj)).to.equal('yolo')
      expect(ternaryValueFromProp('falsy', 'yolo', 'oh no')(obj)).to.equal('oh no')
      expect(ternaryValueFromProp('stringy', 'yolo', 'oh no')(obj)).to.equal('yolo')
      expect(ternaryValueFromProp('func', 'yolo', 'oh no')(obj)).to.equal('oh no')
    })
  })

  describe('propOr', () => {
    const obj = { truthy: true, deeply: { nested: { value: 'yolo' } } }

    it('should return the value or a fallback based on the accessor', () => {
      expect(propOr('truthy', 'oh no')(obj)).to.equal(true)
      expect(propOr('deeply.nested.value', 'oh no')(obj)).to.equal('yolo')
      expect(propOr('error.not.found', 'oh no')(obj)).to.equal('oh no')
    })
  })
})
