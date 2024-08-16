import { useState, useEffect, createContext, useMemo } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Web3 from 'web3'
import { abi, address } from '@config/contract'

// Components
import Layout from '@components/layout'
import Home from '@routes/home'
import PageNotFound from '@routes/not-found'
// import SmartContract from '@components/SmartContract'
import './App.css'

type AuthContextProps = {
  isAuth: boolean
  account?: any
  connectError?: string | null
  isLoggingIn?: boolean
  contract?: any
  connect?: () => any
}


export const AuthContext = createContext<AuthContextProps>({
  isAuth: false,
})

function App() {
  const web3 = new Web3(window.ethereum)
  
  const [isAuth, setIsAuth] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [ethWallet, setEthWallet,] = useState<boolean | null>(null)
  const [account, setAccount] = useState<string | string[] | null>(null)
  const [connectError, setConnectError] = useState<string | null>(null)


  const contextVal: AuthContextProps = {
    isAuth,
    connectError,
    account,
    isLoggingIn,
    connect: connectWallet,
    contract: new web3.eth.Contract(abi, address)
  }

  async function checkWalletConnection() {
    const ethereum = window.ethereum;
    setEthWallet((!ethereum ? false : true));

    // If installed, get user's accounts.
    if (ethereum) {
      const userAcc = await web3.eth.getAccounts();

      if (userAcc.length > 0) {
        setAccount(userAcc[0]);
        setIsAuth(true);
      } else {
        if (isAuth) {
          setAccount(null);
          setIsAuth(false);
        }
      }
    }
  }

  async function connectWallet() {
    try {
      // If MetaMask is not installed, throw error.
      if (!ethWallet) {
        const errMsg = "Please install MetaMask first";
        setConnectError(errMsg);
        return;
      }
      setIsLoggingIn(true)
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      setIsAuth(true);

      // Reset error
      if (connectError !== null) { setConnectError(null); }
      setIsLoggingIn(false)
      // @ts-ignore
      window.location.reload(false)
      return
    } catch (error: any) {
      setConnectError(error.message);
      console.error(error);
      return
    }
  }

  useEffect(() => {
    if (ethWallet === null) { checkWalletConnection(); }
  }, [ethWallet])

  return (
    <>
      <AuthContext.Provider value={contextVal}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Layout />}>
              <Route index element={<Home />} />
              {/* <Route path='smart-contract' element={<SmartContract />} /> */}
              <Route path='*' element={<PageNotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </>
  )
}

export default App