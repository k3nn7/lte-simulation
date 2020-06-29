import BufferItemView from 'Common/bufferItemView';
import LayerView from 'Common/layerView';
import ReceptionBufferView from "./receptionBufferView";

export default class RLCView extends LayerView {
  constructor(resources) {
    super(resources, 'RLC');

    this.receptionBuffer = new ReceptionBufferView(resources);
    this.receptionBuffer.position.set(10, 10);
    this.body.addChild(this.receptionBuffer);
  }

  async onChannelB(data) {
    const bufferItem = new BufferItemView(data, 'SDU');
    await this.receptionBuffer.addItem(bufferItem);
  }
}
