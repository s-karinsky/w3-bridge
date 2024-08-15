import type { Web3ReactHooks } from '@web3-react/core'
import type { MetaMask } from '@web3-react/metamask'
import { useCallback, useEffect, useState } from 'react'

import { CHAINS, getAddChainParameters } from '@config/chains'

function ChainSelect({
  activeChainId,
  switchChain,
  chainIds,
}: {
  activeChainId?: number
  switchChain: (chainId: number) => void
  chainIds: (number | undefined)[]
}) {
  return (
    <select
      value={activeChainId}
      onChange={(event) => {
        switchChain(Number(event.target.value))
      }}
      disabled={switchChain === undefined}
    >
      <option hidden disabled>
        Select chain
      </option>
      <option value={-1}>Default</option>
      {chainIds.map((chainId) => (
        <option key={chainId} value={chainId}>
          {CHAINS[chainId!]?.name ?? chainId}
        </option>
      ))}
    </select>
  )
}

export default function ConnectWithSelect({
  connector,
  activeChainId,
  chainIds = Object.keys(CHAINS).map(Number),
  isActivating,
  isActive,
  error,
  setError,
}: {
  connector: MetaMask
  activeChainId: ReturnType<Web3ReactHooks['useChainId']>
  chainIds?: ReturnType<Web3ReactHooks['useChainId']>[]
  isActivating: ReturnType<Web3ReactHooks['useIsActivating']>
  isActive: ReturnType<Web3ReactHooks['useIsActive']>
  error: Error | undefined
  setError: (error?: Error | undefined) => void
}) {
  const [desiredChainId, setDesiredChainId] = useState<number | undefined>(undefined)
  useEffect(() => {
    if (activeChainId && (!desiredChainId || desiredChainId === -1)) {
      setDesiredChainId(activeChainId)
    }
  }, [desiredChainId, activeChainId])

  const switchChain = useCallback(
    async (desiredChainId?: number) => {
      setDesiredChainId(desiredChainId)

      try {
        if (
          !desiredChainId ||
          desiredChainId === activeChainId ||
          (desiredChainId === -1 && activeChainId !== undefined)
        ) {
          setError()
          return
        }

        await connector.activate(getAddChainParameters(desiredChainId))
        setError()
      } catch (error) {
        setError(error as Error)
      }
    },
    [connector, activeChainId, setError]
  )

  return (
    <div>
      <ChainSelect activeChainId={desiredChainId} switchChain={switchChain} chainIds={chainIds} />
      <div style={{ marginBottom: '1rem' }} />
      {isActive ? (
        error ? (
          <button onClick={() => switchChain(desiredChainId)}>Try again?</button>
        ) : (
          <button
            onClick={() => {
              if (connector?.deactivate) {
                void connector.deactivate()
              } else {
                void connector.resetState()
              }
              setDesiredChainId(undefined)
            }}
          >
            Disconnect
          </button>
        )
      ) : (
        <button
          onClick={() =>switchChain(desiredChainId)}
          disabled={isActivating || !desiredChainId}
        >
          {error ? 'Try again?' : 'Connect'}
        </button>
      )}
    </div>
  )
}