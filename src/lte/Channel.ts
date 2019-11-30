import {ChannelType} from "./ChannelType";
import {Packet} from "./Packet";

export type PacketCallback = (packet: Packet, channel: Channel) => void;

export class Channel {
  onDownLink: PacketCallback;
  onUpLink: PacketCallback;

  constructor(type: ChannelType) {
  }

  setOnDownLink(onDownLink: PacketCallback) {
    this.onDownLink = onDownLink;
  }

  sendDown(packet: Packet) {
    if (this.onDownLink) {
      this.onDownLink(packet, this);
    }
  }

  setOnUpLink(onUpLink: PacketCallback) {
    this.onUpLink = onUpLink;
  }

  sendUp(packet: Packet) {
    if (this.onUpLink) {
      this.onUpLink(packet, this);
    }
  }
}
