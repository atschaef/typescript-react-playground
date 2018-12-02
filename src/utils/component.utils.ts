import { set, curry, get, isFunction } from 'lodash-es'
import { AnyObject } from '../types/app.types'

export const setRef = curry(set)

export const ternaryValueFromProp = (property: string, whenTrue: any, whenFalse: any) => (obj: AnyObject) => {
  const prop = get(obj, property)
  const value = isFunction(prop) ? prop() : prop
  return value ? whenTrue : whenFalse
}

export const propOr = (accessor: string, defaultValue: any) => (obj: AnyObject) => get(obj, accessor, defaultValue)
