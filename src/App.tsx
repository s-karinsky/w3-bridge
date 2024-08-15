
import W3Provider from '@components/w3-provider'
import IndexPage from './routes'

export default function App() {
  return (
    <>
      <W3Provider />
      <div style={{ display: 'flex', flexFlow: 'wrap', fontFamily: 'sans-serif' }}>
        <IndexPage />
      </div>
    </>
  )
}
