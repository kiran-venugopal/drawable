import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FilesStateType } from '~/redux/filesSlice';
import { AccountDataType, accountActions, ReducersType, filesActions } from '~/redux/stores';
import { createUser, fetchFiles } from '~/supabase/api';
import supabase, { realtimeUser } from '~/supabase/config';
import { getRandomRolor, updateActiveFile } from '~/utils/account';
import AccountMenu from './AccountMenu';
import AppMenu from './AppMenu';
import FileName from './FileName';
import './navbar-style.css';

function Navbar() {
  const dispatch = useDispatch();
  const accountData = useSelector<ReducersType, AccountDataType>((state) => state.account);
  const { name, color, avatar_url } = accountData.user;

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log(session);
      // user is logged in
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
        const { data, error } = await fetchFiles(userData.id);
        if (!data?.length) {
          createUser(
            userData.name,
            userData.email,
            userData.color,
            userData.avatar_url,
            userData.id,
          );
        }

        console.log({ files: data });

        if (error) {
          console.error(error);
          return;
        }

        let fileData: Partial<FilesStateType> = { files: data };

        // selecting the default file
        fileData = updateActiveFile(fileData);

        dispatch(filesActions.setFiles(fileData));

        if (error) {
          console.error(error);
          return;
        }
      }
      // user is not logged in
      else {
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

  return (
    <Fragment>
      <AppMenu />
      <FileName />
      <AccountMenu
        name={name || 'A'}
        userColor={color || ''}
        isLoggedIn={accountData.isLoggedIn}
        avatarUrl={avatar_url}
      />
    </Fragment>
  );
}

export default Navbar;
