import { createSlice } from '@reduxjs/toolkit';
import { getLocalFileId } from '~/utils/canvas';

export type FileType = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
};

export type FilesStateType = {
  files: FileType[];
  activeFile: string;
  isFilesLoading: boolean;
  filesFetchedOn: Date | null;
};
const initialFilesState: FilesStateType = {
  files: [],
  activeFile: getLocalFileId(),
  isFilesLoading: true,
  filesFetchedOn: null,
};

const filesSlice = createSlice({
  name: 'files',
  initialState: initialFilesState,
  reducers: {
    setFiles(state, { payload }: { payload: Partial<FilesStateType> }) {
      return { ...state, ...payload, filesFetchedOn: new Date() };
    },
    setFilesLoading(state, { payload }) {
      return { ...state, isFilesLoading: payload };
    },
    updateTitle(state, { payload }: { payload: Partial<FileType> }) {
      return {
        ...state,
        files: state.files.map((f) => {
          if (f.id === payload.id) {
            return { ...f, ...payload };
          }
          return f;
        }),
      };
    },
    pushFiles(state, { payload = [] }) {
      return {
        ...state,
        files: [...state.files, ...payload],
      };
    },
  },
});

export default filesSlice;
