import {RenderableObject} from "../RenderableObject";

export default class Box extends RenderableObject{
  width: number;
  height: number;

  constructor(width: number, height: number) {
    super();

    this.width = width;
    this.height = height;
  }

  protected draw(ctx: CanvasRenderingContext2D): void {
    ctx.rect(0, 0, this.width, this.height);
  }
}
