import BaseComponent from "@/base/BaseComponent";
import {getStyleText, getUnitStyleValue} from "@/utils/common";


export class SwiperWrapper extends BaseComponent {
  public static readonly _name = "swiper-wrapper";
  private lastElement?: HTMLElement;
  private moveElement?: HTMLElement;
  private moveDistance: number = 0;
  private timerID: any = -1;
  private duration: number = 3000;
  private animationTime: number = 300;
  private current: number = 0;
  private maxCurrent: number = 0;

  private static get observedAttributes(): Array<string> {
    return [ "duration", "animation-time" ];
  }

  private attributeChangedCallback(propName: string, oldValue: string, newValue: string): void {
    switch(propName) {
      case "duration":
        if(/^\d+$/.test(newValue)) {
          this.duration = parseInt(newValue);
          this.stopMove();
          this.startMove();
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
    const moveElement: HTMLElement = this.htmlElement.querySelector(".move-element") as HTMLElement;
    const items: NodeList = this.querySelectorAll(SwiperItem._name);
    const itemWidth = this.htmlElement.clientWidth + "px";
    this.moveDistance = this.htmlElement.clientWidth;
    this.moveElement = moveElement;
    this.maxCurrent = items.length;
    items.forEach(item => {
      (item as HTMLElement).setAttribute("width", itemWidth);
    });
    if(this.maxCurrent > 0) {
      this.moveElement.style.width = `${ (this.maxCurrent + 1) * this.moveDistance }px`;
      this.lastElement = items[0].cloneNode(true) as HTMLElement;
      this.lastElement.setAttribute("width", itemWidth);
      moveElement.appendChild(this.lastElement);
    }
    this.startMove();
  }

  private disconnectedCallback() {
    clearInterval(this.timerID);
  }

  private startMove() {
    this.timerID = setInterval(() => {
      if(this.current < this.maxCurrent && this.moveElement) {
        this.current++;
        this.moveElement.style.transform = `translateX(-${ this.moveDistance * this.current }px)`;
        this.moveElement.style.transition = `transform linear ${ this.animationTime }ms`;
        if(this.current === this.maxCurrent) {
          setTimeout(() => {
            this.resetCurrent();
          }, this.animationTime + 10);
        }
      }
    }, this.duration);
  }

  private resetCurrent() {
    if(this.moveElement) {
      this.current = 0;
      this.moveElement.style.transform = `translateX(0)`;
      this.moveElement.style.transition = "none";
    }
  }

  private stopMove() {
    clearInterval(this.timerID);
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
}

export class SwiperItem extends BaseComponent {
  public static readonly _name = "swiper-item";
  constructor() {
    super("open");
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
