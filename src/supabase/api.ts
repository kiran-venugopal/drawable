import { FileType } from '~/redux/filesSlice';
import supabase from './config';

export async function updateFile(fileId: any, file: Partial<FileType>) {
  console.log('updating file', { file, fileId });
  await supabase.from('files').update(file).eq('id', fileId);
}

export async function createFile(fileName: string, description?: string, content?: any) {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) {
      throw error;
    }
    const userId = session?.user.id;

    const { error: err, data } = await supabase
      .from('files')
      .insert({
        title: fileName,
        description,
        content: content || { background: 'white' },
        owner: userId,
      })
      .select();
    if (err) {
      console.error(err);
      throw err;
    }
    console.log({ data });
    const meta = session?.user.user_metadata;
    const fileId = data[0].id;
    supabase.auth.updateUser({
      data: { files: [...(meta?.files || []), fileId] },
    });

    return { success: true, data };
  } catch (err) {
    console.error(err);
    return {
      success: false,
    };
  }
}

export async function fetchFiles(accountId: string) {
  return await supabase.from('files').select().eq('owner', accountId);
}

export async function createUser(
  name: string,
  email: string,
  color: string,
  avatar_url: string,
  uid: string,
) {
  return supabase.from('user').insert({
    name,
    email,
    color,
    avatar_url,
    account: uid,
  });
}
