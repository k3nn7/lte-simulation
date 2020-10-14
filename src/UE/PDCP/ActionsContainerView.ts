import * as PIXI from 'pixi.js';
import {BG_DARK_2, BG_LIGHT_1, FG_1} from 'Common/Colors';

export default class ActionsContainerView extends PIXI.Container {
  sequenceAction: SequenceAction;
  compressAction: Action;
  encryptAction: Action;
  addHeaderAction: Action;

  constructor(resources: Partial<Record<string, PIXI.LoaderResource>>) {
    super();

    this.sequenceAction = new SequenceAction(resources);
    this.compressAction = new Action(resources, 'ROHC');
    this.compressAction.position.set(this.sequenceAction.width - 2, 0);
    this.encryptAction = new Action(resources, 'EPS');
    this.encryptAction.position.set(this.compressAction.width - 2 + this.compressAction.x, 0);
    this.addHeaderAction = new Action(resources, 'HEADER');
    this.addHeaderAction.position.set(this.encryptAction.x + this.encryptAction.width - 2, 0);

    this.addChild(
      this.sequenceAction,
      this.compressAction,
      this.encryptAction,
      this.addHeaderAction
    );
  }

}

class Action extends PIXI.Graphics {
  bullet: PIXI.Sprite;
  actionText: PIXI.Text;

  constructor(resources: Partial<Record<string, PIXI.LoaderResource>>, text: string) {
    super();

    this.actionText = new PIXI.Text(
      text,
      {
        fill: FG_1,
        fontSize: 12,
      }
    );
    this.actionText.anchor.set(0, 0.5);
    this.actionText.position.set(20, 10);

    this.lineStyle(2, BG_DARK_2);
    this.beginFill(BG_LIGHT_1);
    this.drawRect(0, 0, this.actionText.width + 30, 20);
    this.endFill();

    this.bullet = new PIXI.Sprite(resources.bullet.texture);
    this.bullet.anchor.set(0.5, 0.5);
    this.bullet.position.set(10, 10);
    this.bullet.width = 12;
    this.bullet.height = 12;

    this.addChild(this.bullet);
    this.addChild(this. actionText);

    this.interactive = true;
    this.buttonMode = true;
    this.on('mouseover', () => {
      this.tint = 0xaeaeae;
    });
    this.on('mouseout', () => {
      this.tint = 0xffffff;
    });
  }

  activate() {
    this.bullet.tint = PIXI.utils.rgb2hex([0.2, 0.2, 0.2]);
  }

  deactivate() {
    this.bullet.tint = PIXI.utils.rgb2hex([1.0, 1.0, 1.0]);
  }
}

class SequenceAction extends Action {
  constructor(resources: Partial<Record<string, PIXI.LoaderResource>>) {
    super(resources, '#0');
  }

  setSequenceNumber(sequenceNumber: number) {
    this.actionText.text = '#' + sequenceNumber;
  }
}
