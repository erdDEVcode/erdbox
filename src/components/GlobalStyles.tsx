import React, { Fragment } from 'react'
import { css, Global } from '@emotion/core'
import { useTheme } from 'emotion-theming'
import { resetStyles } from 'emotion-styled-utils'

const GlobalStyles: React.FunctionComponent = () => {
  const theme: any = useTheme()

  return (
    <Fragment>
      {/* <link rel='stylesheet' href='https://unpkg.com/@fortawesome/fontawesome-svg-core@1.2.17/styles.css' integrity='sha384-bM49M0p1PhqzW3LfkRUPZncLHInFknBRbB7S0jPGePYM+u7mLTBbwL0Pj/dQ7WqR' crossOrigin='anonymous' /> */}
      <Global styles={css(resetStyles)} />
      <Global styles={css`
        * {
          box-sizing: border-box;
        }

        html {
          font-size: 14px;
        }

        body {
          ${theme.font('body')};
        }

        a {
          cursor: pointer;
          text-decoration: none;
          border-bottom: 1px solid transparent;
        }

        h1, h2, h3 {
          ${theme.font('header', 'light')};
          margin: 1em 0;
          line-height: 1em;
        }

        h1 {
          font-size: 2.1rem;
          margin: 1rem 0;
        }

        h2 {
          font-size: 1.5rem;
        }

        h3 {
          font-size: 1.2rem;
        }
      `} />
    </Fragment>
  )
}

export default GlobalStyles