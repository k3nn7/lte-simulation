import Layer from "./layer";
import * as PIXI from 'pixi.js';
import {BG_DARK_2, FG_1, FG_2} from "../colors";
import Action from "./action";
import Packet from "./packet";
import TWEEN from "@tweenjs/tween.js";
import {sleep} from "../utils";

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
    this.compressAction.position.set(this.sequenceAction.width - 2, 0);
    this.actionsContainer.addChild(this.compressAction);

    this.encryptAction = new Action(resources, 'EPS');
    this.encryptAction.position.set(this.compressAction.width - 2 + this.compressAction.x, 0);
    this.actionsContainer.addChild(this.encryptAction);

    this.addHeaderAction = new Action(resources, 'HEADER');
    this.addHeaderAction.position.set(this.encryptAction.x + this.encryptAction.width - 2, 0);
    this.actionsContainer.addChild(this.addHeaderAction);

    this.body.addChild(this.actionsContainer);
  }

  async pushPacket(tint) {
    this.packet = new Packet();
    this.packet.alpha = 0.0;
    this.packet.position.set(180, 100);
    this.packet.tint = tint;
    this.body.addChild(this.packet);

    return new Promise(resolve => {
      const scale = {scale: 0.0};
      const destination = {scale: 1.0};
      const tween = new TWEEN.Tween(scale)
        .to(destination, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          this.packet.alpha = scale.scale;
        })
        .onComplete(resolve)
        .start();
    });
  }

  async processPacket() {
    this.sequenceAction.activate();
    await sleep(1000);
    this.sequenceAction.deactivate();

    this.compressAction.activate()
    await sleep(1000);
    this.compressAction.deactivate();

    this.encryptAction.activate()
    await sleep(1000);
    this.encryptAction.deactivate();

    this.addHeaderAction.activate()
    await sleep(1000);
    this.addHeaderAction.deactivate();
  }

  async popPacket() {
    return new Promise(resolve => {
      const scale = {scale: 1.0};
      const destination = {scale: 0.0};
      const tween = new TWEEN.Tween(scale)
        .to(destination, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          this.packet.scale.set(scale.scale, scale.scale);
        })
        .onComplete(resolve)
        .start();
    });
  }
}
