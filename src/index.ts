import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Renderer from "./engine/Renderer";
import {MacLayer} from "./model/lte/MacLayer";
import {LogicalChannelType} from "./model/lte/ChannelType";
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

function frame() {
  renderer.render();
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);

