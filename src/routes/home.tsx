
import { useCallback, useContext } from 'react'
import { AuthContext } from '@/App'
import Button from '@/ui/button'
import { Status } from '@/ui/ui'
import styled from 'styled-components'


const Main = styled.main`
  display: flex;
  width: 350px;
  height: 100vh;
  margin: 0 auto;
  align-items: stretch;
  justify-content: center;
  flex-direction: column;
`

const Argument = styled.span`
  border-bottom: 1px dashed #fff;
  min-width: 10px;
  display: inline-block;
`

const Arguments = ({ children }: { children: React.ReactNode }) => (<Argument
  onKeyDown={(e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.target.blur()
    }
  }}
  children={children}
  contentEditable  
/>)

const Home = () => {
  const context = useContext(AuthContext)
  const { contract, isAuth, isLoggingIn } = context

  const handleChangeContent = (e: any) => {
    const key = e.key
    if (key === 'Enter') {
      e.preventDefault()
      e.target.blur()
    }
  }


  const contractMethod = useCallback((method: string, ...args: any[]) => {
    return async (e: any) => {
      e.preventDefault();

      try {
        // const networkType = await contract.methods.web3.eth.net.getNetworkType();
        const isEIP1559Supported = false // networkType !== 'private' && networkType !== 'testnet';

        const txParams = {
          from: context.account,
          ...(isEIP1559Supported ? { maxFeePerGas: '5000000000', maxPriorityFeePerGas: '1000000000' } : { gasPrice: '5000000000' })
        };

        contract.methods[method](...args).send(txParams)
          .on('transactionHash', function (hash: any) {
            console.log('hash', hash);
          })
          .on('confirmation', function (confirmationNumber: any, receipt: any) {
            console.log('confirmation', confirmationNumber, receipt);
          })
          .on('receipt', function (receipt: any) {
            console.log(receipt);
          })
          .on('error', function (error: any, receipt: any) {
            console.log('error', error, receipt);
          });
      } catch (error) {
        console.error('Error sending transaction:', error);
      }
    };
  }, [contract]);

  return (
    <>
      <Main>
        <Button
          attach='bottom'
          style={{ height: 60, fontSize: '1.5em', lineHeight: '0.9em' }}
          // @ts-ignore
          onClick={() => context.connect && context.connect?.().then(() => console.log('connected'))}
          block
        >
          {!isAuth ? 'Connect to MetaMask' : <>Account<br /><span style={{ fontSize: '12px' }}>{context.account}</span></>}
        </Button>
        <Status
          attach={isAuth ? 'both' : 'top'}
          style={{ height: 10 }}
          value={isAuth ? 'success' : (isLoggingIn ? 'error' : null)}
        />
        {isAuth && <>
          <Button
            attach='both'
            onClick={contractMethod('getByIndex', 0)}
          >
            getByIndex(<Arguments>0</Arguments>)
          </Button>
          <Button
            attach='top'
            onClick={contractMethod('push', 'str')}
          >
            push("<span style={{ borderBottom: '1px dashed #fff', minWidth: '10px', display: 'inline-block' }} onKeyDown={handleChangeContent} contentEditable>str</span>")
          </Button>
        </>}
      </Main>
    </>
  )
}

export default Home