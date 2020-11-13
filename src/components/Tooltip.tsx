import React, { useState, useCallback } from 'react'
import { useTheme } from 'emotion-theming'
import styled from '@emotion/styled'
import Tippy from '@tippyjs/react/headless'

const Container = styled.div`
  background-color: ${(p: any) => p.theme.tooltip.bgColor};
  color: ${(p: any) => p.theme.tooltip.textColor};
  padding: 1rem;
  border-radius: 5px;
  max-width: 200px;
  line-height: 1.3em;

  em {
    ${(p: any) => p.theme.font('body', 'regular', 'italic')};
  }

  strong {
    ${(p: any) => p.theme.font('body', 'bold')};
  }
`

const arrowBaseStyles = `
  position: absolute;
  width: 10px;
  height: 10px;
  z-index: -1;
`

const Arrow = styled.div`
  ${arrowBaseStyles};

  &::before {
    ${arrowBaseStyles};
  }

  &:before {
    content: '';
    transform: rotate(45deg);
    background: #333;
  }

  ${(a: any) => {
    const p = a['data-placement'];
    switch (p) {
      case 'top':
        return 'top: -5px'
      case 'bottom':
        return 'bottom: -5px'
      case 'left':
        return 'left: -5px'
      case 'right':
        return 'right: -5px'
      default:
        return ''
    }
  }};
}
`

interface Props {
  content: any,
  showArrow?: boolean,
  children: (arg: any) => any,
}

const Tooltip: React.FunctionComponent<Props> = ({ content, children, showArrow }) => {
  const theme = useTheme() as object
  const [visible, setVisible] = useState<boolean>()
  const show = useCallback(() => setVisible(true), [])
  const hide = useCallback(() => setVisible(false), [])
  const flash = useCallback((timeMs = 2000) => {
    show()
    setTimeout(() => hide(), timeMs)
  }, [hide, show])

  const html = <div>{content}</div>

  return (
    children({
      flash,
      show,
      hide,
      tooltipElement: (
        <Tippy
          duration={200}
          visible={(content ? visible : false)}
          render={attrs => (
            <Container {...attrs} theme={theme}>
              {html}
              {showArrow ? <Arrow {...attrs} /> : null}
            </Container>
          )}
        ><span /></Tippy>
      )
    })
  )
}

export default Tooltip