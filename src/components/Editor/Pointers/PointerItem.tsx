import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FilesStateType } from '~/redux/filesSlice';
import { ReducersType } from '~/redux/stores';
import { realtimeUser } from '~/supabase/config';
import CursorIcon from '../../../icons/cursor';
import { fabric } from 'fabric';
import { addObjectToCanvas, updateObjectWithTransition } from '~/utils/canvas';

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
        if (payload.type === 'added') {
          const data = payload.data;
          console.log({ payload });
          const objects = data.objects;
          objects.forEach((object: any) => {
            addObjectToCanvas({
              canvas,
              object,
            });
          });

          return;
        } else if (payload.type === 'modified') {
          console.log({ payload });
          payload.data.objects.forEach((object: any) => {
            const objInCanvas = canvas._objects.find((obj: any) => obj.id === object.id);
            if (objInCanvas) {
              updateObjectWithTransition(objInCanvas, object, canvas);
            } else if (object.type === 'activeSelection') {
              object.objects.forEach((obj: Record<string, any>) => {
                const canvasObj = canvas._objects.find((o: any) => o.id === obj.id);
                console.log({ canvasObj });
                if (canvasObj)
                  updateObjectWithTransition(
                    canvasObj,
                    {
                      ...obj,
                      left: obj.left + object.left + object.width / 2,
                      top: obj.top + object.top + object.height / 2,
                      angle: (object.angle + obj.angle) % 360,
                      scaleX: object.scaleX,
                      scaleY: object.scaleY,
                    },
                    canvas,
                  );
              });
            } else {
              console.error('Invalid object', { object });
            }
          });
          canvas.renderAll();
        } else {
          let x = canvas.width ? (canvas.width / payload.width) * payload.x : payload.x;
          let y = canvas.height ? (canvas.height / payload.height) * payload.y : payload.y;

          if (canvas.width && x > (canvas.width - 50 || 0)) {
            x = canvas.width - 50 || 0;
          }

          if (canvas.height && y > (canvas.height || 0)) {
            y = canvas.height || 0;
          }

          if (pointerRef.current) {
            pointerRef.current?.style.setProperty('transform', `translate(${x}px,${y}px)`);
          }
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
