import { Web3ReactHooks, Web3ReactProvider } from '@web3-react/core'
import type { MetaMask } from '@web3-react/metamask'

import { hooks as metaMaskHooks, metaMask } from '@config/connector'

const connectors: [MetaMask, Web3ReactHooks][] = [
  [metaMask, metaMaskHooks],
]

function Child() {
  // const { connector } = useWeb3React()
  return null
}

export default function ProviderExample() {
  return (
    <Web3ReactProvider connectors={connectors}>
      <Child />
    </Web3ReactProvider>
  )
}