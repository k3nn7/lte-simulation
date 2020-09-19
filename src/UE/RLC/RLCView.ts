import * as PIXI from 'pixi.js';
import BufferItemView from 'Common/BufferItemView';
import LayerView from 'Common/LayerView';
import ReceptionBufferView from "./receptionBufferView";
import {DataUnit} from "../../Common/DataUnit";
import FlatSDU from "../../eNB/RLC/FlatSDU";
import {PDCPDataUnit} from "../../Common/DataUnit/PDCPDataUnit";

export default class RLCView extends LayerView {
  receptionBuffer: ReceptionBufferView

  constructor(resources: Partial<Record<string, PIXI.LoaderResource>>) {
    super(resources, 'RLC');

    this.receptionBuffer = new ReceptionBufferView(resources);
    this.receptionBuffer.position.set(10, 10);
    this.body.addChild(this.receptionBuffer);

    setTimeout(() => this.forwardSDU(), 5000);
  }

  async onChannelB(data: DataUnit) {
    const bufferItem = new BufferItemView(data, 'SDU');
    await this.receptionBuffer.addItem(bufferItem);
  }

  async forwardSDU() {
    if (this.receptionBuffer.items.length > 0) {
      const item = await this.receptionBuffer.popItem();

      item.wrappedItem.packets.forEach((pdcpDataUnit: PDCPDataUnit) => {
        this.channelA(pdcpDataUnit);
      });
    }

    setTimeout(() => this.forwardSDU(), 5000);
  }
}
