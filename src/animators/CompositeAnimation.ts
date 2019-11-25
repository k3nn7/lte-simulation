import Animator from "../engine/Animator";
import Renderable from "../engine/Renderable";

export class CompositeAnimation extends Animator {
  steps: Array<Animator>;

  constructor(object: Renderable, steps: Array<Animator>) {
    super(object);

    this.steps = steps;
  }

  protected animate(ctx: CanvasRenderingContext2D, elapsed: number): void {
    
  }
}
