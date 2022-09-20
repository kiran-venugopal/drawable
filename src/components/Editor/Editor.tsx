import { fabric } from 'fabric';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { FilesStateType } from '~/redux/filesSlice';
import { AccountDataType, ReducersType } from '~/redux/stores';
import { realtimeUser } from '~/supabase/config';
import { updateFile, uuidv4 } from '~/utils/account';

import { createCanvas, obj, setLocalFilteContent } from '~/utils/canvas';
import Controls from './Controls';
import SecondaryControls from './Controls/SecondaryControls';
import './editor-style.css';
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
    if (!isFilesLoading) {
      console.log('effect');
      const canvas = createCanvas(editorState.current);

      canvas.on('object:added', function (event) {
        if (editorState.current.activeControl === 'laser') {
          event.target?.animate('opacity', 0, {
            onChange: (a: number) => {
              if (a === 0) {
                if (event.target) canvas.remove(event.target);
              }
              canvas.renderAll.bind(canvas)();
            },
            duration: 600,
          });
        } else {
          console.log('added');
          console.log({ file: event.target?.canvas?.toJSON(), target: event.target });
          if (editorState.current.historyProcessing) {
            return;
          }

          const newObjectId = uuidv4();
          const object: any = event.target;
          if (!object?.id) {
            object?.set('id' as any, newObjectId);
            const objectInJSON = object?.toJSON();
            objectInJSON.id = newObjectId;

            realtimeUser
              .fileChange({
                activeFile,
                tempAccountId: tempId,
                objects: [objectInJSON],
              })
              .then((res) => {
                console.log({ res });
                return;
              });
          }

          const json = event.target?.canvas?.toObject(['id']);
          console.log({ json });
          history.add(json);
          setLocalFilteContent(json as any);

          updateFile(editorState.current.fileId, { content: json }).catch((err) => {
            console.error('Error while updating file', err);
          });

          console.log({ activeFile, tempId });
        }
      });

      canvas.on('object:modified', function (event) {
        if (editorState.current.activeControl !== 'laser') {
          if (editorState.current.historyProcessing) {
            return;
          }
          const json = event.target?.canvas?.toJSON();
          history.add(json);
          setLocalFilteContent(json as any);
          updateFile(editorState.current.fileId, { content: json }).catch((err) => {
            console.error('Error while updating file', err);
          });
        }
        console.log('modified');
      });

      canvas.on('object:removed', function (event) {
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
      });

      window.addEventListener('keydown', function (e) {
        if (e.code === 'Backspace' || e.code === 'Delete') {
          canvas.getActiveObjects().forEach((obj: any) => {
            if (obj.type === 'textbox' && obj.isEditing) {
              return;
            }
            canvas.remove(obj);
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
      });

      setCanvas(canvas);
    }
  }, [isFilesLoading]);

  useEffect(() => {
    //TODO: check loading state
    if (canvas && activeFile !== 'local') {
      const file = files.find((f) => f.id === activeFile);
      console.log({ file });
      if (file)
        canvas.loadFromJSON(file.content, () => {
          return;
        });
    }
    editorState.current.fileId = activeFile;
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
