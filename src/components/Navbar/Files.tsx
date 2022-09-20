import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FilesStateType, FileType } from '~/redux/filesSlice';
import { AccountDataType, filesActions, ReducersType } from '~/redux/stores';
import FileItem from './FileItem';

function Files() {
  const accountData = useSelector<ReducersType, AccountDataType>((state) => state.account);
  const filesData = useSelector<ReducersType, FilesStateType>((state) => state.files);
  const dispatch = useDispatch();
  console.log({ accountData });

  function handleFileClick(fileId: string) {
    dispatch(filesActions.setFiles({ activeFile: fileId }));
    window.localStorage.setItem('active_file', fileId);
  }

  return (
    <div className='files'>
      {filesData.files.map((f: FileType) => (
        <FileItem key={f.id} title={f.title} id={f.id} onClick={handleFileClick} />
      ))}
    </div>
  );
}

export default Files;
