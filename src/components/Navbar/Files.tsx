import { useDispatch, useSelector } from 'react-redux';
import { FilesStateType, FileType } from '~/redux/filesSlice';
import { AccountDataType, filesActions, ReducersType } from '~/redux/stores';
import { fetchFiles } from '~/supabase/api';
import FileItem from './FileItem';

export type FilesPropsType = {
  onFileClick(): void;
};

function Files({ onFileClick }: FilesPropsType) {
  const accountData = useSelector<ReducersType, AccountDataType>((state) => state.account);
  const filesData = useSelector<ReducersType, FilesStateType>((state) => state.files);
  const dispatch = useDispatch();
  const files = filesData.files;
  console.log({ accountData });

  async function handleFileClick(fileId: string) {
    dispatch(filesActions.setFiles({ activeFile: fileId, isFilesLoading: true }));
    // to close the dialog
    onFileClick();
    window.localStorage.setItem('active_file', fileId);
    const response = await fetchFiles([fileId]);
    console.log({ response, filesData });
    const file = response.data?.[0] || {};
    const newFiles = files.map((f) => {
      if (f.id === file.id) {
        return file;
      }
      return f;
    });
    dispatch(filesActions.setFiles({ activeFile: fileId, isFilesLoading: false, files: newFiles }));
  }

  return (
    <div className='files'>
      {files.map((f: FileType) => (
        <FileItem key={f.id} title={f.title} id={f.id} onClick={handleFileClick} />
      ))}
      {files.length === 0 && (
        <div className='hint'>{"You don't have any files! Create files to get started"}</div>
      )}
    </div>
  );
}

export default Files;
