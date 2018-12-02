import { createGlobalStyle } from 'styled-components'

import globalStyles from '../style/globals'
import { white } from '../style/colors'

const globalStorybookStyles = `
  ${globalStyles}

  body {
    padding: 1.5em;
    background-color: ${white};
  }
`

createGlobalStyle`${globalStorybookStyles}`

require('./date_input.stories')
