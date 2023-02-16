interface PrivateMethod {
  attributeChangedCallback?: (name: string, oldValue: any, newValue: any) => void;
  connectedCallback?: () => void;
  disconnectedCallback?: () => void;
  adoptedCallback?: () => void;
}

export default class extends HTMLElement {
  protected readonly __PRIVATE_METHOD: PrivateMethod = {};

  constructor() {
    super();
    Object.defineProperty(this, "__PRIVATE_METHOD", {
      writable: false,
      enumerable: false,
      configurable: false
    });
  }

  private attributeChangedCallback(name: string, oldValue: any, newValue: any): void {
    this.__PRIVATE_METHOD.attributeChangedCallback && this.__PRIVATE_METHOD.attributeChangedCallback(name, oldValue, newValue);
  }

  private connectedCallback(): void {
    this.__PRIVATE_METHOD.connectedCallback && this.__PRIVATE_METHOD.connectedCallback();
  }

  private disconnectedCallback(): void {
    this.__PRIVATE_METHOD.disconnectedCallback && this.__PRIVATE_METHOD.disconnectedCallback();
  }

  private adoptedCallback():void {
    this.__PRIVATE_METHOD.adoptedCallback && this.__PRIVATE_METHOD.adoptedCallback();
  }
}
