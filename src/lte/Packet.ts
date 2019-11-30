import {ChannelType} from "./ChannelType";

export class Packet {
  private sizeInBits: number;
  private _parentChannel: ChannelType;

  public constructor(sizeInBits: number, channel: ChannelType = null) {
    this.sizeInBits = sizeInBits;
    this._parentChannel = channel;
  }

  public moveToChannel(channel: ChannelType) {
    this._parentChannel = channel;
  }

  public parentChannel(): ChannelType {
    return this._parentChannel;
  }

  public transmitBits(bitsCount: number): Packet {
    const bitsToTransmit = Math.min(this.sizeInBits, bitsCount);
    this.sizeInBits -= bitsToTransmit;

    return new Packet(bitsToTransmit, this._parentChannel);
  }
}
