import Logo from '../../icons/logo.svg';
import Tab, { Panel } from '../Tab';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Files from './Files';
import { ReducersType } from '~/redux/stores';
import Dialog from '../Dialog';
import Branding from '../Branding/Branding';
import CreateFile from './MenuOptions/CreateFile/CreateFile';

function AppMenu() {
  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const accountData = useSelector((state: ReducersType) => state.account);

  const closeDialog = () => setIsOpen(false);

  if (!accountData.isLoggedIn) {
    return (
      <div className='app-menu'>
        <Logo />
      </div>
    );
  }

  return (
    <div className='app-menu '>
      <button onClick={() => setIsOpen((prev) => !prev)} className='logo'>
        <Logo />
      </button>
      <Dialog isOpen={isOpen} onClose={closeDialog}>
        <div className='menu'>
          <Branding />
          <Tab selectedIndex={index} onSelect={(i) => setIndex(i)}>
            <Panel title='All Files'>
              <Files onFileClick={closeDialog} />
            </Panel>
            <Panel title='Create New'>
              <CreateFile onSuccess={closeDialog} />
            </Panel>
          </Tab>
        </div>
      </Dialog>
    </div>
  );
}

export default AppMenu;
