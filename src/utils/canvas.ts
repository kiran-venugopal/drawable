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
    width: 1200,
    height: 800,
    isDrawingMode: freeDrawingControls.includes(editorStateRef.activeControl),
    selectionLineWidth: 3,
    backgroundColor: editorStateRef.backgroundColor,
    selectionColor: '#2195f37c',
    selectionBorderColor: '#2196f3',
  });

  canvas.freeDrawingBrush.width = editorStateRef.brushWidth;
  canvas.freeDrawingBrush.color = editorStateRef.color;
  return canvas;
}
