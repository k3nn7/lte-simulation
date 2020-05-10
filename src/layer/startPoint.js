import Connectable from "Common/Connectable";

export default class StartPoint extends Connectable {
  constructor() {
    super();
  }

  async addDataUnit(data) {
    await this.channelB(data);
  }
}
