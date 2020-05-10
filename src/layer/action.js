import * as PIXI from 'pixi.js';
import TWEEN from '@tweenjs/tween.js';
import {BG_DARK_2, FG_1} from 'Common/colors';

export default class Action extends PIXI.Graphics {
  constructor(resources, text) {
    super();

    const actionText = new PIXI.Text(
      text,
      {
        fill: FG_1,
        fontSize: 20,
      }
    );
    actionText.anchor.set(0, 0.5);
    actionText.position.set(30, 20);

    this.lineStyle(2, BG_DARK_2);
    this.drawRect(0, 0, actionText.width + 40, 40);

    this.bullet = new PIXI.Sprite(resources.bullet.texture);
    this.bullet.anchor.set(0.5, 0.5);
    this.bullet.scale.set(0.8, 0.8);
    this.bullet.position.set(15, 20);

    this.addChild(this.bullet);
    this.addChild(actionText);

    const scale = {scale: 1.0};
    const to = {scale: 1.3};
    this.tween = new TWEEN.Tween(scale)
      .to(to, 500)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(() => {
        this.bullet.scale.set(scale.scale, scale.scale);
      })
      .yoyo(true)
      .repeat(Infinity);
  }

  activate() {
    this.tween.start();
  }

  deactivate() {
    this.tween.stop();
  }
}
