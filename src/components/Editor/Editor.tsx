import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FilesStateType } from '~/redux/filesSlice';
import { ReducersType } from '~/redux/stores';
import Controls from './Controls';
import SecondaryControls from './Controls/SecondaryControls';
import './editor-style.css';
import history from './History';
import { useEditor } from './hooks/useEditor';
import Pointers from './Pointers/Pointers';

function Editor() {
  const { activeFile, files, isFilesLoading } = useSelector<ReducersType, FilesStateType>(
    (state) => state.files,
  );
  const { setEditorFile, canvas, editor } = useEditor();

  useEffect(() => {
    if (isFilesLoading) {
      return;
    }

    const file = files.find((f) => f.id === activeFile);
    setEditorFile(file);
  }, [isFilesLoading, activeFile]);

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (!canvas) return;

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
        editor.historyProcessing = true;
        const state = history.redo();
        console.log(state);
        canvas.loadFromJSON(state, () => {
          return null;
        });
        editor.historyProcessing = false;
        return;
      }

      if (evtobj.code === 'KeyZ' && evtobj.ctrlKey) {
        editor.historyProcessing = true;
        const state = history.undo();
        canvas.loadFromJSON(state, () => {
          return null;
        });
        editor.historyProcessing = false;
        return;
      }
    };

    window.addEventListener('keydown', onKeydown);

    return () => window.removeEventListener('keydown', onKeydown);
  }, [canvas]);

  return (
    <div className='editor'>
      <Controls canvas={canvas} editorState={editor} />
      <SecondaryControls canvas={canvas} editorState={editor} />
      <div className='main-content'>
        {isFilesLoading ? (
          <div className='loading'>
            <div className='spinner'></div>
          </div>
        ) : (
          <div key='canvas-container'>
            <canvas id='fabric-container'></canvas>
            <Pointers canvas={canvas} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Editor;
