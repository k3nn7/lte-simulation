import * as PIXI from 'pixi.js';
import LayerView from '../../Common/LayerView';
import {IPPacket} from '../../Common/IP/IPPacket';
import PDUView from './PDUView';
import {appear, scaleDown} from '../../Common/tweens';
import ActionsContainerView from './ActionsContainerView';
import Mutex from 'async-mutex/lib/Mutex';
import {DataUnit} from "../../Common/DataUnit";
import {PDCPDataUnit} from "../../Common/DataUnit/PDCPDataUnit";
import InspectorView from "../../Common/InspectorView";

export default class PDCPView extends LayerView {
  mutex: Mutex;
  pdu: PDUView;
  actionsContainer: ActionsContainerView;
  resources: Partial<Record<string, PIXI.LoaderResource>>;
  sequenceNumber: number;
  inspectorView: InspectorView;

  constructor(
    resources: Partial<Record<string, PIXI.LoaderResource>>,
    inspectorView: InspectorView,
  ) {
    super(resources, 'PDCP');
    this.inspectorView = inspectorView;

    this.mutex = new Mutex();
    this.resources = resources;
    this.actionsContainer = new ActionsContainerView(resources);
    this.actionsContainer.position.set(10, 20);
    this.body.addChild(this.actionsContainer);
    this.sequenceNumber = 0;

    this.header.on('click', () => {
      this.inspectorView.show('PDCP', 'PDCP Layer is responsible for:');
    });
  }

  async onChannelA(dataUnit: DataUnit): Promise<void> {
    if (dataUnit instanceof IPPacket) {
      const release = await this.mutex.acquire();

      await this.pushPacket(dataUnit);
      const result = await this.processPacket(dataUnit);
      await this.popPacket();
      this.channelB(result);

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

  async processPacket(packet: IPPacket): Promise<PDCPDataUnit> {
    this.actionsContainer.sequenceAction.setSequenceNumber(this.sequenceNumber);
    this.actionsContainer.sequenceAction.activate();
    await this.pdu.setSequenceNumber(this.sequenceNumber);
    const result = new PDCPDataUnit(packet, this.sequenceNumber);
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

    return result;
  }

  async popPacket() {
    return scaleDown(this.pdu, 500);
  }
}
