import { Fragment, useState } from 'react';
import Divider from '~/components/Common/Divider';
import supabase from '~/supabase/config';
import GoogleIcon from '../../../icons/google.svg';
import LoginForm from './LoginForm';
import './signin-style.css';
import SignUpForm from './SignUpForm';

const handleSignInClick = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });
  console.log({ data, error });
};

function SignIn() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const toggleIsLogin = () => setIsLogin((prev) => !prev);

  const toggleIsOpen = () => setIsOpen((prev) => !prev);

  return (
    <Fragment>
      <button className='secondary' onClick={toggleIsOpen}>
        Sign In
      </button>
      {isOpen && (
        <div className='dropdown auth'>
          {isLogin ? (
            <LoginForm onCreateAccountClick={toggleIsLogin} />
          ) : (
            <SignUpForm onLoginClick={toggleIsLogin} />
          )}
          <Divider text='OR' />
          <div className='sign-in'>
            <button className='gauth icon secondary' onClick={handleSignInClick}>
              <GoogleIcon />
              <span className='label'>Sign In with Google</span>
            </button>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default SignIn;
