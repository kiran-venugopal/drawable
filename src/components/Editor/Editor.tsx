import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FilesStateType } from '~/redux/filesSlice';
import { ReducersType } from '~/redux/stores';
import Controls from './Controls';
import SecondaryControls from './Controls/SecondaryControls';
import './editor-style.css';
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
          <div className='editor-content' key='canvas-container'>
            <canvas id='fabric-container'></canvas>
            <Pointers canvas={canvas} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Editor;
