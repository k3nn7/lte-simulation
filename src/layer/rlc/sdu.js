import * as PIXI from 'pixi.js';
import {BG_DARK_2, BG_MEDIUM_3} from "../../colors";
import {moveToThePoint} from "../../utils";
import {Mutex} from "async-mutex";
import TWEEN from "@tweenjs/tween.js";

const WIDTH = 122;
const HEIGHT = 20;
const CAPACITY = WIDTH;

export default class SDU extends PIXI.Graphics {
  constructor() {
    super();

    this.mutex = new Mutex();
    this.packets = [];
    this.size = 0;

    this.lineStyle(2, BG_DARK_2);
    this.drawRect(0, 0, WIDTH, HEIGHT);

    this.acceptsPackets = true;
  }

  makeClone() {
    const sdu = new SDU();

    sdu.size = this.size;
    sdu.packets = this.packets.map(packet => packet.makeClone());
    sdu.packets.forEach(packet => sdu.addChild(packet));

    return sdu;
  }

  async addPacket(packet) {
    const release = await this.mutex.acquire();
    packet.position = this.toLocal(new PIXI.Point(0, 0), packet);
    this.addChild(packet);

    await moveToThePoint(packet, {x: this.size + 2 + this.packets.length, y: 2}, 500);
    this.size += packet.wrappedPacket.size;

    this.packets.push(packet);
    release();
  }
}

