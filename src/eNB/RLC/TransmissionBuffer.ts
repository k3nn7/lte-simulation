import * as PIXI from 'pixi.js';
import {BG_DARK_2, BG_MEDIUM_2, FG_1, FG_2} from 'Common/Colors';
import {Mutex} from 'async-mutex';
import {moveToThePoint} from 'Common/tweens';;
import {PDCPDataUnit} from "Common/DataUnit/PDCPDataUnit";

const WIDTH = 120;
const HEIGHT = 130;
const TITLE_HEIGHT = 20;

export default class TransmissionBuffer extends PIXI.Graphics {
  mutex: Mutex;
  packets: Packet[];
  titleObject: PIXI.Text;

  constructor(resources: Partial<Record<string, PIXI.LoaderResource>>, title: string) {
    super();

    this.mutex = new Mutex();
    this.packets = [];

    this.lineStyle(2, BG_DARK_2);
    this.drawRect(0, 0, WIDTH, HEIGHT);

    this.beginFill(BG_DARK_2);
    this.drawRect(0, HEIGHT - TITLE_HEIGHT, WIDTH, TITLE_HEIGHT);

    this.titleObject = new PIXI.Text(
      title,
      {
        fill: FG_2,
        fontSize: 12,
      }
    );
    this.titleObject.anchor.set(0.5, 0.5);
    this.titleObject.position.set(WIDTH / 2, HEIGHT - (TITLE_HEIGHT / 2));

    this.addChild(this.titleObject);

    this.interactive = true;
    this.buttonMode = true;
    this.on('mouseover', () => {
      this.tint = 0xaeaeae;
    });
    this.on('mouseout', () => {
      this.tint = 0xffffff;
    });
  }

  async addPacket(packet: PDCPDataUnit) {
    const release = await this.mutex.acquire();

    const wrapper = new Packet(packet);
    wrapper.position.set(5, 5);
    this.addChild(wrapper);
    this.packets.push(wrapper);

    await this.updatePacketsPositions();

    release();
  }

  async popPacket(packetHandler: (_: Packet) => void) {
    const release = await this.mutex.acquire();

    const result = this.packets.shift();

    await packetHandler(result);

    await this.updatePacketsPositions();

    release();
  }

  async updatePacketsPositions() {
    await Promise.all(this.packets.map((packet, i) => {
      const destination = {x: 5, y: HEIGHT - 5 - 16 - TITLE_HEIGHT - i * 21};
      return moveToThePoint(packet, destination, 500);
    }));
  }
}

export class Packet extends PIXI.Graphics {
  wrappedPacket: PDCPDataUnit;
  caption: PIXI.Text;

  constructor(wrappedPacket: PDCPDataUnit) {
    super();

    this.wrappedPacket = wrappedPacket;

    this.beginFill(BG_MEDIUM_2);
    this.tint = wrappedPacket.tint;
    this.drawRect(0, 0, this.wrappedPacket.size, 16);
    this.endFill();

    this.caption = new PIXI.Text(
      'SDU',
      {
        fontSize: 8,
        fill: FG_1,
      }
    );
    this.caption.anchor.set(0.5, 0.5);
    this.caption.position.set(this.width / 2, this.height / 2);
    this.addChild(this.caption);
  }
}
