import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { FileType } from '~/redux/filesSlice';
import { AccountDataType, ReducersType } from '~/redux/stores';
import { createCanvas, getLocalFilteContent } from '~/utils/canvas';
import { handleObjectModified, handleObjectRemoved, hanldeObjectAdd } from '../handlers/canvas';

export const initialEditorState = {
  color: '#ce1fff',
  brushWidth: 2,
  backgroundColor: 'white',
  activeControl: 'pencil',
  historyProcessing: false,
  fileId: 'local',
};

export function useEditor() {
  const editorRef = useRef(initialEditorState);
  const [canvas, setCanvas] = useState<fabric.Canvas>();
  const { tempId } = useSelector<ReducersType, AccountDataType>((state) => state.account);

  function setEditorFile(file?: FileType) {
    if (canvas) {
      canvas.dispose();
      setCanvas(undefined);
    }

    let fileContent;
    const newCanvas = createCanvas(editorRef.current);
    if (!file) {
      fileContent = getLocalFilteContent();
    } else {
      fileContent = file.content;
    }
    newCanvas.loadFromJSON(fileContent || {}, () => {
      return;
    });

    editorRef.current.fileId = file?.id || 'local';
    assignEventHandlers(newCanvas);

    setCanvas(newCanvas);
  }

  function assignEventHandlers(canvas: fabric.Canvas) {
    canvas.on('object:added', (e) => hanldeObjectAdd(e, editorRef, canvas, tempId));
    canvas.on('object:modified', (e) => handleObjectModified(e, editorRef, canvas, tempId));
    canvas.on('object:removed', (e) => handleObjectRemoved(e, editorRef, canvas, tempId));
  }

  return { editor: editorRef.current, setEditorFile, canvas };
}
