import Renderable from "./Renderable";
import Vector2D from "./Vector2D";

export default class Transform implements Renderable {
  transformation: Vector2D;
  object: Renderable;

  constructor(transformation: Vector2D, object: Renderable) {
    this.transformation = transformation;
    this.object = object;
  }

  render(ctx: CanvasRenderingContext2D, time: number): void {
    ctx.translate(this.transformation.x, this.transformation.y);
    this.object.render(ctx, time);
  }
}
