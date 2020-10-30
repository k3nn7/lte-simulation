import {DataUnit, Type} from 'Common/DataUnit';
import {PDCPDataUnit} from 'Common/DataUnit/PDCPDataUnit';
import FlatSDU from "../../eNB/RLC/FlatSDU";

export class ACK implements DataUnit {
  acked: FlatSDU;
  readonly sequenceNumber: number;
  readonly tint: number;
  readonly size: number;
  readonly type: Type;

  constructor(acked: FlatSDU, sequenceNumber: number) {
    this.acked = acked;
    this.sequenceNumber = sequenceNumber;
    this.tint = acked.tint;
    this.size = 50;
    this.type = Type.Ack;
  }

}
