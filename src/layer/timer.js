import * as PIXI from 'pixi.js';
import TWEEN from "@tweenjs/tween.js";
import {BG_MEDIUM_3} from "../colors";

const START_ANGLE = -Math.PI / 2;

export default class Timer extends PIXI.Container {
  constructor() {
    super();

    this.timer = new PIXI.Graphics();
    this.drawTimer(START_ANGLE);
    this.addChild(this.timer);
  }

  drawTimer(angle) {
    this.timer.clear();
    this.timer.beginFill(BG_MEDIUM_3);
    this.timer.arc(0, 0, 10, angle, 1.5 * Math.PI);
    this.timer.lineTo(0, 0);
    this.timer.endFill();
  }

  async startCounting(time) {
    return new Promise(resolve => {
      const angle = {angle: START_ANGLE};
      const to = {angle: 1.5 * Math.PI};
      const tween = new TWEEN.Tween(angle)
        .to(to, time)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(() => {
          this.drawTimer(angle.angle);
        })
        .start()
        .onComplete(resolve);
    });
  }
}
