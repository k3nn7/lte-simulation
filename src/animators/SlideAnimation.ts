import Animator from "../engine/Animator";
import Renderable from "../engine/Renderable";
import Vector2D from "../engine/Vector2D";

export class SlideAnimation extends Animator {
  slide: Vector2D;
  duration: number;

  constructor(object: Renderable, slide: Vector2D, duration: number) {
    super(object);

    this.slide = slide;
    this.duration = duration;
  }

  protected animate(ctx: CanvasRenderingContext2D, elapsed: number): void {
    const percentageElapsed = Math.min(elapsed / this.duration, 1);

    ctx.translate(percentageElapsed * this.slide.x, percentageElapsed * this.slide.y);
  }
}
