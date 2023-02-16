import PrivateComponent from "@/base/PrivateComponent";
import { createElement, getStyleText,defineFinalProperty } from "@/utils/common";
const COMPONENT_NAME = "scroll-text";

export default class extends PrivateComponent {
  public static readonly _name: string = COMPONENT_NAME;

  constructor() {
    super();
    const moveElement = createElement("div", {className: "move-element"});
    // 构建元素
    function createHTMLElement():  HTMLElement{
      const element = createElement("div", {
        className: COMPONENT_NAME,
        childrens: [ moveElement ]
      });
      return element;
    }

    // 构建样式
    function createStyleElement(): HTMLElement {
      const element = document.createElement("style");
      let styleText = getStyleText(`.${COMPONENT_NAME}`, {
        overflow: "hidden",
        position: "relative",
        width: "100%"
      });
      styleText += getStyleText(`.${COMPONENT_NAME} .move-element`, {
        display: "inline-block",
        whiteSpace: "nowrap"
      });
      element.textContent = styleText;
      return element;
    }

    // 执行渲染
    const shadowElement = this.attachShadow({ mode: "closed" });
    const htmlElement = createHTMLElement();
    const styleElement = createStyleElement();
    shadowElement.appendChild(styleElement);
    shadowElement.appendChild(htmlElement);


    // 动画部分
    let result: any = (this.getAttribute("speed") || "").match(/\d+/);
    let speed: number = result ? result["0"] * 1 : 200;
    let timerID: any = -1;
    function onTransitionend() {
      startScroll();
    }
    moveElement.addEventListener("transitionend", onTransitionend);

    function startScroll() {
      clearTimeout(timerID);
      moveElement.style.transition = "none 0s ease 0s";
      moveElement.style.transform = `translateX(${htmlElement.offsetWidth + "px"})`;
      timerID = setTimeout(() => {
        moveElement.style.transition = `transform ${Math.ceil(moveElement.offsetWidth / speed)}s linear 0s`;
        moveElement.style.transform = `translateX(-${moveElement.offsetWidth + "px"})`;
      }, 300);
    }

    function resetScroll() {
      moveElement.style.transform = "translateX(0)";
      moveElement.style.transition = "none 0s ease 0s";
    }

    // 定义生命周期
    defineFinalProperty(this.__PRIVATE_METHOD, "attributeChangedCallback", function(name: string, oldValue: any, newValue: any) {
      switch (name) {
        case "text":
          moveElement.textContent = newValue;

        break;
        case "speed":
          result = newValue.match(/\d+/);
          speed = result ? result["0"] * 1 : 200;
          break;
      }
      if(moveElement.offsetWidth > htmlElement.offsetWidth) {
        startScroll();
      } else {
        resetScroll();
      }
    });
    defineFinalProperty(this.__PRIVATE_METHOD, "connectedCallback", function(): void {

    });
    defineFinalProperty(this.__PRIVATE_METHOD, "disconnectedCallback", function(): void {
      clearTimeout(timerID);
      moveElement.removeEventListener("transitionend", onTransitionend);
    });
    defineFinalProperty(this.__PRIVATE_METHOD, "adoptedCallback", function(): void {

    });
  }

  private static get observedAttributes(): Array<string> {
    return [ "text", "speed" ];
  }

}
