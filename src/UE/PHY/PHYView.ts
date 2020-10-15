import * as PIXI from 'pixi.js';
import LayerView from 'Common/LayerView';
import InspectorView from "../../Common/InspectorView";

export default class PHYView extends LayerView {
  inspectorView: InspectorView;

  constructor(
    resources: Partial<Record<string, PIXI.LoaderResource>>,
    inspectorView: InspectorView,
  ) {
    super(resources, 'PHY', 60);
    this.inspectorView = inspectorView;

    this.header.on('click', () => {
      this.inspectorView.show('PHY', 'MAC Layer is responsible for:');
    });
  }
}
