import * as PIXI from 'pixi.js';

export default class Connectable extends PIXI.Graphics {
  setChannelA(channel) {
    this.channelA = channel;
  }

  setChannelB(channel) {
    this.channelB = channel;
  }

  async onChannelA(data) {
    if (this.channelB) {
      await this.channelB(data);
    }
  }

  async onChannelB(data) {
    if (this.channelA) {
      await this.channelA(data);
    }
  }
}
