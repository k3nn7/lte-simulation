import Renderable from "../engine/Renderable";

export default class Fill implements Renderable {
  fillStyle: string;
  object: Renderable;

  constructor(fillStyle: string, object: Renderable) {
    this.fillStyle = fillStyle;
    this.object = object;
  }

  render(ctx: CanvasRenderingContext2D, time: number): void {
    this.object.render(ctx, time);
    ctx.fillStyle = this.fillStyle;
    ctx.fill();
  }
}
