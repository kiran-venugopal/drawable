import { fabric } from 'fabric';
import { FabricObject } from '~/types/editor';

export const freeDrawingControls = ['pencil', 'laser'];

export function configureCanvas() {
  fabric.Object.prototype.transparentCorners = false;
  fabric.Object.prototype.cornerColor = '#2196f3';
  fabric.Object.prototype.cornerStyle = 'circle';
  fabric.Object.prototype.strokeWidth = 5;
  fabric.Object.prototype.borderScaleFactor = 2;
  fabric.Object.prototype.cornerSize = 10;
}

configureCanvas();

export function resizeCanvas(canvas: fabric.Canvas) {
  const { innerWidth } = window;

  const width = innerWidth - 180;
  const height = width * (2 / 3);
  //const zoom = canvas.getZoom();
  console.log({ width, height, diff: width - height });

  //const containerWidth = width;

  // const scale = containerWidth / width;
  // const zoom = canvas.getZoom() * scale;
  const diff = 500;
  const currentDiff = width - height;
  const scale = currentDiff / diff;
  canvas.setZoom(scale);

  canvas.setDimensions({ width: width, height: height });

  // re-render canvas with new quality
  canvas.requestRenderAll();
  // canvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0]);
}

export function createCanvas(editorStateRef: any): fabric.Canvas {
  const canvas = new fabric.Canvas('fabric-container', {
    width: ((window.innerHeight - 150) * 3) / 2,
    height: window.innerHeight - 150,
    isDrawingMode: freeDrawingControls.includes(editorStateRef.activeControl),
    selectionLineWidth: 3,
    backgroundColor: editorStateRef.backgroundColor,
    selectionColor: '#2195f37c',
    selectionBorderColor: '#2196f3',
  });

  window.__canvas = canvas;

  resizeCanvas(canvas);

  window.addEventListener('resize', () => resizeCanvas(canvas));

  canvas.freeDrawingBrush.width = editorStateRef.brushWidth;
  canvas.freeDrawingBrush.color = editorStateRef.color;

  return canvas;
}

export function getLocalFileId() {
  const fileId = window.localStorage.getItem('active_file');
  if (fileId) return fileId;
  const localId = 'local';
  window.localStorage.setItem('active_file', localId);
  return localId;
}

export function getLocalFilteContent() {
  const localContent = { background: 'white' };
  const fileContent =
    JSON.parse(window.localStorage.getItem('local_content') || 'null') || localContent;
  if (fileContent) return fileContent;

  window.localStorage.setItem('local_content', JSON.stringify(localContent));
  return localContent;
}

export function setLocalFilteContent(content: { [key: string]: any }) {
  window.localStorage.setItem('local_content', JSON.stringify(content || {}));
}

export type AddObjectToCanvasArgs = {
  canvas: fabric.Canvas;
  object: FabricObject;
};

export async function createCanvasImage(imgURL: string, object = {}) {
  const shapeObj: Record<string, any> = await new Promise((res) => {
    fabric.Image.fromURL(
      imgURL,
      function (image) {
        image
          .set({
            left: 30,
            top: 30,
          })
          .scale(0.2);
        res(image);
      },
      object,
    );
  });
  return shapeObj;
}

async function createNewObject(object: Record<string, any>) {
  switch (object.type) {
    case 'path': {
      const newObject: FabricObject = new fabric.Path(object.path, object);
      return newObject;
    }

    case 'rect': {
      const newObject: FabricObject = new fabric.Rect(object);
      return newObject;
    }

    case 'circle': {
      const newObject: FabricObject = new fabric.Circle(object);
      return newObject;
    }

    case 'textbox': {
      const newObject: FabricObject = new fabric.Textbox(object.text, object);
      return newObject;
    }

    case 'image': {
      const newObject: FabricObject = await createCanvasImage(object.src, object);
      return newObject;
    }

    default:
      return;
  }
}

export async function addObjectToCanvas({ canvas, object }: AddObjectToCanvasArgs) {
  const newObject: any = await createNewObject(object);
  if (!newObject) {
    console.error('Invalid canvas object!', { object });
  }
  const exisiting = canvas._objects.find((obj: any) => obj.id === newObject.id);
  if (!exisiting) {
    console.log('not existing!');
    canvas.add(newObject);
  }
}

export async function updateObjectWithTransition(
  target: Record<string, any>,
  object: Record<string, any>,
  canvas: fabric.Canvas,
) {
  target.animate('left', object.left, {
    duration: 300,
    onChange: canvas.renderAll.bind(canvas),
    easing: fabric.util.ease.easeInQuad,
  });
  target.animate('top', object.top, {
    duration: 300,
    onChange: canvas.renderAll.bind(canvas),
    easing: fabric.util.ease.easeInQuad,
  });

  target.set(object);
}

export function getAbsolueObjects(canvas: fabric.Canvas) {
  // discarding current selection for getting the absolute positions of objects as a workaround
  //TODO: Need to figure out a proper solution
  const activeObjectIds = canvas.getActiveObjects().map((obj: Record<string, any>) => obj.id);

  canvas.discardActiveObject();

  const canvasObjects: fabric.Object[] = [];
  const objects = canvas
    .getObjects()
    .filter((obj: Record<string, any>) => activeObjectIds.includes(obj.id))
    .map((obj) => {
      canvasObjects.push(obj);
      return obj.toJSON(['id']);
    });

  const activeSelection = new fabric.ActiveSelection(canvasObjects, { canvas });
  canvas.setActiveObject(activeSelection);
  return objects;
}
