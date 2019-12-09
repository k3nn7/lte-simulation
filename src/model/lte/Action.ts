import {LogicalChannelType, TransportChannelType} from "./ChannelType";

export enum ActionType {
  TransmitPacket
}

export abstract class Action {
  readonly type: ActionType;

  protected constructor(type: ActionType) {
    this.type = type;
  }
}

export class TransmitPacketDownLink extends Action {
  readonly from: LogicalChannelType;
  readonly to: TransportChannelType
  readonly bits: number;

  constructor(from: LogicalChannelType, to: TransportChannelType, bits: number) {
    super(ActionType.TransmitPacket);
    this.from = from;
    this.to = to;
    this.bits = bits;
  }
}


