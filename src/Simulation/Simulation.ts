import * as PIXI from 'pixi.js';
import {IPPacketGenerator} from 'Common/IP/index';
import ButtonView from 'Common/ButtonView';
import EntitiesConnector from 'Common/Connector/EntitiesConnector';
import {ENBProtocols} from "./ENBProtocols";
import {UEProtocols} from "./UEProtocols";
import InspectorView from "../Common/InspectorView";

export class Simulation extends PIXI.Container {
  debugMode: boolean;
  startButton: ButtonView;
  pauseButton: ButtonView;
  enbProtocols: ENBProtocols;
  ueProtocols: UEProtocols;
  entitiesConnector: EntitiesConnector;
  ipPacketGenerator: IPPacketGenerator;
  inspectorView: InspectorView;

  constructor(
    resources: Partial<Record<string, PIXI.LoaderResource>>,
    ticker: PIXI.Ticker,
    debugMode: boolean,
    inspector: HTMLElement,
    overlay: HTMLElement,
  ) {
    super();

    this.inspectorView = new InspectorView(inspector, overlay);
    this.debugMode = debugMode;

    this.startButton = new ButtonView('Send packet →');
    this.startButton.position.set(30, 0);
    this.startButton.setOnClick(() => {
      this.sendPacket();
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

    this.enbProtocols = new ENBProtocols(resources, this.inspectorView);
    this.ueProtocols = new UEProtocols(resources, debugMode, this.inspectorView);

    this.entitiesConnector = new EntitiesConnector(
      this.enbProtocols.phy,
      this.ueProtocols.phyDown
    );

    this.ipPacketGenerator = new IPPacketGenerator();

    this.addChild(this.enbProtocols);
    this.addChild(this.ueProtocols);
    this.addChild(this.entitiesConnector);
  }


  async sendPacket() {
    const ipPacket = this.ipPacketGenerator.generate();
    await this.enbProtocols.startPoint.addDataUnit(ipPacket);
  }
}
