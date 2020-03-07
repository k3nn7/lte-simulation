import * as PIXI from 'pixi.js';
import {BG_DARK_2, BG_LIGHT_1, FG_2} from '../colors';

const HEADER_WIDTH = 30;
const BODY_WIDTH = 400;
const HEIGHT = 150;

export default class Layer extends PIXI.Container {
  constructor(resources, caption) {
    super();

    this.header = new PIXI.Graphics();
    this.header.beginFill(BG_DARK_2);
    this.header.drawRect(0, 0, HEADER_WIDTH, HEIGHT);
    this.header.endFill();

    this.headerText = new PIXI.Text(caption, {
      fill: FG_2,
      fontSize: 20,
      align: 'center',
    });
    this.headerText.position.set(HEADER_WIDTH / 2, HEIGHT / 2);
    this.headerText.anchor.set(0.5, 0.5);
    this.headerText.rotation = -0.5 * Math.PI;

    this.helpIcon = new PIXI.Sprite(resources.helpIcon.texture);
    this.helpIcon.width = this.helpIcon.height = HEADER_WIDTH * 0.80;
    this.helpIcon.anchor.set(0.5, 0);
    this.helpIcon.position.set(HEADER_WIDTH / 2, 5);

    this.body = new PIXI.Graphics();
    this.body.beginFill(BG_LIGHT_1);
    this.body.drawRect(0, 0, BODY_WIDTH, HEIGHT);
    this.body.position.set(HEADER_WIDTH, 0);
    this.body.endFill();

    this.addChild(this.header);
    this.header.addChild(this.headerText);
    this.header.addChild(this.helpIcon);
    this.addChild(this.body);
  }
}
