import Renderable from "./Renderable";
import {RenderableObject} from "./RenderableObject";

export default abstract class Animator extends RenderableObject {
  startTime: number;
  object: Renderable;

  protected constructor(object: Renderable) {
    super();

    this.startTime = null;
    this.object = object;
  }

  protected abstract animate(ctx: CanvasRenderingContext2D, elapsed: number): void

  protected draw(ctx: CanvasRenderingContext2D, time: number): void {
    if (!this.startTime) {
      this.startTime = time;
    }

    this.animate(ctx, time - this.startTime);

    this.object.render(ctx, time);
  }
}
