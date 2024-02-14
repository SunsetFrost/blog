import { useEffect } from "react";

const Canvas = () => {
  useEffect(() => {
    const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
    const ctx = canvas!.getContext("2d");

    if (ctx === null) {
      return;
    }

    ctx.beginPath();
    ctx.moveTo(75, 50);
    ctx.lineTo(100, 75);
    ctx.lineTo(100, 25);
    ctx.fill();
  }, []);

  return (
    <canvas id="myCanvas" width="200" height="200">
      Your browser does not support the HTML5 canvas tag.
    </canvas>
  );
};

export default Canvas;