import * as PIXI from 'pixi.js';

export type Channel = (data: any) => Promise<void>

export default class Connectable extends PIXI.Graphics {
  channelA: Channel;
  channelB: Channel;

  setChannelA(channel: Channel) {
    this.channelA = channel;
  }

  setChannelB(channel: Channel) {
    this.channelB = channel;
  }

  async onChannelA(data: any) {
    if (this.channelB) {
      await this.channelB(data);
    }
  }

  async onChannelB(data: any) {
    if (this.channelA) {
      await this.channelA(data);
    }
  }
}
