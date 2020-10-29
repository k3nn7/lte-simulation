import * as PIXI from 'pixi.js';
import {BG_MEDIUM_2} from 'Common/Colors';
import {heartbeat} from "../../Common/tweens";
import {DataUnit, Type} from 'Common/DataUnit';
import FlatSDU from "./FlatSDU";

export default class MinimizedPacket extends PIXI.Graphics implements DataUnit {
  size: number;
  sdu: FlatSDU
  tween: any;
  type: Type;

  constructor(size: number, sdu: FlatSDU) {
    super();

    this.size = size;
    this.sdu = sdu;

    const val1 = Math.random(),
      val2 = Math.random(),
      val3 = Math.random();
    const tint = PIXI.utils.rgb2hex([
      val1,
      val2,
      val3,
    ]);

    this.beginFill(BG_MEDIUM_2);
    this.tint = tint;
    this.drawCircle(0, 0, 10);
    this.endFill();

    this.tween = heartbeat(this);
    this.type = Type.Data;
  }

  activate() {
    this.tween.start();
  }

  stop() {
    this.tween.stop();
  }
}
