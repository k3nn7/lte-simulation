import * as PIXI from 'pixi.js';
import BufferItemView from 'Common/BufferItemView';
import LayerView from 'Common/LayerView';
import ReceptionBufferView from "./receptionBufferView";
import {DataUnit} from "../../Common/DataUnit";
import {PDCPDataUnit} from "../../Common/DataUnit/PDCPDataUnit";
import ButtonView from "../../Common/ButtonView";
import {IPPacket} from "../../Common/IP/IPPacket";
import MinimizedPacket from "../../eNB/RLC/MinimizedPacket";
import {PDCPAck} from "../../Common/DataUnit/PDCPAck";

export default class RLCView extends LayerView {
  receptionBuffer: ReceptionBufferView;
  sendPacketButton: ButtonView;

  constructor(resources: Partial<Record<string, PIXI.LoaderResource>>, debugMode: boolean) {
    super(resources, 'RLC');

    this.receptionBuffer = new ReceptionBufferView(resources);
    this.receptionBuffer.position.set(10, 10);
    this.body.addChild(this.receptionBuffer);

    this.initDebugMode(debugMode);

    setTimeout(() => this.forwardSDU(), 5000);
  }

  async onChannelB(data: DataUnit) {
    if (data instanceof MinimizedPacket) {
      const bufferItem = new BufferItemView(data, 'SDU');
      await this.receptionBuffer.addItem(bufferItem);

      this.channelB.sendOut(new PDCPAck(data.packets[0], 1));
    }
  }

  async forwardSDU() {
    if (this.receptionBuffer.items.length > 0) {
      const item = await this.receptionBuffer.popItem();

      item.wrappedItem.packets.forEach((pdcpDataUnit: PDCPDataUnit) => {
        this.channelA.sendOut(pdcpDataUnit);
      });
    }

    setTimeout(() => this.forwardSDU(), 5000);
  }

  private initDebugMode(debugMode: boolean) {
    if (!debugMode) return;

    this.sendPacketButton = new ButtonView('+', 20, 20);
    this.sendPacketButton.setOnClick(() => {
      this.onChannelB(
        new MinimizedPacket(
          50,
          [new PDCPDataUnit(
            new IPPacket('foooo sdafasdfasdfasdfasdfasdf dsfafdsfasfasdfa', 10),
            1
          )]
        )
      )
    });
    this.sendPacketButton.position.set(5, 120);
    this.addChild(this.sendPacketButton);
  }
}
