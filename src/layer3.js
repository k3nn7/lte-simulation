import * as PIXI from 'pixi.js';

export class Layer3 extends PIXI.Container {
  constructor(name) {
    super();

    const title = new PIXI.Text(
      name,
      {
        align: 'center',
        fontSize: 15,
      }
    );
    title.position.set(10, 10);

    this.border = new PIXI.Graphics();
    this.border.beginFill(0xffffff);
    this.border.lineStyle(4, 0xa1e6e1);
    this.border.drawRect(0, 0, 250, 70);
    this.border.endFill();

    this.border.addChild(title);

    this.addChild(this.border);
  }
}
