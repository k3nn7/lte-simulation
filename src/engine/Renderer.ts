import Renderable from "./Renderable";

export default class Renderer {
  ctx: CanvasRenderingContext2D;
  objects: Array<Renderable>;

  public constructor(context: CanvasRenderingContext2D) {
    this.ctx = context;
    this.objects = Array<Renderable>();
  }

  public addObject(object: Renderable): number {
    return this.objects.push(object) - 1;
  }

  public removeObject(i: number) {
    delete this.objects[i];
  }

  public render() {
    this.clearScreen();

    const now = (new Date()).getTime();

    this.objects.forEach((object: Renderable) => {
      this.ctx.save();
      this.ctx.strokeStyle = 'black';
      this.ctx.beginPath();
      object.render(this.ctx, now);
      this.ctx.stroke();
      this.ctx.restore();
    });

  }

  private clearScreen() {
    this.ctx.fillStyle = 'black';
    this.ctx.strokeStyle = 'black';
    this.ctx.clearRect(
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height
    );
  }
}
