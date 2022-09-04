import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AccountDataType, actions } from '~/redux/stores';
import supabase from '~/supabase/config';
import './navbar-style.css';

function Navbar() {
  const dispatch = useDispatch();
  const accountData = useSelector<AccountDataType, AccountDataType>((state) => state);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const session = supabase.auth.session();
      console.log(session);
      if (session) {
        dispatch(actions.setAccount({ isLoggedIn: true, user: session.user?.user_metadata || {} }));
      }
    };
    checkAuth();
  }, []);

  const handleSignInClick = async () => {
    const { user, session, error } = await supabase.auth.signIn({
      provider: 'google',
    });
    console.log({ user, session, error });
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
