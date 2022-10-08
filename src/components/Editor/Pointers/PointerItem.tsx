import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FilesStateType } from '~/redux/filesSlice';
import { ReducersType } from '~/redux/stores';
import { realtimeUser } from '~/supabase/config';
import CursorIcon from '../../../icons/cursor';
import { fabric } from 'fabric';
import { handleRealtimeUser } from './handlers/canvas';

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
    if (activeFile === 'local' || !canvas) {
      return;
    }

    const channel = realtimeUser.getCursorChannel();
    channel.on(
      `broadcast`,
      { event: `location(${activeFile})(${id})` },
      handleRealtimeUser(canvas, pointerRef),
    );
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
