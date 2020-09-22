import {IPPacket} from 'Common/IP/IPPacket';
import {DataUnit, Type} from 'Common/DataUnit';

export class PDCPDataUnit implements DataUnit {
  ipPacket: IPPacket
  readonly sequenceNumber: number;
  readonly tint: number;
  readonly size: number;
  readonly type: Type;

  constructor(ipPacket: IPPacket, sequenceNumber: number) {
    this.ipPacket = ipPacket;
    this.sequenceNumber = sequenceNumber;
    this.tint = ipPacket.tint;
    this.size = ipPacket.size;
    this.type = Type.Data;
  }
}
