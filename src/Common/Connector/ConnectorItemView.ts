import * as PIXI from 'pixi.js';
import {heartbeat} from 'Common/tweens';
import {BG_MEDIUM_2} from 'Common/colors';
import {DataUnit} from "../DataUnit";

export class ConnectorItemView extends PIXI.Graphics {
  tween: any;

  constructor(dataUnit: DataUnit) {
    super();

    this.beginFill(BG_MEDIUM_2);
    this.tint = dataUnit.tint;
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
