import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { FileType } from '~/redux/filesSlice';
import { AccountDataType, ReducersType } from '~/redux/stores';
import { realtimeUser } from '~/supabase/config';
import { createCanvas, getLocalFilteContent } from '~/utils/canvas';
import { handleObjectModified, handleObjectRemoved, hanldeObjectAdd } from '../handlers/canvas';
import history from '../History';

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
    history.clear();
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

    history.add(fileContent);

    editorRef.current.fileId = file?.id || 'local';
    assignEventHandlers(newCanvas);

    setCanvas(newCanvas);
  }

  function assignEventHandlers(canvas: fabric.Canvas) {
    canvas.on('object:added', (e) => hanldeObjectAdd(e, editorRef, canvas, tempId));
    canvas.on('object:modified', (e) => handleObjectModified(e, editorRef, canvas, tempId));
    canvas.on('object:removed', (e) => handleObjectRemoved(e, editorRef, canvas));
  }

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (!canvas) return;

      if (e.code === 'Backspace' || e.code === 'Delete') {
        const objectsToBeRemoved: any[] = [];
        canvas.getActiveObjects().forEach((obj: any) => {
          if (obj.type === 'textbox' && obj.isEditing) {
            return;
          } else {
            canvas.remove(obj);
            canvas.discardActiveObject().renderAll();
            objectsToBeRemoved.push(obj.toJSON(['id']));
          }
        });
        if (objectsToBeRemoved.length) {
          const activeFile = editorRef.current.fileId;
          realtimeUser
            .fileChange({
              activeFile,
              tempAccountId: tempId,
              objects: objectsToBeRemoved,
              type: 'removed',
            })
            .catch((err) => console.error(err));
        }
      }
      const evtobj = e;
      console.log({ evtobj });

      if (evtobj.code === 'KeyZ' && evtobj.ctrlKey && evtobj.shiftKey) {
        editorRef.current.historyProcessing = true;
        const state = history.redo();
        canvas.loadFromJSON(state, () => {
          return null;
        });
        editorRef.current.historyProcessing = false;
        return;
      }

      if (evtobj.code === 'KeyZ' && evtobj.ctrlKey) {
        editorRef.current.historyProcessing = true;
        const state = history.undo();
        canvas.loadFromJSON(state, () => {
          return null;
        });
        editorRef.current.historyProcessing = false;
        return;
      }
    };

    window.addEventListener('keydown', onKeydown);

    return () => window.removeEventListener('keydown', onKeydown);
  }, [canvas]);

  return { editor: editorRef.current, setEditorFile, canvas };
}
