export default abstract class BaseComponent<E extends HTMLElement = HTMLElement> extends HTMLElement {
  protected readonly htmlElement: E;
  protected readonly styleElement: HTMLElement;
  private readonly mode: ShadowRootMode

  constructor(mode: ShadowRootMode = "closed") {
    super();
    this.htmlElement = this.createHTMLElement();
    this.styleElement = this.createStyleElement();
    this.mode = mode;
    this.render();
  }

  protected abstract createHTMLElement(): E;
  protected abstract createStyleElement(): HTMLElement;

  protected render(): void {
    const shadowElement: ShadowRoot = this.attachShadow({ mode: this.mode });
    shadowElement.appendChild(this.styleElement);
    shadowElement.appendChild(this.htmlElement);
  }
}
