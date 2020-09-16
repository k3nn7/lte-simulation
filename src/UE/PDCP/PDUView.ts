import * as PIXI from 'pixi.js';
import {BG_DARK_2, BG_MEDIUM_2, FG_1, FG_2} from '../../Common/colors';
import {appear, disappear, quadraticTween} from '../../Common/tweens';
import StretchableBoxView from '../../Common/StretchableBoxView';
import {PDCPDataUnit} from "../../Common/DataUnit/PDCPDataUnit";

const ACTION_DURATION = 200;

export default class PDUView extends PIXI.Graphics {
  packetBox: StretchableBoxView;
  dataBox: StretchableBoxView;
  packet: PDCPDataUnit;
  headerBox: StretchableBoxView;
  sequenceNumber: SequenceNumber;
  lockIcon: PIXI.Sprite;
  pduHeaderBox: StretchableBoxView;

  constructor(packet: PDCPDataUnit, resources: Partial<Record<string, PIXI.LoaderResource>>) {
    super();
    this.packet = packet;

    this.packetBox = new StretchableBoxView('IP Packet', BG_DARK_2, FG_2, 205, 20);
    this.headerBox = new StretchableBoxView('HEADER', BG_MEDIUM_2, FG_1, 80, 30);
    this.headerBox.position.set(0, 20);
    this.dataBox = new StretchableBoxView('DATA', BG_MEDIUM_2, FG_1, 124, 30);
    this.dataBox.position.set(81, 20);
    this.lockIcon = new PIXI.Sprite(resources.lock.texture);
    this.lockIcon.anchor.set(0.5, 0.5);
    this.lockIcon.width = 20;
    this.lockIcon.height = 20;
    this.lockIcon.position.set(100, 15);
    this.dataBox.addChild(this.lockIcon);

    this.sequenceNumber = new SequenceNumber(packet.sequenceNumber);
    this.sequenceNumber.position.set(-31, 0);

    this.pduHeaderBox = new StretchableBoxView('HDR', BG_MEDIUM_2, FG_1, 40, 50);
    this.pduHeaderBox.position.set(-72, 0);

    this.pivot.set(125, 25);

    this.addChild(this.pduHeaderBox);
    this.addChild(this.sequenceNumber);
    this.addChild(this.packetBox);
    this.addChild(this.dataBox);
    this.addChild(this.headerBox);
  }

  async compressHeader() {
    await Promise.all([
        this.headerBox.resizeTween(125, 30, ACTION_DURATION),
        this.packetBox.resizeTween(250, 20, ACTION_DURATION),
        this.tweenDataBox(),
      ]
    );
  }

  async setSequenceNumber(sequenceNumber: number) {
    this.sequenceNumber = new SequenceNumber(sequenceNumber);
    this.sequenceNumber.alpha = 0.0;
    this.sequenceNumber.position.set(-31, 0);
    this.addChild(this.sequenceNumber);

    return appear(this.sequenceNumber, ACTION_DURATION);
  }

  async addHeader() {
    await disappear(this.pduHeaderBox, ACTION_DURATION);
    this.removeChild(this.pduHeaderBox);
  }

  async encryptData() {
    await disappear(this.lockIcon, ACTION_DURATION);
    this.dataBox.removeChild(this.lockIcon);
  }

  private async tweenDataBox() {
    const position = {x: this.dataBox.position.x};
    return quadraticTween(position, {x: 126}, ACTION_DURATION, () => {
      this.dataBox.position.x = position.x;
    });
  }
}

class SequenceNumber extends PIXI.Graphics {
  constructor(sequenceNumber: number) {
    super();

    this.beginFill(BG_MEDIUM_2);
    this.drawRect(0, 0, 30, 50);
    this.endFill();

    const caption = new PIXI.Text(
      '#' + sequenceNumber.toString(),
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
