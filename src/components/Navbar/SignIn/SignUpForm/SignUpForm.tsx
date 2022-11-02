import { FormEventHandler, useState } from 'react';
import Input from '~/components/Common/Input';
import { createUser } from '~/supabase/api';
import supabase from '~/supabase/config';
import { getRandomRolor } from '~/utils/account';

const initialErrors = {};

export type SignUpFormProps = {
  onLoginClick(): void;
  onSignUpSuccess(): void;
};

function SignUpForm({ onLoginClick, onSignUpSuccess }: SignUpFormProps) {
  const [errors, setErrors] = useState<Record<any, string>>(initialErrors);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setErrors({});
    const target = e.target as HTMLElement;
    const emailEl = target.querySelector('#email') as HTMLInputElement;
    const passEl = target.querySelector('#password') as HTMLInputElement;
    const cpassEl = target.querySelector('#cpassword') as HTMLInputElement;
    const nameEl = target.querySelector('#name') as HTMLInputElement;

    if (passEl.value !== cpassEl.value) {
      setErrors({ cpassword: "Passwords don't match" });
      return;
    }

    const color = getRandomRolor();
    const { error, data } = await supabase.auth.signUp({
      email: emailEl.value,
      password: passEl.value,
      options: {
        data: {
          name: nameEl.value,
          color,
        },
      },
    });
    if (error) {
      console.error(error);
      setErrors({ general: error.message });
      return;
    }

    const user = data.user;
    if (!user?.id) {
      console.error('No user id', { user });
      return;
    }
    createUser(
      nameEl.value,
      emailEl.value,
      color,
      user.user_metadata.avatar_url || '',
      user?.id,
    ).catch((err) => console.error(err));
    onSignUpSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className='auth-form'>
      <div className='title'>Create Account</div>
      <Input required label='Email' name='email' id='email' type='email' />
      <Input required label='Password' name='password' type='password' id='password' />
      <Input
        error={errors.cpassword}
        required
        label='Confirm password'
        name='cpassword'
        type='password'
        id='cpassword'
      />

      <Input required label='Your Name' name='name' id='name' />
      {errors.general && <div className='error-message'>{errors.general}</div>}
      <div className='actions'>
        <button onClick={onLoginClick} type='button' className='link'>
          Login with existing account
        </button>
        <button className='primary'>Sign Up</button>
      </div>
    </form>
  );
}

export default SignUpForm;
