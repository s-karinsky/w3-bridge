import type { Web3ReactHooks } from '@web3-react/core'
import type { MetaMask } from '@web3-react/metamask'

import Accounts from '@components/accounts'
import ConnectWithSelect from '@components/connect'
import { Chain, Status as StatusLabel } from '@ui/ui'

interface Props {
  connector: MetaMask
  activeChainId: ReturnType<Web3ReactHooks['useChainId']>
  chainIds?: ReturnType<Web3ReactHooks['useChainId']>[]
  isActivating: ReturnType<Web3ReactHooks['useIsActivating']>
  isActive: ReturnType<Web3ReactHooks['useIsActive']>
  error: Error | undefined
  setError: any // (error?: Error) => any
  ENSNames: ReturnType<Web3ReactHooks['useENSNames']>
  provider?: ReturnType<Web3ReactHooks['useProvider']>
  accounts?: string[]
}

export default function Status({
  connector,
  activeChainId,
  chainIds,
  isActivating,
  isActive,
  error,
  setError,
  ENSNames,
  accounts,
  provider,
}: Props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '20rem',
        padding: '1rem',
        margin: '1rem',
        overflow: 'auto',
        border: '1px solid',
        borderRadius: '1rem',
        background: '#434343',
        color: '#f5f5f5',
        fontFamily: '"Roboto Serif", serif'
      }}
    >
      <b>

      </b>
      <div style={{ marginBottom: '1rem', display: 'flex', gap: 5 }}>
        <StatusLabel isActivating={isActivating} isActive={isActive} error={error} />
        <span>
          {!isActivating && !isActive && 'Connect to '}
          {isActivating && 'Connecting to '}
          {isActive && 'Connected to '}
          MetaMask
        </span>
      </div>
      <Chain chainId={activeChainId} />
      <div style={{ marginBottom: '1rem' }}>
        <Accounts accounts={accounts} provider={provider} ENSNames={ENSNames} />
      </div>
      <ConnectWithSelect
        connector={connector}
        activeChainId={activeChainId}
        chainIds={chainIds}
        isActivating={isActivating}
        isActive={isActive}
        error={error}
        setError={setError}
      />
    </div>
  )
}