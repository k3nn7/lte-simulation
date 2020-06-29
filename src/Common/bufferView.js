import * as PIXI from 'pixi.js';
import {BG_DARK_2, FG_2} from 'Common/colors';

export default class BufferView extends PIXI.Graphics {
  constructor(resources, title) {
    super();

    this.WIDTH = 120;
    this.HEIGHT = 130;
    this.TITLE_HEIGHT = 20;

    this.lineStyle(2, BG_DARK_2);
    this.drawRect(0, 0, this.WIDTH, this.HEIGHT);

    this.beginFill(BG_DARK_2);
    this.drawRect(0, this.HEIGHT - this.TITLE_HEIGHT, this.WIDTH, this.TITLE_HEIGHT);

    this.title = new PIXI.Text(
      title,
      {
        fill: FG_2,
        fontSize: 12,
      }
    );
    this.title.anchor.set(0.5, 0.5);
    this.title.position.set(this.WIDTH / 2, this.HEIGHT - (this.TITLE_HEIGHT / 2));

    this.addChild(this.title);
  }
}
