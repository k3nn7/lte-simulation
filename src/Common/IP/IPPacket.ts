import * as PIXI from 'pixi.js';
import {DataUnit, Type} from 'Common/DataUnit';

export class IPPacket implements DataUnit {
  readonly data: string;
  readonly size: number;
  readonly id: number;
  readonly tint: number;
  readonly type: Type;

  constructor(data: string, id: number) {
    this.data = data;
    this.size = data.length;
    this.id = id;
    this.type = Type.Data;
    this.tint = PIXI.utils.rgb2hex([
      Math.random() / 2 + 0.5,
      Math.random() / 2 + 0.5,
      Math.random() / 2 + 0.5
    ]);
  }

}
