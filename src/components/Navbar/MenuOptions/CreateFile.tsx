import { FormEventHandler } from 'react';
import { useDispatch } from 'react-redux';
import { filesActions } from '~/redux/stores';
import { createFile } from '~/supabase/api';
import './create-file-style.css';

export type CreateFileProps = {
  onSuccess(): void;
};

function CreateFile({ onSuccess }: CreateFileProps) {
  const dispatch = useDispatch();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const nameEl = target.querySelector('#file-name') as HTMLInputElement;
    const descriptionEl = target.querySelector('#file-description') as HTMLInputElement;
    console.log(nameEl.value, descriptionEl.value);
    const result = await createFile(nameEl.value, descriptionEl.value);
    if (result.success) {
      dispatch(filesActions.pushFiles(result.data));
      onSuccess();
    }
  };

  return (
    <form className='create-file' onSubmit={handleSubmit}>
      <div className='field'>
        <label htmlFor='#file-name'>File name</label>
        <input id='file-name' name='file-name' type='text' placeholder='' />
      </div>
      <div className='field'>
        <label htmlFor='#file-name'>
          File description <span>(optional)</span>{' '}
        </label>
        <input id='file-description' name='file-name' type='text' placeholder='' />
      </div>
      <div className='actions'>
        <button className='primary'>Create</button>
      </div>
    </form>
  );
}

export default CreateFile;
