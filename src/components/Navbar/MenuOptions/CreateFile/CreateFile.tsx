import { FormEventHandler } from 'react';
import { useDispatch } from 'react-redux';
import Input from '~/components/Common/Input';
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
      <Input label='File name' id='file-name' name='file-name' />
      <Input label='File description' id='file-description' name='file-name' isOptional />
      <div className='actions'>
        <button className='primary'>Create</button>
      </div>
    </form>
  );
}

export default CreateFile;
