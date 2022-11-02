import { FilesStateType } from '~/redux/filesSlice';
import { getLocalFileId } from './canvas';

export function getRandomRolor() {
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += Math.floor(Math.random() * 10);
  }
  return color;
}

export function uuidv4() {
  return (([1e7] as any) + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: number) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
  );
}

export function updateActiveFile(fileData: Partial<FilesStateType>) {
  const data = fileData.files;
  if (data?.length) {
    let localFileId = getLocalFileId();
    const activeFileObj = data.find((file) => file.id === localFileId);
    if (!activeFileObj && localFileId !== 'local') {
      localFileId = data[0].id;
    }
    window.localStorage.setItem('active_file', localFileId);
  } else {
    fileData.activeFile = 'local';
    window.localStorage.setItem('active_file', 'local');
  }
  return fileData;
}
