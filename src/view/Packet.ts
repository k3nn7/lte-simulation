import {RenderableObject} from "../engine/RenderableObject";
import Vector2D from "../engine/Vector2D";

export class Packet extends RenderableObject {
  private readonly bits: number;

  constructor(x: number, y: number, bits: number) {
    super();
    this.bits = bits;
    this.translate(new Vector2D(x, y));
  }

  protected draw(ctx: CanvasRenderingContext2D, time: number): void {
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.strokeRect(0, 0, 30, 30);
    ctx.fillRect(0, 0, 30, 30);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'black';
    ctx.fillText('' + this.bits, 15, 15);
  }
}
