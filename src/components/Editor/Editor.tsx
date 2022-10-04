import { fabric } from 'fabric';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { FilesStateType } from '~/redux/filesSlice';
import { AccountDataType, ReducersType } from '~/redux/stores';
import { updateFile } from '~/supabase/api';
import { realtimeUser } from '~/supabase/config';
import { createCanvas, getAbsolueObjects, setLocalFilteContent } from '~/utils/canvas';
import Controls from './Controls';
import SecondaryControls from './Controls/SecondaryControls';
import './editor-style.css';
import { hanldeObjectAdd } from './handlers/canvas';
import history from './History';

import Pointers from './Pointers/Pointers';

export const initialEditorState = {
  color: '#ce1fff',
  brushWidth: 2,
  backgroundColor: 'white',
  activeControl: 'pencil',
  historyProcessing: false,
  fileId: 'local',
};

function Editor() {
  const [canvas, setCanvas] = useState<fabric.Canvas>();
  const editorState = useRef(initialEditorState);
  const { activeFile, files, isFilesLoading } = useSelector<ReducersType, FilesStateType>(
    (state) => state.files,
  );
  const { tempId } = useSelector<ReducersType, AccountDataType>((state) => state.account);

  useEffect(() => {
    if (isFilesLoading && activeFile !== 'local') return;

    const canvas = createCanvas(editorState.current);

    const onAdded = (e) => hanldeObjectAdd(e, editorState, canvas, tempId);

    const onModified = (event) => {
      if (editorState.current.activeControl !== 'laser') {
        if (editorState.current.historyProcessing) {
          return;
        }
        const json = event.target?.canvas?.toJSON(['id']);
        history.add(json);
        setLocalFilteContent(json as any);
        const objInJSON = event.target?.toJSON(['id']);

        updateFile(editorState.current.fileId, { content: json }).catch((err) => {
          console.error('Error while updating file', err);
        });
        console.log({ objInJSON });
        if (objInJSON.type === 'activeSelection') {
          const objects = getAbsolueObjects(canvas);
          realtimeUser.fileChange({
            activeFile,
            tempAccountId: tempId,
            objects,
            type: 'modified',
          });
          // transform object
        } else {
          realtimeUser.fileChange({
            activeFile,
            tempAccountId: tempId,
            objects: [objInJSON],
            type: 'modified',
          });
        }
      }
      console.log('modified');
    };

    const onRemoved = (event) => {
      console.log('removed');
      if (editorState.current.activeControl !== 'laser') {
        if (editorState.current.historyProcessing) {
          return;
        }
        const json = event.target?.canvas?.toDatalessJSON();
        history.add(json);
        setLocalFilteContent(json as any);
        updateFile(editorState.current.fileId, { content: json }).catch((err) => {
          console.error('Error while updating file', err);
        });
      }
    };

    const onKeydown = (e) => {
      if (e.code === 'Backspace' || e.code === 'Delete') {
        canvas.getActiveObjects().forEach((obj: any) => {
          if (obj.type === 'textbox' && obj.isEditing) {
            return;
          } else {
            canvas.remove(obj);
            canvas.discardActiveObject().renderAll();
          }
        });
      }
      const evtobj = e;
      console.log({ evtobj });

      if (evtobj.code === 'KeyZ' && evtobj.ctrlKey && evtobj.shiftKey) {
        editorState.current.historyProcessing = true;
        const state = history.redo();
        console.log(state);
        canvas.loadFromJSON(state, () => {
          return null;
        });
        editorState.current.historyProcessing = false;
        return;
      }

      if (evtobj.code === 'KeyZ' && evtobj.ctrlKey) {
        editorState.current.historyProcessing = true;
        const state = history.undo();
        canvas.loadFromJSON(state, () => {
          return null;
        });
        editorState.current.historyProcessing = false;
        return;
      }
    };

    canvas.on('object:added', onAdded);

    canvas.on('object:modified', onModified);

    canvas.on('object:removed', onRemoved);

    window.addEventListener('keydown', onKeydown);

    setCanvas(canvas);

    return () => {
      canvas.off('object:added', onAdded);

      canvas.off('object:modified', onModified);

      canvas.off('object:removed', onRemoved);

      window.removeEventListener('keydown', onKeydown);
    };
  }, [isFilesLoading]);

  useEffect(() => {
    //TODO: check loading state
    if (canvas && activeFile !== 'local') {
      const file = files.find((f) => f.id === activeFile);
      console.log({ file });
      if (file) {
        editorState.current.fileId = activeFile;
        canvas.loadFromJSON(file.content, () => {
          return;
        });
      }
    }
  }, [canvas, activeFile]);

  return (
    <div className='editor'>
      <Controls canvas={canvas} editorState={editorState.current} />
      <SecondaryControls canvas={canvas} editorState={editorState.current} />
      <div className='main-content'>
        {isFilesLoading ? (
          <div className='loading'>
            <div className='spinner'></div>
          </div>
        ) : (
          <Fragment>
            <canvas id='fabric-container'></canvas>
            <Pointers canvas={canvas} />
          </Fragment>
        )}
      </div>
    </div>
  );
}

export default Editor;
