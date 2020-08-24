
export const createCanvasAndGetCtx = (id) => {
  const canvas = document.createElement("canvas");
  const container = document.getElementById(id);
  container.appendChild(canvas);
  return canvas.getContext("2d");
};
