export type FabricObject = Record<string, any>;

declare global {
  // eslint-disable-next-line no-var
  var __canvas: fabric.Canvas;
}
