import PrivateComponent from "@/base/PrivateComponent";
import { createElement, defineFinalProperty } from "@/utils/common";
const COMPONENT_NAME = "template";

export default class extends PrivateComponent {
  public static readonly _name: string = COMPONENT_NAME;

  constructor() {
    super();
    // 构建元素
    function createHTMLElement():  HTMLElement{
      const element = createElement("div", {
        className: COMPONENT_NAME,
        childrens: [

        ]
      });
      return element;
    }

    // 构建样式
    function createStyleElement(): HTMLElement {
      const element = document.createElement("style");
      return element;
    }

    // 执行渲染
    const shadowElement = this.attachShadow({ mode: "closed" });
    const htmlElement = createHTMLElement();
    const styleElement = createStyleElement();
    shadowElement.appendChild(styleElement);
    shadowElement.appendChild(htmlElement);

    // 定义生命周期
    defineFinalProperty(this.__PRIVATE_METHOD, "attributeChangedCallback", function(name: string, oldValue: any, newValue: any) {

    });
    defineFinalProperty(this.__PRIVATE_METHOD, "connectedCallback", function(): void {

    });
    defineFinalProperty(this.__PRIVATE_METHOD, "disconnectedCallback", function(): void {

    });
    defineFinalProperty(this.__PRIVATE_METHOD, "adoptedCallback", function(): void {

    });
  }
}
