import styled from 'styled-components'

const Button = styled.button <{ attach?: 'top' | 'bottom' | 'both', block?: boolean }>`
  display: ${({ block }) => block ? 'block' : 'inline-block'};
  width: ${({ block }) => block ? '100%' : 'auto'};;
  background-color: #434343;
  color: #f0f0f0;
  box-shadow: 0 0 2px 2px #00000033;
  padding: 10px 20px;
  font-size: 1.2dvw;;
  border: none;
  cursor: pointer;
  transition: 0.3s ease;
  transition-property: background-color, box-shadow;

  &:active,
  &:focus {
    outline: none;
    box-shadow: 0 0 1px 1px #ffffff22;
  }

  &:hover {
    background-color: #333;
    box-shadow: 0 0 1px 1px #00000033;
  }

  border-radius: ${({ attach }) => {
    if (!attach) return '8px';
    if (attach === 'both') return '0';
    if (attach === 'top') return '0 0 8px 8px';
    if (attach === 'bottom') return '8px 8px 0 0';
  }};
`

export default Button