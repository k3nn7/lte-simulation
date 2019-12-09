import {RenderableObject} from "../engine/RenderableObject";
import Vector2D from "../engine/Vector2D";

export class Layer extends RenderableObject {
  private readonly name: string;

  constructor(x: number, y: number, name: string) {
    super();
    this.translate(new Vector2D(x, y));
    this.name = name;
  }

  protected draw(ctx: CanvasRenderingContext2D, time: number): void {
    ctx.rect(0, 0, 390, 80);

    ctx.textAlign = 'left';
    ctx.textBaseline = 'hanging';
    ctx.fillText(this.name, 5, 5);
  }
}
