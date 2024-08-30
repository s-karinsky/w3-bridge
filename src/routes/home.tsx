
import { useCallback, useContext, useMemo, useState } from 'react'
import { AuthContext } from '@/App'
import Button from '@/ui/button'
import { Status } from '@/ui/ui'
import styled from 'styled-components'
import { ControlProps, StyledControl } from '@/ui/button/button'
import { isValidAddress } from '@/utils'


const Main = styled.main`
  display: flex;
  width: 400px;
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

const Ol = styled.ol`
  padding-left: 0;
  margin-top: 0;
  font-size: 1.6rem;
  line-height: 4rem;
  width: 600px;
`

const Li = styled.li<{ current?: boolean, disabled?: boolean }>`
  position: relative;
  margin-bottom: 10px;
  pointer-events: ${({ disabled }) => disabled ? 'none' : 'auto'};
  opacity: ${({ disabled }) => disabled ? 0.3 : 1};

  &:before {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(-450%, -50%);
    content: "${({ current }) => current ? '>' : ''}";
  }
`

const Dropdown = styled.select<ControlProps>`
  ${StyledControl}
`

const Input = styled.input<ControlProps>`
  ${StyledControl}
  box-shadow: inset 0 0 2px 2px #00000033;
  background-color: #ccc;
  color: #000000;
  cursor: auto;

  &:hover {
    background-color: #ccc;
    border-color: #999;
  }
`

const Log = styled.div`
  background-color: #000;
  color: #f0f0f0;
  display: block;
  padding: 10px;
  font-size: 1rem;
  line-height: 1.5rem;
`

const spinner = <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><rect width="10" height="10" x="1" y="1" fill="currentColor" rx="1"><animate id="svgSpinnersBlocksShuffle20" fill="freeze" attributeName="x" begin="0;svgSpinnersBlocksShuffle27.end" dur="0.2s" values="1;13" /><animate id="svgSpinnersBlocksShuffle21" fill="freeze" attributeName="y" begin="svgSpinnersBlocksShuffle24.end" dur="0.2s" values="1;13" /><animate id="svgSpinnersBlocksShuffle22" fill="freeze" attributeName="x" begin="svgSpinnersBlocksShuffle25.end" dur="0.2s" values="13;1" /><animate id="svgSpinnersBlocksShuffle23" fill="freeze" attributeName="y" begin="svgSpinnersBlocksShuffle26.end" dur="0.2s" values="13;1" /></rect><rect width="10" height="10" x="1" y="13" fill="currentColor" rx="1"><animate id="svgSpinnersBlocksShuffle24" fill="freeze" attributeName="y" begin="svgSpinnersBlocksShuffle20.end" dur="0.2s" values="13;1" /><animate id="svgSpinnersBlocksShuffle25" fill="freeze" attributeName="x" begin="svgSpinnersBlocksShuffle21.end" dur="0.2s" values="1;13" /><animate id="svgSpinnersBlocksShuffle26" fill="freeze" attributeName="y" begin="svgSpinnersBlocksShuffle22.end" dur="0.2s" values="1;13" /><animate id="svgSpinnersBlocksShuffle27" fill="freeze" attributeName="x" begin="svgSpinnersBlocksShuffle23.end" dur="0.2s" values="13;1" /></rect></svg>

const Home = () => {
  const context = useContext(AuthContext)
  const { contract, isAuth, isLoggingIn } = context
  const [ direction, setDirection ] = useState<string>('0')
  const [ recepient, setRecepient ] = useState<string>('')
  const [ amount, setAmount ] = useState<string>('')
  const [ transaction, setTransaction ] = useState<string>('')
  const [ error, setError ] = useState<any>('')
  const [ progress, setProgress ] = useState<boolean>(false)

  const handleChangeContent = (e: any) => {
    const key = e.key
    if (key === 'Enter') {
      e.preventDefault()
      e.target.blur()
    }
  }


  const contractMethod = useCallback((method: string, ...args: any[]) => {
    return async (e: any) => {
      setProgress(true)
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
            setTransaction(hash)
          })
          .on('confirmation', function (confirmationNumber: any, receipt: any) {
            console.log('confirmation', confirmationNumber, receipt);
            setProgress(false)
          })
          .on('receipt', function (receipt: any) {
            console.log(receipt)
          })
          .on('error', function (error: any, receipt: any) {
            setError(error)
          });
      } catch (error) {
        console.error('Error sending transaction:', error);
      }
    };
  }, [contract])

  const currentStep = useMemo(() => {
    if (!context.account) {
      return 1
    } else if (direction === '0') {
      return 2
    } else if (!recepient || !isValidAddress(recepient)) {
      return 3
    } else if (!amount || parseFloat(amount) <= 0) {
      return 4
    } else {
      return 5
    }
  }, [context.account, direction, recepient, amount])
  
  return (
    <>
      <Main>
        <Ol>
          <Li current={currentStep === 1}>
            {!isAuth ? <>
              <Button
                width='150px'
                style={{ fontSize: '1.6rem' }}
                // @ts-ignore
                onClick={() => context.connect && context.connect?.().then(() => console.log('connected'))}
              >
                Connect
              </Button> to MetaMask
            </> : <div style={{ whiteSpace: 'nowrap '}}>
              <Button width='150px' type='success' style={{ paddingLeft: 0, paddingRight: 0, marginRight: 20  }}>
                Connected
              </Button>
              {context.account}
            </div>}
          </Li>
          <Li disabled={currentStep < 2} current={currentStep === 2}>
            <Dropdown value={direction} onChange={e => setDirection(e.target.value)}>
              <option value='0'>Select direction</option>
              <option value='1'>Network 1 → Network 2</option>
              <option value='2'>Network 2 → Network 1</option>
            </Dropdown>
          </Li>
          <Li disabled={currentStep < 3} current={currentStep === 3}>
            <Input placeholder='Recepient wallet' onChange={e => setRecepient(e.target.value)} block />
          </Li>
          <Li disabled={currentStep < 4} current={currentStep === 4} style={{ paddingTop: 5 }}>
            <Input width='358px' type='number' onChange={e => setAmount(e.target.value)} placeholder='Amount' min="0.00001" step="0.00001" />
          </Li>
          <Li disabled={currentStep < 5} current={currentStep === 5}>
            <Button width='150px' type={currentStep === 5 ? 'success' : undefined} onClick={contractMethod('transferFrom', recepient, amount)}>
              {progress ? spinner : 'Transfer'}
            </Button>
            {error ? <span style={{ color: '#dc3545' }}>{error}</span> : transaction}
          </Li>
        </Ol>
      </Main>
    </>
  )
}

export default Home