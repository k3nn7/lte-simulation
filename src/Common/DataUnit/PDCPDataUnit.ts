import {IPPacket} from '../IP/IPPacket';

export class PDCPDataUnit{
  ipPacket: IPPacket
  sequenceNumber: number;

  constructor(ipPacket: IPPacket, sequenceNumber: number) {
    this.ipPacket = ipPacket;
    this.sequenceNumber = sequenceNumber;
  }
}
