import * as PIXI from 'pixi.js';
import TWEEN from '@tweenjs/tween.js';

export class Packet extends PIXI.Container {
  constructor() {
    super();

    this.border = new PIXI.Graphics();
    this.border.beginFill(0xffffff);
    this.border.lineStyle(2, 0xaabbaa);
    this.border.drawRect(0, 0, 100, 30);
    this.border.endFill();

    this.text = new PIXI.Text('IP Packet', {fontSize: 12});

    this.addChild(this.border);
    this.addChild(this.text);
  }

  async moveDown(){
    return new Promise((resolve) => {
      const position = {x: this.x, y: this.y};
      const to = {x: this.x, y: this.y + 70};
      const tween = new TWEEN.Tween(position)
        .to(to, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          this.position.set(position.x, position.y);
        })
        .start()
        .onComplete(resolve);
    });
  }
}
