import * as PIXI from 'pixi.js';
import {BG_MEDIUM_2} from 'Common/colors';
import {moveToThePoint, scaleDown, scaleUp} from 'Common/tweens';
import {ConnectorItemView} from 'Common/Connector/ConnectorItemView';
import Connectable, {Channel} from 'Common/Connectable';

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

    componentA.setChannelB((data: any) => this.onChannelA(data));
    componentB.setChannelA((data: any) => this.onChannelB(data));

    this.setChannelB((data: any) => componentB.onChannelA(data));
    this.setChannelA((data: any) => componentA.onChannelB(data));
  }

  async onChannelA(data: any) {
    await this.transferData(
      data,
      this.channelAPosition,
      this.channelBPosition,
      this.channelB,
    );
  }

  async onChannelB(data: any) {
    await this.transferData(
      data,
      this.channelBPosition,
      this.channelAPosition,
      this.channelA
    );
  }

  async transferData(data: any, from: PIXI.Point, to: PIXI.Point, channel: Channel) {
    const itemView = new ConnectorItemView(data);
    this.addChild(itemView);
    itemView.scale.set(0, 0);
    itemView.position = from;
    await scaleUp(itemView, 200);
    itemView.activate();

    await moveToThePoint(itemView, to, 500);
    await scaleDown(itemView, 200);
    itemView.stop();
    this.removeChild(itemView);
    channel(data);
  }
}
