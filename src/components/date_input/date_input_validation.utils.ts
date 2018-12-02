import { default as moment } from 'moment'

const dayRegex = /^(0?[1-9]|[1-2]\d|3[0-1])$/
const monthRegex = /^(0?[1-9]|1[0-2])$/

export type DateFields = {
  day?: string
  month?: string
  year?: string
}

export type DateFieldErrors = {
  dayError?: string
  monthError?: string
  yearError?: string
}

export type DateInputValidation = DateFields & DateFieldErrors

export const validateDay = ({ day, month, year, monthError, yearError }: DateInputValidation) => {
  if (!day) {
    return (month && !monthError) || (year && !yearError) ? 'Required' : undefined
  }

  return dayRegex.test(day) ? undefined : 'Please enter a valid day'
}

export const validateMonth = ({ day, month, year, dayError, yearError }: DateInputValidation) => {
  if (!month) {
    return (day && !dayError) || (year && !yearError) ? 'Required' : undefined
  }

  return monthRegex.test(month) ? undefined : 'Please enter a valid month'
}

export const validateYear = ({ day, month, year, dayError, monthError }: DateInputValidation) => {
  if (!year) {
    return (day && !dayError) || (month && !monthError) ? 'Required' : undefined
  }

  return year.length === 4 ? undefined : 'Please enter a valid year'
}

export const validateDate = ({ day, month, year, ...fieldErrors }: DateInputValidation) => {
  const { dayError, monthError, yearError } = fieldErrors

  if (!day && !month && !year) {
    return { dayError: undefined, monthError: undefined, yearError: undefined, dateError: undefined }
  }

  if (dayError || monthError || yearError) {
    return { ...fieldErrors, dateError: undefined }
  }

  return { ...fieldErrors, dateError: isValidDayOfMonth({ day, month, year }) }
}

function isValidDayOfMonth({ day, month, year }: DateInputValidation) {
  if (!month || month === '0' || !day || day === '0') {
    return undefined
  }

  // moment stores months in an array; must zero base index month when passed into moment
  const month0BasedIndex = Number(month) - 1
  const testYear = Number(year) || 2016 // default to a leap year for optimistic validation
  const testDay = Number(day)

  return moment({ year: testYear, month: month0BasedIndex, day: testDay }).isValid()
    ? undefined
    : `Please enter a valid day for ${moment.months(month0BasedIndex)}`
}
