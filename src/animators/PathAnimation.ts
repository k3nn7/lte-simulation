import Animator from "../engine/Animator";
import Renderable from "../engine/Renderable";
import Vector2D from "../engine/Vector2D";

export class PathAnimation extends Animator{
  steps: Array<Vector2D>;
  duration: number;
  percentagePerStep: number;

  constructor(object: Renderable, steps: Array<Vector2D>, duration: number) {
    super(object);

    this.steps = steps;
    this.duration = duration;
    this.percentagePerStep = 1 / this.steps.length;
  }

  protected animate(ctx: CanvasRenderingContext2D, elapsed: number): void {
    const totalPercentageElapsed = Math.min(elapsed / this.duration, 1);
    const step = Math.min(Math.floor(totalPercentageElapsed / this.percentagePerStep), this.steps.length - 1);
    const stepPercentageElapsed = (totalPercentageElapsed % this.percentagePerStep) / (this.percentagePerStep - 0.01);

    if (step > 0) {
      ctx.translate(this.steps[step - 1].x, this.steps[step - 1].y);
    }

    ctx.translate(stepPercentageElapsed * this.steps[step].x, stepPercentageElapsed * this.steps[step].y);
  }
}
