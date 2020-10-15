import * as PIXI from 'pixi.js';
import LayerView from 'Common/LayerView';
import {DataUnit} from 'Common/DataUnit';
import TransmissionBuffer, {Packet} from './TransmissionBuffer';
import RetransmissionBuffer from './RetransmissionBuffer';
import {appear, moveToThePoint, scaleDown} from 'Common/tweens';
import TimerView from './TimerView';
import FlatSDU from './FlatSDU';
import MinimizedPacket from './MinimizedPacket';
import SDU from './SDU';
import {PDCPDataUnit} from 'Common/DataUnit/PDCPDataUnit';
import InspectorView from "../../Common/InspectorView";

export default class RLCView extends LayerView {
  transmissionBuffer: TransmissionBuffer;
  retransmissionBuffer: RetransmissionBuffer;
  sdu: SDU;
  timer: TimerView
  inspectorView: InspectorView;

  constructor(
    resources: Partial<Record<string, PIXI.LoaderResource>>,
    inspectorView: InspectorView,
  ) {
    super(resources, 'RLC');
    this.inspectorView = inspectorView;

    this.transmissionBuffer = new TransmissionBuffer(resources, 'Transmission Buffer');
    this.transmissionBuffer.position.set(10, 10);
    this.body.addChild(this.transmissionBuffer);

    this.retransmissionBuffer = new RetransmissionBuffer(resources, 'Retransmission Buffer');
    this.retransmissionBuffer.position.set(270, 10);
    this.retransmissionBuffer.setOnPacketRetransmission(flatSdu => this.transmitSDU2(flatSdu))
    this.body.addChild(this.retransmissionBuffer);

    this.initEmptySDU();

    this.header.on('click', () => {
      this.inspectorView.show('RLC', 'MAC Layer is responsible for:');
    });
  }

  async onChannelA(data: DataUnit) {
    if (data instanceof PDCPDataUnit) {
      await this.addPacket(data);
    }
  }

  async addPacket(packet: PDCPDataUnit) {
    await this.transmissionBuffer.addPacket(packet)
  }

  initEmptySDU() {
    this.sdu = new SDU();
    this.sdu.position.set(138, 60);
    this.body.addChild(this.sdu);

    this.timer = new TimerView();
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
        this.timer.startCounting(10000);
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

    const rawPackets = this.sdu.packets.map((packet: Packet): PDCPDataUnit => packet.wrappedPacket);

    const flatSDU = new FlatSDU(rawPackets),
      flatSDURetransmission = new FlatSDU(rawPackets, 90);
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

    scaleDown(flatSDU, 500);

    this.channelB(new MinimizedPacket(50, flatSDU.packets));

    this.initEmptySDU();
  }

  async transmitSDU2(sdu: FlatSDU) {
    const newSDU = new FlatSDU(sdu.packets, sdu.width);
    newSDU.position = this.toLocal(new PIXI.Point(0, 0), sdu);
    this.body.addChild(newSDU);
    await moveToThePoint(newSDU, {x: 138, y: 125}, 500);
    scaleDown(newSDU, 500);

    this.channelB(new MinimizedPacket(50, sdu.packets));
  }

}
