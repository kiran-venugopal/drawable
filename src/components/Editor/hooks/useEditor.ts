import { useRef, useState } from 'react';
import { FileType } from '~/redux/filesSlice';
import { createCanvas, getLocalFileId, getLocalFilteContent } from '~/utils/canvas';
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

  function setEditorFile(file?: FileType) {
    if (canvas) {
      canvas.dispose();
    }

    let fileContent;
    const newCanvas = createCanvas(editorRef);
    if (!file) {
      fileContent = getLocalFilteContent();
    } else {
      fileContent = file.content;
    }
    newCanvas.loadFromJSON(fileContent || {}, () => {
      return;
    });

    assignEventHandlers(newCanvas, file?.id || 'local');

    setCanvas(newCanvas);
  }

  function assignEventHandlers(canvas: fabric.Canvas, fileId: string) {
    canvas.on('object:added', (e) => hanldeObjectAdd(e, editorRef, canvas, fileId || 'local'));
    canvas.on('object:modified', (e) =>
      handleObjectModified(e, editorRef, canvas, fileId || 'local'),
    );
    canvas.on('object:removed', (e) =>
      handleObjectRemoved(e, editorRef, canvas, fileId || 'local'),
    );
  }

  return { editor: editorRef.current, setEditorFile, canvas };
}
