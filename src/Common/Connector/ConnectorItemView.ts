import * as PIXI from 'pixi.js';
import {heartbeat} from 'Common/tweens';
import {IPPacket} from 'Common/IP/IPPacket';
import {BG_MEDIUM_2} from 'Common/colors';

export class ConnectorItemView extends PIXI.Graphics {
  tween: any;

  constructor(data: IPPacket) {
    super();

    this.beginFill(BG_MEDIUM_2);
    this.tint = data.tint;
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
