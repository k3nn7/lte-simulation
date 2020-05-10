import {getRandomInt} from "../random";
import {IPPacket} from "./IPPacket";

export class IPPacketGenerator {
  currentID: number;

  constructor() {
    this.currentID = 0;
  }

  generate() {
    const id = this.currentID++;
    const size = getRandomInt(20, 70);
    const data = 'x'.repeat(size);

    return new IPPacket(data, id);
  }
}
