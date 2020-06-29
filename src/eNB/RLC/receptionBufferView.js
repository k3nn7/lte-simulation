import BufferView from 'Common/bufferView';
import {Mutex} from 'async-mutex';
import {moveToThePoint} from 'Common/tweens';

export default class ReceptionBufferView extends BufferView {
  constructor(resources) {
    super(resources, 'Reception Buffer');

    this.mutex = new Mutex();
    this.items = [];
  }

  async addItem(item) {
    const release = await this.mutex.acquire();

    item.position.set(5, 5);
    this.addChild(item);
    this.items.push(item);

    await this.updateItemsView();

    release();
  }

  async updateItemsView() {
    await Promise.all(this.items.map((item, i) => {
      const destination = {x: 5, y: this.HEIGHT - 5 - 16 - 20 - i * 21};
      return moveToThePoint(item, destination, 500);
    }));
  }
}
