import * as PIXI from 'pixi.js';
import {BG_MEDIUM_3} from 'Common/Colors';
import {timeTween} from "../../Common/tweens";

const START_ANGLE = -Math.PI / 2;

export default class TimerView extends PIXI.Container {
  timer: PIXI.Graphics;
  isCounting: boolean;
  isFinished: boolean;

  constructor() {
    super();

    this.timer = new PIXI.Graphics();
    this.drawTimer(START_ANGLE);
    this.addChild(this.timer);
    this.isCounting = false;
    this.isFinished = false;
  }

  drawTimer(angle: number) {
    this.timer.clear();
    this.timer.beginFill(BG_MEDIUM_3);
    this.timer.arc(0, 0, 10, angle, 1.5 * Math.PI);
    this.timer.lineTo(0, 0);
    this.timer.endFill();
  }

  async startCounting(time: number): Promise<void> {
    return new Promise(resolve => timeTween(
      (angle: number) => {
        this.drawTimer(angle);
      },
      () => {
        this.isCounting = true;
        this.isFinished = false;
      },
      () => {
        this.isCounting = false;
        this.isFinished = true;
        resolve();
      },
      time
    ));
  }
}
