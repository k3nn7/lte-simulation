import Renderable from "../engine/Renderable";
import Vector2D from "../engine/Vector2D";

export default class Line implements Renderable {
  a: Vector2D;
  b: Vector2D;

  constructor(a: Vector2D, b: Vector2D) {
    this.a = a;
    this.b = b;
  }

  render(ctx: CanvasRenderingContext2D, time: number): void {
    ctx.moveTo(this.a.x, this.a.y);
    ctx.lineTo(this.b.x, this.b.y);
  }
}
