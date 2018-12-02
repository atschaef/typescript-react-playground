import { KeyboardInputEvent } from '../../types/app.types'

type FocusNextArgs = {
  isValid: boolean
  value: string
  previousValueLength: number
  fieldType: DateFieldType
  nextInput: HTMLInputElement | null
}

export enum DateFieldType {
  Day,
  Month,
  Year,
}

const DELETE_KEY = 8

export const preventNonNumeric = (event: KeyboardInputEvent) => {
  // Prevent iOS non-numeric and non-numeric keypress values allowed in HTML5 number input: e, -, +, .
  if (/[^0-9]+/g.test(String.fromCharCode(event.charCode))) {
    event.preventDefault()
  }
}

// focus previous input on delete in an empty field
export const focusPreviousInput = (previousInput: HTMLInputElement | null) => (event: KeyboardInputEvent) => {
  if (event.keyCode === DELETE_KEY && !event.currentTarget.value && previousInput) {
    event.currentTarget.blur!()
    previousInput.focus()
    event.preventDefault()
  }
}

// focus next input if 2 digits, or the first digit is higher than the allowed 10's place digit (2+ for month, 4+ for day)
export const tryFocusNextInput = ({ isValid, value, previousValueLength, fieldType, nextInput }: FocusNextArgs) => {
  if (!isValid || !nextInput) {
    return
  }

  const { maxQuickFocusValue, minFocusLength, maxFocusLength } = focusNextOptions(fieldType)

  const isMaxFieldLength = previousValueLength === maxFocusLength - 1 && value.length === maxFocusLength
  const isMaxQuickFocusValue = value.length === minFocusLength && Number(value) > maxQuickFocusValue

  if (isMaxFieldLength || isMaxQuickFocusValue) {
    nextInput.focus()
  }
}

export const normalizeValue = (value: string, maxLength: 2 | 4 = 2) => {
  if (!value) {
    return ''
  }

  if (maxLength === 2) {
    return value.substr(0, 2).replace('00', '0')
  }

  return value.substr(0, 4).replace('0000', '000')
}

function focusNextOptions(fieldType: DateFieldType) {
  if (fieldType === DateFieldType.Day) {
    return { maxQuickFocusValue: 3, minFocusLength: 1, maxFocusLength: 2 }
  }

  if (fieldType === DateFieldType.Month) {
    return { maxQuickFocusValue: 1, minFocusLength: 1, maxFocusLength: 2 }
  }

  return { maxQuickFocusValue: 9999, minFocusLength: 4, maxFocusLength: 4 }
}

// if day/month allows 1 OR 2 digits '0' is valid (i.e. DD or MM)
export const formatValue = (value: string) => {
  if (value.length !== 1) {
    return value
  }

  return `0${value}`
}

// if year allows 2 digits (e.g. YY) and is formatted in 4 (e.g. YYYY)
export const formatYear = (year: string) => {
  if (year.length !== 2) {
    return year
  }

  const currentYear = String(new Date().getFullYear())
  const isFutureDate = Number(year) > Number(currentYear.substr(2, 2))

  const century = currentYear.substr(0, 2)
  const pastCentury = String(Number(century) - 1)

  return `${isFutureDate ? pastCentury : century}${year}`
}
