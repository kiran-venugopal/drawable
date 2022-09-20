import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FilesStateType } from '~/redux/filesSlice';
import { ReducersType } from '~/redux/stores';
import { realtimeUser } from '~/supabase/config';
import CursorIcon from '../../../icons/cursor';
import { fabric } from 'fabric';

export type PointerItemProps = {
  fill: string;
  name: string;
  id: string;
  canvas?: fabric.Canvas;
};

function PointerItem({ fill, name, id, canvas }: PointerItemProps) {
  const pointerRef = useRef<HTMLSpanElement>();
  const { activeFile } = useSelector<ReducersType, FilesStateType>((state) => state.files);

  useEffect(() => {
    const channel = realtimeUser.getCursorChannel();
    if (activeFile !== 'local' && canvas) {
      channel.on(`broadcast`, { event: `location(${activeFile})(${id})` }, ({ payload }: any) => {
        if (payload.data) {
          const data = payload.data;
          if (payload.type === 'added') {
            console.log({ payload });
            const objects = data.objects;
            objects.forEach((canvasObject) => {
              const object = new fabric.Path(canvasObject.path, canvasObject);
              const exisiting = canvas._objects.find((obj: any) => obj.id === object.id);
              if (!exisiting) {
                console.log('not existing!');
                canvas.add(object);
              }
            });

            return;
          }
        }
        let x = canvas.width ? (canvas.width / payload.width) * payload.x : payload.x;
        let y = canvas.height ? (canvas.height / payload.height) * payload.y : payload.y;

        if (x > (canvas.width || 0)) {
          x = canvas.width || 0;
        }

        if (y > (canvas.height || 0)) {
          y = canvas.height || 0;
        }

        if (pointerRef.current) {
          pointerRef.current?.style.setProperty('transform', `translate(${x}px,${y}px)`);
        }
      });
    }
  }, [activeFile, canvas]);

  return (
    <span ref={pointerRef as any} className='pointer'>
      <CursorIcon style={{ fill }} />
      <span style={{ background: fill }} className='name'>
        {name}
      </span>
    </span>
  );
}

export default PointerItem;
