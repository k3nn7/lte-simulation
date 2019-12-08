import './style.css'
import Renderer from "./engine/Renderer";
import Transform from "./engine/Transform";
import Vector2D from "./engine/Vector2D";
import Box from "./renderables/Box";
import Circle from "./renderables/Circle";
import RowLayout from "./renderables/RowLayout";
import {MacLayer} from "./lte/MacLayer";
import {LogicalChannelType, TransportChannelType} from "./lte/ChannelType";
import {SlideAnimation} from "./animators/SlideAnimation";
import {TransmitPacketDownLink} from "./lte/Action";

const canvas = <HTMLCanvasElement>document.getElementById('simulation');
const renderer = new Renderer(canvas.getContext('2d'));
const startSimulationButton = <HTMLButtonElement>document.getElementById('start-simulation');

startSimulationButton.addEventListener('click', startSimulation);

const macLayer = new MacLayer();
const PCCH = new Circle(15, '0'),
  BCCH = new Circle(15, '0'),
  CCCH = new Circle(15, '0'),
  DCCH = new Circle(15, '0'),
  DTCH = new Circle(15, '0'),
  MCCH = new Circle(15, '0'),
  MTCH = new Circle(15, '0'),
  PCH = new Circle(15, '0'),
  BCH = new Circle(15, '0'),
  DL_SCH = new Circle(15, '0'),
  MCH = new Circle(15, '0');


function startSimulation() {
  macLayer.setChannelsPriorities([
    LogicalChannelType.PCCH,
    LogicalChannelType.BCCH,
    LogicalChannelType.CCCH,
    LogicalChannelType.DCCH,
    LogicalChannelType.DTCH,
    LogicalChannelType.MCCH,
    LogicalChannelType.MTCH,
  ]);

  macLayer.setChannelPBR(LogicalChannelType.PCCH, 2);
  macLayer.setChannelPBR(LogicalChannelType.BCCH, 3);
  macLayer.setChannelPBR(LogicalChannelType.CCCH, 4);
  macLayer.setChannelPBR(LogicalChannelType.DCCH, 1);
  macLayer.setChannelPBR(LogicalChannelType.DTCH, 6);
  macLayer.setChannelPBR(LogicalChannelType.MCCH, 1);
  macLayer.setChannelPBR(LogicalChannelType.MTCH, 3);

  macLayer.setMaxPDU(30);

  macLayer.sendViaUpLink(LogicalChannelType.PCCH, 5);
  macLayer.sendViaUpLink(LogicalChannelType.BCCH, 10);
  macLayer.sendViaUpLink(LogicalChannelType.CCCH, 7);
  macLayer.sendViaUpLink(LogicalChannelType.DCCH, 3);
  macLayer.sendViaUpLink(LogicalChannelType.DTCH, 8);
  macLayer.sendViaUpLink(LogicalChannelType.MCCH, 2);
  macLayer.sendViaUpLink(LogicalChannelType.MTCH, 6);

  PCCH.setText('' + macLayer.peekUpLink().get(LogicalChannelType.PCCH));
  BCCH.setText('' + macLayer.peekUpLink().get(LogicalChannelType.BCCH));
  CCCH.setText('' + macLayer.peekUpLink().get(LogicalChannelType.CCCH));
  DCCH.setText('' + macLayer.peekUpLink().get(LogicalChannelType.DCCH));
  DTCH.setText('' + macLayer.peekUpLink().get(LogicalChannelType.DTCH));
  MCCH.setText('' + macLayer.peekUpLink().get(LogicalChannelType.MCCH));
  MTCH.setText('' + macLayer.peekUpLink().get(LogicalChannelType.MTCH));

  PCH.setText('' + macLayer.peekDownLink().get(TransportChannelType.PCH));
  BCH.setText('' + macLayer.peekDownLink().get(TransportChannelType.BCH));
  DL_SCH.setText('' + macLayer.peekDownLink().get(TransportChannelType.DL_SCH));
  MCH.setText('' + macLayer.peekDownLink().get(TransportChannelType.MCH));

  simulationStep();
}

function simulationStep() {
  if (!macLayer.isDownLinkFinished()) {
    macLayer.doDownLinkStep();
    PCCH.setText('' + macLayer.peekUpLink().get(LogicalChannelType.PCCH));

    BCCH.setText('' + macLayer.peekUpLink().get(LogicalChannelType.BCCH));
    CCCH.setText('' + macLayer.peekUpLink().get(LogicalChannelType.CCCH));
    DCCH.setText('' + macLayer.peekUpLink().get(LogicalChannelType.DCCH));
    DTCH.setText('' + macLayer.peekUpLink().get(LogicalChannelType.DTCH));
    MCCH.setText('' + macLayer.peekUpLink().get(LogicalChannelType.MCCH));
    MTCH.setText('' + macLayer.peekUpLink().get(LogicalChannelType.MTCH));
    PCH.setText('' + macLayer.peekDownLink().get(TransportChannelType.PCH));

    BCH.setText('' + macLayer.peekDownLink().get(TransportChannelType.BCH));
    DL_SCH.setText('' + macLayer.peekDownLink().get(TransportChannelType.DL_SCH));
    MCH.setText('' + macLayer.peekDownLink().get(TransportChannelType.MCH));

    const action = <TransmitPacketDownLink>macLayer.getLastAction();

    const animation = new SlideAnimation(
      new Box(30, 30, '' + action.bits),
      new Vector2D(0, 100),
      1000
    );

    const packetAnimation = new Transform(
      new Vector2D(200, 110),
      animation,
    );
    const id = renderer.addObject(packetAnimation);

    animation.waitFor().then(() => {
      renderer.removeObject(id);
      simulationStep();
    });
  }
}



// Radio Link Control Layer
renderer.addObject(
  new Transform(
    new Vector2D(5, 5),
    new Box(390, 80)
  )
);

// Mac Layer
renderer.addObject(
  new Transform(
    new Vector2D(5, 135),
    new Box(390, 80)
  )
);

// Physical Layer
renderer.addObject(
  new Transform(
    new Vector2D(5, 265),
    new Box(390, 80)
  )
);

// Physical Layer PDU
renderer.addObject(
  new Transform(
    new Vector2D(100, 280),
    new Box(200, 50)
  )
);


// Channels
const row = new RowLayout(47);
row.addObject(PCCH);
row.addObject(BCCH);
row.addObject(CCCH);
row.addObject(DCCH);
row.addObject(DTCH);
row.addObject(MCCH);
row.addObject(MTCH);

renderer.addObject(new Transform(
  new Vector2D(62, 110),
  row
));

// Channels
const row2 = new RowLayout(60);
row2.addObject(PCH);
row2.addObject(BCH);
row2.addObject(DL_SCH);
row2.addObject(MCH);

renderer.addObject(
  new Transform(
    new Vector2D(107, 240),
    row2
  )
);

// Connections
// renderer.addObject(
//   new Line(
//     new Vector2D(62, 140),
//     new Vector2D(107, 210),
//   )
// );
//
// renderer.addObject(
//   new Line(
//     new Vector2D(154, 140),
//     new Vector2D(199, 210),
//   )
// );
//
// renderer.addObject(
//   new Line(
//     new Vector2D(246, 140),
//     new Vector2D(199, 210),
//   )
// );
//
// renderer.addObject(
//   new Line(
//     new Vector2D(338, 140),
//     new Vector2D(291, 210),
//   )
// );



function frame() {
  renderer.render();
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);

