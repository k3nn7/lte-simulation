import * as PIXI from 'pixi.js';
import {quadraticTween} from './tweens';

export default class StretchableBoxView extends PIXI.Graphics {
  box: PIXI.Graphics;
  caption: PIXI.Text;

  constructor(caption: string, backgroundColor: number, captionColor: number, width: number, height: number) {
    super();

    this.box = new PIXI.Graphics();
    this.box.beginFill(backgroundColor);
    this.box.drawRect(0, 0, width, height);
    this.caption = new PIXI.Text(
      caption,
      {
        fontSize: 14,
        fill: captionColor
      }
    )
    this.caption.anchor.set(0.5, 0.5);
    this.caption.position.set(width / 2, height / 2);

    this.addChild(this.box);
    this.addChild(this.caption);
  }

  async resizeTween(newWidth: number, newHeight: number, duration: number) {
    const tween = {
      width: this.width,
      height: this.height,
      captionX: this.caption.position.x,
      captionY: this.caption.position.y,
    };

    const tweenDestination = {
      width: newWidth,
      height: newHeight,
      captionX: newWidth / 2,
      captionY: newHeight / 2
    };

    await quadraticTween(tween, tweenDestination, duration, () => {
      this.box.width = tween.width;
      this.box.height = tween.height;
      this.caption.position.x = tween.captionX;
      this.caption.position.y = tween.captionY;
    });
  }
}
