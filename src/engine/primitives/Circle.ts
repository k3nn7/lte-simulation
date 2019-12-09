import {RenderableObject} from "../RenderableObject";

export default class Circle extends RenderableObject{
  radius: number;

  constructor(radius: number) {
    super();
    this.radius = radius;
  }

  protected draw(ctx: CanvasRenderingContext2D, time: number): void {
    ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
  }
}
