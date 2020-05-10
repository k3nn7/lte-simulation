import * as PIXI from 'pixi.js';
import {BG_MEDIUM_2} from 'Common/colors';
import TWEEN from "@tweenjs/tween.js";

export default class ConnectorItemView extends PIXI.Graphics {
  constructor(data) {
    super();
    this.data = data;

    this.beginFill(BG_MEDIUM_2);
    this.tint = data.tint;
    this.drawCircle(0, 0, 10);
    this.endFill();

    const scale = {scale: 1.0};
    const to = {scale: 1.3};
    this.tween = new TWEEN.Tween(scale)
      .to(to, 500)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(() => {
        this.scale.set(scale.scale, scale.scale)
      })
      .yoyo(true)
      .repeat(Infinity);
  }

  activate() {
    this.tween.start();
  }

  stop() {
    this.tween.stop();
  }
}
