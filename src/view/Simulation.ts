import Vector2D from "../engine/Vector2D";
import {RenderableObject} from "../engine/RenderableObject";
import {Layer} from "./Layer";
import Box from "../engine/primitives/Box";
import {Channel} from "./Channel";
import RowLayout from "../engine/primitives/RowLayout";
import {Packet} from "./Packet";
import {SlideAnimation} from "../engine/primitives/SlideAnimation";

export class Simulation extends RenderableObject {
  private readonly transportChannels: Map<string, Channel>;
  private readonly logicalChannels: Map<string, Channel>;
  private readonly transportChannelsRow: RowLayout;
  private readonly logicalChannelsRow: RowLayout;
  private readonly radioLinkControlLayer: Layer;
  private readonly macLayer: Layer;
  private readonly physicalLayer: Layer;
  private readonly pdu: RenderableObject;

  private packet: RenderableObject;

  constructor() {
    super();
    this.logicalChannels = new Map<string, Channel>();
    this.transportChannels = new Map<string, Channel>();
    this.logicalChannelsRow = new RowLayout(47);
    this.logicalChannelsRow.translate(new Vector2D(62, 110));
    this.transportChannelsRow = new RowLayout(60);
    this.transportChannelsRow.translate(new Vector2D(107, 240));

    this.createChannels();

    this.radioLinkControlLayer = new Layer(5, 5, 'Radio Link Control Layer');
    this.macLayer = new Layer(5, 135, 'Mac Layer');
    this.physicalLayer = new Layer(5, 265, 'Physical Layer');

    this.pdu = new Box(200, 50);
    this.pdu.translate(new Vector2D(100, 280));
  }

  private createChannels() {
    ['PCCH', 'BCCH', 'CCCH', 'DCCH', 'DTCH', 'MCCH', 'MTCH'].forEach((channel) => {
      const channelObject = new Channel(0, channel);
      this.logicalChannels.set(
        channel,
        channelObject
      );
      this.logicalChannelsRow.addObject(channelObject);
    });

    ['PCH', 'BCH', 'DL_SCH', 'MCH'].forEach((channel => {
      const channelObject = new Channel(0, channel);
      this.transportChannels.set(
        channel,
        channelObject
      );
      this.transportChannelsRow.addObject(channelObject);
    }));
  }

  public async sendPacketToInput(destination: string, bits: number): Promise<void> {
    const channel = this.logicalChannels.get(destination);
    const animation = new SlideAnimation(
      new Packet(channel.getTranslation().x + 46, 50, bits),
      new Vector2D(0, 30),
      500
    );
    this.packet = animation;

    return animation.waitFor().then(() => {
      this.packet = null;
      channel.addBits(bits);
    });
  }

  public async sendPacketFromLogicalChannelToTransportChannel(input: string, destination: string, bits: number): Promise<void> {
    const inputChannel = this.logicalChannels.get(input);
    const destinationChannel = this.transportChannels.get(destination);
    const path = new Vector2D(
      destinationChannel.getTranslation().x - inputChannel.getTranslation().x + 40,
      130,
    );

    const animation = new SlideAnimation(
      new Packet(inputChannel.getTranslation().x + 46, 80, bits),
      path,
      500
    );

    this.packet = animation;
    inputChannel.addBits(-bits);

    return animation.waitFor().then(() => {
      this.packet = null;
      destinationChannel.addBits(bits);
    });
  }

  protected draw(ctx: CanvasRenderingContext2D, time: number): void {
    this.radioLinkControlLayer.render(ctx, time);
    this.macLayer.render(ctx, time);
    this.physicalLayer.render(ctx, time);
    this.pdu.render(ctx, time);
    this.logicalChannelsRow.render(ctx, time);
    this.transportChannelsRow.render(ctx, time);

    if (this.packet) {
      this.packet.render(ctx, time);
    }
  }
}
