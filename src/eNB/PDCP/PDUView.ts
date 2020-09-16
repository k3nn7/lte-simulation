import * as PIXI from 'pixi.js';
import {BG_DARK_2, BG_MEDIUM_2, FG_1, FG_2} from '../../Common/colors';
import {IPPacket} from '../../Common/IP/IPPacket';
import {appear, quadraticTween} from '../../Common/tweens';
import StretchableBoxView from '../../Common/StretchableBoxView';

const ACTION_DURATION = 300;

export default class PDUView extends PIXI.Graphics {
  packetBox: StretchableBoxView;
  dataBox: StretchableBoxView;
  packet: IPPacket;
  headerBox: StretchableBoxView;
  orderNumber: OrderNumber;
  lockIcon: PIXI.Sprite;
  pduHeaderBox: StretchableBoxView;

  constructor(packet: IPPacket, resources: Partial<Record<string, PIXI.LoaderResource>>) {
    super();
    this.packet = packet;

    this.packetBox = new StretchableBoxView('IP Packet', BG_DARK_2, FG_2, 250, 20);
    this.headerBox = new StretchableBoxView('HEADER', BG_MEDIUM_2, FG_1, 125, 30);
    this.headerBox.position.set(0, 20);
    this.dataBox = new StretchableBoxView('DATA', BG_MEDIUM_2, FG_1, 124, 30);
    this.dataBox.position.set(126, 20);
    this.lockIcon = new PIXI.Sprite(resources.lock.texture);
    this.lockIcon.anchor.set(0.5, 0.5);
    this.lockIcon.width = 20;
    this.lockIcon.height = 20;
    this.lockIcon.position.set(100, 15);

    this.pivot.set(125, 25);

    this.addChild(this.packetBox);
    this.addChild(this.dataBox);
    this.addChild(this.headerBox);
  }

  async compressHeader() {
    await Promise.all([
        this.headerBox.resizeTween(80, 30, ACTION_DURATION),
        this.packetBox.resizeTween(205, 20, ACTION_DURATION),
        this.tweenDataBox(),
      ]
    );
  }

  async giveOrderNumber(orderNumber: number) {
    this.orderNumber = new OrderNumber(orderNumber);
    this.orderNumber.alpha = 0.0;
    this.orderNumber.position.set(-31, 0);
    this.addChild(this.orderNumber);

    return appear(this.orderNumber, ACTION_DURATION);
  }

  async addHeader() {
    this.pduHeaderBox = new StretchableBoxView('HDR', BG_MEDIUM_2, FG_1, 40, 50);
    this.pduHeaderBox.alpha = 0.0;
    this.pduHeaderBox.position.set(-72, 0);
    this.addChild(this.pduHeaderBox);

    return appear(this.pduHeaderBox, ACTION_DURATION);
  }

  async encryptData() {
    this.lockIcon.alpha = 0.0;
    this.dataBox.addChild(this.lockIcon);
    return appear(this.lockIcon, ACTION_DURATION);
  }

  private async tweenDataBox() {
    const position = {x: this.dataBox.position.x};
    return quadraticTween(position, {x: 81}, ACTION_DURATION, () => {
      this.dataBox.position.x = position.x;
    });
  }
}

class OrderNumber extends PIXI.Graphics {
  constructor(orderNumber: number) {
    super();

    this.beginFill(BG_MEDIUM_2);
    this.drawRect(0, 0, 30, 50);
    this.endFill();

    const caption = new PIXI.Text(
      '#' + orderNumber.toString(),
      {
        fontSize: 14,
        fill: FG_1,
      }
    );
    caption.anchor.set(0.5, 0.5);
    caption.position.set(15, 25);
    this.addChild(caption);
  }
}
