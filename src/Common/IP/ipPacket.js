import * as PIXI from 'pixi.js';

export class IPPacket {
  constructor(data, id) {
    this.data = data;
    this.size = data.length;
    this.id = id;
    this.tint = PIXI.utils.rgb2hex([
      Math.random(),
      Math.random(),
      Math.random()
    ]);
  }
}
