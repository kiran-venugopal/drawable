import { useEffect, useState } from 'react';
import supabase from '~/supabase/config';

export type FileItemPropsType = {
  id: string;
  title: string;
  onClick(fileId: string): void;
};

function FileItem({ id, title, onClick }: FileItemPropsType) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    const fetchUrl = async () => {
      const { data } = await supabase.storage.from('files-thumbnail').createSignedUrl(`${id}`, 60);
      console.log({ data });
      setUrl(data?.signedUrl || '');
    };
    fetchUrl();
  }, []);

  return (
    <button onClick={() => onClick(id)} className='file-item'>
      <img src={url} alt='' />
      <div className='title'>{title}</div>
    </button>
  );
}

export default FileItem;
