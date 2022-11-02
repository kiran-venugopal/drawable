import { FormEventHandler, useState } from 'react';
import { useDispatch } from 'react-redux';
import Input from '~/components/Common/Input';
import { FilesStateType } from '~/redux/filesSlice';
import { accountActions, filesActions } from '~/redux/stores';
import { fetchFiles } from '~/supabase/api';
import supabase from '~/supabase/config';
import { updateActiveFile } from '~/utils/account';

const initialErrors = {};

export type LoginFormPropsType = {
  onCreateAccountClick(): void;
};

function LoginForm({ onCreateAccountClick }: LoginFormPropsType) {
  const [errors, setErrors] = useState<Record<any, string>>(initialErrors);
  const dispatch = useDispatch();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setErrors({});
    const target = e.target as HTMLElement;
    const emailEl = target.querySelector('#email') as HTMLInputElement;
    const passEl = target.querySelector('#password') as HTMLInputElement;
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailEl.value,
      password: passEl.value,
    });
    if (error) {
      console.error({ error }, error.message);
      setErrors({ general: error.message });
      return;
    }
    const user = data.user?.user_metadata;
    const userId = data.user?.id;
    dispatch(
      accountActions.setAccount({
        isLoggedIn: true,
        user: {
          name: user?.name,
          color: user?.color,
          id: data.user?.id,
        },
      }),
    );

    if (!userId) {
      console.error('No user id found!', { data });
      return;
    }

    const { data: files } = await fetchFiles(userId);
    const fileData = updateActiveFile({ files });
    dispatch(filesActions.setFiles(fileData));
  };

  return (
    <form onSubmit={handleSubmit} className='auth-form'>
      <div className='title'>Sign In</div>
      <Input required label='Email' name='email' id='email' />
      <Input required label='Password' name='password' type='password' id='password' />
      {errors.general && <div className='error-message'>{errors.general}</div>}
      <div className='actions'>
        <button onClick={onCreateAccountClick} type='button' className='link'>
          Create new account
        </button>
        <button className='primary'>Login</button>
      </div>
    </form>
  );
}

export default LoginForm;
