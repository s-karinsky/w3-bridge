import type { Web3ReactHooks } from '@web3-react/core'

export default function Status({
  isActivating,
  isActive,
  error,
  withText,
}: {
  isActivating: ReturnType<Web3ReactHooks['useIsActivating']>
  isActive: ReturnType<Web3ReactHooks['useIsActive']>
  error?: Error
  withText?: boolean
}) {
  return (
    <div>
      {error ? (
        <>
          🔴 {error.name ?? 'Error'}
          {error.message ? `: ${error.message}` : null}
        </>
      ) : isActivating ? (
        <>🟡 {withText && 'Connecting'}</>
      ) : isActive ? (
        <>🟢 {withText && 'Connected'}</>
      ) : (
        <>⚪️ {withText && 'Disconnected'}</>
      )}
    </div>
  )
}