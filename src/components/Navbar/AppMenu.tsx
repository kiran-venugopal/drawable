import Logo from '../../icons/logo.svg';
import DownArrow from '../../icons/darrow.svg';
import Tab, { Panel } from '../Tab';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Files from './Files';
import { ReducersType } from '~/redux/stores';
import Dialog from '../Dialog';
import Branding from '../Branding/Branding';
import CreateFile from './MenuOptions/CreateFile';

function AppMenu() {
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const accountData = useSelector((state: ReducersType) => state.account);

  if (!accountData.isLoggedIn) {
    return (
      <div className='app-menu'>
        <Logo />
      </div>
    );
  }

  return (
    <div className='app-menu'>
      <button onClick={() => setIsOpen((prev) => !prev)} className='logo'>
        <Logo />
        <DownArrow />
      </button>
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className='menu'>
          <Branding />
          <Tab selectedIndex={index} onSelect={(i) => setIndex(i)}>
            <Panel title='All Files'>
              <Files />
            </Panel>
            <Panel title='Create New'>
              <CreateFile onSuccess={() => setIsOpen(false)} />
            </Panel>
          </Tab>
        </div>
      </Dialog>
    </div>
  );
}

export default AppMenu;
