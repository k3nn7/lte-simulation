import {IPPacket} from '../IP/IPPacket';
import {DataUnit} from "../DataUnit";

export class PDCPDataUnit implements DataUnit {
  ipPacket: IPPacket
  sequenceNumber: number;
  readonly tint: number;
  readonly size: number;

  constructor(ipPacket: IPPacket, sequenceNumber: number) {
    this.ipPacket = ipPacket;
    this.sequenceNumber = sequenceNumber;
    this.tint = ipPacket.tint;
    this.size = ipPacket.size;
  }
}
