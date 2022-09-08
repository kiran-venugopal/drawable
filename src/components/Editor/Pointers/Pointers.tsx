import { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { accountActions, AccountDataType } from '~/redux/stores';
import { channel, usersChannel } from '~/supabase/config';
import PointerItem from './PointerItem';

export type PointerProps = {
  canvas?: fabric.Canvas;
};

function Pointers({ canvas }: PointerProps) {
  const accountData = useSelector<any, AccountDataType>((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    canvas?.on('mouse:move', async function (event) {
      const { e } = event;
      const rect = (e.target as any)?.getBoundingClientRect();

      await channel.send({
        type: 'broadcast',
        event: `location(${accountData.tempId})`,
        payload: {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          width: canvas?.width || 0,
          height: canvas?.height || 0,
        },
      });
    });
  }, [canvas]);

  useEffect(() => {
    channel.subscribe();
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
  }, []);

  console.log(accountData);

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
