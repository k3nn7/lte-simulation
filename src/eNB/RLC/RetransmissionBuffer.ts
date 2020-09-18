import * as PIXI from 'pixi.js';
import {BG_DARK_2, FG_2} from 'Common/colors';
import {Mutex} from 'async-mutex';
import {moveToThePoint} from 'Common/tweens';
import FlatSDU from "./FlatSDU";

const WIDTH = 120;
const HEIGHT = 130;
const TITLE_HEIGHT = 20;

export default class RetransmissionBuffer extends PIXI.Graphics {
  mutex: Mutex;
  packets: FlatSDU[];
  titleObject: PIXI.Text;
  packetRetransmissionHandler: (_: FlatSDU) => void;

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
  }

  async addDirectly(packet: FlatSDU) {
    const release = await this.mutex.acquire();

    packet.position = this.toLocal(new PIXI.Point(0, 0), packet);
    this.addChild(packet);
    const destination = {x: 5, y: HEIGHT - 5 - 20 - TITLE_HEIGHT - this.packets.length * 25};
    await Promise.all([
      moveToThePoint(packet, destination, 500),
    ]);
    this.packets.push(packet);
    packet.startCounting()
      .then(() => this.retransmitPacket(packet));

    release();
  }

  async retransmitPacket(packet: FlatSDU) {
    packet.startCounting()
      .then(() => this.retransmitPacket(packet));
    await this.packetRetransmissionHandler(packet);
  }

  setOnPacketRetransmission(handler: (_: FlatSDU) => void) {
    this.packetRetransmissionHandler = handler;
  }
}
