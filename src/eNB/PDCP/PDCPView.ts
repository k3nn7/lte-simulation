import * as PIXI from 'pixi.js';
import LayerView from '../../Common/LayerView';
import {IPPacket} from '../../Common/IP/IPPacket';
import PDUView from './PDUView';
import {appear, scaleDown} from '../../Common/tweens';
import ActionsContainerView from './ActionsContainerView';
import Mutex from 'async-mutex/lib/Mutex';

export default class PDCPView extends LayerView {
  mutex: Mutex;
  pdu: PDUView;
  actionsContainer: ActionsContainerView;
  resources: Partial<Record<string, PIXI.LoaderResource>>;
  sequenceNumber: number;

  constructor(resources: Partial<Record<string, PIXI.LoaderResource>>) {
    super(resources, 'PDCP');

    this.mutex = new Mutex();
    this.resources = resources;
    this.actionsContainer = new ActionsContainerView(resources);
    this.actionsContainer.position.set(10, 20);
    this.body.addChild(this.actionsContainer);
    this.sequenceNumber = 0;
  }


  async onChannelA(data: any): Promise<void> {
    if (data instanceof IPPacket) {
      const release = await this.mutex.acquire();

      await this.pushPacket(data);
      await this.processPacket();
      await this.popPacket();
      this.channelB(data);

      release();
    }
  }

  async pushPacket(packet: IPPacket) {
    this.pdu = new PDUView(packet, this.resources);
    this.pdu.alpha = 0.0;
    this.pdu.position.set(220, 100);
    this.body.addChild(this.pdu);

    return appear(this.pdu, 500);
  }

  async processPacket() {
    this.actionsContainer.sequenceAction.setSequenceNumber(this.sequenceNumber);
    this.actionsContainer.sequenceAction.activate();
    await this.pdu.giveOrderNumber(this.sequenceNumber);
    this.actionsContainer.sequenceAction.deactivate();
    this.sequenceNumber++;

    this.actionsContainer.compressAction.activate();
    await this.pdu.compressHeader();
    this.actionsContainer.compressAction.deactivate();

    this.actionsContainer.encryptAction.activate();
    await this.pdu.encryptData();
    this.actionsContainer.encryptAction.deactivate();

    this.actionsContainer.addHeaderAction.activate();
    await this.pdu.addHeader();
    this.actionsContainer.addHeaderAction.deactivate();
  }

  async popPacket() {
    return scaleDown(this.pdu, 500);
  }
}
