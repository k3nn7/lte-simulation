import * as PIXI from 'pixi.js';
import {BG_DARK_2, FG_2} from 'Common/colors';

export default class BufferView extends PIXI.Graphics {
  title: PIXI.Text;

  constructor(resources: Partial<Record<string, PIXI.LoaderResource>>, title: string) {
    super();


    this.lineStyle(2, BG_DARK_2);
    this.drawRect(0, 0, 120, 130);

    this.beginFill(BG_DARK_2);
    this.drawRect(0, 130 - 20, 120, 20);

    this.title = new PIXI.Text(
      title,
      {
        fill: FG_2,
        fontSize: 12,
      }
    );
    this.title.anchor.set(0.5, 0.5);
    this.title.position.set(60, 130 - (20 / 2));

    this.addChild(this.title);
  }
}
