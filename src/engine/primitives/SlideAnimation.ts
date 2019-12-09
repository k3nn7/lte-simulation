import Vector2D from "../Vector2D";
import Animator from "../Animator";
import Renderable from "../Renderable";

export class SlideAnimation extends Animator {
  slide: Vector2D;
  duration: number;
  promise: Promise<void>;
  resolve: () => void;

  constructor(object: Renderable, slide: Vector2D, duration: number) {
    super(object);

    this.slide = slide;
    this.duration = duration;
    this.promise = new Promise<void>((resolve) => {
      this.resolve = resolve;
    });
  }

  async waitFor() {
    return this.promise;
  }

  protected animate(ctx: CanvasRenderingContext2D, elapsed: number): void {
    const percentageElapsed = Math.min(elapsed / this.duration, 1);
    if (percentageElapsed === 1) {
      this.resolve();
    }

    ctx.translate(percentageElapsed * this.slide.x, percentageElapsed * this.slide.y);
  }
}
