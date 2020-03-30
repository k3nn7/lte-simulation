import * as PIXI from 'pixi.js';
import {BG_MEDIUM_2} from "../colors";

export default class KneeConnector extends PIXI.Graphics {
  constructor(from, to) {
    super();

    this.lineStyle(3, BG_MEDIUM_2);
    this.moveTo(
      from.x + (from.width / 2),
      from.y + from.height
    );

    this.lineTo(
      from.x + (from.width / 2),
      from.y + from.height + 50
    );

    this.lineTo(
      to.x + (to.width / 2) + 600,
      to.y + to.height + 50
    );

    this.lineTo(
      to.x + (to.width / 2) + 600,
      to.y + to.height
    );
  }
}
