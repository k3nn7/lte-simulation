import Renderable from "../engine/Renderable";

export default class Circle implements Renderable {
  radius: number;
  text: string;

  constructor(radius: number, text: string = null) {
    this.radius = radius;
    this.text = text;
  }

  setText(text: string) {
    this.text = text;
  }

  render(ctx: CanvasRenderingContext2D, time: number): void {
    ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);

    if (this.text) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeText(this.text, 0, 0, this.radius * 2);
    }
  }
}
