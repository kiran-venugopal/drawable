import { HTMLProps } from 'react';
import './input-style.css';

export type InputPropsType = {
  label: string;
  isOptional?: boolean;
  error?: string;
} & HTMLProps<HTMLInputElement>;

function Input({ label, isOptional, placeholder, error, ...rest }: InputPropsType) {
  return (
    <div className={`field ${error ? 'error' : ''}`}>
      <label htmlFor='#file-name'>
        {label} {isOptional && <span>(optional)</span>}
      </label>
      <input placeholder={placeholder} {...rest} />
      {error && <div className='error-message'>{error}</div>}
    </div>
  );
}

export default Input;
