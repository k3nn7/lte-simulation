import Renderable from "../engine/Renderable";

export default class Box implements Renderable {
  width: number;
  height: number;
  text: string;

  constructor(width: number, height: number, text: string = null) {
    this.width = width;
    this.height = height;
    this.text = text;
  }

  render(ctx: CanvasRenderingContext2D, time: number): void {
    ctx.rect(0, 0, this.width, this.height);

    if (this.text) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText(this.text, this.width / 2, this.height / 2, this.width);
    }
  }
}
