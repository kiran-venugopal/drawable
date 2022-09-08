import { useEffect, useRef } from 'react';
import { channel } from '~/supabase/config';
import CursorIcon from '../../../icons/cursor';

export type PointerItemProps = {
  fill: string;
  name: string;
  id: string;
  canvas?: fabric.Canvas;
};

function PointerItem({ fill, name, id, canvas }: PointerItemProps) {
  const pointerRef = useRef<HTMLSpanElement>();

  useEffect(() => {
    channel.on('broadcast', { event: `location(${id})` }, ({ payload }: any) => {
      let x = canvas?.width ? (canvas?.width / payload.width) * payload.x : payload.x;
      let y = canvas?.height ? (canvas?.height / payload.height) * payload.y : payload.y;

      if (x > (canvas?.width || 0)) {
        x = canvas?.width || 0;
      }

      if (y > (canvas?.height || 0)) {
        y = canvas?.height || 0;
      }

      if (pointerRef.current) {
        pointerRef.current?.style.setProperty('transform', `translate(${x}px,${y}px)`);
      }
    });
  }, []);

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
