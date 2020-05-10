import Layer from "../layer";
import PacketBuffer from "./packet-buffer";
import Action from "./action";
import SDU from "./rlc/sdu";
import Timer from "./timer";
import {appear, moveToThePoint, swallow} from "../utils";
import FlatSDU from "./rlc/flatSdu";
import * as PIXI from "pixi.js";
import MinimizedPacket from "./minimized-packet";

export default class RLC extends Layer {
  constructor(resources) {
    super(resources, 'RLC');

    this.transmissionBuffer = new PacketBuffer(resources, 'Transmission Buffer');
    this.transmissionBuffer.position.set(10, 10);
    this.body.addChild(this.transmissionBuffer);

    this.retransmissionBuffer = new PacketBuffer(resources, 'Retransmission Buffer');
    this.retransmissionBuffer.position.set(270, 10);
    this.retransmissionBuffer.setOnPacketRetransmission(sdu => this.transmitSDU2(sdu));
    this.body.addChild(this.retransmissionBuffer);

    this.addHeaderAction = new Action(resources, 'HEADER');
    this.addHeaderAction.position.set(138, 10);
    this.body.addChild(this.addHeaderAction);

    this.initEmptySDU();
  }

  async onChannelA(data) {
    await this.addPacket(data);
  }

  async addPacket(packet) {
    await this.transmissionBuffer.addPacket(packet)
  }

  initEmptySDU() {
    this.sdu = new SDU();
    this.sdu.position.set(138, 60);
    this.body.addChild(this.sdu);

    this.timer = new Timer();
    this.timer.position.set(138 + 122, 60 + 20);
    this.body.addChild(this.timer);

    setTimeout(() => this.updateSDU(), 500);
  }

  async updateSDU() {
    if (this.sdu.acceptsPackets && this.transmissionBuffer.packets.length > 0) {
      await this.transmissionBuffer.popPacket(async (packet) => {
        await this.sdu.addPacket(packet);
      });

      if (!this.timer.isFinished && !this.timer.isCounting) {
        this.timer.startCounting(2000);
      }
    }

    if (this.timer.isFinished) {
      await this.transmitSDU();
    } else {
      setTimeout(() => this.updateSDU(), 500);
    }
  }

  async transmitSDU() {
    this.sdu.acceptsPackets = false;
    this.body.removeChild(this.timer);

    const flatSDU = new FlatSDU(),
      flatSDURetransmission = new FlatSDU(90);
    flatSDU.alpha = 0.0;
    flatSDURetransmission.alpha = 0.0;
    flatSDU.position.set(138, 60);
    flatSDURetransmission.position.set(138, 60);
    this.body.addChild(flatSDU, flatSDURetransmission);
    await appear(flatSDU, 500);
    flatSDURetransmission.alpha = 1.0;
    this.body.removeChild(this.sdu);

    await Promise.all([
      moveToThePoint(flatSDU, {x: 138, y: 125}, 500),
      this.retransmissionBuffer.addDirectly(flatSDURetransmission)
    ]);

    swallow(flatSDU, 500);

    this.channelB(new MinimizedPacket(50));

    this.initEmptySDU();
  }

  async transmitSDU2(sdu) {
    const newSDU = new FlatSDU(sdu.width);
    newSDU.position = this.toLocal(new PIXI.Point(0, 0), sdu);
    this.body.addChild(newSDU);
    await moveToThePoint(newSDU, {x: 138, y: 125}, 500);
    swallow(newSDU, 500);

    this.channelB(new MinimizedPacket(50));
  }
}
