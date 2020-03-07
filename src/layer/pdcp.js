import Layer from "./layer";
import * as PIXI from 'pixi.js';
import {BG_DARK_2, FG_1, FG_2} from "../colors";
import Action from "./action";

export default class PDCP extends Layer {
  constructor(resources) {
    super(resources, 'PDCP');

    this.actionsContainer = new PIXI.Container();
    this.actionsContainer.position.set(10, 20);

    this.sequenceActionBox = new PIXI.Graphics();
    this.sequenceActionBox.lineStyle(3, BG_DARK_2);
    this.sequenceActionBox.drawRect(0, 0, 50, 40);

    this.sequenceAction = new Action(resources, '#00');
    this.actionsContainer.addChild(this.sequenceAction);

    this.compressAction = new Action(resources, 'ROHC');
    this.compressAction.position.set(this.sequenceAction.width - 3, 0);
    this.actionsContainer.addChild(this.compressAction);

    this.encryptAction = new Action(resources, 'EPS');
    this.encryptAction.position.set(this.compressAction.width - 3 + this.compressAction.x, 0);
    this.actionsContainer.addChild(this.encryptAction);

    this.addHeaderAction = new Action(resources, 'HEADER');
    this.addHeaderAction.position.set(this.encryptAction.x + this.encryptAction.width - 3, 0);
    this.actionsContainer.addChild(this.addHeaderAction);

    this.body.addChild(this.actionsContainer);
  }
}
