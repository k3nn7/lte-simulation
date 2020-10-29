import * as PIXI from 'pixi.js';
import Connectable, {Channel} from 'Common/Connectable';
import {BG_MEDIUM_2} from 'Common/Colors';
import {moveToThePoint, scaleDown, scaleUp} from 'Common/tweens';
import {DataUnit} from "../DataUnit";
import {ConnectorItemView} from "./ConnectorItemView";

export default class EntitiesConnector extends Connectable {
  channelAPosition: PIXI.Point;
  channelBPosition: PIXI.Point;
  knee1Position: PIXI.Point;
  knee2Position: PIXI.Point;
  connected: boolean;

  constructor(componentA: Connectable, componentB: Connectable) {
    super();

    const pointA = new PIXI.Point(
      componentA.x + (componentA.width / 2),
      componentA.y + componentA.height
    );
    const pointB = new PIXI.Point(
      pointA.x,
      pointA.y + 50
    );
    const pointC = new PIXI.Point(
      componentB.x + (componentB.width / 2) + 600,
      pointB.y
    );
    const pointD = new PIXI.Point(
      pointC.x,
      componentB.y + componentB.height
    );

    this.lineStyle(3, BG_MEDIUM_2);
    this.position = pointA;
    this.lineTo(pointB.x - pointA.x, pointB.y - pointA.y);
    this.lineTo(pointC.x - pointA.x, pointC.y - pointA.y);
    this.lineTo(pointD.x - pointA.x, pointD.y - pointA.y);

    this.channelAPosition = new PIXI.Point(0, 0);
    this.knee1Position = new PIXI.Point(pointB.x - pointA.x, pointB.y - pointA.y);
    this.knee2Position = new PIXI.Point(pointC.x - pointA.x, pointC.y - pointA.y);
    this.channelBPosition = new PIXI.Point(pointD.x - pointA.x, pointD.y - pointA.y);

    componentA.setChannelB((dataUnit: DataUnit) => this.onChannelA(dataUnit));
    componentB.setChannelB((dataUnit: DataUnit) => this.onChannelB(dataUnit));

    this.setChannelA((dataUnit: DataUnit) => componentA.onChannelB(dataUnit));
    this.setChannelB((dataUnit: DataUnit) => componentB.onChannelB(dataUnit));
    this.connected = true;
  }

  async onChannelA(data: DataUnit) {
    if (!this.connected) return;

    await this.transferData(
      data,
      [this.channelAPosition, this.knee1Position, this.knee2Position, this.channelBPosition],
      this.channelB
    );
  }

  async onChannelB(data: DataUnit) {
    if (!this.connected) return;

    await this.transferData(
      data,
      [this.channelBPosition, this.knee2Position, this.knee1Position, this.channelAPosition],
      this.channelA
    );
  }

  async transferData(dataUnit: DataUnit, path: PIXI.Point[], channel: Channel) {
    const itemView = new ConnectorItemView(dataUnit);
    this.addChild(itemView);
    itemView.scale.set(0, 0);
    itemView.position = path[0];
    await scaleUp(itemView, 200);
    itemView.activate();

    for (let i = 1; i < path.length; i++) {
      await moveToThePoint(itemView, path[i], 500);
    }

    await scaleDown(itemView, 200);
    itemView.stop();
    this.removeChild(itemView);
    channel(itemView.dataUnit);
  }

  switchConnection() {
    if (this.connected) {
      this.connected = false;
      this.alpha = 0.2;
    } else {
      this.connected = true;
      this.alpha = 1.0;
    }
  }
}
