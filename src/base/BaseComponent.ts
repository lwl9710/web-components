export default abstract class BaseComponent extends HTMLElement {
  protected readonly htmlElement: HTMLElement;
  protected readonly styleElement: HTMLElement;
  private readonly mode: ShadowRootMode

  constructor(mode: ShadowRootMode = "closed") {
    super();
    this.htmlElement = this.createHTMLElement();
    this.styleElement = this.createStyleElement();
    this.mode = mode;
    this.render();
  }

  protected abstract createHTMLElement(): HTMLElement;
  protected abstract createStyleElement(): HTMLElement;

  protected render(): void {
    const shadowElement: ShadowRoot = this.attachShadow({ mode: this.mode });
    shadowElement.appendChild(this.styleElement);
    shadowElement.appendChild(this.htmlElement);
  }
}
