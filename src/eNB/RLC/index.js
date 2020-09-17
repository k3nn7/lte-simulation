import BufferItemView from 'Common/bufferItemView';
import LayerView from 'Common/layerView';
import ReceptionBufferView from "./receptionBufferView";

export default class RLCView extends LayerView {
  constructor(resources) {
    super(resources, 'RLC');

    this.receptionBuffer = new ReceptionBufferView(resources);
    this.receptionBuffer.position.set(10, 10);
    this.body.addChild(this.receptionBuffer);

    setTimeout(() => this.forwardSDU(), 5000);
  }

  async onChannelB(data) {
    const bufferItem = new BufferItemView(data, 'SDU');
    await this.receptionBuffer.addItem(bufferItem);
  }

  async forwardSDU() {
    if (this.receptionBuffer.items.length > 0) {
      const item = await this.receptionBuffer.popItem();

      item.wrappedItem.packets.forEach((pdcpDataUnit) => {
        this.channelA(pdcpDataUnit);
      });
    }

    setTimeout(() => this.forwardSDU(), 5000);
  }
}
