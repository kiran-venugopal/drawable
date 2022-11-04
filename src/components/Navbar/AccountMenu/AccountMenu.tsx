import { Fragment, useState } from 'react';
import { useDispatch } from 'react-redux';
import { accountActions } from '~/redux/stores';
import supabase, { realtimeUser } from '~/supabase/config';
import SignIn from '../SignIn/SignIn';

export type AccountMenuProps = {
  name: string;
  userColor: string;
  avatarUrl?: string;
  isLoggedIn: boolean;
};

const getBackground = (color: string, imgUrl?: string) => {
  if (imgUrl) {
    return `url(${imgUrl})`;
  }
  return color;
};

function AccountMenu({ name, userColor, avatarUrl, isLoggedIn }: AccountMenuProps) {
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const dispatch = useDispatch();

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
    <div className='account-nav'>
      {isLoggedIn ? (
        <Fragment>
          <button onClick={handleUserClick} className='user'>
            <div className='avatar' style={{ background: getBackground(userColor, avatarUrl) }}>
              {!avatarUrl && name[0]}
            </div>
          </button>
          {isUserMenuOpen && (
            <div className='dropdown'>
              <button onClick={handleSignOut}>Sign Out</button>
            </div>
          )}
        </Fragment>
      ) : (
        <SignIn />
      )}
    </div>
  );
}

export default AccountMenu;
