import Renderable from "./Renderable";
import Vector2D from "./Vector2D";

export abstract class RenderableObject implements Renderable {
  protected translation: Vector2D = new Vector2D(0, 0);

  protected abstract draw(ctx: CanvasRenderingContext2D, time: number): void;

  public translate(translation: Vector2D) {
    this.translation = translation;
  }

  public getTranslation(): Vector2D {
    return this.translation;
  }

  public render(ctx: CanvasRenderingContext2D, time: number): void {
    ctx.save();
    ctx.translate(this.translation.x, this.translation.y);
    ctx.beginPath();
    this.draw(ctx, time);
    ctx.stroke();
    ctx.restore();
  }
}
