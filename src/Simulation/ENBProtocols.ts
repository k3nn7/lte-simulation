import * as PIXI from 'pixi.js';
import StartPoint from 'Common/StartPoint';
import enbPDCPView from '../eNB/PDCP/PDCPView';
import enbRLCView from '../eNB/RLC/RLCView';
import enbMACView from '../eNB/MAC/MACView';
import enbPHYView from '../eNB/PHY/PHYView';
import {ConnectorView} from 'Common/Connector/ConnectorView';
import InspectorView from "../Common/InspectorView";

export class ENBProtocols extends PIXI.Container {
  startPoint: StartPoint;
  pdcp: enbPDCPView;
  rlc: enbRLCView;
  mac: enbMACView;
  phy: enbPHYView;

  startToPdcp: ConnectorView;
  pdcpToRlc: ConnectorView;
  rlcToMac: ConnectorView;
  macToPhy: ConnectorView;

  constructor(
    resources: Partial<Record<string, PIXI.LoaderResource>>,
    inspectorView: InspectorView,
  ) {
    super();

    this.startPoint = new StartPoint();
    this.startPoint.position.set(215, 10);

    this.pdcp = new enbPDCPView(resources, inspectorView);
    this.pdcp.position.set(0, 50);
    this.addChild(this.pdcp);

    this.rlc = new enbRLCView(resources, inspectorView);
    this.rlc.position.set(0, this.pdcp.height + this.pdcp.y + 50);
    this.addChild(this.rlc);

    this.mac = new enbMACView(resources, inspectorView);
    this.mac.position.set(0, this.rlc.y + this.rlc.height + 50);
    this.addChild(this.mac);

    this.phy = new enbPHYView(resources, inspectorView);
    this.phy.position.set(0, this.mac.y + this.mac.height + 50);
    this.addChild(this.phy);

    this.startToPdcp = new ConnectorView(this.startPoint, this.pdcp);
    this.addChild(this.startToPdcp);

    this.pdcpToRlc = new ConnectorView(this.pdcp, this.rlc);
    this.addChild(this.pdcpToRlc);

    this.rlcToMac = new ConnectorView(this.rlc, this.mac);
    this.addChild(this.rlcToMac);

    this.macToPhy = new ConnectorView(this.mac, this.phy);
    this.addChild(this.macToPhy);
  }
}
