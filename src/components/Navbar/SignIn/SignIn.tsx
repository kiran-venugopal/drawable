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

const STATES = {
  INIT: '',
  SIGNUP_SUCCESS: 'Your account has been successfully created! Login to continue',
};

function SignIn() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [status, setStatus] = useState<string>(STATES.INIT);

  const toggleIsLogin = () => setIsLogin((prev) => !prev);

  const toggleIsOpen = () => setIsOpen((prev) => !prev);

  const handleSignUpSuccess = () => {
    setIsLogin(true);
    setStatus(STATES.SIGNUP_SUCCESS);
  };

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
            <SignUpForm onLoginClick={toggleIsLogin} onSignUpSuccess={handleSignUpSuccess} />
          )}
          {status === STATES.SIGNUP_SUCCESS && <div className='success-message'>{status}</div>}
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
