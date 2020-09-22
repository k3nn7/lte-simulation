import {DataUnit} from "../DataUnit";
import {PDCPDataUnit} from "./PDCPDataUnit";

export class PDCPAck implements DataUnit {
  acked: PDCPDataUnit;
  sequenceNumber: number;
  readonly tint: number;
  readonly size: number;

  constructor(acked: PDCPDataUnit, sequenceNumber: number) {
    this.acked = acked;
    this.sequenceNumber = sequenceNumber;
    this.tint = acked.tint;
    this.size = acked.size;
  }
}
