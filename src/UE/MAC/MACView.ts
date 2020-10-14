import * as PIXI from 'pixi.js';
import LayerView from 'Common/LayerView';
import {ConnectorView} from 'Common/Connector/ConnectorView';
import ChannelView from './ChannelView';

export default class MACView extends LayerView {
  logicalChannels: Array<ChannelView>;
  transportChannels: Array<ChannelView>;
  connectors: Array<ConnectorView>;

  constructor(resources: Partial<Record<string, PIXI.LoaderResource>>) {
    super(resources, 'MAC');

    this.logicalChannels = new Array<ChannelView>();
    this.transportChannels = new Array<ChannelView>();
    this.connectors = new Array<ConnectorView>();

    this.logicalChannels.push(
      new ChannelView('PCCH'),
      new ChannelView('BCCH'),
      new ChannelView('CCCH'),
      new ChannelView('DCCH'),
      new ChannelView('DTCH'),
      new ChannelView('MCCH'),
      new ChannelView('MTCH'),
    );

    this.logicalChannels.forEach(((value, index) => {
      value.position.set(30 + index * 45, 5)
    }));

    this.transportChannels.push(
      new ChannelView('PCH', true),
      new ChannelView('BCH', true),
      new ChannelView('DL-SCH', true),
      new ChannelView('MCH', true),
    );
    this.transportChannels[0].position.set(30, 115);
    this.transportChannels[1].position.set(75, 115);
    this.transportChannels[2].position.set(165, 115);
    this.transportChannels[3].position.set(300, 115);

    this.connectors.push(
      new ConnectorView(this.logicalChannels[0], this.transportChannels[0], 1),
      new ConnectorView(this.logicalChannels[1], this.transportChannels[1], 1),
      new ConnectorView(this.logicalChannels[1], this.transportChannels[2], 1),
      new ConnectorView(this.logicalChannels[2], this.transportChannels[2], 1),
      new ConnectorView(this.logicalChannels[3], this.transportChannels[2], 1),
      new ConnectorView(this.logicalChannels[4], this.transportChannels[2], 1),
      new ConnectorView(this.logicalChannels[5], this.transportChannels[2], 1),
      new ConnectorView(this.logicalChannels[6], this.transportChannels[2], 1),
      new ConnectorView(this.logicalChannels[5], this.transportChannels[3], 1),
      new ConnectorView(this.logicalChannels[6], this.transportChannels[3], 1),
    );

    this.body.addChild(
      ...this.logicalChannels,
      ...this.transportChannels,
      ...this.connectors,
    );
  }
}
