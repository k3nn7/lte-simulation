import * as PIXI from 'pixi.js';
import LayerView from 'Common/LayerView';

export default class PHYView extends LayerView {
  constructor(resources: Partial<Record<string, PIXI.LoaderResource>>) {
    super(resources, 'PHY', 60);
  }
}
