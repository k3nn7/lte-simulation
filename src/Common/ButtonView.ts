import * as PIXI from 'pixi.js';
import {BG_MEDIUM_2, FG_2} from './colors';

export default class ButtonView extends PIXI.Graphics {
  onClick: () => void;

  constructor(caption: string, width: number = 120, height: number = 30) {
    super();

    this.beginFill(BG_MEDIUM_2);
    this.drawRoundedRect(0, 0, width, height, 10);
    this.endFill();

    this.interactive = true;
    this.buttonMode = true;
    this.on('click', () => {
      if (this.onClick) this.onClick();
    })

    const captionText = new PIXI.Text(caption, {
      fill: FG_2,
      fontSize: 15,
      align: 'center'
    });
    captionText.position.set(this.width / 2, this.height / 2);
    captionText.anchor.set(0.5, 0.5);
    this.addChild(captionText);
  }

  setOnClick(onClick: () => void) {
    this.onClick = onClick;
  }
}
