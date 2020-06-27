import {getRandomInt} from 'Common/random';
import {IPPacket} from 'Common/IP/IPPacket';

export class IPPacketGenerator {
  currentID: number;

  constructor() {
    this.currentID = 0;
  }

  generate(): IPPacket {
    const id = this.currentID++;
    const size = getRandomInt(20, 70);
    const data = 'x'.repeat(size);

    return new IPPacket(data, id);
  }
}
