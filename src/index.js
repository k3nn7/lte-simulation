import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './main.css';

import * as PIXI from 'pixi.js';
import TWEEN from '@tweenjs/tween.js';
import {Simulation} from "./Simulation/Simulation";

const application = new PIXI.Application({width: 1200, height: 900, transparent: true, antialias: true});

const loading = document.getElementById('loading');
const navbar = document.getElementById('navbar');
const inspector = document.getElementById('inspector');
const simulationOverlay = document.getElementById('simulation-overlay');
const simulationContainer = document.getElementById('simulation-container');
simulationContainer.appendChild(application.view);

application.loader
  .add('helpIcon', 'help-icon.png')
  .add('lock', 'lock.png')
  .add('bullet', 'bullet.png');

application.loader.load((loader, resources) => {
  const simulation = new Simulation(resources, application.ticker, false, inspector, simulationOverlay);
  application.stage.addChild(simulation);



  application.ticker.add(() => {
    TWEEN.update(application.ticker.lastTime);
  });

  simulationContainer.classList.remove('d-none');
  navbar.classList.remove('d-none');
  loading.classList.add('d-none');

  simulationOverlay.addEventListener('click', () => {
    inspector.classList.add('d-none');
    simulationOverlay.classList.add('d-none');
  });
});
