import * as PIXI from 'pixi.js';
import RLCView from './UE/RLC';
import {IPPacketGenerator} from 'Common/IP';
import {ConnectorView} from 'Common/Connector/ConnectorView';
import ButtonView from 'Common/ButtonView';
import enbPDCPView from './eNB/PDCP/PDCPView';
import uePDCPView from './UE/PDCP/PDCPView' ;
import enbRLCView from './eNB/RLC/RLCView';
import enbMACView from './eNB/MAC/MACView';
import ueMACView from './UE/MAC/MACView';
import enbPHYView from './eNB/PHY/PHYView';
import uePHYView from './UE/PHY/PHYView';
import KneeConnector from 'Common/Connector/KneeConnector';
import StartPoint from 'Common/StartPoint';

export class Simulation extends PIXI.Container {
  constructor(resources, ticker, debugMode) {
    super();

    this.debugMode = debugMode;

    this.startButton = new ButtonView('Send packet →');
    this.startButton.position.set(30, 0);
    this.startButton.setOnClick(() => {
      this.start();
    });
    this.addChild(this.startButton);

    this.pauseButton = new ButtonView('Pause');
    this.pauseButton.position.set(250, 0);
    this.pauseButton.setOnClick(() => {
      if (ticker.started) {
        ticker.stop();
      } else {
        ticker.start();
      }
    });
    this.addChild(this.pauseButton);

    this.enbProtocols = this.createENBProtocols(resources);
    this.ueProtocols = this.createUEProtocols(resources);

    this.entitiesConnector = new KneeConnector(
      this.enbProtocols.phyDown,
      this.ueProtocols.phyDown
    );

    this.ipPacketGenerator = new IPPacketGenerator();

    this.addChild(this.enbProtocols);
    this.addChild(this.ueProtocols);
    this.addChild(this.entitiesConnector);
  }

  createENBProtocols(resources) {
    const enb = new PIXI.Container();

    enb.endPoint = new StartPoint();
    enb.endPoint.position.set(215, 10);

    enb.pdcpUp = new enbPDCPView(resources);
    enb.pdcpUp.position.set(0, 50);
    enb.addChild(enb.pdcpUp);

    enb.rlcUp = new enbRLCView(resources);
    enb.rlcUp.position.set(0, enb.pdcpUp.height + enb.pdcpUp.y + 50);
    enb.addChild(enb.rlcUp);

    enb.macUp = new enbMACView(resources);
    enb.macUp.position.set(0, enb.rlcUp.y + enb.rlcUp.height + 50);
    enb.addChild(enb.macUp);

    enb.phyDown = new enbPHYView(resources);
    enb.phyDown.position.set(0, enb.macUp.y + enb.macUp.height + 50);
    enb.addChild(enb.phyDown);

    enb.startToPdcp = new ConnectorView(enb.endPoint, enb.pdcpUp);
    enb.addChild(enb.startToPdcp);

    enb.pdcpToRlc = new ConnectorView(enb.pdcpUp, enb.rlcUp);
    enb.addChild(enb.pdcpToRlc);

    enb.rlcToMac = new ConnectorView(enb.rlcUp, enb.macUp);
    enb.addChild(enb.rlcToMac);

    enb.macToPhy = new ConnectorView(enb.macUp, enb.phyDown);
    enb.addChild(enb.macToPhy);

    return enb;
  }

  createUEProtocols(resources) {
    const ue = new PIXI.Container();
    ue.position.set(600, 0);

    ue.endPoint = new StartPoint();
    ue.endPoint.position.set(215, 0);

    ue.pdcpUp = new uePDCPView(resources, this.debugMode);
    ue.pdcpUp.position.set(0, 50);
    ue.addChild(ue.pdcpUp);

    ue.rlcUp = new RLCView(resources);
    ue.rlcUp.position.set(0, ue.pdcpUp.height + ue.pdcpUp.y + 50);
    ue.addChild(ue.rlcUp);

    ue.macUp = new ueMACView(resources);
    ue.macUp.position.set(0, ue.rlcUp.y + ue.rlcUp.height + 50);
    ue.addChild(ue.macUp);

    ue.phyDown = new uePHYView(resources);
    ue.phyDown.position.set(0, ue.macUp.y + ue.macUp.height + 50);
    ue.addChild(ue.phyDown);

    ue.startToPdcp = new ConnectorView(ue.endPoint, ue.pdcpUp);
    ue.addChild(ue.startToPdcp);

    ue.pdcpToRlc = new ConnectorView(ue.pdcpUp, ue.rlcUp);
    ue.addChild(ue.pdcpToRlc);

    ue.rlcToMac = new ConnectorView(ue.rlcUp, ue.macUp);
    ue.addChild(ue.rlcToMac);

    ue.macToPhy = new ConnectorView(ue.macUp, ue.phyDown);
    ue.addChild(ue.macToPhy);

    return ue;
  }

  async start() {
    const ipPacket = this.ipPacketGenerator.generate();
    await this.enbProtocols.endPoint.addDataUnit(ipPacket);
  }
}
