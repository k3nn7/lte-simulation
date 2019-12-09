import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Renderer from "./engine/Renderer";
import Transform from "./engine/Transform";
import Vector2D from "./engine/Vector2D";
import Box from "./renderables/Box";
import Circle from "./renderables/Circle";
import RowLayout from "./renderables/RowLayout";
import {MacLayer} from "./model/lte/MacLayer";
import {LogicalChannelType, TransportChannelType} from "./model/lte/ChannelType";
import {SlideAnimation} from "./animators/SlideAnimation";
import {TransmitPacketDownLink} from "./model/lte/Action";
import {Simulation} from "./view/Simulation";
import {SimulationController} from "./controller/SimulationController";

const canvas = <HTMLCanvasElement>document.getElementById('simulation');
const renderer = new Renderer(canvas.getContext('2d'));
const startSimulationButton = <HTMLButtonElement>document.getElementById('start-simulation');

const macLayer = new MacLayer();

const simulation = new Simulation();

const simulationController = new SimulationController(
  new Map<string, HTMLInputElement>([
    ['PCCH', <HTMLInputElement>document.getElementById('PCCH-bits')],
    ['BCCH', <HTMLInputElement>document.getElementById('BCCH-bits')],
    ['CCCH', <HTMLInputElement>document.getElementById('CCCH-bits')],
    ['DCCH', <HTMLInputElement>document.getElementById('DCCH-bits')],
    ['DTCH', <HTMLInputElement>document.getElementById('DTCH-bits')],
    ['MCCH', <HTMLInputElement>document.getElementById('MCCH-bits')],
    ['MTCH', <HTMLInputElement>document.getElementById('MTCH-bits')],
  ]),
  new Map<LogicalChannelType, HTMLInputElement>([
    [LogicalChannelType.PCCH, <HTMLInputElement>document.getElementById('PCCH-pbr')],
    [LogicalChannelType.BCCH, <HTMLInputElement>document.getElementById('BCCH-pbr')],
    [LogicalChannelType.CCCH, <HTMLInputElement>document.getElementById('CCCH-pbr')],
    [LogicalChannelType.DCCH, <HTMLInputElement>document.getElementById('DCCH-pbr')],
    [LogicalChannelType.DTCH, <HTMLInputElement>document.getElementById('DTCH-pbr')],
    [LogicalChannelType.MCCH, <HTMLInputElement>document.getElementById('MCCH-pbr')],
    [LogicalChannelType.MTCH, <HTMLInputElement>document.getElementById('MTCH-pbr')],
  ]),
  <HTMLInputElement>document.getElementById('PDU'),
  simulation,
  macLayer
);

renderer.addObject(simulation);

startSimulationButton.addEventListener('click', async () => {
  await simulationController.start();
});


//
//   simulationStep();
// }
//
// function simulationStep() {
//   if (!macLayer.isDownLinkFinished()) {
//     macLayer.doDownLinkStep();
//     PCCH.setText('' + macLayer.peekUpLink().get(LogicalChannelType.PCCH));
//
//     BCCH.setText('' + macLayer.peekUpLink().get(LogicalChannelType.BCCH));
//     CCCH.setText('' + macLayer.peekUpLink().get(LogicalChannelType.CCCH));
//     DCCH.setText('' + macLayer.peekUpLink().get(LogicalChannelType.DCCH));
//     DTCH.setText('' + macLayer.peekUpLink().get(LogicalChannelType.DTCH));
//     MCCH.setText('' + macLayer.peekUpLink().get(LogicalChannelType.MCCH));
//     MTCH.setText('' + macLayer.peekUpLink().get(LogicalChannelType.MTCH));
//     PCH.setText('' + macLayer.peekDownLink().get(TransportChannelType.PCH));
//
//     BCH.setText('' + macLayer.peekDownLink().get(TransportChannelType.BCH));
//     DL_SCH.setText('' + macLayer.peekDownLink().get(TransportChannelType.DL_SCH));
//     MCH.setText('' + macLayer.peekDownLink().get(TransportChannelType.MCH));
//
//     const action = <TransmitPacketDownLink>macLayer.getLastAction();
//
//     const animation = new SlideAnimation(
//       new Box(30, 30, '' + action.bits),
//       new Vector2D(0, 100),
//       1000
//     );
//
//     const packetAnimation = new Transform(
//       new Vector2D(200, 110),
//       animation,
//     );
//     const id = renderer.addObject(packetAnimation);
//
//     animation.waitFor().then(() => {
//       renderer.removeObject(id);
//       simulationStep();
//     });
//   }
// }
//
//


function frame() {
  renderer.render();
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);

