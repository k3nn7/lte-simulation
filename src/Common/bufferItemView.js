import * as PIXI from 'pixi.js';
import {BG_MEDIUM_2, FG_1} from 'Common/colors';

export default class BufferItemView extends PIXI.Graphics {
  constructor(wrappedItem, caption) {
    super();

    this.wrappedItem = wrappedItem;

    this.beginFill(BG_MEDIUM_2);
    this.drawRect(0, 0, this.wrappedItem.size, 16);
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
  }
}
