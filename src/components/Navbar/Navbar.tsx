import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AccountDataType, accountActions, ReducersType } from '~/redux/stores';
import supabase, { usersChannel } from '~/supabase/config';
import { getRandomRolor } from '~/utils/account';
import AppMenu from './AppMenu';
import './navbar-style.css';

function Navbar() {
  const dispatch = useDispatch();
  const accountData = useSelector<ReducersType, AccountDataType>((state) => state.account);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      await usersChannel.subscribe();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log({ session });
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
        await usersChannel.track({
          name: 'Kiran',
          color: userData.color,
          id: accountData.tempId,
        });
        const { data, error } = await supabase.from('files').select().eq('owner_id', userData.id);
        if (error) {
          console.error(error);
          return;
        }
        console.log({ data });
        if (!data.length) {
          const { data, error } = await supabase
            .from('files')
            .insert({
              title: 'File One',
              owner_id: userData.id,
              content: { background: 'white' },
              description: 'file created as part of testing',
            })
            .select();
          console.log({ data });
          if (error) {
            console.error(error);
            return;
          }
          await supabase.auth.updateUser({
            data: {
              files: data.map((f) => f.id),
            },
          });
        }
      } else {
        await usersChannel.track({
          name: 'Anonymous',
          color: getRandomRolor(),
          id: accountData.tempId,
        });
      }
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
  };

  const handleUserClick = () => {
    setUserMenuOpen((prev) => !prev);
  };

  return (
    <Fragment>
      <AppMenu />
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
    </Fragment>
  );
}

export default Navbar;
