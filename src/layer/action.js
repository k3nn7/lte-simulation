import Layer from "./layer";
import * as PIXI from 'pixi.js';
import {BG_DARK_2, FG_1, FG_2} from "../colors";

export default class Action extends PIXI.Graphics {
  constructor(resources, text) {
    super();

    const actionText = new PIXI.Text(
      text,
      {
        fill: FG_1,
        fontSize: 20,
      }
    );
    actionText.anchor.set(0, 0.5);
    actionText.position.set(30, 20);

    this.lineStyle(3, BG_DARK_2);
    this.drawRect(0, 0, actionText.width + 40, 40);

    const bullet = new PIXI.Sprite(resources.bullet.texture);
    bullet.anchor.set(0, 0.5);
    bullet.scale.set(0.8, 0.8);
    bullet.position.set(10, 20);

    this.addChild(bullet);
    this.addChild(actionText);
  }
}
