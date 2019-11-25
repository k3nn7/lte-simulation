export default interface Renderable {
  render(ctx: CanvasRenderingContext2D, time: number): void;
}
