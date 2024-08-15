export enum Chain {
  POLYGON,
  MAINNET,
}

interface ExampleConfig {
  chain: Chain
  rpc: {
    polygon: string
    mainnet: string
  }
}

export const CurrentConfig: ExampleConfig = {
  chain: Chain.MAINNET,
  rpc: {
    polygon: '',
    mainnet: '',
  },
}