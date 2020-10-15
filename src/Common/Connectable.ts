import * as PIXI from 'pixi.js';
import {DataUnit} from "./DataUnit";

export type Channel = (data: DataUnit) => Promise<void>

export default abstract class Connectable extends PIXI.Graphics {
  channelA: Channel;
  channelB: Channel;

  public setChannelA(channel: Channel) {
    this.channelA = channel;
  }

  public setChannelB(channel: Channel) {
    this.channelB = channel;
  }

  async onChannelA(data: DataUnit) {
    if (this.channelB) {
      await this.channelB(data);
    }
  }

  async onChannelB(data: DataUnit) {
    if (this.channelA) {
      await this.channelA(data);
    }
  }
}
