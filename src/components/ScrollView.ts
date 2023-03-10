import TriggerComponent from "@/base/TriggerComponent";
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

export default class ScrollView extends TriggerComponent<ScrollViewEvent> {
  public static readonly _name: string = "scroll-view";

  private safeSpace: number = 5;
  private duration: number = 500;
  private beforeScrollTop: number = 0;
  private isTriggerTopEvent: boolean = true;
  private isTriggerBottomEvent: boolean = true;

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
      const maxTop: number = scrollHeight - clientHeight;
      if((maxTop - scrollTop) <= this.safeSpace && this.isTriggerBottomEvent) {
        // 到达底部
        this.isTriggerBottomEvent = false;
        try {
          this.triggerEvent(EVENT_TYPE.REACH_BOTTOM);
        } finally {
          setTimeout(() => this.isTriggerBottomEvent = true, this.duration);
        }
      }
    } else {
      if(scrollTop <= this.safeSpace && this.isTriggerTopEvent) {
        // 到达顶部
        this.isTriggerTopEvent = false;
        try {
          this.triggerEvent(EVENT_TYPE.REACH_TOP);
        } finally {
          setTimeout(() => this.isTriggerTopEvent = true, this.duration);
        }
      }
    }
    this.beforeScrollTop = scrollTop;
  }

  protected createEventInstance(eventType: EVENT_TYPE): ScrollViewEvent {
    const event: ScrollViewEvent = new ScrollViewEvent(eventType, {
      bubbles: false,
      composed: false,
      cancelable: false
    })
    return event;
  }

  protected createHTMLElement(): HTMLElement {
    if(this.htmlElement) {
      return this.htmlElement;
    } else {
      const scrollViewElement: HTMLElement = document.createElement("div");
      scrollViewElement.className = "scroll-view";
      scrollViewElement.innerHTML = "<slot></slot>";
      return scrollViewElement;
    }
  }

  protected createStyleElement(): HTMLElement {
    if(this.styleElement) {
      return this.styleElement;
    } else {
      const styleElement: HTMLElement = document.createElement("style");
      styleElement.textContent = getStyleText(".scroll-view", {
        overflow: "auto",
        width: "100%",
        height: "100%"
      });
      return styleElement;
    }
  }
}
