import { ChangeEventHandler, FormEventHandler, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { initialEditorState } from '../Editor';

import MoveIcon from '../../../icons/move.svg';
import PencilIcon from '../../../icons/pencil.svg';
import LaserIcon from '../../../icons/laser.svg';
import SqaureIcon from '../../../icons/square.svg';
import CircleIcon from '../../../icons/circle.svg';
import TextIcon from '../../../icons/text.svg';
import ImgIcon from '../../../icons/image.svg';

import './control-style.css';

export type ControlsPropsType = {
  canvas?: fabric.Canvas;
  editorState: typeof initialEditorState;
};

function Controls({ canvas, editorState }: ControlsPropsType) {
  const [editorData, setEditorState] = useState(editorState);
  const [openModal, setOpenModal] = useState<'imgDialog' | ''>('');

  const colorRef = useRef<HTMLInputElement>();

  if (!canvas) return null;

  const handleControlClick = () => {
    colorRef.current?.click();
  };

  const handleColorChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;

    if (canvas) {
      const activeElements = canvas?.getActiveObjects();
      if (activeElements.length) {
        activeElements.forEach((obj) => {
          console.log({ obj });
          if (obj.type === 'path') {
            obj.set('stroke', value);
          } else obj.set('fill', value);
        });
        canvas.renderAll();
      }
      canvas.freeDrawingBrush.color = e.target.value;
      setEditorState((prev) => ({
        ...prev,
        color: value,
      }));
    }
  };

  const handleToggleDrawingMode = (type: 'pencil' | 'move' | 'laser') => () => {
    if (type === 'move') {
      canvas.isDrawingMode = false;
    } else canvas.isDrawingMode = true;

    setEditorState((prev) => ({
      ...prev,
      activeControl: type,
    }));

    editorState.activeControl = type;
  };

  const handleShapeClick =
    (shape: 'square' | 'circle' | 'text' | 'image') =>
    async (data: any = '') => {
      handleToggleDrawingMode('move')();
      const imgURL = data as string;

      let shapeObj;
      switch (shape) {
        case 'circle':
          shapeObj = new fabric.Circle({
            top: 30,
            left: 30,
            fill: editorData.color,
            radius: 50,
          });
          break;
        case 'square':
          shapeObj = new fabric.Rect({
            top: 30,
            left: 30,
            fill: editorData.color,
            width: 100,
            height: 100,
          });
          break;
        case 'text':
          shapeObj = new fabric.Textbox('Text', {
            top: 30,
            left: 30,
            fill: editorData.color,
            fontFamily: 'Helvetica',
            fontSize: 25,
          });
          break;
        case 'image':
          shapeObj = await new Promise((res) => {
            fabric.Image.fromURL(imgURL, function (image) {
              image
                .set({
                  left: 30,
                  top: 30,
                })
                .scale(0.2);
              res(image);
            });
          });
          break;
      }

      if (shapeObj) canvas.add(shapeObj as any);
    };

  const handleImgClick = () => {
    setOpenModal((prev) => (prev === 'imgDialog' ? '' : 'imgDialog'));
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const urlEl = (e.target as HTMLFormElement).querySelector('input');
    handleShapeClick('image')(urlEl?.value);
  };

  return (
    <div className=' controls'>
      <button onClick={handleControlClick} className='control-item color'>
        <div style={{ background: editorData.color }} className='color-display'></div>
        <input ref={colorRef as any} type='color' onChange={handleColorChange} />
      </button>
      <button
        onClick={handleToggleDrawingMode('move')}
        className={`control-item ${editorData.activeControl === 'move' ? 'active' : ''}`}
      >
        <MoveIcon />
      </button>
      <button
        onClick={handleToggleDrawingMode('pencil')}
        className={`control-item ${editorData.activeControl === 'pencil' ? 'active' : ''}`}
      >
        <PencilIcon />
      </button>
      <button
        onClick={handleToggleDrawingMode('laser')}
        className={`control-item ${editorData.activeControl === 'laser' ? 'active' : ''}`}
      >
        <LaserIcon />
      </button>
      <button onClick={handleShapeClick('square')} className='control-item'>
        <SqaureIcon />
      </button>
      <button onClick={handleShapeClick('circle')} className='control-item'>
        <CircleIcon />
      </button>
      <button onClick={handleShapeClick('text')} className='control-item'>
        <TextIcon />
      </button>
      <div className='menu'>
        <button onClick={handleImgClick} className='control-item'>
          <ImgIcon />
        </button>
        {openModal === 'imgDialog' && (
          <div className='image-input dropdown'>
            <h3>Import Image</h3>
            <form onSubmit={handleSubmit} className='field'>
              <input type='text' placeholder='Paste url here' />
              <button>Import</button>
            </form>
          </div>
        )}
      </div>

      {/* <button
        onClick={() => {
          if (canvas) {
            canvas.clear();
            canvas.backgroundColor = 'white';
          }
        }}
      >
        clear
      </button>
      <button
        onClick={() => {
          canvas.getActiveObjects().forEach((obj) => {
            canvas.remove(obj);
          });
        }}
      >
        del
      </button> */}
    </div>
  );
}

export default Controls;
