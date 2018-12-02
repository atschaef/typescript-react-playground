import { createSandbox, SinonSpy } from 'sinon'
import { expect } from 'chai'

import {
  preventNonNumeric,
  focusPreviousInput,
  tryFocusNextInput,
  DateFieldType,
  normalizeValue,
} from '../../../../src/components/date_input/date_input_utils'
import { keyboardEvent } from '../../data/events'

describe('-- Date Input Utils  --', () => {
  const testSandbox = createSandbox()
  const event = { ...keyboardEvent }
  let preventDefault: SinonSpy
  let focus: SinonSpy
  let blur: SinonSpy

  before(() => {
    preventDefault = testSandbox.spy(event, 'preventDefault')
    blur = testSandbox.spy(event.currentTarget, 'blur')
  })

  afterEach(() => {
    testSandbox.resetHistory()
  })

  after(() => {
    testSandbox.restore()
  })

  describe('preventNonNumeric', () => {
    it('should call preventDefault if exponent key is entered', () => {
      event.charCode = 69

      preventNonNumeric(event)
      expect(preventDefault.callCount).to.equal(1)
    })

    it('should call preventDefault if minus key is entered', () => {
      event.charCode = 187

      preventNonNumeric(event)
      expect(preventDefault.callCount).to.equal(1)
    })

    it('should call preventDefault if plus key is entered', () => {
      event.charCode = 189

      preventNonNumeric(event)
      expect(preventDefault.callCount).to.equal(1)
    })

    it('should call preventDefault if decimal key is entered', () => {
      event.charCode = 190

      preventNonNumeric(event)
      expect(preventDefault.callCount).to.equal(1)
    })

    it('should not call preventDefault if numeric value is entered', () => {
      // "charCode 48" is 0
      event.charCode = 48

      preventNonNumeric(event)
      expect(preventDefault.callCount).to.equal(0)
    })
  })

  describe('focusPreviousInput', () => {
    const mockInput = document.createElement('input')

    before(() => {
      focus = testSandbox.spy(mockInput, 'focus')
    })

    it('should focus the previous input on delete key', () => {
      event.keyCode = 8

      focusPreviousInput(mockInput)(event)

      expect(blur.callCount).to.equal(1)
      expect(focus.callCount).to.equal(1)
      expect(preventDefault.callCount).to.equal(1)
    })

    it('should not call focusPreviousInput if input is empty but keyCode is not the delete key', () => {
      event.keyCode = 40

      focusPreviousInput(mockInput)(event)

      expect(blur.callCount).to.equal(0)
      expect(focus.callCount).to.equal(0)
      expect(preventDefault.callCount).to.equal(0)
    })

    it('should not call focusPreviousInput if input is not empty', () => {
      event.keyCode = 8
      event.currentTarget.value = '0'

      focusPreviousInput(mockInput)(event)

      expect(blur.callCount).to.equal(0)
      expect(focus.callCount).to.equal(0)
      expect(preventDefault.callCount).to.equal(0)
    })

    it('should not call focusPreviousInput if previous input is not provided', () => {
      event.keyCode = 8

      focusPreviousInput(null)(event)

      expect(blur.callCount).to.equal(0)
      expect(preventDefault.callCount).to.equal(0)
    })
  })

  describe('tryFocusNextInput', () => {
    const mockInput = document.createElement('input')
    let focus: SinonSpy

    before(() => {
      focus = testSandbox.spy(mockInput, 'focus')
    })

    it('should focus the next input if the value is valid and max length of field has been reached', () => {
      tryFocusNextInput({
        isValid: true,
        value: '12',
        previousValueLength: 1,
        fieldType: DateFieldType.Day,
        nextInput: mockInput,
      })

      expect(focus.callCount).to.equal(1)
    })

    it('should focus next input if the value is greater than the max quick focus value', () => {
      tryFocusNextInput({
        isValid: true,
        value: '2',
        previousValueLength: 1,
        fieldType: DateFieldType.Month,
        nextInput: mockInput,
      })

      expect(focus.callCount).to.equal(1)
    })

    it('should not focus next input if the value is invalid or there is no next input', () => {
      tryFocusNextInput({
        isValid: false,
        value: '12',
        previousValueLength: 1,
        fieldType: DateFieldType.Day,
        nextInput: mockInput,
      })

      expect(focus.callCount).to.equal(0)

      tryFocusNextInput({
        isValid: true,
        value: '12',
        previousValueLength: 1,
        fieldType: DateFieldType.Day,
        nextInput: null,
      })

      expect(focus.callCount).to.equal(0)
    })

    it('should not focus next input if it does not meet the requirements', () => {
      tryFocusNextInput({
        isValid: true,
        value: '200',
        previousValueLength: 0,
        fieldType: DateFieldType.Year,
        nextInput: mockInput,
      })

      expect(focus.callCount).to.equal(0)
    })
  })

  describe('normalizeValue', () => {
    it('should allow zero as first digit', () => {
      expect(normalizeValue('')).to.equal('')
      expect(normalizeValue('00')).to.equal('0')
      expect(normalizeValue('01')).to.equal('01')
      expect(normalizeValue('00', 4)).to.equal('00')
      expect(normalizeValue('000', 4)).to.equal('000')
      expect(normalizeValue('0000', 4)).to.equal('000')
      expect(normalizeValue('0001', 4)).to.equal('0001')
    })
  })
})
