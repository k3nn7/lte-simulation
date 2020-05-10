import {IPPacket} from 'Common/IP';
import {getRandomInt} from 'Common/random';

export class IPPacketGenerator {
  constructor() {
    this.currentId = 0;
  }

  generate() {
    const id = this.currentId++;
    const size = getRandomInt(20, 70);
    const data = 'x'.repeat(size);

    return new IPPacket(data, id);
  }
}
