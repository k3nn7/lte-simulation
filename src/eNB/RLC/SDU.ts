import * as PIXI from 'pixi.js';
import {BG_DARK_2} from 'Common/Colors';
import {Mutex} from 'async-mutex';
import {moveToThePoint} from 'Common/tweens';
import {Packet} from './TransmissionBuffer';

const WIDTH = 122;
const HEIGHT = 20;

export default class SDU extends PIXI.Graphics {
  mutex: Mutex;
  packets: Packet[];
  size: number;
  acceptsPackets: boolean;

  constructor() {
    super();

    this.mutex = new Mutex();
    this.packets = [];
    this.size = 0;

    this.lineStyle(2, BG_DARK_2);
    this.drawRect(0, 0, WIDTH, HEIGHT);

    this.acceptsPackets = true;
  }

  async addPacket(packet: Packet) {
    const release = await this.mutex.acquire();
    packet.position = this.toLocal(new PIXI.Point(0, 0), packet);
    this.addChild(packet);

    await moveToThePoint(packet, {x: this.size + 2 + this.packets.length, y: 2}, 500);
    this.size += packet.wrappedPacket.size;

    this.packets.push(packet);
    release();
  }
}

