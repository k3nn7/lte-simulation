import Layer from "./layer";
import PacketBuffer from "./packet-buffer";
import Action from "./action";
import Timer from "./timer";

export default class RLC extends Layer {
  constructor(resources) {
    super(resources, 'RLC');

    this.transmissionBuffer = new PacketBuffer(resources, 'Transmission Buffer');
    this.transmissionBuffer.position.set(10, 10);
    this.body.addChild(this.transmissionBuffer);

    this.retransmissionBuffer = new PacketBuffer(resources, 'Retransmission Buffer');
    this.retransmissionBuffer.position.set(270, 10);
    this.body.addChild(this.retransmissionBuffer);

    this.addHeaderAction = new Action(resources, 'HEADER');
    this.addHeaderAction.position.set(138, 10);
    this.body.addChild(this.addHeaderAction);

    this.timer = new Timer();
    this.timer.position.set(30, 30);
    this.body.addChild(this.timer);
  }
}
