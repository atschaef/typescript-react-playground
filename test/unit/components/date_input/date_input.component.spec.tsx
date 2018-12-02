import React from 'react'
import { default as moment } from 'moment'
import { shallow } from 'enzyme'
import { createSandbox } from 'sinon'
import { expect } from 'chai'

import { RawDateInput, parseDate, generateOutput } from '../../../../src/components/date_input/date_input.component'
import { changeInputEvent, focusInputEvent } from '../../data/events'

describe('-- DateInput --', () => {
  const testSandbox = createSandbox()
  const initialState = {
    day: '',
    month: '',
    year: '',
    dayError: undefined,
    monthError: undefined,
    yearError: undefined,
    dateError: undefined,
    highlightError: false,
    highlightStyles: { width: '0', left: '0' },
  }

  const props = {
    date: '2016-04-19',
    onChange: testSandbox.spy(),
    onBlur: testSandbox.spy(),
  }

  afterEach(() => {
    testSandbox.resetHistory()
  })

  after(() => {
    testSandbox.restore()
  })

  describe('parseDate', () => {
    it('should return day, month and year fields with actual passed date', () => {
      const momentDate = moment({ year: 1989, month: 10, day: 15 }) // moment is 0 based month index
      expect(parseDate(momentDate)).to.deep.equal({
        day: '15',
        month: '11',
        year: '1989',
        dateError: undefined,
      })

      const isoDate = moment({ year: 2010, month: 11, day: 10 }).toISOString() // moment is 0 based month index
      expect(parseDate(isoDate)).to.deep.equal({
        day: '10',
        month: '12',
        year: '2010',
        dateError: undefined,
      })

      const date = new Date(`2016-04-19T00:00:00.000-0${new Date().getTimezoneOffset() / 60}:00`)
      expect(parseDate(date)).to.deep.equal({
        day: '19',
        month: '4',
        year: '2016',
        dateError: undefined,
      })
    })

    it('should return empty values if no date', () => {
      expect(parseDate()).to.deep.equal({
        day: '',
        month: '',
        year: '',
        dateError: undefined,
      })
    })

    it('should return empty values with an error if the date is invalid', () => {
      expect(parseDate('2012-15-15')).to.deep.equal({
        day: '',
        month: '',
        year: '',
        dateError: 'Invlid date supplied: 2012-15-15',
      })
    })
  })

  describe('generateOutput', () => {
    it('should return correct output', () => {
      const dateParts = {
        day: '7',
        month: '4',
        year: '2012',
        dayError: undefined,
        monthError: undefined,
        yearError: undefined,
        dateError: undefined,
      }

      expect(generateOutput(dateParts)).to.deep.equal({ isValid: true, date: '2012-04-07' })
      expect(generateOutput({ ...dateParts, day: '' })).to.deep.equal({ isValid: false, date: '2012-04-' })
      expect(generateOutput({ ...dateParts, month: '' })).to.deep.equal({ isValid: false, date: '2012--07' })
      expect(generateOutput({ ...dateParts, year: '' })).to.deep.equal({ isValid: false, date: '-04-07' })
      expect(generateOutput({ ...dateParts, month: '', year: '' })).to.deep.equal({ isValid: false, date: '--07' })
      expect(generateOutput({ day: '', month: '', year: '' })).to.deep.equal({ isValid: false, date: '--' })
    })
  })

  describe('handleFocus', () => {
    it('it should set highlightStyles in state', () => {
      const container = shallow<RawDateInput>(<RawDateInput {...props} />)
      const component = container.instance()

      component.dayInput = document.createElement('input')
      component.dateInput = document.createElement('div')

      component.handleFocus({ ...focusInputEvent, currentTarget: component.dayInput! })

      expect(container.state('highlightStyles')).to.deep.equal(
        { left: '0px', width: '0px' },
        'highlightStyles should be set with calculated values',
      )
    })

    it('it should set highlightError true if focused input contains error class', () => {
      const container = shallow<RawDateInput>(<RawDateInput {...props} />)
      const component = container.instance()

      component.dateInput = document.createElement('div')
      const input = document.createElement('input')
      input.classList.add('error')

      component.handleFocus({ ...focusInputEvent, currentTarget: input })

      expect(container.state('highlightError')).to.equal(true)
    })

    it('it should set highlightError false if focused input does not contain error class', () => {
      const container = shallow<RawDateInput>(<RawDateInput {...props} />)
      const component = container.instance()

      component.dateInput = document.createElement('div')
      const input = document.createElement('input')

      component.handleFocus({ ...focusInputEvent, currentTarget: input })

      expect(container.state('highlightError')).to.equal(false)
    })
  })

  describe('handleDayChange', () => {
    it('should update state with the new value', () => {
      const container = shallow<RawDateInput>(<RawDateInput {...props} />)
      const component = container.instance()

      component.handleDayChange({
        ...changeInputEvent,
        currentTarget: { ...changeInputEvent.currentTarget, value: '4' },
      })

      expect(props.onChange.callCount).to.equal(1)
      expect(container.state()).to.deep.equal({
        ...initialState,
        day: '4',
        month: '4',
        year: '2016',
      })
    })

    it('should not have error if value is 0', () => {
      const container = shallow<RawDateInput>(<RawDateInput {...props} />)
      const component = container.instance()

      component.handleDayChange({
        ...changeInputEvent,
        currentTarget: { ...changeInputEvent.currentTarget, value: '0' },
      })

      expect(props.onChange.callCount).to.equal(1)
      expect(container.state()).to.deep.equal({
        ...initialState,
        day: '0',
        month: '4',
        year: '2016',
      })
    })

    it('should have errors if value is invalid', () => {
      const container = shallow<RawDateInput>(<RawDateInput />)
      const component = container.instance()

      component.handleDayChange({
        ...changeInputEvent,
        currentTarget: { ...changeInputEvent.currentTarget, value: '32' },
      })

      expect(container.state()).to.deep.equal({
        ...initialState,
        day: '32',
        dayError: 'Please enter a valid day',
        highlightError: true,
      })
    })
  })

  describe('handleMonthChange', () => {
    it('should update state with the new value', () => {
      const container = shallow<RawDateInput>(<RawDateInput {...props} />)
      const component = container.instance()

      component.handleMonthChange({
        ...changeInputEvent,
        currentTarget: { ...changeInputEvent.currentTarget, value: '9' },
      })

      expect(props.onChange.callCount).to.equal(1)
      expect(container.state()).to.deep.equal({
        ...initialState,
        day: '19',
        month: '9',
        year: '2016',
      })
    })

    it('should not have error if value is 0', () => {
      const container = shallow<RawDateInput>(<RawDateInput {...props} />)
      const component = container.instance()

      component.handleMonthChange({
        ...changeInputEvent,
        currentTarget: { ...changeInputEvent.currentTarget, value: '0' },
      })

      expect(props.onChange.callCount).to.equal(1)
      expect(container.state()).to.deep.equal({
        ...initialState,
        day: '19',
        month: '0',
        year: '2016',
      })
    })

    it('should have errors if value is invalid', () => {
      const container = shallow<RawDateInput>(<RawDateInput />)
      const component = container.instance()

      component.handleMonthChange({
        ...changeInputEvent,
        currentTarget: { ...changeInputEvent.currentTarget, value: '13' },
      })

      expect(container.state()).to.deep.equal({
        ...initialState,
        month: '13',
        monthError: 'Please enter a valid month',
        highlightError: true,
      })
    })
  })

  describe('handleYearChange', () => {
    it('should update state with the new value', () => {
      const container = shallow<RawDateInput>(<RawDateInput onChange={props.onChange} />)
      const component = container.instance()

      component.handleYearChange({
        ...changeInputEvent,
        currentTarget: { ...changeInputEvent.currentTarget, value: '199' },
      })

      expect(props.onChange.callCount).to.equal(1)
      expect(container.state()).to.deep.equal({
        ...initialState,
        year: '199',
      })
    })

    it('should have errors if value is invalid', () => {
      const container = shallow<RawDateInput>(<RawDateInput date="2016-02-29" />)
      const component = container.instance()

      component.handleYearChange({
        ...changeInputEvent,
        currentTarget: { ...changeInputEvent.currentTarget, value: '2015' },
      })

      expect(container.state()).to.deep.equal({
        ...initialState,
        day: '29',
        month: '2',
        year: '2015',
        dateError: 'Please enter a valid day for February',
        highlightError: true,
      })
    })
  })

  describe('handleDayBlur', () => {
    it('should update state with the new value', () => {
      const container = shallow<RawDateInput>(<RawDateInput />)
      const component = container.instance()

      component.handleDayBlur({
        ...focusInputEvent,
        currentTarget: { ...focusInputEvent.currentTarget, value: '4' },
      })

      expect(container.state()).to.deep.equal({ ...initialState, day: '04' })
    })

    it('should have errors if value is invalid', () => {
      const container = shallow<RawDateInput>(<RawDateInput {...props} />)
      const component = container.instance()

      component.handleDayBlur({
        ...focusInputEvent,
        currentTarget: { ...focusInputEvent.currentTarget, value: '' },
      })

      expect(props.onBlur.callCount).to.equal(1)
      expect(container.state()).to.deep.equal({
        ...initialState,
        day: '',
        month: '4',
        year: '2016',
        dayError: 'Required',
      })
    })
  })

  describe('handleMonthBlur', () => {
    it('should update state with the new value', () => {
      const container = shallow<RawDateInput>(<RawDateInput />)
      const component = container.instance()

      component.handleMonthBlur({
        ...focusInputEvent,
        currentTarget: { ...focusInputEvent.currentTarget, value: '4' },
      })

      expect(container.state()).to.deep.equal({ ...initialState, month: '04' })
    })

    it('should have errors if value is invalid', () => {
      const container = shallow<RawDateInput>(<RawDateInput {...props} />)
      const component = container.instance()

      component.handleMonthBlur({
        ...focusInputEvent,
        currentTarget: { ...focusInputEvent.currentTarget, value: '' },
      })

      expect(props.onBlur.callCount).to.equal(1)
      expect(container.state()).to.deep.equal({
        ...initialState,
        day: '19',
        month: '',
        year: '2016',
        monthError: 'Required',
      })
    })
  })

  describe('handleYearBlur', () => {
    it('should update state with the new value', () => {
      const container = shallow<RawDateInput>(<RawDateInput />)
      const component = container.instance()

      component.handleYearBlur({
        ...focusInputEvent,
        currentTarget: { ...focusInputEvent.currentTarget, value: '2016' },
      })

      expect(container.state()).to.deep.equal({ ...initialState, year: '2016' })

      const futureDate = new Date().getFullYear() + 1
      const futureDate2DigitYear = String(futureDate).substr(2, 2)
      const pastCentury = Number(String(futureDate).substr(0, 2)) - 1
      component.handleYearBlur({
        ...focusInputEvent,
        currentTarget: { ...focusInputEvent.currentTarget, value: futureDate2DigitYear },
      })

      expect(container.state()).to.deep.equal({ ...initialState, year: `${pastCentury}${futureDate2DigitYear}` })

      const lastYear = new Date().getFullYear() - 1
      const lastYear2DigitYear = String(lastYear).substr(2, 2)
      const currentCentury = String(lastYear).substr(0, 2)
      component.handleYearBlur({
        ...focusInputEvent,
        currentTarget: { ...focusInputEvent.currentTarget, value: lastYear2DigitYear },
      })

      expect(container.state()).to.deep.equal({ ...initialState, year: `${currentCentury}${lastYear2DigitYear}` })
    })

    it('should update state with the new value', () => {
      const container = shallow<RawDateInput>(<RawDateInput />)
      const component = container.instance()

      component.handleYearBlur({
        ...focusInputEvent,
        currentTarget: { ...focusInputEvent.currentTarget, value: '2016' },
      })

      expect(container.state()).to.deep.equal({ ...initialState, year: '2016' })
    })

    it('should have errors if value is invalid', () => {
      const container = shallow<RawDateInput>(<RawDateInput {...props} />)
      const component = container.instance()

      component.handleYearBlur({
        ...focusInputEvent,
        currentTarget: { ...focusInputEvent.currentTarget, value: '201' },
      })

      expect(props.onBlur.callCount).to.equal(1)
      expect(container.state()).to.deep.equal({
        ...initialState,
        day: '19',
        month: '4',
        year: '201',
        yearError: 'Please enter a valid year',
      })
    })
  })

  it('should display error if dayError', () => {
    const dayError = 'Please enter a valid day'
    const monthError = 'Please enter a valid month'
    const yearError = 'Please enter a valid year'
    const dateError = 'Please enter a valid day for January'

    const container = shallow(<RawDateInput {...props} />)
    container.setState(() => ({ dayError }))

    let error = container.find('span').at(2)
    expect(error.text()).to.equal(dayError)

    container.setState(() => ({ dayError: undefined, monthError }))

    error = container.find('span').at(2)
    expect(error.text()).to.equal(monthError)

    container.setState(() => ({ monthError: undefined, yearError }))
    error = container.find('span').at(2)
    expect(error.text()).to.equal(yearError)

    container.setState(() => ({ yearError: undefined, dateError }))
    error = container.find('span').at(2)
    expect(error.text()).to.equal(dateError)
  })
})
