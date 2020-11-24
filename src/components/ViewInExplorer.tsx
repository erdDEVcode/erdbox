import React, { useCallback } from 'react'

import { ChainConsumer, ChainContextValue } from '../contexts'
import { openExternalUrl } from '../utils'

interface Props {
  chainId: string,
  render: Function,
}

const Inner: React.FunctionComponent<Props> = ({ chainId, render }) => {
  const getTransactionUrl = useCallback(id => {
    return `https://${'T' === chainId ? 'testnet-' : ''}explorer.elrond.com/transactions/${id}`
  }, [ chainId ])

  const getAddressUrl = useCallback(addr => {
    return `https://${'T' === chainId ? 'testnet-' : ''}explorer.elrond.com/address/${addr}`
  }, [ chainId ])

  return render({ getTransactionUrl, getAddressUrl })
}

const Wrapper: React.FunctionComponent = ({ children }) => {
  return (
    <ChainConsumer>
      {({ config }: ChainContextValue) => (
        (children && config)
          ? <Inner chainId={config.chainId} render={children as Function} />
          : null
      )}
    </ChainConsumer>
  )
}

export interface ViewInExplorerContext {
  onClick: () => void
}

interface ViewProps {
  fns: any,
  type: string,
  input: any,
}

const View: React.FunctionComponent<ViewProps> = ({ children, fns, type, input }) => {
  const onClick = useCallback(() => {
    switch (type) {
      case 'address':
        return openExternalUrl(fns.getAddressUrl(input))
      case 'transaction':
        return openExternalUrl(fns.getTransactionUrl(input))
    }
  }, [ fns, type, input ])

  const ret: ViewInExplorerContext = {
    onClick,
  }

  return (children as Function)(ret)
}

interface ViewAddressProps {
  address: string,
}

export const ViewAddressInExplorer: React.FunctionComponent<ViewAddressProps> = ({ children, address }) => {
  return (
    <Wrapper>
      {(fns: any) => (
        <View type='address' input={address} fns={fns}>
          {children}
        </View>
      )}
    </Wrapper>
  )
}

interface ViewTransactionProps {
  id: string,
}

export const ViewTransactionInExplorer: React.FunctionComponent<ViewTransactionProps> = ({ children, id }) => {
  return (
    <Wrapper>
      {(fns: any) => (
        <View type='transaction' input={id} fns={fns}>
          {children}
        </View>
      )}
    </Wrapper>
  )
}

