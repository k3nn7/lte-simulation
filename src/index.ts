import './style.css'
import Renderer from "./engine/Renderer";
import Transform from "./engine/Transform";
import Vector2D from "./engine/Vector2D";
import Box from "./renderables/Box";
import Circle from "./renderables/Circle";
import RowLayout from "./renderables/RowLayout";
import Fill from "./renderables/Fill";
import Line from "./renderables/Line";
import {PathAnimation} from "./animators/PathAnimation";

const canvas = <HTMLCanvasElement>document.getElementById('simulation');
const renderer = new Renderer(canvas.getContext('2d'));


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
const row = new RowLayout(92);
row.addObject(new Fill('red', new Circle(30)));
row.addObject(new Fill('red', new Circle(30)));
row.addObject(new Fill('red', new Circle(30)));
row.addObject(new Fill('red', new Circle(30)));

renderer.addObject(new Transform(
  new Vector2D(62, 110),
  row
));

// Channels
const row2 = new RowLayout(92);
row2.addObject(new Fill('red', new Circle(30)));
row2.addObject(new Fill('red', new Circle(30)));
row2.addObject(new Fill('red', new Circle(30)));

renderer.addObject(
  new Transform(
    new Vector2D(107, 240),
    row2
  )
);

// Connections
renderer.addObject(
  new Line(
    new Vector2D(62, 140),
    new Vector2D(107, 210),
  )
);

renderer.addObject(
  new Line(
    new Vector2D(154, 140),
    new Vector2D(199, 210),
  )
);

renderer.addObject(
  new Line(
    new Vector2D(246, 140),
    new Vector2D(199, 210),
  )
);

renderer.addObject(
  new Line(
    new Vector2D(338, 140),
    new Vector2D(291, 210),
  )
);


// Packet animation
renderer.addObject(
  new Transform(
    new Vector2D(62, 140),
    new PathAnimation(
      new Box(50, 50, "Packet"),
      [
        new Vector2D(45, 70),
        new Vector2D(45, 100)
      ],
      2000
    ),
  )
);


function frame() {
  renderer.render();
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);

