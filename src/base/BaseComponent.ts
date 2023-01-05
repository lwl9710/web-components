export default abstract class BaseComponent extends HTMLElement {
  protected readonly htmlElement: HTMLElement;
  protected readonly styleElement: HTMLElement;

  constructor() {
    super();
    this.htmlElement = this.createHTMLElement();
    this.styleElement = this.createStyleElement();
    this.render();
  }

  protected abstract createHTMLElement(): HTMLElement;
  protected abstract createStyleElement(): HTMLElement;

  protected render(): void {
    const shadowElement: ShadowRoot = this.attachShadow({mode: "closed"});
    shadowElement.appendChild(this.styleElement);
    shadowElement.appendChild(this.htmlElement);
  }
}
