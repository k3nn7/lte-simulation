import * as PIXI from 'pixi.js';
import {BG_DARK_2, FG_1} from 'Common/Colors';
import Connectable from 'Common/Connectable';

export default class ChannelView extends Connectable {
  constructor(name: string, captionOnBottom: boolean = false) {
    super();

    this.beginFill(BG_DARK_2);
    if (captionOnBottom) {
      this.drawRoundedRect(0, 0, 30, 15, 5);
    } else {
      this.drawRoundedRect(0, 15, 30, 15, 5);
    }
    this.endFill();

    const caption = new PIXI.Text(name, {
      fill: FG_1,
      fontSize: 10,
      align: 'center',
    });
    if (captionOnBottom) {
      caption.position.set(15, 20);
      caption.anchor.set(0.5, 0.0);
    } else {
      caption.position.set(15, 0);
      caption.anchor.set(0.5, 0.0);
    }
    this.addChild(caption);

    this.interactive = true;
    this.buttonMode = true;
    this.on('mouseover', () => {
      this.tint = 0xaeaeae;
    });
    this.on('mouseout', () => {
      this.tint = 0xffffff;
    });
  }
}
