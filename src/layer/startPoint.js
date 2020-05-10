import Connectable from "Common/connectable";

export default class StartPoint extends Connectable {
  constructor() {
    super();
  }

  async addDataUnit(data) {
    await this.channelB(data);
  }
}
