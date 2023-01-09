import BaseComponent from "@/base/BaseComponent";
import {getStyleText, getUnitStyleValue} from "@/utils/common";
import TriggerComponent from "@/base/TriggerComponent";

function isSwiperWrapper(element: Element | null): element is SwiperWrapper {
  return element !== null && element.tagName === "SWIPER-WRAPPER";
}

class ChangeEvent extends Event {
  [propName: string]: any
  constructor(type: string, eventInitDict?: EventInit) {
    super(type, eventInitDict);
  }
}

const enum EVENT_TYPE {
  ChangeEvent = "change"
}

export class SwiperWrapper extends TriggerComponent<ChangeEvent> {
  public static readonly _name = "swiper-wrapper";
  private lastElement?: HTMLElement;
  private moveElement?: HTMLElement;
  private moveDistance: number = 0;
  private timerID: any = -1;
  private duration: number = 3000;
  private animationTime: number = 300;
  private maxCurrent: number = 0;
  private _current: number = 0;
  private items: Array<HTMLElement> = [];

  public get current(): number {
    return this._current;
  }

  public set current(newValue: number) {
    if(this.moveElement && newValue <= this.maxCurrent) {
      this._current = newValue;
      this.moveElement.style.transform = `translateX(-${ this.moveDistance * this.current }px)`;
      if(this._current < this.maxCurrent) {
        this.triggerEvent(EVENT_TYPE.ChangeEvent, { current: this._current });
      }
    }
  }

  public toCurrent(newValue: number, isAnimate: boolean = true): void {
    if(this.moveElement) {
      if(isAnimate) {
        this.moveElement.style.transition = `transform linear ${ this.animationTime }ms`;
      } else {
        this.moveElement.style.transition = "none";
      }
      this.current = newValue;
    }
  }

  private static get observedAttributes(): Array<string> {
    return [ "duration", "animation-time" ];
  }

  private attributeChangedCallback(propName: string, oldValue: string, newValue: string): void {
    console.log(`属性变更[${ propName }]======${ newValue }`);
    switch(propName) {
      case "duration":
        if(/^\d+$/.test(newValue)) {
          this.duration = parseInt(newValue);
        }
        break;
      case "animation-time":
        if(/^\d+$/.test(newValue)) {
          this.animationTime = parseInt(newValue);
        }
        break;
    }
  }

  private connectedCallback() {
    this.moveElement = this.htmlElement.querySelector(".move-element") as HTMLElement;
    this.moveElement.className = "move-element";
  }

  private disconnectedCallback() {
    clearInterval(this.timerID);
  }

  public refresh() {
    clearInterval(this.timerID);
    if(this.lastElement) {
      this.removeChild(this.lastElement);
    }
    this.toCurrent(0, false);

    this.moveDistance = this.htmlElement.clientWidth;
    this.maxCurrent = this.childElementCount;
    if(this.maxCurrent > 0) {
      const items: Array<HTMLElement> = Array.from(this.querySelectorAll(SwiperItem._name));
      this.lastElement = items[0].cloneNode(true) as HTMLElement;
      this.items = items;
      items.push(this.lastElement);
      this.appendChild(this.lastElement);
      if(this.moveElement) {
        this.moveElement.style.width = (this.moveDistance * (this.maxCurrent + 1)) + "px";
      }
      items.forEach(element => element.setAttribute("width", this.moveDistance + "px"));
      this.startMove();
    } else {
      this.items = [];
    }
  }

  private startMove(): void {
    this.timerID = setInterval(() => {
      if(this.current < this.maxCurrent) {
        this.toCurrent(this.current + 1);
      }
      if(this.current === this.maxCurrent) {
        setTimeout(() => this.toCurrent(0, false), this.animationTime + 10);
      }
    }, this.duration + this.animationTime + 15);
  }

  public onSwiperItemConnected(swiperItem: SwiperItem): void {
    // swiper-items 挂载
    if(this.lastElement !== swiperItem && !this.items.includes(swiperItem)) {
      this.refresh();
    }
  }

  public onSwiperItemDisconnected(swiperItem: SwiperItem): void {
    // swiper-items 卸载
    if(this.lastElement !== swiperItem && this.items.includes(swiperItem)) {
      this.refresh();
    }
  }

  protected createHTMLElement(): HTMLElement {
    const swiperElement: HTMLElement = document.createElement("div");
    const moveElement = this.createMoveElement();
    swiperElement.className = SwiperWrapper._name;
    swiperElement.appendChild(moveElement);
    return swiperElement;
  }

  private createMoveElement(): HTMLElement {
    const moveElement: HTMLElement = document.createElement("ul");
    moveElement.className = "move-element";
    moveElement.innerHTML = "<slot></slot>";
    return moveElement;
  }

  protected createStyleElement(): HTMLElement {
    const styleElement: HTMLElement = document.createElement("style");
    const swiperWrapperStyleText = getStyleText(`.${ SwiperWrapper._name }`, {
      overflow: "hidden",
      width: "100%",
      height: "100%",
    });
    const moveElementStyleText = getStyleText(".move-element", {
      display: "flex",
      height: "100%",
      margin: 0,
      padding: 0,
      listStyleType: "none"
    });
    styleElement.textContent = swiperWrapperStyleText + moveElementStyleText;
    return styleElement;
  }

  protected createEventInstance<D = any>(eventType: string, eventData?: D): ChangeEvent {
    const event = new ChangeEvent(eventType, {
      bubbles: false,
      cancelable: false,
      composed: false
    });
    event.eventData = eventData;
    return event;
  }
}

export class SwiperItem extends BaseComponent {
  public static readonly _name: string = "swiper-item";
  private swiperWrapper?: SwiperWrapper;
  constructor() {
    super("closed");
  }

  connectedCallback() {
    setTimeout(() => {
      if(isSwiperWrapper(this.parentElement)) {
        this.swiperWrapper = this.parentElement as SwiperWrapper;
        this.swiperWrapper.onSwiperItemConnected(this);
      }
    });
  }

  disconnectedCallback() {
    this.swiperWrapper?.onSwiperItemDisconnected(this);
  }

  private static get observedAttributes(): Array<string> {
    return [ "width" ];
  }

  private attributeChangedCallback(propName: string, oldValue: string, newValue: string): void {
    switch(propName) {
      case "width":
        this.htmlElement.style.width = getUnitStyleValue(newValue);
        break;
    }
  }

  protected createHTMLElement(): HTMLElement {
    const swiperItemElement: HTMLElement = document.createElement("li");
    swiperItemElement.className = SwiperWrapper._name;
    swiperItemElement.innerHTML = "<slot></slot>";
    return swiperItemElement;
  }

  protected createStyleElement(): HTMLElement {
    const styleElement: HTMLElement = document.createElement("style");
    styleElement.textContent = getStyleText(`.${ SwiperWrapper._name }`, {
      height: "100%",
    });
    return styleElement;
  }
}
