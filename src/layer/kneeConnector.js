import * as PIXI from 'pixi.js';
import Connectable from 'Common/connectable';
import {BG_MEDIUM_2} from 'Common/colors';
import {moveToThePoint, spit, swallow} from "../utils";

export default class KneeConnector extends Connectable {
  constructor(componentA, componentB) {
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

    componentA.setChannelB((data) => this.onChannelA(data));

    this.setChannelB((data) => componentB.onChannelB(data));
    this.setChannelA((data) => componentA.onChannelB(data));

    this.channelAPosition = new PIXI.Point(0, 0);
    this.knee1Position = new PIXI.Point(pointB.x - pointA.x, pointB.y - pointA.y);
    this.knee2Position = new PIXI.Point(pointC.x - pointA.x, pointC.y - pointA.y);
    this.channelBPosition = new PIXI.Point(pointD.x - pointA.x, pointD.y - pointA.y);
  }

  async onChannelA(data) {
    this.addChild(data);
    data.scale.set(0, 0);
    data.position = this.channelAPosition;
    await spit(data, 200);
    data.activate();

    await moveToThePoint(data, this.knee1Position, 500);
    await moveToThePoint(data, this.knee2Position, 500);
    await moveToThePoint(data, this.channelBPosition, 500);
    await swallow(data, 200);
    data.stop();
    this.removeChild(data);
    this.channelB(data);
  }
}
