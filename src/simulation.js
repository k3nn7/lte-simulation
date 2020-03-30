import * as PIXI from 'pixi.js';
import PDCP from "./layer/pdcp";
import RLC from "./layer/rlc";
import Connector from "./layer/connector";
import StartPoint from "./layer/startPoint";
import MAC from "./layer/mac";
import PHY from "./layer/phy";
import KneeConnector from "./layer/kneeConnector";
import MinimizedPacket from "./layer/minimized-packet";
import TWEEN from "@tweenjs/tween.js";

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

    // const layers = new PIXI.Container();
    // layers.position.set(0, 50);
    //
    // const pdcpLayer1 = new Layer('RLC');
    // pdcpLayer1.position.set(5, 5);
    // layers.addChild(pdcpLayer1);
    //
    // const rlcLayer1 = new Layer();
    // rlcLayer1.position.set(5, 125);
    // layers.addChild(rlcLayer1);
    //
    // const macLayer1 = new Layer();
    // macLayer1.position.set(5, 245);
    // layers.addChild(macLayer1);
    //
    // const phyLayer1 = new Layer();
    // phyLayer1.position.set(5, 365);
    // layers.addChild(phyLayer1);
    //
    // const pdcpLayer2 = new Layer();
    // pdcpLayer2.position.set(340, 5);
    // layers.addChild(pdcpLayer2);
    //
    // const rlcLayer2 = new Layer();
    // rlcLayer2.position.set(340, 125);
    // layers.addChild(rlcLayer2);
    //
    // const macLayer2 = new Layer();
    // macLayer2.position.set(340, 245);
    // layers.addChild(macLayer2);
    //
    // const phyLayer2 = new Layer();
    // phyLayer2.position.set(340, 365);
    // layers.addChild(phyLayer2)
    //
    // this.addChild(layers);
    //
    // this.packet = new Packet();
    // this.packet.position.set(120, 5);
    // this.addChild(this.packet);
  }

  createUEProtocols(resources) {
    const ue = new PIXI.Container();

    ue.endPoint = new StartPoint();
    ue.endPoint.position.set(215, 0);

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

    enb.rlcUp = new RLC(resources);
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
    // await this.enbProtocols.pdcpUp.packet.minimize();
    // await this.enbProtocols.rlcUp.timer.startCounting(2000);
    await this.movePacket();
  }

  async movePacket() {
    const packet = new MinimizedPacket();
    packet.position.set(215, 15);

    this.addChild(packet);

    packet.activate();
    await this.movePacketToThePoint(packet, {x: 215, y: 50});

    await Promise.all([
      this.swallowPacket(packet),
      this.ueProtocols.pdcpUp.pushPacket(packet.tint)
    ]);
    await this.ueProtocols.pdcpUp.processPacket();
    packet.position.set(215, 200);
    await Promise.all([
      this.ueProtocols.pdcpUp.popPacket(),
      this.spitPacket(packet)
    ]);

    await this.movePacketToThePoint(packet, {x: 215, y: 250});
    packet.position.set(215, 400);
    await this.movePacketToThePoint(packet, {x: 215, y: 450});
    packet.position.set(215, 600);
    await this.movePacketToThePoint(packet, {x: 215, y: 650});
    packet.position.set(215, 800);
    await this.movePacketToThePoint(packet, {x: 215, y: 850});
    await this.movePacketToThePoint(packet, {x: 815, y: 850});

    await this.movePacketToThePoint(packet, {x: 815, y: 800});
    packet.position.set(815, 650);
    await this.movePacketToThePoint(packet, {x: 815, y: 600});
    packet.position.set(815, 450);
    await this.movePacketToThePoint(packet, {x: 815, y: 400});
    packet.position.set(815, 250);
    await this.movePacketToThePoint(packet, {x: 815, y: 200});
    packet.position.set(815, 50);
    await this.movePacketToThePoint(packet, {x: 815, y: 15});

    this.removeChild(packet);
  }

  async movePacketToThePoint(packet, point) {
    return new Promise((resolve) => {
      const position = {x: packet.x, y: packet.y};
      const tween = new TWEEN.Tween(position)
        .to(point, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          packet.position.set(position.x, position.y)
        })
        .onComplete(resolve)
        .start();
    });
  }

  async swallowPacket(packet) {
    packet.stop();
    return new Promise(resolve => {
      const scale = {scale: 1.0};
      const destination = {scale: 0.0};
      const tween = new TWEEN.Tween(scale)
        .to(destination, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          packet.scale.set(scale.scale, scale.scale);
        })
        .onComplete(resolve)
        .start();
    });
  }

  async spitPacket(packet) {
    return new Promise(resolve => {
      const scale = {scale: 0.0};
      const destination = {scale: 1.0};
      const tween = new TWEEN.Tween(scale)
        .to(destination, 500)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          packet.scale.set(scale.scale, scale.scale);
        })
        .onComplete(() => {
          packet.activate();
          resolve();
        })
        .start();
    });
  }
}
