import {Simulation} from "../view/Simulation";
import {MacLayer} from "../model/lte/MacLayer";
import {ChannelType, LogicalChannelType, TransportChannelType} from "../model/lte/ChannelType";
import {TransmitPacketDownLink} from "../model/lte/Action";

export class SimulationController {
  private readonly inputBits: Map<string, HTMLInputElement>;
  private readonly inputPBR: Map<LogicalChannelType, HTMLInputElement>;
  private inputPDU: HTMLInputElement;
  private view: Simulation;
  private macLayer: MacLayer;

  constructor(
    inputBits: Map<string, HTMLInputElement>,
    inputPBR: Map<LogicalChannelType, HTMLInputElement>,
    inputPDU: HTMLInputElement,
    view: Simulation,
    macLayer: MacLayer
  ) {
    this.inputPDU = inputPDU;
    this.inputBits = inputBits;
    this.inputPBR = inputPBR;
    this.view = view;
    this.macLayer = macLayer;
  }

  public async start(): Promise<void> {
    this.macLayer.reset();

    this.macLayer.setChannelsPriorities([
      LogicalChannelType.PCCH,
      LogicalChannelType.BCCH,
      LogicalChannelType.CCCH,
      LogicalChannelType.DCCH,
      LogicalChannelType.DTCH,
      LogicalChannelType.MCCH,
      LogicalChannelType.MTCH,
    ]);
    const pdu = parseInt(this.inputPDU.value, 10);
    this.macLayer.setMaxPDU(pdu);

    for (const [c, v] of this.inputPBR) {
      const bits = parseInt(v.value, 10);
      this.macLayer.setChannelPBR(c, bits);
    }

    for (const [c, v] of this.inputBits) {
      const bits = parseInt(v.value, 10);
      this.macLayer.sendViaUpLink(<LogicalChannelType>this.strToChannel(c), bits);
      await this.view.sendPacketToInput(c, bits);
    }

    while (!this.macLayer.isDownLinkFinished()) {
      this.macLayer.doDownLinkStep();
      const action = <TransmitPacketDownLink>this.macLayer.getLastAction();
      await this.view.sendPacketFromLogicalChannelToTransportChannel(
        this.channelToStr(action.from),
        this.channelToStr(action.to),
        action.bits
      );
    }
  }

  private strToChannel(name: string): ChannelType {
    switch (name) {
      case 'PCCH':
        return LogicalChannelType.PCCH;
      case 'BCCH':
        return LogicalChannelType.BCCH;
      case 'CCCH':
        return LogicalChannelType.CCCH;
      case 'DCCH':
        return LogicalChannelType.DCCH;
      case 'DTCH':
        return LogicalChannelType.DTCH;
      case 'MCCH':
        return LogicalChannelType.MCCH;
      case 'MTCH':
        return LogicalChannelType.MTCH;
      case 'PCH':
        return TransportChannelType.PCH;
      case 'BCH':
        return TransportChannelType.BCH;
      case 'MCH':
        return TransportChannelType.MCH;
      case 'DL_SCH':
        return TransportChannelType.DL_SCH;
    }
  }

  private channelToStr(channel: ChannelType): string {
    switch (channel) {
      case LogicalChannelType.PCCH:
        return 'PCCH';
      case LogicalChannelType.BCCH:
        return 'BCCH';
      case LogicalChannelType.CCCH:
        return 'CCCH';
      case LogicalChannelType.DCCH:
        return 'DCCH';
      case LogicalChannelType.DTCH:
        return 'DTCH';
      case LogicalChannelType.MCCH:
        return 'MCCH';
      case LogicalChannelType.MTCH:
        return 'MTCH';
      case TransportChannelType.PCH:
        return 'PCH';
      case TransportChannelType.BCH:
        return 'BCH';
      case TransportChannelType.MCH:
        return 'MCH';
      case TransportChannelType.DL_SCH:
        return 'DL_SCH';
    }
  }
}
