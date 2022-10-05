import { FormEventHandler } from 'react';
import { useDispatch } from 'react-redux';
import { FileType } from '~/redux/filesSlice';
import { filesActions } from '~/redux/stores';
import { createFile } from '~/supabase/api';
import './create-file-style.css';

export type CreateFileProps = {
  onSuccess(createdFile?: FileType): void;
  content?: any;
};

function CreateFile({ onSuccess, content }: CreateFileProps) {
  const dispatch = useDispatch();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const nameEl = target.querySelector('#file-name') as HTMLInputElement;
    const descriptionEl = target.querySelector('#file-description') as HTMLInputElement;
    console.log(nameEl.value, descriptionEl.value);
    const result = await createFile(nameEl.value, descriptionEl.value, content);
    if (result.success) {
      dispatch(filesActions.pushFiles(result.data));
      onSuccess(result?.data?.[0] as FileType);
    }
  };

  return (
    <form className='create-file' onSubmit={handleSubmit}>
      <div className='field'>
        <label htmlFor='#file-name'>File name</label>
        <input required id='file-name' name='file-name' type='text' placeholder='' />
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
