import * as PIXI from 'pixi.js';
import Connectable from 'Common/connectable';
import {moveToThePoint, spit, swallow} from "../utils";
import {BG_MEDIUM_2} from 'Common/colors';

export default class Connector extends Connectable {
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
    this.addChild(data);
    data.scale.set(0, 0);
    data.position = this.channelAPosition;
    await spit(data, 200);
    data.activate();

    await moveToThePoint(data, this.channelBPosition, 500);
    await swallow(data, 200);
    data.stop();
    this.removeChild(data);
    this.channelB(data);
  }

  async onChannelB(data) {
    this.addChild(data);
    data.scale.set(0, 0);
    data.position = this.channelBPosition;
    await spit(data, 200);
    data.activate();

    await moveToThePoint(data, this.channelAPosition, 500);
    await swallow(data, 200);
    data.stop();
    this.removeChild(data);
    this.channelA(data);
  }
}
