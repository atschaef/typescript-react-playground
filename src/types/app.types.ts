import { KeyboardEvent, FocusEvent, ChangeEvent } from 'react'

export type AnyObject = { [key: string]: any }

export interface FileInput extends HTMLInputElement {
  files: any
}

export interface KeyboardInputEvent extends KeyboardEvent<Partial<HTMLInputElement>> {
  nativeEvent: any
}

export interface FocusInputEvent extends FocusEvent<Partial<HTMLInputElement>> {
  nativeEvent: any
}

export interface ChangeInputEvent extends ChangeEvent<Partial<FileInput>> {
  nativeEvent: any
}
