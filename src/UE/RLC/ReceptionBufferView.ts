import * as PIXI from 'pixi.js';
import BufferView from 'Common/BufferView';
import {Mutex} from 'async-mutex';
import {disappear, moveToThePoint} from 'Common/tweens';
import BufferItemView from 'Common/BufferItemView';

export default class ReceptionBufferView extends BufferView {
  mutex: Mutex;
  items: Array<BufferItemView>

  constructor(resources: Partial<Record<string, PIXI.LoaderResource>>) {
    super(resources, 'Reception Buffer');

    this.mutex = new Mutex();
    this.items = [];
  }

  async addItem(item: BufferItemView) {
    const release = await this.mutex.acquire();

    item.position.set(5, 5);
    this.addChild(item);
    this.items.push(item);

    await this.updateItemsView();

    release();
  }

  async popItem(): Promise<BufferItemView> {
    const release = await this.mutex.acquire();

    const item = this.items.shift();
    await disappear(item, 100);
    await this.updateItemsView();
    this.removeChild(item);

    release();

    return item;
  }

  async updateItemsView() {
    await Promise.all(this.items.map((item, i) => {
      const destination = {x: 5, y: this.height - 5 - 16 - 20 - i * 21};
      return moveToThePoint(item, destination, 500);
    }));
  }
}
