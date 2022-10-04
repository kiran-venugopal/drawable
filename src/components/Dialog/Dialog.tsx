import { ReactElement, useRef } from 'react';
import useContainerClick from 'use-container-click';
import './dialog-style.css';

export type DialogPropsType = {
  children: ReactElement;
  isOpen: boolean;
  onClose?(): void;
};

function Dialog({ children, onClose, isOpen }: DialogPropsType) {
  const ref = useRef();
  useContainerClick(ref as any, onClose);

  if (!isOpen) return null;
  return (
    <div className='dialog'>
      <div ref={ref as any} className='dialog-content'>
        {children}
      </div>
    </div>
  );
}

export default Dialog;
