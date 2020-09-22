import * as PIXI from 'pixi.js';
import {heartbeat} from 'Common/tweens';
import {BG_MEDIUM_2} from 'Common/Colors';
import {DataUnit, Type} from 'Common/DataUnit';

export class ConnectorItemView extends PIXI.Graphics {
  tween: any;
  dataUnit: DataUnit;

  constructor(dataUnit: DataUnit) {
    super();

    this.dataUnit = dataUnit;
    this.beginFill(BG_MEDIUM_2);
    this.tint = dataUnit.tint;
    this.draw(dataUnit.type);
    this.endFill();

    this.tween = heartbeat(this);
  }

  activate() {
    this.tween.start();
  }

  stop() {
    this.tween.stop();
  }

  private draw(type: Type) {
    switch (type) {
      case Type.Data:
        this.drawCircle(0, 0, 10);
        break;
      case Type.Ack:
        this.drawPolygon([
          new PIXI.Point(0, -10),
          new PIXI.Point(10, 10),
          new PIXI.Point(-10, 10),
          new PIXI.Point(0, -10),
        ]);
    }
  }
}
