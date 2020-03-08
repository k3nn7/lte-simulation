import * as PIXI from 'pixi.js';
import {BG_DARK_2, FG_2} from "../colors";

const WIDTH = 120;
const HEIGHT = 130;
const TITLE_HEIGHT = 20;

export default class PacketBuffer extends PIXI.Graphics {
  constructor(resources, title) {
    super();

    this.lineStyle(2, BG_DARK_2);
    this.drawRect(0, 0, WIDTH, HEIGHT);

    this.beginFill(BG_DARK_2);
    this.drawRect(0, HEIGHT - TITLE_HEIGHT, WIDTH, TITLE_HEIGHT);

    this.titleObject = new PIXI.Text(
      title,
      {
        fill: FG_2,
        fontSize: 12,
      }
    );
    this.titleObject.anchor.set(0.5, 0.5);
    this.titleObject.position.set(WIDTH / 2, HEIGHT - (TITLE_HEIGHT / 2));

    this.addChild(this.titleObject);
  }
}
