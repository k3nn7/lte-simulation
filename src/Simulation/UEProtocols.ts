import * as PIXI from 'pixi.js';
import StartPoint from 'Common/StartPoint';
import uePDCPView from '../UE/PDCP/PDCPView';
import RLCView from '../UE/RLC/RLCView';
import ueMACView from '../UE/MAC/MACView';
import uePHYView from '../UE/PHY/PHYView';
import {ConnectorView} from 'Common/Connector/ConnectorView';
import InspectorView from "../Common/InspectorView";

export class UEProtocols extends PIXI.Container {
  endPoint: StartPoint;
  pdcpUp: uePDCPView;
  rlcUp: RLCView;
  macUp: ueMACView;
  phyDown: uePHYView;

  startToPdcp: ConnectorView
  pdcpToRlc: ConnectorView;
  rlcToMac: ConnectorView;
  macToPhy: ConnectorView;

  constructor(
    resources: Partial<Record<string, PIXI.LoaderResource>>,
    debugMode: boolean,
    inspectorView: InspectorView,
  ) {
    super();

    this.position.set(600, 0);

    this.endPoint = new StartPoint();
    this.endPoint.position.set(215, 0);

    this.pdcpUp = new uePDCPView(resources, debugMode, inspectorView);
    this.pdcpUp.position.set(0, 50);
    this.addChild(this.pdcpUp);

    this.rlcUp = new RLCView(resources, debugMode, inspectorView);
    this.rlcUp.position.set(0, this.pdcpUp.height + this.pdcpUp.y + 50);
    this.addChild(this.rlcUp);

    this.macUp = new ueMACView(resources, inspectorView);
    this.macUp.position.set(0, this.rlcUp.y + this.rlcUp.height + 50);
    this.addChild(this.macUp);

    this.phyDown = new uePHYView(resources, inspectorView);
    this.phyDown.position.set(0, this.macUp.y + this.macUp.height + 50);
    this.addChild(this.phyDown);

    this.startToPdcp = new ConnectorView(this.endPoint, this.pdcpUp);
    this.addChild(this.startToPdcp);

    this.pdcpToRlc = new ConnectorView(this.pdcpUp, this.rlcUp);
    this.addChild(this.pdcpToRlc);

    this.rlcToMac = new ConnectorView(this.rlcUp, this.macUp);
    this.addChild(this.rlcToMac);

    this.macToPhy = new ConnectorView(this.macUp, this.phyDown);
    this.addChild(this.macToPhy);
  }
}
