import {LogicalChannelType, TransportChannelType} from "./ChannelType";
import {Action, TransmitPacketDownLink} from "./Action";

export class MacLayer {
  private readonly upLinkChannels: Map<LogicalChannelType, number>;
  private readonly downLinkChannels: Map<TransportChannelType, number>;
  private readonly stageFunction: (() => void)[];

  private logicalToTransportChannelMapping: Map<LogicalChannelType, TransportChannelType>;
  private upLinkChannelPriorities: LogicalChannelType[];
  private channelPBRs: Map<LogicalChannelType, number>;
  private maxPDU: number;
  private PDU: number;

  private stage: number;
  private step: number;
  private isFinished: boolean;
  private upLinkBits: number;
  private lastAction: Action;

  constructor() {
    this.upLinkChannels = new Map<LogicalChannelType, number>();
    this.downLinkChannels = new Map<TransportChannelType, number>();
    this.logicalToTransportChannelMapping = new Map<LogicalChannelType, TransportChannelType>();
    this.channelPBRs = new Map<LogicalChannelType, number>();
    this.stageFunction = [
      () => this.doStage0(),
      () => this.doStage1()
    ];
    this.reset();
  }

  reset() {
    this.step = 0;
    this.stage = 0;
    this.PDU = 0;
    this.isFinished = false;
    this.upLinkBits = 0;
    this.clearUpLinkChannels();
    this.clearDownLinkChannels();
    this.configureChannelsMapping();
  }

  private clearUpLinkChannels() {
    this.upLinkChannels.set(LogicalChannelType.PCCH, 0);
    this.upLinkChannels.set(LogicalChannelType.BCCH, 0);
    this.upLinkChannels.set(LogicalChannelType.CCCH, 0);
    this.upLinkChannels.set(LogicalChannelType.DCCH, 0);
    this.upLinkChannels.set(LogicalChannelType.DTCH, 0);
    this.upLinkChannels.set(LogicalChannelType.MCCH, 0);
    this.upLinkChannels.set(LogicalChannelType.MTCH, 0);
  }

  private clearDownLinkChannels() {
    this.downLinkChannels.set(TransportChannelType.PCH, 0);
    this.downLinkChannels.set(TransportChannelType.BCH, 0);
    this.downLinkChannels.set(TransportChannelType.DL_SCH, 0);
    this.downLinkChannels.set(TransportChannelType.MCH, 0);
  }

  private configureChannelsMapping() {
    this.logicalToTransportChannelMapping.set(LogicalChannelType.PCCH, TransportChannelType.PCH);
    this.logicalToTransportChannelMapping.set(LogicalChannelType.BCCH, TransportChannelType.BCH);
    this.logicalToTransportChannelMapping.set(LogicalChannelType.CCCH, TransportChannelType.DL_SCH);
    this.logicalToTransportChannelMapping.set(LogicalChannelType.DCCH, TransportChannelType.DL_SCH);
    this.logicalToTransportChannelMapping.set(LogicalChannelType.DTCH, TransportChannelType.DL_SCH);
    this.logicalToTransportChannelMapping.set(LogicalChannelType.MCCH, TransportChannelType.DL_SCH);
    this.logicalToTransportChannelMapping.set(LogicalChannelType.MTCH, TransportChannelType.MCH);
  }

  sendViaUpLink(channel: LogicalChannelType, bits: number) {
    const newBits = this.upLinkChannels.get(channel) + bits;
    this.upLinkChannels.set(channel, newBits);
    this.upLinkBits += bits;
  }

  peekUpLink(): Map<LogicalChannelType, number> {
    return this.upLinkChannels;
  }

  peekDownLink(): Map<TransportChannelType, number> {
    return this.downLinkChannels;
  }

  sendViaDownLink(channel: TransportChannelType, bits: number) {
    const newBits = this.downLinkChannels.get(channel) + bits;
    this.downLinkChannels.set(channel, newBits);
  }

  setChannelsPriorities(priorities: LogicalChannelType[]) {
    this.upLinkChannelPriorities = priorities;
  }

  setChannelPBR(channel: LogicalChannelType, PBR: number) {
    this.channelPBRs.set(channel, PBR);
  }

  doDownLinkStep() {
    if (this.stage == 0 && this.step == this.upLinkChannels.size) {
      this.stage = 1;
      this.step = 0;
    }

    this.stageFunction[this.stage]();

    if (this.PDU == this.maxPDU) {
      this.isFinished = true;
    }

    if (this.upLinkBits == 0) {
      this.isFinished = true;
    }
  }

  private doStage0() {
    const sourceChannel = this.upLinkChannelPriorities[this.step];
    const destinationChannel = this.logicalToTransportChannelMapping.get(sourceChannel);
    const bitsToFetch = Math.min(this.channelPBRs.get(sourceChannel), this.maxPDU - this.PDU);

    const fetchedBits = this.fetchFromUpLink(sourceChannel, bitsToFetch);
    this.sendViaDownLink(destinationChannel, fetchedBits);
    this.PDU += fetchedBits;

    this.lastAction = new TransmitPacketDownLink(
      sourceChannel,
      destinationChannel,
      fetchedBits
    );

    this.step++;
  }

  private doStage1() {
    const sourceChannel = this.upLinkChannelPriorities[this.step];
    const destinationChannel = this.logicalToTransportChannelMapping.get(sourceChannel);
    const bitsToFetch = this.maxPDU - this.PDU;

    const fetchedBits = this.fetchFromUpLink(sourceChannel, bitsToFetch);
    this.sendViaDownLink(destinationChannel, fetchedBits);
    this.PDU += fetchedBits;

    this.lastAction = new TransmitPacketDownLink(
      sourceChannel,
      destinationChannel,
      fetchedBits
    );

    this.step++;
  }

  fetchFromDownLink(channel: TransportChannelType, bits: number): number {
    const bitsInChannel = this.downLinkChannels.get(channel);
    const bitsToFetch = Math.min(bitsInChannel, bits);

    this.downLinkChannels.set(channel, bitsInChannel - bitsToFetch);

    return bitsToFetch;
  }

  fetchFromUpLink(channel: LogicalChannelType, bits: number): number {
    const bitsInChannel = this.upLinkChannels.get(channel);
    const bitsToFetch = Math.min(bitsInChannel, bits);

    this.upLinkChannels.set(channel, bitsInChannel - bitsToFetch);
    this.upLinkBits -= bitsToFetch;

    return bitsToFetch;
  }

  setMaxPDU(PDU: number) {
    this.maxPDU = PDU;
  }

  public isDownLinkFinished() {
    return this.isFinished;
  }

  getLastAction(): Action {
    return this.lastAction;
  }
}
