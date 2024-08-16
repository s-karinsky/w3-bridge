import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import Web3 from 'web3'

type AuthContextProps = {
  isAuth: boolean
  account?: any
  connectError?: string | null
  connect?: () => any
}

export const AuthContext = createContext<AuthContextProps>({
  isAuth: false,
})

const web3 = new Web3(Web3.givenProvider)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ isAuth, setIsAuth ] = useState(false)
  const [ connected, setConnected ] = useState<boolean | null>(null)
  const [ account, setAccount ] = useState<string | string[] | null>(null)
  const [ connectError, setConnectError ] = useState<string | null>(null)

  
  const checkWalletConnection = useCallback(async () => {
    const ethereum = window.ethereum
    setConnected(!!ethereum)
    if (ethereum) {
      const accounts = await web3.eth.getAccounts()
      if (accounts.length > 0) {
        setAccount(accounts[0])
        setIsAuth(true)
      } else {
        if (isAuth) {
          setAccount(null)
          setIsAuth(false)
        }
      }
    }
  }, [])

  const connectWallet = async () => {
    let provider = window.ethereum;
    const web3 = new Web3(window.ethereum)
    if (typeof provider !== 'undefined') {
      provider.request({ method: 'eth_requestAccounts' })
        .then((accounts: string[]) => {
          setAccount(accounts)
        })
        .catch((err: any) => {
          setConnectError(err.message)
        })
    }
  }

  /* useEffect(() => {
    if (connected === false) {
      console.log('checking wallet connection');
      checkWalletConnection()
    }
  }, [connected]) */

  const value = useMemo(() => ({
    isAuth,
    account,
    connectError,
    connect: connectWallet
  }), [isAuth, account, connectError, connectWallet])

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useWallet must be used within AuthProvider')
  }
  return {
    isAuth: context?.isAuth,
    account: context?.account,
    connectError: context?.connectError,
    connect: context?.connect,
  }
}