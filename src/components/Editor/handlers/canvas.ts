import { MutableRefObject } from 'react';
import { updateFile } from '~/supabase/api';
import { realtimeUser } from '~/supabase/config';
import { uuidv4 } from '~/utils/account';
import { getAbsolueObjects, setLocalFilteContent } from '~/utils/canvas';
import history from '../History';

export async function hanldeObjectAdd(
  event: fabric.IEvent<Event>,
  editorState: MutableRefObject<any>,
  canvas: fabric.Canvas,
  userId: string,
) {
  const object: any = event.target;
  let objectInJSON;
  const activeFile = editorState.current.fileId;
  const newObjectId = uuidv4();
  if (editorState.current.activeControl === 'laser' || object.isLaser) {
    event.target?.animate('opacity', 0, {
      onChange: (a: number) => {
        if (a === 0) {
          if (event.target) canvas.remove(event.target);
        }
        canvas.renderAll.bind(canvas)();
      },
      duration: 1000,
    });
    if (!object.id) {
      object.set('id', newObjectId).set('isLaser', true);
      objectInJSON = object?.toJSON(['id', 'isLaser']);
      console.log({ objectInJSON, object });
    }
  } else {
    console.log({ file: event.target?.canvas?.toJSON(['id']), target: event.target });
    if (editorState.current.historyProcessing) {
      return;
    }

    const json = event.target?.canvas?.toObject(['id']);
    console.log({ json });
    history.add(json);
    setLocalFilteContent(json as any);

    updateFile(editorState.current.fileId, { content: json }).catch((err) => {
      console.error('Error while updating file', err);
    });

    console.log({ object });
    if (!object?.id) {
      object?.set('id' as any, newObjectId);
      objectInJSON = object?.toJSON(['id']);
    }
  }

  if (objectInJSON) {
    await realtimeUser.fileChange({
      activeFile,
      tempAccountId: userId,
      objects: [objectInJSON],
      type: 'added',
    });
  }
}

export async function handleObjectModified(
  event: fabric.IEvent<Event>,
  editorState: MutableRefObject<any>,
  canvas: fabric.Canvas,
  userId: string,
) {
  const activeFile = editorState.current.fileId;
  if (editorState.current.activeControl !== 'laser') {
    if (editorState.current.historyProcessing) {
      return;
    }
    const json = event.target?.canvas?.toJSON(['id']);
    history.add(json);
    setLocalFilteContent(json as any);
    const objInJSON = event.target?.toJSON(['id']);

    updateFile(editorState.current.fileId, { content: json }).catch((err) => {
      console.error('Error while updating file', err);
    });

    if (objInJSON.type === 'activeSelection') {
      const objects = getAbsolueObjects(canvas);
      realtimeUser.fileChange({
        activeFile,
        tempAccountId: userId,
        objects,
        type: 'modified',
      });
      // transform object
    } else {
      realtimeUser.fileChange({
        activeFile,
        tempAccountId: userId,
        objects: [objInJSON],
        type: 'modified',
      });
    }
  }
}

export async function handleObjectRemoved(
  event: fabric.IEvent<Event>,
  editorState: MutableRefObject<any>,
  canvas: fabric.Canvas,
  userId: string,
) {
  console.log('removed', { canvas, userId });
  if (editorState.current.activeControl !== 'laser') {
    if (editorState.current.historyProcessing) {
      return;
    }
    const json = event.target?.canvas?.toDatalessJSON();
    history.add(json);
    setLocalFilteContent(json as any);
    updateFile(editorState.current.fileId, { content: json }).catch((err) => {
      console.error('Error while updating file', err);
    });
  }
}
