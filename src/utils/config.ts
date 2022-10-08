export function getCanvasInJSON(canvas: fabric.Canvas) {
  const propsToBeIncluded = ['id'];
  return canvas.toJSON(propsToBeIncluded);
}
