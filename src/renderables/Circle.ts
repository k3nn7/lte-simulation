import Renderable from "../engine/Renderable";

export default class Circle implements Renderable {
  radius: number;

  constructor(radius: number) {
    this.radius = radius;
  }

  render(ctx: CanvasRenderingContext2D, time: number): void {
    ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
  }
}
