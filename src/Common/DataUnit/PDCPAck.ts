import {DataUnit, Type} from 'Common/DataUnit';
import {PDCPDataUnit} from 'Common/DataUnit/PDCPDataUnit';

export class PDCPAck implements DataUnit {
  acked: PDCPDataUnit;
  readonly sequenceNumber: number;
  readonly tint: number;
  readonly size: number;
  readonly type: Type;

  constructor(acked: PDCPDataUnit, sequenceNumber: number) {
    this.acked = acked;
    this.sequenceNumber = sequenceNumber;
    this.tint = acked.tint;
    this.size = acked.size;
    this.type = Type.Ack;
  }

}
