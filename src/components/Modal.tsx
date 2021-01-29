import React from 'react'
import styled from '@emotion/styled'
import { ClassNames } from '@emotion/core'
import { useTheme } from 'emotion-theming'
import { flex, boxShadow, smoothTransitions } from 'emotion-styled-utils'
import ReactModal, { Props as DefaultProps } from 'react-modal'


interface Props extends DefaultProps {
  width?: string | number,
  height?: string | number,
  className?: string,
}

const Modal: React.FunctionComponent<Props> = ({ className, children, ...props }) => {
  const theme: any = useTheme()

  return (
    <ClassNames>
      {({ css }) => (
        <ReactModal
          className={{
            base: css`
              ${flex({ direction: 'column', justify: 'center', align: 'center' })};
              width: 85%;
              max-width: 700px;
              height: 80%;
              max-height: 640px;
              margin: auto;
              outline: none;
            `,
            afterOpen: '',
            beforeClose: '',
          }}
          overlayClassName={{
            base: css`
              position: fixed;
              top: 0;
              left: 0;
              width: 100vw;
              height: 100vh;
              z-index: 30;
              ${flex({ direction: 'column', justify: 'center', align: 'center' })};
              background-color: ${theme.modal.overlay.bgColor};
              opacity: 0;
            `,
            afterOpen: css`
              opacity: 1;
            `,
            beforeClose: '',
          }}
          {...props}
        >
          {children}
        </ReactModal>
      )}
    </ClassNames>
  )
}

export default Modal
