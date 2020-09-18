import Connectable from './Connectable';
import {DataUnit} from "./DataUnit";

export default class StartPoint extends Connectable {
  async addDataUnit(data: DataUnit) {
    await this.channelB(data);
  }
}
