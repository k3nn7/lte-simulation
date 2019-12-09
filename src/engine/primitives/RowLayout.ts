import {RenderableObject} from "../RenderableObject";
import Vector2D from "../Vector2D";

export default class RowLayout extends RenderableObject {
  objects: Array<RenderableObject>;
  padding: number;

  constructor(padding: number) {
    super();
    this.objects = new Array<RenderableObject>();
    this.padding = padding;
  }

  addObject(object: RenderableObject) {
    this.objects.push(object);
  }

  protected draw(ctx: CanvasRenderingContext2D, time: number): void {
    this.objects.forEach((object: RenderableObject, i: number) => {
      object.translate(new Vector2D(this.padding * i, 0));
      object.render(ctx, time);
    });
  }
}
