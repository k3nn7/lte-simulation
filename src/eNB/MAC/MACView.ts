import * as PIXI from 'pixi.js';
import LayerView from 'Common/LayerView';
import ChannelView from './ChannelView';
import {ConnectorView} from 'Common/Connector/ConnectorView';
import InspectorView from "../../Common/InspectorView";

export default class MACView extends LayerView {
  logicalChannels: Array<ChannelView>;
  transportChannels: Array<ChannelView>;
  connectors: Array<ConnectorView>;
  inspectorView: InspectorView;

  constructor(
    resources: Partial<Record<string, PIXI.LoaderResource>>,
    inspectorView: InspectorView,
  ) {
    super(resources, 'MAC');
    this.inspectorView = inspectorView;

    this.header.on('click', () => {
      this.inspectorView.show('MAC', 'MAC Layer is responsible for:');
    });

    this.logicalChannels = new Array<ChannelView>();
    this.transportChannels = new Array<ChannelView>();
    this.connectors = new Array<ConnectorView>();

    this.logicalChannels.push(
      new ChannelView('PCCH', false, this.inspectorView),
      new ChannelView('BCCH', false, this.inspectorView),
      new ChannelView('CCCH', false, this.inspectorView),
      new ChannelView('DCCH', false, this.inspectorView),
      new ChannelView('DTCH', false, this.inspectorView),
      new ChannelView('MCCH', false, this.inspectorView),
      new ChannelView('MTCH', false, this.inspectorView),
    );

    this.logicalChannels.forEach(((value, index) => {
      value.position.set(30 + index * 45, 5)
    }));

    this.transportChannels.push(
      new ChannelView('PCH', true, this.inspectorView),
      new ChannelView('BCH', true, this.inspectorView),
      new ChannelView('DL-SCH', true, this.inspectorView),
      new ChannelView('MCH', true, this.inspectorView),
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
