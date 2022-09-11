import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AccountDataType, filesActions, FilesStateType, ReducersType } from '~/redux/stores';
import supabase from '~/supabase/config';
import FileItem from './FileItem';

function Files() {
  const accountData = useSelector<ReducersType, AccountDataType>((state) => state.account);
  const filesData = useSelector<ReducersType, FilesStateType>((state) => state.files);
  const dispatch = useDispatch();
  console.log({ accountData });

  useEffect(() => {
    const fetchFiles = async () => {
      const { data, error } = await supabase
        .from('files')
        .select()
        .in('id', accountData.user?.files || []);

      if (error) {
        console.error(error);
        return;
      }

      console.log({ data });

      dispatch(filesActions.setFiles({ files: data }));
    };
    fetchFiles();
  }, []);

  function handleFileClick(fileId: string) {
    dispatch(filesActions.setFiles({ activeFile: fileId }));
    window.localStorage.setItem('active_file', fileId);
  }

  return (
    <div className='files'>
      {filesData.files.map((f) => (
        <FileItem key={f.id} title={f.title} id={f.id} onClick={handleFileClick} />
      ))}
    </div>
  );
}

export default Files;
