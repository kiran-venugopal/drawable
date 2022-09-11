import Logo from '../../icons/logo.svg';
import DownArrow from '../../icons/darrow.svg';
import Tab, { Panel } from '../Tab';
import { useRef, useState } from 'react';
import useContainerClick from 'use-container-click';
import { useSelector } from 'react-redux';
import Files from './Files';
import { ReducersType } from '~/redux/stores';

function AppMenu() {
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const accountData = useSelector((state: ReducersType) => state.account);
  const ref = useRef();
  useContainerClick(ref as any, () => setIsOpen(false));

  if (!accountData.isLoggedIn) {
    return (
      <div className='app-menu'>
        <Logo />
      </div>
    );
  }

  return (
    <div ref={ref as any} className='app-menu'>
      <button onClick={() => setIsOpen((prev) => !prev)} className='logo'>
        <Logo />
        <DownArrow style={{ transform: `rotate(${isOpen ? 180 : 0}deg)` } as any} />
      </button>
      {isOpen && (
        <div className='menu dropdown'>
          <Tab selectedIndex={index} onSelect={(i) => setIndex(i)}>
            <Panel title='Files'>
              <Files />
            </Panel>
          </Tab>
        </div>
      )}
    </div>
  );
}

export default AppMenu;
