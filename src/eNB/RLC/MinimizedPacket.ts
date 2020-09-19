import * as PIXI from 'pixi.js';
import {BG_MEDIUM_2} from 'Common/Colors';
import {PDCPDataUnit} from "../../Common/DataUnit/PDCPDataUnit";
import {heartbeat} from "../../Common/tweens";

export default class MinimizedPacket extends PIXI.Graphics {
  size: number;
  packets: PDCPDataUnit[];
  tween: any;

  constructor(size: number, packets: PDCPDataUnit[]) {
    super();

    this.size = size;
    this.packets = packets;

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
  }

  activate() {
    this.tween.start();
  }

  stop() {
    this.tween.stop();
  }
}
