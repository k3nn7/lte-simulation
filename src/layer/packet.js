import * as PIXI from 'pixi.js';
import {BG_MEDIUM_2, FG_1} from 'Common/colors';
import TWEEN from "@tweenjs/tween.js";

export default class Packet extends PIXI.Graphics {
  constructor() {
    super();

    this.beginFill(BG_MEDIUM_2);
    this.drawRoundedRect(0, 0, 200, 40, 10);
    this.endFill();

    this.caption = new PIXI.Text(
      'IP Packet',
      {
        fontSize: 20,
        fill: FG_1,
      }
    );
    this.caption.anchor.set(0.5, 0.5);
    this.caption.position.set(100, 20);

    this.pivot.set(100, 20);

    this.addChild(this.caption);
  }

  activate() {
    const scale = {scale: 1.0};
    const to = {scale: 1.3};
    const tween = new TWEEN.Tween(scale)
      .to(to, 500)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(() => {
        this.scale.set(scale.scale, scale.scale)
      })
      .yoyo(true)
      .repeat(Infinity)
      .start();
  }

  async minimize() {
    return new Promise((resolve) => {
      const size = {width: 200, height: 40, alpha: 1.0};
      const to = {width: 30, height: 30, alpha: 0.0};
      const tween = new TWEEN.Tween(size)
        .to(to, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          this.width = size.width;
          this.height = size.height;
          this.caption.alpha = size.alpha;
        })
        .start()
        .onComplete(resolve);
    });
  }
}
