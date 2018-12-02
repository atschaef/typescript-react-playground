import { expect } from 'chai'
import {
  validateDay,
  validateMonth,
  validateYear,
  validateDate,
} from '../../../../src/components/date_input/date_input_validation.utils'

describe('-- DateInput Validation --', () => {
  const requiredError = 'Required'

  describe('validateDay', () => {
    const invalidDayError = 'Please enter a valid day'

    it('should validate day', () => {
      expect(validateDay({ day: '' })).to.equal(undefined)
      expect(validateDay({ day: '1' })).to.equal(undefined)
      expect(validateDay({ day: '01' })).to.equal(undefined)
      expect(validateDay({ day: '31' })).to.equal(undefined)
      expect(validateDay({ day: '00' })).to.equal(invalidDayError)
      expect(validateDay({ day: '33' })).to.equal(invalidDayError)
      expect(validateDay({ day: '', month: '02', monthError: undefined })).to.equal(requiredError)
      expect(validateDay({ day: '', year: '2002', yearError: undefined })).to.equal(requiredError)
    })
  })

  describe('validateMonth', () => {
    const invalidMonthError = 'Please enter a valid month'

    it('should validate month', () => {
      expect(validateMonth({ month: '' })).to.equal(undefined)
      expect(validateMonth({ month: '1' })).to.equal(undefined)
      expect(validateMonth({ month: '01' })).to.equal(undefined)
      expect(validateMonth({ month: '12' })).to.equal(undefined)
      expect(validateMonth({ month: '00' })).to.equal(invalidMonthError)
      expect(validateMonth({ month: '13' })).to.equal(invalidMonthError)
      expect(validateMonth({ month: '', day: '02', dayError: undefined })).to.equal(requiredError)
      expect(validateMonth({ month: '', year: '2002', yearError: undefined })).to.equal(requiredError)
    })
  })

  describe('validateYear', () => {
    const invalidYearError = 'Please enter a valid year'

    it('should validate month', () => {
      expect(validateYear({ year: '' })).to.equal(undefined)
      expect(validateYear({ year: '0001' })).to.equal(undefined)
      expect(validateYear({ year: '2016' })).to.equal(undefined)
      expect(validateYear({ year: '1' })).to.equal(invalidYearError)
      expect(validateYear({ year: '01' })).to.equal(invalidYearError)
      expect(validateYear({ year: '001' })).to.equal(invalidYearError)
      expect(validateYear({ year: '', day: '02', dayError: undefined })).to.equal(requiredError)
      expect(validateYear({ year: '', month: '12', monthError: undefined })).to.equal(requiredError)
    })
  })

  describe('validateDate', () => {
    const dateErrors = { dayError: undefined, monthError: undefined, yearError: undefined }
    const clearedErrors = { ...dateErrors, dateError: undefined }

    it('should validate leap day', () => {
      expect(validateDate({ ...dateErrors, day: '29', month: '2', year: '' })).to.deep.equal(clearedErrors)
      expect(validateDate({ ...dateErrors, day: '29', month: '2', year: '2016' })).to.deep.equal(clearedErrors)
    })

    it('should validate day of month', () => {
      expect(validateDate({ ...dateErrors, day: '30', month: '2' })).to.deep.equal({
        ...clearedErrors,
        dateError: 'Please enter a valid day for February',
      })
      expect(validateDate({ ...dateErrors, day: '32', month: '4' })).to.deep.equal({
        ...clearedErrors,
        dateError: 'Please enter a valid day for April',
      })
      expect(validateDate({ ...dateErrors, day: '29', month: '2', year: '2015' })).to.deep.equal({
        ...clearedErrors,
        dateError: 'Please enter a valid day for February',
      })

      expect(validateDate({ ...dateErrors, day: '', month: '2', year: '2015' })).to.deep.equal(clearedErrors)
      expect(validateDate({ ...dateErrors, day: '10', month: '2', year: '2015' })).to.deep.equal(clearedErrors)
      expect(validateDate({ ...dateErrors, day: '10', month: '', year: '2015' })).to.deep.equal(clearedErrors)
      expect(validateDate({ ...dateErrors, day: '0', month: '0', year: '2015' })).to.deep.equal(clearedErrors)
    })

    it('should clear errors on clearing the inputs', () => {
      const clearedInputsPaylaod = {
        day: '',
        month: '',
        year: '',
        dayError: 'Oops',
        monthError: 'Oops',
        yearError: 'Oops',
      }
      expect(validateDate(clearedInputsPaylaod)).to.deep.equal(clearedErrors)
    })

    it('should return field errors if they exist and the input is not empty', () => {
      const dayErrorPayload = { ...clearedErrors, day: '32', month: '01', year: '2016', dayError: 'Oops' }
      const monthErrorPayload = { ...clearedErrors, day: '01', month: '13', year: '2016', monthError: 'Oops' }
      const yearErrorPayload = { ...clearedErrors, day: '01', month: '01', year: '201', yearError: 'Oops' }

      expect(validateDate(dayErrorPayload)).to.deep.equal({ ...clearedErrors, dayError: 'Oops' })
      expect(validateDate(monthErrorPayload)).to.deep.equal({ ...clearedErrors, monthError: 'Oops' })
      expect(validateDate(yearErrorPayload)).to.deep.equal({ ...clearedErrors, yearError: 'Oops' })
    })
  })
})
