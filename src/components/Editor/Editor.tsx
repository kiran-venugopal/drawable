import { fabric } from 'fabric';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { FilesStateType, ReducersType } from '~/redux/stores';

import { createCanvas, setLocalFilteContent } from '~/utils/canvas';
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
};

function Editor() {
  const [canvas, setCanvas] = useState<fabric.Canvas>();
  const editorState = useRef(initialEditorState);
  const { activeFile, files } = useSelector<ReducersType, FilesStateType>((state) => state.files);

  useEffect(() => {
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
        if (editorState.current.historyProcessing) {
          return;
        }
        const json = event.target?.canvas?.toJSON();

        history.add(json);
        setLocalFilteContent(json as any);
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
      }
    });

    canvas.on('object:removed', function (event) {
      if (editorState.current.activeControl !== 'laser') {
        if (editorState.current.historyProcessing) {
          return;
        }
        const json = event.target?.canvas?.toDatalessJSON();
        history.add(json);
        setLocalFilteContent(json as any);
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
  }, []);

  useEffect(() => {
    //TODO: check loading state
    if (canvas && activeFile !== 'local') {
      const file = files.find((f) => f.id === activeFile);
      if (file)
        canvas.loadFromJSON(file.content, () => {
          return;
        });
    }
  }, [canvas, activeFile]);

  return (
    <div className='editor'>
      <Controls canvas={canvas} editorState={editorState.current} />
      <SecondaryControls canvas={canvas} editorState={editorState.current} />
      <div className='main-content'>
        <canvas id='fabric-container'></canvas>
        <Pointers canvas={canvas} />
      </div>
    </div>
  );
}

export default Editor;
