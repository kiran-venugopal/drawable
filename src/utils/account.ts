import { FileType } from '~/redux/filesSlice';
import supabase from '~/supabase/config';

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

export async function updateFile(fileId: any, file: Partial<FileType>) {
  await supabase.from('files').update(file).eq('id', fileId);
}
