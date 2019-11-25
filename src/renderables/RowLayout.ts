import Renderable from "../engine/Renderable";

export default class RowLayout implements Renderable {
  objects: Array<Renderable>;
  padding: number;

  constructor(padding: number) {
    this.objects = new Array<Renderable>();
    this.padding = padding;
  }

  addObject(object: Renderable) {
    this.objects.push(object);
  }

  render(ctx: CanvasRenderingContext2D, time: number): void {
    this.objects.forEach((object: Renderable) => {
      ctx.beginPath();
      object.render(ctx, time);
      ctx.translate(this.padding, 0);
      ctx.stroke();
    });
  }
}
