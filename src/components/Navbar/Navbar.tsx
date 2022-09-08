import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AccountDataType, accountActions } from '~/redux/stores';
import supabase, { usersChannel } from '~/supabase/config';
import { getRandomRolor } from '~/utils/account';
import './navbar-style.css';

function Navbar() {
  const dispatch = useDispatch();
  const accountData = useSelector<AccountDataType, AccountDataType>((state) => state);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      await usersChannel.subscribe();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      console.log({ session });
      if (session) {
        dispatch(
          accountActions.setAccount({ isLoggedIn: true, user: session.user?.user_metadata || {} }),
        );
        await usersChannel.track({
          name: 'Kiran',
          color: session.user.user_metadata.color,
          id: accountData.tempId,
        });
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
    }
  };

  const handleUserClick = () => {
    setUserMenuOpen((prev) => !prev);
  };

  return (
    <Fragment>
      <div className='account-nav'>
        {accountData.isLoggedIn ? (
          <button onClick={handleUserClick} className='user'>
            <div className='avatar' style={{ background: accountData.user.color }}>
              {accountData.user.name?.[0]}
            </div>
          </button>
        ) : (
          <button onClick={handleSignInClick}>Sign In</button>
        )}
        {isUserMenuOpen && (
          <div className='dropdown'>
            <button onClick={handleSignOut}>Sign Out</button>
          </div>
        )}
      </div>
    </Fragment>
  );
}

export default Navbar;
