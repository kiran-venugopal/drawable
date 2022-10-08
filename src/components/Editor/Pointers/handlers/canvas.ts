import { MutableRefObject } from 'react';
import { addObjectToCanvas, removeObjects, updateObjectWithTransition } from '~/utils/canvas';

export const handleRealtimeUser =
  (canvas: fabric.Canvas, pointerRef: MutableRefObject<HTMLElement | undefined>) =>
  ({ payload }: any) => {
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
    } else if (payload.type === 'removed') {
      const data = payload.data;
      console.log({ payload });
      const objects = data.objects;
      removeObjects(objects, canvas);
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

      if (canvas.width && x > (canvas.width || 0)) {
        x = canvas.width || 0;
      }

      if (canvas.height && y > (canvas.height || 0)) {
        y = canvas.height || 0;
      }

      if (pointerRef.current) {
        pointerRef.current?.style.setProperty('transform', `translate(${x}px,${y}px)`);
      }
    }
  };
