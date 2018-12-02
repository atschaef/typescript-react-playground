import React, { HTMLProps, useState } from 'react'
import styled from 'styled-components'
import { DateInput } from '../components/date_input/date_input.component'
import { If } from 'jsx-control-statements'

type PaddedContainerProps = {
  background?: boolean
}

type DateInputContainerProps = {
  date?: Date
  background?: boolean
}

export const PaddedContainer = styled.div<HTMLProps<HTMLDivElement> & PaddedContainerProps>`
  padding: 1em;
  background: ${({ background }) => (background ? '#000000' : 'transparent')};
  max-width: 480px;

  div:last-child {
    color: ${({ background }) => (background ? '#ffffff' : '#000000')};
  }
`

export const DateInputContainer = ({ date, background }: DateInputContainerProps) => {
  const [state, setState] = useState({
    isValid: date ? true : false,
    date: date ? date.toISOString().split('T')[0] : '',
  })

  return (
    <PaddedContainer background={!!background}>
      <DateInput onChange={setState} onBlur={setState} date={date} invertStyles={!background} />
      <If condition={!!state.date}>
        <div>
          Date is {state!.isValid ? 'valid' : 'invalid'} with a value of: {state!.date}
        </div>
      </If>
    </PaddedContainer>
  )
}
