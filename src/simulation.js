import * as PIXI from 'pixi.js';
import PDCP from './layer/pdcp';
import RLC from './layer/rlc';
import Connector from './layer/connector';
import StartPoint from './layer/startPoint';
import MAC from './layer/mac';
import PHY from './layer/phy';
import KneeConnector from './layer/kneeConnector';
import MinimizedPacket from './layer/minimized-packet';
import {getRandomInt} from './/src/utils';
import RLCView from './eNB/RLC';

export class Simulation extends PIXI.Container {
  constructor(resources) {
    super();

    this.ueProtocols = this.createUEProtocols(resources);
    this.enbProtocols = this.createEnbProtocols(resources);

    this.entitiesConnector = new KneeConnector(
      this.ueProtocols.phyDown,
      this.enbProtocols.phyDown
    );

    this.addChild(this.ueProtocols);
    this.addChild(this.enbProtocols);
    this.addChild(this.entitiesConnector);
  }

  createUEProtocols(resources) {
    const ue = new PIXI.Container();

    ue.endPoint = new StartPoint();
    ue.endPoint.position.set(215, 10);

    ue.pdcpUp = new PDCP(resources);
    ue.pdcpUp.position.set(0, 50);
    ue.addChild(ue.pdcpUp);

    ue.rlcUp = new RLC(resources);
    ue.rlcUp.position.set(0, ue.pdcpUp.height + ue.pdcpUp.y + 50);
    ue.addChild(ue.rlcUp);

    ue.macUp = new MAC(resources);
    ue.macUp.position.set(0, ue.rlcUp.y + ue.rlcUp.height + 50);
    ue.addChild(ue.macUp);

    ue.phyDown = new PHY(resources);
    ue.phyDown.position.set(0, ue.macUp.y + ue.macUp.height + 50);
    ue.addChild(ue.phyDown);

    ue.startToPdcp = new Connector(ue.endPoint, ue.pdcpUp);
    ue.addChild(ue.startToPdcp);

    ue.pdcpToRlc = new Connector(ue.pdcpUp, ue.rlcUp);
    ue.addChild(ue.pdcpToRlc);

    ue.rlcToMac = new Connector(ue.rlcUp, ue.macUp);
    ue.addChild(ue.rlcToMac);

    ue.macToPhy = new Connector(ue.macUp, ue.phyDown);
    ue.addChild(ue.macToPhy);

    return ue;
  }

  createEnbProtocols(resources) {
    const enb = new PIXI.Container();
    enb.position.set(600, 0);

    enb.endPoint = new StartPoint();
    enb.endPoint.position.set(215, 0);

    enb.pdcpUp = new PDCP(resources);
    enb.pdcpUp.position.set(0, 50);
    enb.addChild(enb.pdcpUp);

    enb.rlcUp = new RLCView(resources);
    enb.rlcUp.position.set(0, enb.pdcpUp.height + enb.pdcpUp.y + 50);
    enb.addChild(enb.rlcUp);

    enb.macUp = new MAC(resources);
    enb.macUp.position.set(0, enb.rlcUp.y + enb.rlcUp.height + 50);
    enb.addChild(enb.macUp);

    enb.phyDown = new PHY(resources);
    enb.phyDown.position.set(0, enb.macUp.y + enb.macUp.height + 50);
    enb.addChild(enb.phyDown);

    enb.startToPdcp = new Connector(enb.endPoint, enb.pdcpUp);
    enb.addChild(enb.startToPdcp);

    enb.pdcpToRlc = new Connector(enb.pdcpUp, enb.rlcUp);
    enb.addChild(enb.pdcpToRlc);

    enb.rlcToMac = new Connector(enb.rlcUp, enb.macUp);
    enb.addChild(enb.rlcToMac);

    enb.macToPhy = new Connector(enb.macUp, enb.phyDown);
    enb.addChild(enb.macToPhy);

    return enb;
  }

  async start() {
    const size = getRandomInt(20, 70);
    const packet = new MinimizedPacket(size);
    await this.ueProtocols.endPoint.addDataUnit(packet);
  }
}
