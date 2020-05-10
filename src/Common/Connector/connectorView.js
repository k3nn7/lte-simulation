import * as PIXI from 'pixi.js';
import Connectable from 'Common/connectable';
import {BG_MEDIUM_2} from 'Common/colors';
import {moveToThePoint, scaleDown, scaleUp} from 'Common/tweens';
import ConnectorItemView from 'Common/Connector/connectorItemView';

export default class ConnectorView extends Connectable {
  constructor(componentA, componentB) {
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

    componentA.setChannelB((data) => this.onChannelA(data));
    componentB.setChannelA((data) => this.onChannelB(data));

    this.setChannelB((data) => componentB.onChannelA(data));
    this.setChannelA((data) => componentA.onChannelB(data));
  }

  async onChannelA(data) {
    const itemView = new ConnectorItemView(data);
    this.addChild(itemView);
    itemView.scale.set(0, 0);
    itemView.position = this.channelAPosition;
    await scaleUp(itemView, 200);
    itemView.activate();

    await moveToThePoint(itemView, this.channelBPosition, 500);
    await scaleDown(itemView, 200);
    itemView.stop();
    this.removeChild(itemView);
    this.channelB(data);
  }

  async onChannelB(data) {
    const itemView = new ConnectorItemView(data);
    this.addChild(itemView);
    itemView.scale.set(0, 0);
    itemView.position = this.channelBPosition;
    await scaleUp(itemView, 200);
    itemView.activate();

    await moveToThePoint(itemView, this.channelAPosition, 500);
    await scaleDown(itemView, 200);
    itemView.stop();
    this.removeChild(itemView);
    this.channelA(data);
  }
}
