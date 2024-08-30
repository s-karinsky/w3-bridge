import styled, { css } from 'styled-components'

export type ControlProps = {
  type?: string,
  width?: string | number,
  attach?: 'top' | 'bottom' | 'both',
  block?: boolean
}

const colorByType: Record<string, any> = {
  primary: {
    bg: '#007bff',
    bgHover: '#0056b3',
    color: '#f0f0f0',
  },
  secondary: {
    bg: '#434343',
    bgHover: '#333',
    color: '#f0f0f0',
  },
  success: {
    bg: '#28a745',
    bgHover: '#218838',
    color: '#f0f0f0',
  },
  failed: {
    bg: '#dc3545',
    bgHover: '#c82333',
    color: '#f0f0f0',
  },
  warning: {
    bg: '#ffc107',
    bgHover: '#e0a800',
    color: '#333'
  }
}

export const StyledControl = css<ControlProps>`
  --bgColor: ${({ type }) => colorByType[type!]?.bg || colorByType.secondary.bg};
  --color: ${({ type }) => colorByType[type!]?.color || colorByType.secondary.color};

  display: ${({ block }) => block ? 'block' : 'inline-block'};
  width: ${({ block, width }) => width || (block ? '100%' : 'auto')};
  background-color: var(--bgColor);
  color: #f0f0f0;
  box-shadow: var(--shadow);
  padding: 8px 16px;
  font-family: 'Roboto Mono', monospace;
  font-size: 1.6rem;
  height: 52px;
  border: none;
  box-sizing: border-box;
  cursor: pointer;
  transition: 0.3s ease;
  transition-property: background-color, box-shadow;

  &:not(:first-child) {
    --shadow: 0 0 2px 2px #00000011;
  }

  &:active,
  &:focus {
    outline: none;
    --shadow: 0 0 1px 1px #ffffff22;
  }

  &:hover {
    --bgColor: ${({ type }) => colorByType[type!]?.bgHover || colorByType.secondary.bgHover};
    --shadow: 0 0 1px 1px #00000033;
  }

  border-radius: ${({ attach }) => {
    if (!attach) return '8px';
    if (attach === 'both') return '0';
    if (attach === 'top') return '0 0 8px 8px';
    if (attach === 'bottom') return '8px 8px 0 0';
  }};

  &:has(+ &) {
    position: relative;
    z-index: 10;
  }
`


const Button = styled.button<ControlProps>`

  &:hover {

  }

  ${StyledControl}
`

export default Button