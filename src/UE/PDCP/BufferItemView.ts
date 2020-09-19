import * as PIXI from 'pixi.js';
import {BG_MEDIUM_2, FG_1} from 'Common/Colors';
import {PDCPDataUnit} from 'Common/DataUnit/PDCPDataUnit';

export default class BufferItemView extends PIXI.Graphics {
  wrappedItem: PDCPDataUnit;
  sequenceNumber: PIXI.Text;
  caption: PIXI.Text;

  constructor(wrappedItem: PDCPDataUnit, caption: string) {
    super();

    this.wrappedItem = wrappedItem;

    this.beginFill(BG_MEDIUM_2);
    this.drawRect(0, 0, 20, 16);
    this.drawRect(21, 0, this.wrappedItem.ipPacket.size, 16);
    this.endFill();

    this.caption = new PIXI.Text(
      caption,
      {
        fontSize: 8,
        fill: FG_1,
      }
    );
    this.caption.anchor.set(0.5, 0.5);
    this.caption.position.set(this.width / 2, this.height / 2);
    this.addChild(this.caption);

    this.sequenceNumber = new PIXI.Text(
      '#' + this.wrappedItem.sequenceNumber.toString(),
      {
        fontSize: 10,
        fill: FG_1,
      }
    );
    this.sequenceNumber.anchor.set(0.5, 0.5);
    this.sequenceNumber.position.set(10, 8);
    this.addChild(this.sequenceNumber);
  }
}
