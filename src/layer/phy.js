import Layer from "./layer";
import * as PIXI from 'pixi.js';
import {BG_DARK_2, FG_1, FG_2} from "../colors";
import Action from "./action";
import Packet from "./packet";

export default class PHY extends Layer {
  constructor(resources) {
    super(resources, 'PHY');
  }
}
