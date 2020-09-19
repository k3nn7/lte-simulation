import * as PIXI from 'pixi.js';
import {IPPacketGenerator} from 'Common/IP/index';
import ButtonView from 'Common/ButtonView';
import KneeConnector from 'Common/Connector/KneeConnector';
import {ENBProtocols} from "./ENBProtocols";
import {UEProtocols} from "./UEProtocols";

export class Simulation extends PIXI.Container {
  debugMode: boolean;
  startButton: ButtonView;
  pauseButton: ButtonView;
  enbProtocols: ENBProtocols;
  ueProtocols: UEProtocols;
  entitiesConnector: KneeConnector;
  ipPacketGenerator: IPPacketGenerator;

  constructor(
    resources: Partial<Record<string, PIXI.LoaderResource>>,
    ticker: PIXI.Ticker,
    debugMode: boolean
  ) {
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

    this.enbProtocols = new ENBProtocols(resources);
    this.ueProtocols = new UEProtocols(resources, debugMode);

    this.entitiesConnector = new KneeConnector(
      this.enbProtocols.phy,
      this.ueProtocols.phyDown
    );

    this.ipPacketGenerator = new IPPacketGenerator();

    this.addChild(this.enbProtocols);
    this.addChild(this.ueProtocols);
    this.addChild(this.entitiesConnector);
  }


  async start() {
    const ipPacket = this.ipPacketGenerator.generate();
    await this.enbProtocols.startPoint.addDataUnit(ipPacket);
  }
}
