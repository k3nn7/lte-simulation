export type ChannelType = LogicalChannelType | TransportChannelType;

export enum LogicalChannelType {
  PCCH,
  BCCH,
  CCCH,
  DCCH,
  DTCH,
  MCCH,
  MTCH,
}

export enum TransportChannelType {
  PCH = 10,
  BCH,
  DL_SCH,
  MCH,
}
