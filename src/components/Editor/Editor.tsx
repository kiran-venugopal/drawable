import { fabric } from 'fabric';
import { useEffect, useRef, useState } from 'react';
import Controls from './Controls';
import SecondaryControls from './Controls/SecondaryControls';
import './editor-style.css';

const freeDrawingControls = ['pencil', 'laser'];

export const initialEditorState = {
  color: '#ce1fff',
  brushWidth: 2,
  backgroundColor: 'white',
  activeControl: 'pencil',
};

function Editor() {
  const [canvas, setCanvas] = useState<fabric.Canvas>();
  const editorState = useRef(initialEditorState);

  useEffect(() => {
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerColor = '#2196f3';
    fabric.Object.prototype.cornerStyle = 'circle';
    fabric.Object.prototype.strokeWidth = 5;
    fabric.Object.prototype.borderScaleFactor = 2;
    fabric.Object.prototype.cornerSize = 10;

    const canvas = new fabric.Canvas('fabric-container', {
      width: 1200,
      height: 800,
      isDrawingMode: freeDrawingControls.includes(editorState.current.activeControl),
      selectionLineWidth: 3,
      backgroundColor: editorState.current.backgroundColor,
      selectionColor: '#2195f37c',
      selectionBorderColor: '#2196f3',
    });

    canvas.freeDrawingBrush.width = editorState.current.brushWidth;
    canvas.freeDrawingBrush.color = editorState.current.color;

    canvas.on('object:added', function (event) {
      console.log(event);
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
    });

    setCanvas(canvas);
  }, []);

  return (
    <div className='editor'>
      <Controls canvas={canvas} editorState={editorState.current} />
      <SecondaryControls canvas={canvas} editorState={editorState.current} />
      <div className='main-content'>
        <canvas id='fabric-container'></canvas>
      </div>
    </div>
  );
}

export default Editor;
