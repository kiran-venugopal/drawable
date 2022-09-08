import { fabric } from 'fabric';

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
  return canvas;
}
