import * as PIXI from 'pixi.js';
import LayerView from '../../Common/LayerView';
import {IPPacket} from '../../Common/IP/IPPacket';
import PDUView from './PDUView';
import {appear, scaleDown} from '../../Common/tweens';
import ActionsContainerView from './ActionsContainerView';
import Mutex from 'async-mutex/lib/Mutex';
import ReceptionBufferView from './ReceptionBufferView';
import BufferItemView from './BufferItemView';
import ButtonView from '../../Common/ButtonView';
import {PDCPDataUnit} from '../../Common/DataUnit/PDCPDataUnit';

export default class PDCPView extends LayerView {
  mutex: Mutex;
  pdu: PDUView;
  actionsContainer: ActionsContainerView;
  resources: Partial<Record<string, PIXI.LoaderResource>>;
  sequenceNumber: number;
  receptionBuffer: ReceptionBufferView;

  sendPacketButton: ButtonView;

  constructor(resources: Partial<Record<string, PIXI.LoaderResource>>, debugMode: boolean = false) {
    super(resources, 'PDCP');

    this.mutex = new Mutex();
    this.resources = resources;
    this.actionsContainer = new ActionsContainerView(resources);
    this.actionsContainer.position.set(140, 10);
    this.body.addChild(this.actionsContainer);
    this.receptionBuffer = new ReceptionBufferView(resources);
    this.receptionBuffer.position.set(10, 10);
    this.body.addChild(this.receptionBuffer);

    if (debugMode) {
      let sequenceNumber = 0;
      this.sendPacketButton = new ButtonView('+', 20, 20);
      this.sendPacketButton.setOnClick(() => {
        this.onChannelB(
          new PDCPDataUnit(
            new IPPacket('foooo sdafasdfasdfasdfasdfasdf dsfafdsfasfasdfa', 10),
            sequenceNumber++
          )
        );
      });
      this.sendPacketButton.position.set(5, 120);
      this.addChild(this.sendPacketButton);
    }

    this.sequenceNumber = 0;
  }

  async onChannelB(data: any): Promise<void> {
    if (data instanceof PDCPDataUnit) {
      const release = await this.mutex.acquire();

      await this.pushPacket(data);
      await this.processPacket();
      this.popPacket();

      release();

      const bufferItem = new BufferItemView(data, 'SDU');
      await this.receptionBuffer.addItem(bufferItem);

      // this.channelA(data);
    }
  }

  async pushPacket(packet: PDCPDataUnit) {
    this.pdu = new PDUView(packet, this.resources);
    this.pdu.alpha = 0.0;
    this.pdu.scale.set(0.7, 0.7);
    this.pdu.position.set(280, 80);
    this.body.addChild(this.pdu);

    return appear(this.pdu, 500);
  }

  async processPacket() {
    this.actionsContainer.addHeaderAction.activate();
    await this.pdu.addHeader();
    this.actionsContainer.addHeaderAction.deactivate();

    this.actionsContainer.encryptAction.activate();
    await this.pdu.encryptData();
    this.actionsContainer.encryptAction.deactivate();

    this.actionsContainer.compressAction.activate();
    await this.pdu.compressHeader();
    this.actionsContainer.compressAction.deactivate();

    this.actionsContainer.sequenceAction.activate();
    this.sequenceNumber = this.pdu.packet.sequenceNumber;
    this.actionsContainer.sequenceAction.setSequenceNumber(this.sequenceNumber);
    await this.pdu.giveOrderNumber(this.sequenceNumber);
    this.actionsContainer.sequenceAction.deactivate();

  }

  async popPacket() {
    return scaleDown(this.pdu, 500);
  }
}
