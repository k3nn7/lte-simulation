import * as PIXI from 'pixi.js';
import {BG_MEDIUM_2} from 'Common/colors';
import {moveToThePoint, scaleDown, scaleUp} from 'Common/tweens';
import {ConnectorItemView} from 'Common/Connector/ConnectorItemView';
import Connectable, {Channel} from 'Common/Connectable';
import {DataUnit} from "../DataUnit";

export class ConnectorView extends Connectable {
  channelAPosition: PIXI.Point;
  channelBPosition: PIXI.Point;

  constructor(componentA: Connectable, componentB: Connectable) {
    super();

    const startPointPosition = new PIXI.Point(
      componentA.x + (componentA.width / 2),
      componentA.y + componentA.height
    );
    const endPointPosition = new PIXI.Point(
      componentB.x + (componentB.width / 2),
      componentB.y
    );

    this.position = startPointPosition;
    this.lineStyle(3, BG_MEDIUM_2);
    this.lineTo(
      endPointPosition.x - startPointPosition.x,
      endPointPosition.y - startPointPosition.y
    );

    this.channelAPosition = new PIXI.Point(0, 0);
    this.channelBPosition = new PIXI.Point(
      endPointPosition.x - startPointPosition.x,
      endPointPosition.y - startPointPosition.y
    );

    componentA.setChannelB((dataUnit: DataUnit) => this.onChannelA(dataUnit));
    componentB.setChannelA((dataUnit: DataUnit) => this.onChannelB(dataUnit));

    this.setChannelB((dataUnit: DataUnit) => componentB.onChannelA(dataUnit));
    this.setChannelA((dataUnit: DataUnit) => componentA.onChannelB(dataUnit));
  }

  async onChannelA(dataUnit: DataUnit) {
    await this.transferData(
      dataUnit,
      this.channelAPosition,
      this.channelBPosition,
      this.channelB,
    );
  }

  async onChannelB(dataUnit: DataUnit) {
    await this.transferData(
      dataUnit,
      this.channelBPosition,
      this.channelAPosition,
      this.channelA
    );
  }

  async transferData(dataUnit: DataUnit, from: PIXI.Point, to: PIXI.Point, channel: Channel) {
    const itemView = new ConnectorItemView(dataUnit);
    this.addChild(itemView);
    itemView.scale.set(0, 0);
    itemView.position = from;
    await scaleUp(itemView, 200);
    itemView.activate();

    await moveToThePoint(itemView, to, 500);
    await scaleDown(itemView, 200);
    itemView.stop();
    this.removeChild(itemView);
    channel(dataUnit);
  }
}
