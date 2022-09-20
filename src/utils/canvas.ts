import { fabric } from 'fabric';

const mock = {
  type: 'rect',
  version: '5.2.4',
  originX: 'left',
  originY: 'top',
  left: 240.14,
  top: 48.78,
  width: 100,
  height: 100,
  fill: '#ce1fff',
  stroke: null,
  strokeWidth: 5,
  strokeDashArray: null,
  strokeLineCap: 'butt',
  strokeDashOffset: 0,
  strokeLineJoin: 'miter',
  strokeUniform: false,
  strokeMiterLimit: 4,
  scaleX: 1,
  scaleY: 1,
  angle: 0,
  flipX: false,
  flipY: false,
  opacity: 1,
  shadow: null,
  visible: true,
  backgroundColor: '',
  fillRule: 'nonzero',
  paintFirst: 'fill',
  globalCompositeOperation: 'source-over',
  skewX: 0,
  skewY: 0,
  rx: 0,
  ry: 0,
};

export const obj = new fabric.Rect(mock);

export function createCanvas(editorStateRef: any): fabric.Canvas {
  fabric.Object.prototype.transparentCorners = false;
  fabric.Object.prototype.cornerColor = '#2196f3';
  fabric.Object.prototype.cornerStyle = 'circle';
  fabric.Object.prototype.strokeWidth = 5;
  fabric.Object.prototype.borderScaleFactor = 2;
  fabric.Object.prototype.cornerSize = 10;

  const freeDrawingControls = ['pencil', 'laser'];

  const canvas = new fabric.Canvas('fabric-container', {
    width: ((window.innerHeight - 150) * 3) / 2,
    height: window.innerHeight - 150,
    isDrawingMode: freeDrawingControls.includes(editorStateRef.activeControl),
    selectionLineWidth: 3,
    backgroundColor: editorStateRef.backgroundColor,
    selectionColor: '#2195f37c',
    selectionBorderColor: '#2196f3',
  });

  window.canvas = canvas;

  function resizeCanvas() {
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

  resizeCanvas();

  window.addEventListener('resize', resizeCanvas);

  canvas.freeDrawingBrush.width = editorStateRef.brushWidth;
  canvas.freeDrawingBrush.color = editorStateRef.color;
  const fileId = getLocalFileId();
  if (fileId === 'local') {
    const fileContent = getLocalFilteContent();
    canvas.loadFromJSON(fileContent || {});
  }
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
