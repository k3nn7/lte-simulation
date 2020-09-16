import * as PIXI from 'pixi.js';
import {DataUnit} from "../DataUnit";

export class IPPacket implements DataUnit {
  data: string;
  size: number;
  id: number;
  tint: number;

  constructor(data: string, id: number) {
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
