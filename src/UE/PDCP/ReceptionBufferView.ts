import * as PIXI from 'pixi.js';
import {Mutex} from 'async-mutex';
import {moveToThePoint} from 'Common/tweens';
import BufferView from '../../Common/BufferView';
import BufferItemView from '../../Common/BufferItemView';

export default class ReceptionBufferView extends BufferView {
  mutex: Mutex;
  items: BufferItemView[];

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

  async updateItemsView() {
    await Promise.all(this.items.map((item, i) => {
      const destination = {x: 5, y: this.height - 5 - 16 - 20 - i * 21};
      return moveToThePoint(item, destination, 500);
    }));
  }
}
