import { white, black } from './colors'
import { mobile } from './breakpoints'

// Easing made possible by Will Justice (https://github.com/wjustice), CSS & animation guru
export const transitionEasing = 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'

export default `
  *, *:before, *:after { box-sizing: inherit; }

  html {
    box-sizing: border-box;
    font-family: roboto,-apple-system,sans-serif;
  }

  html,
  body {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
  }

  body {
    background-color: ${black};
    color: ${white};
    font-size: 16px;
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;
    margin: 0;
    min-height: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ul {
    padding: 0;
    margin: 0;

    li {
      list-style: none;
    }
  }

  @media (min-width: ${mobile}px) {
    body {
      font-size: 18px;
    }
  }
`
