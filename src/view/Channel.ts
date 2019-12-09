import {RenderableObject} from "../engine/RenderableObject";

export class Channel extends RenderableObject {
  private bits: number;

  constructor(bits: number) {
    super();

    this.bits = bits;
  }

  public addBits(bits: number) {
    this.bits += bits;
  }

  protected draw(ctx: CanvasRenderingContext2D, time: number): void {
    ctx.arc(0, 0, 15, 0, 2 * Math.PI);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('' + this.bits, 0, 0);
  }
}
