
import { AuthContext } from '@/App';
import Button from '@/ui/button';
import { Status } from '@/ui/ui';
import { useContext } from 'react';
import styled from 'styled-components';


const Main = styled.main`
  display: flex;
  width: 350px;
  height: 100vh;
  margin: 0 auto;
  align-items: stretch;
  justify-content: center;
  flex-direction: column;

`

const Home = () => {
  const context = useContext(AuthContext)
  const { isAuth, isLoggingIn } = context

  const handleChangeContent = (e: any) => {
    const key = e.key
    if (key === 'Enter') {
      e.preventDefault()
      e.target.blur()
    }
    
  }

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
          >
            getByIndex(<span style={{ borderBottom: '1px dashed #fff', minWidth: '5px', display: 'inline-block' }} onKeyDown={handleChangeContent} contentEditable>0</span>)
          </Button>
          <Button
            attach='top'
          >
            push("<span style={{ borderBottom: '1px dashed #fff', minWidth: '5px', display: 'inline-block' }} onKeyDown={handleChangeContent} contentEditable>str</span>")
          </Button>
        </>}
        {/* {!context.connect ? (
          <p className="lead">
            Please install MetaMask wallet to continue.
          </p>
        ) : (
          <>
            <p className="lead">
              Please connect your MetaMask wallet to continue.
            </p>
          </>
        )}

        {context.connectError !== null && (
          <p className="lead error-text">
            Error: {context.connectError}
          </p>
        )} */}
      </Main>
    </>
  )
}

export default Home