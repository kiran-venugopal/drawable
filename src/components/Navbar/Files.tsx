import { useDispatch, useSelector } from 'react-redux';
import { FilesStateType, FileType } from '~/redux/filesSlice';
import { AccountDataType, filesActions, ReducersType } from '~/redux/stores';
import { fetchFiles } from '~/supabase/api';
import FileItem from './FileItem';

function Files() {
  const accountData = useSelector<ReducersType, AccountDataType>((state) => state.account);
  const filesData = useSelector<ReducersType, FilesStateType>((state) => state.files);
  const dispatch = useDispatch();
  console.log({ accountData });

  async function handleFileClick(fileId: string) {
    dispatch(filesActions.setFiles({ activeFile: fileId, isFilesLoading: true }));
    window.localStorage.setItem('active_file', fileId);
    const response = await fetchFiles([fileId]);
    const file = response.data?.[0] || {};
    const files = filesData.files.map((f) => {
      if (f.id === file.id) {
        return file;
      }
      return f;
    });
    dispatch(filesActions.setFiles({ activeFile: fileId, isFilesLoading: false, files }));
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
