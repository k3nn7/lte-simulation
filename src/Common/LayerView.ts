import * as PIXI from 'pixi.js';
import Connectable from './Connectable';
import {BG_DARK_2, BG_LIGHT_1, FG_2} from 'Common/Colors';

const HEADER_WIDTH = 30;
const BODY_WIDTH = 400;
const HEIGHT = 150;

export default class LayerView extends Connectable {
  header: PIXI.Graphics;
  body: PIXI.Graphics;

  constructor(resources: Partial<Record<string, PIXI.LoaderResource>>, caption: string) {
    super();

    this.header = this.makeHeader(resources, caption);
    this.body = this.makeBody();

    this.addChild(this.header, this.body);
  }

  private makeHeader(resources: Partial<Record<string, PIXI.LoaderResource>>, caption: string) {
    const header = new PIXI.Graphics();
    header.beginFill(BG_DARK_2);
    header.drawRect(0, 0, HEADER_WIDTH, HEIGHT);
    header.endFill();

    const headerText = new PIXI.Text(caption, {
      fill: FG_2,
      fontSize: 20,
      align: 'center',
    });
    headerText.position.set(HEADER_WIDTH / 2, HEIGHT / 2);
    headerText.anchor.set(0.5, 0.5);
    headerText.rotation = -0.5 * Math.PI;

    const helpIcon = new PIXI.Sprite(resources.helpIcon.texture);
    helpIcon.width = helpIcon.height = HEADER_WIDTH * 0.80;
    helpIcon.anchor.set(0.5, 0);
    helpIcon.position.set(HEADER_WIDTH / 2, 5);

    header.addChild(headerText, helpIcon);

    return header;
  }

  private makeBody() {
    const body = new PIXI.Graphics();
    body.beginFill(BG_LIGHT_1);
    body.drawRect(0, 0, BODY_WIDTH, HEIGHT);
    body.position.set(HEADER_WIDTH, 0);
    body.endFill();

    return body;
  }
}
