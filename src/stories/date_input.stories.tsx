import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import { DateInputContainer } from './helpers.stories'

export default storiesOf('Date Input', module)
  .add(
    'Default State',
    withInfo('This is the default date input')(() => {
      return (
        <section>
          <h2>Default State</h2>
          <DateInputContainer background />
          <DateInputContainer />
        </section>
      )
    }),
  )
  .add(
    'Existing Value',
    withInfo("Today's Date")(() => (
      <section>
        <h2>Loading with an Existing Value</h2>
        <DateInputContainer background date={new Date()} />
        <DateInputContainer date={new Date('2000-04-19')} />
      </section>
    )),
  )
