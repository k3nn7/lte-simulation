import Renderable from "./Renderable";

export default abstract class Animator implements Renderable{
  startTime: number;
  object: Renderable;

  constructor(object: Renderable) {
    this.startTime = null;
    this.object = object;
  }

  render(ctx: CanvasRenderingContext2D, time: number): void {
    if (!this.startTime) {
      this.startTime = time;
    }

    this.animate(ctx, time - this.startTime);

    this.object.render(ctx, time);
  }

  protected abstract animate(ctx: CanvasRenderingContext2D, elapsed: number): void
}
