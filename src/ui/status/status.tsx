import styled from 'styled-components'

const Status = styled.div<{ value?: null | string, height?: string | number, attach?: 'top' | 'bottom' | 'both' }>`
  background: ${({ value }) => !value ? 'transparent' : 'linear-gradient(to right, #EF2D56 0, #DCED31 50%, #0CCE6B 100%)'};
  background-position: ${({ value }) => {
    if (!value) return '0 0';
    switch (value) {
      case 'error':
        return '0 0';
      
      case 'pending':
        return '50% 0';
    
      case 'success':
        return '99.9% 0';
    }
  }};
  height: ${({ height }) => typeof height === 'number' ? `${height}px` : (height || '8px')};
  border-radius: ${({ attach }) => {
    if (!attach || attach === 'both') return 0;
    if (attach === 'top') return '0 0 8px 8px';
    if (attach === 'bottom') return '8px 8px 0 0';
  }};
  background-size: 400% auto;
  box-sizing: border-box;
  border: 1px solid #ffffff33;
  box-shadow: 0 0 2px 2px #00000033;
  transition: 0.3s ease;
  transition-property: background-color, background-position, border-color, box-shadow;
`

export default Status