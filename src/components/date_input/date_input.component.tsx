import React from 'react'
import { default as moment } from 'moment'
import { get, pick } from 'lodash-es'
import styled from 'styled-components'
import { If } from 'jsx-control-statements'

import {
  validateDay,
  validateMonth,
  validateDate,
  DateInputValidation,
  validateYear,
  DateFields,
  DateFieldErrors,
} from './date_input_validation.utils'
import {
  DateFieldType,
  preventNonNumeric,
  tryFocusNextInput,
  focusPreviousInput,
  normalizeValue,
  formatYear,
  formatValue,
} from './date_input_utils'
import { ChangeInputEvent, FocusInputEvent } from '../../types/app.types'
import { setRef, ternaryValueFromProp } from '../../utils/component.utils'
import { gray, black, white, red, blue, neonBlue } from '../../style/colors'
import { mobile } from '../../style/breakpoints'
import { transitionEasing } from '../../style/globals'

type DateType = moment.Moment | Date | string

type Props = {
  date?: DateType
  onChange?: (event: any) => any
  onBlur?: (event: any) => any
  className?: string
  invertStyles?: boolean
}

type State = {
  day: string
  month: string
  year: string
  dayError?: string
  monthError?: string
  yearError?: string
  dateError?: string
  highlightError: boolean
  highlightStyles: { width: string; left: string }
}

type DateParts = Required<DateFields> & DateFieldErrors & { dateError?: string }

const DateInputContainer = styled.div``
const DateError = styled.div``
const FocusSlider = styled.div``
const defaultHighlightStyles = { width: '0', left: '0' }

export const validationKeys: Array<keyof DateInputValidation> = [
  'day',
  'month',
  'year',
  'dayError',
  'monthError',
  'yearError',
]

export const parseDate = (date?: DateType) => {
  if (!date) {
    return { day: '', month: '', year: '', dateError: undefined }
  }

  const parsedDate = moment(date)

  if (!parsedDate.isValid()) {
    return { day: '', month: '', year: '', dateError: `Invlid date supplied: ${date}` }
  }

  return {
    year: String(parsedDate.year()),
    month: String(parsedDate.month() + 1), // moment months are 0 indexed
    day: String(parsedDate.date()),
    dateError: undefined,
  }
}

export const generateOutput = (state: DateParts) => {
  const { day, month, year, dayError, monthError, yearError, dateError } = state
  const isDateComplete = day && month && year && year.length === 4
  const isValid = !dayError && !monthError && !yearError && !dateError && !!isDateComplete

  return { isValid, date: `${year}-${formatValue(month)}-${formatValue(day)}` }
}

export class RawDateInput extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {
    date: undefined,
    onChange: undefined,
    onBlur: undefined,
  }

  constructor(props: Props) {
    super(props)

    const parsedDate = parseDate(props.date)

    this.state = {
      ...parsedDate,
      dayError: undefined,
      monthError: undefined,
      yearError: undefined,
      highlightError: false,
      highlightStyles: defaultHighlightStyles,
    }
  }

  dateInput: HTMLDivElement | null = null
  dayInput: HTMLInputElement | null = null
  monthInput: HTMLInputElement | null = null
  yearInput: HTMLInputElement | null = null

  handleChange(state: State) {
    generateOutput(state)
    if (!this.props.onChange) {
      return
    }

    this.props.onChange(generateOutput(state))
  }

  handleBlur(state: State) {
    if (!this.props.onBlur) {
      return
    }

    this.props.onBlur(generateOutput(state))
  }

  handleFocus = (event: FocusInputEvent) => {
    const focused = event.currentTarget
    const focusedRect = focused.getBoundingClientRect!()

    /* istanbul ignore next */
    if (!this.dateInput) {
      return
    }

    const left = focusedRect.left - this.dateInput.getBoundingClientRect().left
    const highlightStyles = {
      left: `${left}px`,
      width: `${focusedRect.width}px`,
    }

    if (focused.classList!.contains('error')) {
      this.setState(() => ({ highlightStyles, highlightError: true }))
    } else {
      this.setState(() => ({ highlightStyles, highlightError: false }))
    }
  }

  handleDayChange = (event: ChangeInputEvent) => {
    const previousValue = this.state.day
    const day = normalizeValue(event.currentTarget.value!)

    // day allows 2 digits '0' is valid (e.g. DD)
    let dayError = undefined
    if (day !== '0') {
      dayError = validateDay({ day })
    }

    const errors = validateDate(
      pick<State, keyof DateInputValidation>({ ...this.state, day, dayError }, validationKeys),
    )

    const isValid = !(dayError || errors.dateError)

    this.handleChange({ ...this.state, ...errors, day })
    this.setState(() => ({ day, ...errors, highlightError: !isValid }))

    tryFocusNextInput({
      isValid,
      value: day,
      previousValueLength: previousValue.length,
      fieldType: DateFieldType.Day,
      nextInput: this.yearInput,
    })
  }

  handleMonthChange = (event: ChangeInputEvent) => {
    const previousValue = this.state.month
    const month = normalizeValue(event.currentTarget.value!)

    // month allows 2 digits '0' is valid (e.g. MM)
    let monthError
    if (month !== '0') {
      monthError = validateMonth({ month })
    }

    const errors = validateDate(
      pick<State, keyof DateInputValidation>({ ...this.state, month, monthError }, validationKeys),
    )

    const isValid = !(monthError || errors.dateError)

    this.handleChange({ ...this.state, ...errors, month })
    this.setState(() => ({ month, ...errors, highlightError: !isValid }))

    tryFocusNextInput({
      isValid,
      value: month,
      previousValueLength: previousValue.length,
      fieldType: DateFieldType.Month,
      nextInput: this.dayInput,
    })
  }

  handleYearChange = (event: ChangeInputEvent) => {
    const year = normalizeValue(event.currentTarget.value!, 4)

    const errors = validateDate(
      pick<State, keyof DateInputValidation>({ ...this.state, year, yearError: undefined }, validationKeys),
    )

    this.handleChange({ ...this.state, ...errors, year: year })
    this.setState(() => ({ year, ...errors, highlightError: !!errors.dateError }))
  }

  handleDayBlur = (event: FocusInputEvent) => {
    const value = get(event, 'currentTarget.value', '')
    const day = formatValue(value)

    const validationArgs = pick<State, keyof DateInputValidation>({ ...this.state, day }, validationKeys)
    const dayError = validateDay(validationArgs)
    const { dateError } = validateDate({ ...validationArgs, dayError })

    this.handleBlur({ ...this.state, day, dayError, dateError })
    this.setState(() => ({ day, dayError, dateError, highlightStyles: defaultHighlightStyles }))
  }

  handleMonthBlur = (event: FocusInputEvent) => {
    const value = get(event, 'currentTarget.value', '')
    const month = formatValue(value)

    const validationArgs = pick<State, keyof DateInputValidation>({ ...this.state, month }, validationKeys)
    const monthError = validateMonth(validationArgs)
    const { dateError } = validateDate({ ...validationArgs, monthError })

    this.handleBlur({ ...this.state, month, monthError, dateError })
    this.setState(() => ({ month, monthError, dateError, highlightStyles: defaultHighlightStyles }))
  }

  handleYearBlur = (event: FocusInputEvent) => {
    const value = get(event, 'currentTarget.value', '')
    const year = formatYear(value)

    const validationArgs = pick<State, keyof DateInputValidation>({ ...this.state, year }, validationKeys)
    const yearError = validateYear(validationArgs)
    const { dateError } = validateDate({ ...validationArgs, yearError })

    this.handleBlur({ ...this.state, year, yearError, dateError })
    this.setState(() => ({ year, yearError, dateError, highlightStyles: defaultHighlightStyles }))
  }

  render() {
    const { day, month, year, dayError, monthError, yearError, dateError } = this.state
    const displayError = monthError || dayError || yearError || dateError

    return (
      <div className={this.props.className}>
        <DateInputContainer ref={setRef(this, 'dateInput')}>
          <input
            className={`${monthError || dateError ? 'error' : ''}`}
            name="month"
            type="number"
            pattern="\d*"
            min="0"
            max="12"
            placeholder="MM"
            value={month}
            ref={setRef(this, 'monthInput')}
            onKeyPress={preventNonNumeric}
            onChange={this.handleMonthChange}
            onBlur={this.handleMonthBlur}
            onFocus={this.handleFocus}
          />
          <span>/</span>
          <input
            className={`${dayError || dateError ? 'error' : ''}`}
            name="day"
            type="number"
            pattern="\d*"
            min="0"
            max="32"
            placeholder="DD"
            value={day}
            ref={setRef(this, 'dayInput')}
            onKeyDown={focusPreviousInput(this.monthInput)}
            onKeyPress={preventNonNumeric}
            onChange={this.handleDayChange}
            onBlur={this.handleDayBlur}
            onFocus={this.handleFocus}
          />
          <span>/</span>
          <input
            className={`${yearError || dateError ? 'error' : ''}`}
            name="year"
            type="number"
            pattern="\d*"
            min="0"
            placeholder="YYYY"
            value={year}
            ref={setRef(this, 'yearInput')}
            onKeyDown={focusPreviousInput(this.dayInput)}
            onKeyPress={preventNonNumeric}
            onChange={this.handleYearChange}
            onBlur={this.handleYearBlur}
            onFocus={this.handleFocus}
          />
          <FocusSlider className={`${this.state.highlightError ? 'error' : ''}`} style={this.state.highlightStyles} />
        </DateInputContainer>
        <DateError>
          <If condition={displayError}>
            <span>{displayError}</span>
          </If>
        </DateError>
      </div>
    )
  }
}

export const DateInput = styled(RawDateInput)`
  ${DateInputContainer} {
    border-bottom: 2px solid ${gray};
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;

    input {
      position: relative;
      background-color: transparent;
      background: transparent;
      outline: none;
      padding: 0.7em 0.5em 0.5em 0;
      margin: 0;
      color: ${ternaryValueFromProp('invertStyles', black, white)};
      font-size: 16px;
      font-weight: 600;
      text-align: center;
      min-width: 0;
      position: relative;
      top: 2px;
      flex: 1 33%;

      &::placeholder {
        font-size: 16px;
      }

      border-radius: 0px; /* iOS Safari */

      &[type='number'],
      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        appearance: none;
        -moz-appearance: none; /* Firefox */
        -webkit-appearance: none; /* Safari and Chrome */
      }

      -webkit-appearance: none; /* legacy iOS Safari */
      -moz-appearance: textfield; /* Firefox */

      &:read-only {
        pointer-events: none;
        border-bottom: 1px dotted ${gray};
        color: ${gray};
      }

      &:focus,
      &:active {
        outline: none;
      }

      &:required,
      &:invalid {
        box-shadow: none;
      }

      &.error {
        border-bottom: 2px solid ${red};
      }

      @media (min-width: ${mobile}px) {
        padding: 0.75em 1em;
        font-size: 20px;

        &::placeholder {
          font-size: 20px;
        }
      }

      border: none;
      border-bottom: 1px solid ${gray};
    }

    span {
      color: ${gray};
    }

    ${FocusSlider} {
      position: absolute;
      bottom: -2px;
      left: 0;
      height: 2px;
      width: 0;
      background: ${ternaryValueFromProp('invertStyles', blue, neonBlue)};

      /* Transition made possible by Will Justice (https://github.com/wjustice) */
      will-change: width;
      transition: width 0.3s ${transitionEasing}, left 0.3s ${transitionEasing}, color 0.3s ${transitionEasing};

      &.error {
        background: ${red};
      }
    }
  }

  ${DateError} {
    padding: 0.4em 0;
    min-height: 2.5rem;

    span {
      font-size: 13px;
      font-style: italic;
      color: ${red};
      display: inline-block;

      @media (min-width: ${mobile}px) {
        font-size: 16px;
      }
    }
  }
`
