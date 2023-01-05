import { getStyleText, getUnitStyleValue } from "@/utils/common";

const enum EVENT_TYPE {
  REACH_TOP = "reachtop",
  REACH_BOTTOM = "reachbottom"
}

class ScrollViewEvent extends Event {
  [propName: string]: any
  constructor(type: string, eventInitDict?: EventInit) {
    super(type, eventInitDict);
  }
}

export default class ScrollView extends HTMLElement{
  public static readonly _name: string = "scroll-view";
  private duration: number = 500;
  private safeSpace: number = 5;
  private isTriggerTopEvent: boolean = true;
  private isTriggerBottomEvent: boolean = true;
  private htmlElement: HTMLElement;
  private styleElement: HTMLElement;
  private beforeScrollTop: number = 0;
  constructor() {
    super();
    this.htmlElement = this.createHTMLElement();
    this.styleElement = this.createStyleElement();
    this.render();
  }

  private static get observedAttributes(): Array<string> {
    return [ "height", "duration", "safe-space" ];
  }

  private attributeChangedCallback(propName: string, oldValue: string, newValue: string): void {
    switch(propName) {
      case "height":
        this.htmlElement.style.height = getUnitStyleValue(newValue);
        break;
      case "duration":
        if(/^\d+$/.test(newValue)) {
          this.duration = parseInt(newValue);
        }
        break;
      case "safe-space":
        if(/^\d+$/.test(newValue)) {
          this.safeSpace = parseInt(newValue);
        }
        break;
    }
  }

  private connectedCallback() {
    this.htmlElement.addEventListener("scroll", this.onScrollCallback);
  }

  private disconnectedCallback() {
    this.htmlElement.removeEventListener("scroll", this.onScrollCallback);
  }

  private onScrollCallback = () => {
    const { scrollTop } = this.htmlElement;
    if(scrollTop - this.beforeScrollTop > 0) {
      const { scrollHeight, clientHeight } = this.htmlElement;
      const maxTop = scrollHeight - clientHeight;
      if((maxTop - scrollTop) <= this.safeSpace && this.isTriggerBottomEvent) {
        // 到达底部
        this.isTriggerBottomEvent = false;
        try {
          this.triggerEvent(EVENT_TYPE.REACH_BOTTOM, {});
        } finally {
          setTimeout(() => this.isTriggerBottomEvent = true, this.duration);
        }
      }
    } else {
      if(scrollTop <= this.safeSpace && this.isTriggerTopEvent) {
        // 到达顶部
        this.isTriggerTopEvent = false;
        try {
          this.triggerEvent(EVENT_TYPE.REACH_TOP, {});
        } finally {
          setTimeout(() => this.isTriggerTopEvent = true, this.duration);
        }
      }
    }
    this.beforeScrollTop = scrollTop;
  }

  private triggerEvent(eventType: EVENT_TYPE, eventData: AnyObject): void {
    const event = new ScrollViewEvent(eventType, {
      bubbles: false,
      cancelable: false,
      composed: false
    });
    event.eventData = eventData;
    this.dispatchEvent(event);
  }

  private createHTMLElement(): HTMLElement {
    if(this.htmlElement) {
      return this.htmlElement;
    } else {
      const ScrollViewElement: HTMLElement = document.createElement("div");
      ScrollViewElement.className = "scroll-view";
      ScrollViewElement.innerHTML = "<slot></slot>";
      this.htmlElement = ScrollViewElement;
      return ScrollViewElement;
    }
  }

  private createStyleElement(): HTMLElement {
    if(this.styleElement) {
      return this.styleElement;
    } else {
      const styleElement = document.createElement("style");
      this.styleElement = styleElement;
      styleElement.textContent = getStyleText(".scroll-view", {
        overflow: "auto",
        width: "100%",
        height: "100%"
      });
      return styleElement;
    }
  }

  // 渲染函数
  private render(): void {
    const shadowElement: ShadowRoot = this.attachShadow({mode: "closed"});
    shadowElement.appendChild(this.styleElement);
    shadowElement.appendChild(this.htmlElement);
  }
}
