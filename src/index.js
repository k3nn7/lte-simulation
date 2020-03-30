import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './main.css';

import * as PIXI from 'pixi.js';
import TWEEN from '@tweenjs/tween.js';
import {Simulation} from "./simulation";

const application = new PIXI.Application({width: 1200, height: 900, transparent: true, antialias: true});

// const startButton = document.getElementById('start-simulation');
document.getElementById('simulation-container').appendChild(application.view);

application.loader
  .add('helpIcon', 'help-icon.png')
  .add('bullet', 'bullet.png');

application.loader.load((loader, resources) => {
  const simulation = new Simulation(resources);
  application.stage.addChild(simulation);

  application.ticker.add(() => {
    TWEEN.update(application.ticker.lastTime);
  });

  document.getElementById('simulation-container')
    .addEventListener('click', async() => {
      await simulation.start();
    });
});
