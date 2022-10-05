import { ChangeEventHandler, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useContainerClick from 'use-container-click';
import { FilesStateType } from '~/redux/filesSlice';
import { AccountDataType, filesActions, ReducersType } from '~/redux/stores';
import supabase from '~/supabase/config';
import SaveAs from './MenuOptions/SaveAs';

function FileName() {
  const { activeFile, files, isFilesLoading } = useSelector<ReducersType, FilesStateType>(
    (state) => state.files,
  );
  const { isLoggedIn } = useSelector<ReducersType, AccountDataType>((state) => state.account);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(document.createElement('input'));

  const file = files.find((f) => f.id === activeFile);

  useContainerClick(inputRef, handleClose);

  useEffect(() => {
    if (!isEditing && file) {
      console.log({ isEditing, file });
      supabase
        .from('files')
        .update({ title: file.title })
        .match({ id: file.id })
        .then(() => {
          return;
        });
    }
  }, [isEditing]);

  const handleNameChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const newTitle = e.target.value;
    if (!newTitle.trim()) return;
    dispatch(filesActions.updateTitle({ id: file?.id, title: newTitle }));
  };

  function handleClose() {
    setIsEditing(false);
  }

  if (isFilesLoading) return null;

  if (!file)
    return (
      <div className='file-name'>
        {isLoggedIn ? <SaveAs /> : <div className='hint'>Sign in to save this file</div>}
      </div>
    );

  return (
    <div className='file-name'>
      {isEditing ? (
        <input ref={inputRef as any} onChange={handleNameChange} value={file.title} />
      ) : (
        <button onClick={() => setIsEditing(true)} className='text'>
          {file.title}
        </button>
      )}
    </div>
  );
}

export default FileName;
