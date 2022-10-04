import { Fragment, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FilesStateType } from '~/redux/filesSlice';
import { accountActions, AccountDataType, ReducersType } from '~/redux/stores';
import { realtimeUser } from '~/supabase/config';
import PointerItem from './PointerItem';

export type PointerProps = {
  canvas?: fabric.Canvas;
};

function Pointers({ canvas }: PointerProps) {
  const accountData = useSelector<any, AccountDataType>((state) => state.account);
  const { activeFile, isFilesLoading } = useSelector<ReducersType, FilesStateType>(
    (state) => state.files,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    async function handleMove(event: any) {
      const { e } = event;
      const rect = (e.target as any)?.getBoundingClientRect();

      await realtimeUser.cursorChange({
        activeFile,
        tempAccountId: accountData.tempId,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        width: canvas?.width || 0,
        height: canvas?.height || 0,
      });
    }

    canvas?.on('mouse:move', handleMove);
    canvas?.on('touch:drag', handleMove);

    return () => {
      canvas?.off('mouse:move', handleMove);
      canvas?.off('touch:drag', handleMove);
    };
  }, [canvas, activeFile]);

  useEffect(() => {
    if (!isFilesLoading && activeFile !== 'local') {
      const usersChannel = realtimeUser.getUserChannel(activeFile);
      usersChannel
        .on('presence', { event: 'sync' }, () => {
          console.log('currently online users', usersChannel.presenceState());
        })
        .on('presence', { event: 'join' }, ({ newPresences }: any) => {
          console.log('a new user has joined', newPresences);
          dispatch(accountActions.addActiveUser(newPresences));
        })
        .on('presence', { event: 'leave' }, ({ leftPresences }: any) => {
          console.log('a user has left', leftPresences);
          dispatch(accountActions.removeActiveUser(leftPresences));
        });
    }
  }, [activeFile, isFilesLoading]);

  if (!canvas) return null;

  return (
    <Fragment>
      {accountData.activeUsers.map((user) => (
        <PointerItem
          id={user.id}
          canvas={canvas}
          key={user.id}
          fill={user.color}
          name={user.name}
        />
      ))}
    </Fragment>
  );
}

export default Pointers;
