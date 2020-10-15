export default class InspectorView {
  htmlElement: HTMLElement;
  overlay: HTMLElement;

  constructor(htmlElement: HTMLElement, overlay: HTMLElement) {
    this.htmlElement = htmlElement;
    this.overlay = overlay;
  }

  show(caption: string, content: string) {
    this.htmlElement.classList.remove('d-none');
    this.htmlElement.children.item(0).textContent = caption;
    this.htmlElement.children.item(1).textContent = content;

    this.overlay.classList.remove('d-none');
  }
}
