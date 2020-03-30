import * as PIXI from 'pixi.js';
import {BG_MEDIUM_2, FG_1} from "../colors";
import TWEEN from "@tweenjs/tween.js";

export default class MinimizedPacket extends PIXI.Graphics {
  constructor() {
    super();

    const val = Math.random();
    const tint = PIXI.utils.rgb2hex([
      val,
      val,
      val,
    ]);

    this.beginFill(BG_MEDIUM_2);
    this.tint = tint;
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
