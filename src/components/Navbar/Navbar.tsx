import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FilesStateType } from '~/redux/filesSlice';
import { AccountDataType, accountActions, ReducersType, filesActions } from '~/redux/stores';
import { fetchFiles } from '~/supabase/api';
import supabase, { realtimeUser } from '~/supabase/config';
import { getRandomRolor } from '~/utils/account';
import AppMenu from './AppMenu';
import FileName from './FileName';
import './navbar-style.css';

function Navbar() {
  const dispatch = useDispatch();
  const accountData = useSelector<ReducersType, AccountDataType>((state) => state.account);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log(session);
      if (session) {
        const userData = session.user?.user_metadata || {};
        userData.id = session.user.id;
        if (!userData.color) {
          userData.color = getRandomRolor();
          supabase.auth.updateUser({
            data: {
              color: userData.color,
            },
          });
        }
        dispatch(accountActions.setAccount({ isLoggedIn: true, user: userData || {} }));
        // start broadcasting pointer movement
        realtimeUser.setUser({
          name: 'Kiran',
          color: userData.color,
          id: accountData.tempId,
        });

        // fetching user files
        const { data, error } = await fetchFiles(userData.files);

        console.log({ files: data });

        if (error) {
          console.error(error);
          return;
        }

        const fileData: Partial<FilesStateType> = { files: data };

        // selecting the default file
        if (data.length) {
          fileData.activeFile = data[0].id;
          window.localStorage.setItem('active_file', data[0].id);
        } else {
          fileData.activeFile = 'local';
          window.localStorage.setItem('active_file', 'local');
        }

        dispatch(filesActions.setFiles(fileData));

        if (error) {
          console.error(error);
          return;
        }
      } else {
        realtimeUser.setUser({
          name: 'Anonymous',
          color: getRandomRolor(),
          id: accountData.tempId,
        });
        window.localStorage.setItem('active_file', 'local');
        dispatch(filesActions.setFiles({ activeFile: 'local' }));
      }

      dispatch(filesActions.setFilesLoading(false));
    };
    checkAuth();
  }, []);

  const handleSignInClick = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    console.log({ data, error });
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
      return;
    }
    dispatch(
      accountActions.setAccount({
        isLoggedIn: false,
        user: {},
      }),
    );
    await realtimeUser.signOut();
  };

  const handleUserClick = () => {
    setUserMenuOpen((prev) => !prev);
  };

  return (
    <div className='navbar'>
      <AppMenu />
      <FileName />
      <div className='account-nav'>
        {accountData.isLoggedIn ? (
          <Fragment>
            <button onClick={handleUserClick} className='user'>
              <div className='avatar' style={{ background: accountData.user.color }}>
                {accountData.user.name?.[0]}
              </div>
            </button>
            {isUserMenuOpen && (
              <div className='dropdown'>
                <button onClick={handleSignOut}>Sign Out</button>
              </div>
            )}
          </Fragment>
        ) : (
          <button onClick={handleSignInClick}>Sign In</button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
