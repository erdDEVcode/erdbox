import React from 'react'

interface Props {
  className?: string,
  title?: string,
}

const LoadingIcon: React.FunctionComponent<Props> = props => {
  return (
    <span {...props}>Loading...</span>
  )
}

export default LoadingIcon