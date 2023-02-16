// value转string
export function valueToString(value: StringNumber): string {
  if(typeof(value) === "number") {
    return value.toString();
  } else {
    return value;
  }
}
// 对象转样式文本
export function getStyleText(selector: string, styleObject: AnyObject<StringNumber>) {
  const styleTextContent = Object.entries(styleObject).map(entry => {
    let property: string = entry[0];
    const value: string = property === "zIndex" ? entry[1] as string : getUnitStyleValue(entry[1]);
    property = property.replace(/[A-Z]/g, letter => {
      return `-${ letter.toLowerCase() }`;
    });
    return `${ property }: ${ value }`
  }).join(";");
  return `${selector} {${ styleTextContent }}`
}
// 获取带单位的样式值
export function getUnitStyleValue(value: StringNumber): string {
  let unitValue: string = valueToString(value);
  if(/^\d+$/.test(unitValue)) {
    return `${ unitValue }px`;
  } else {
    return unitValue;
  }
}

// 创建元素
export function createElement(type: string, options?: AnyObject,): any {
  const element = document.createElement(type);
  for (const attributeName in options) {
    if(attributeName === "childrens") {
      const elements: Array<HTMLElement> = options[attributeName];
      for (const childrenElement of elements) {
        element.appendChild(childrenElement);
      }
    } else {
      (element as AnyObject)[attributeName] = options[attributeName];
    }
  }
  return element;
}

// 双击事件
export function createDoubleClickCallback(callback: () => void, delay: number = 300) {
  let count = 0;
  let timerID: any = -1;
  return function() {
    if(count > 0) {
      clearTimeout(timerID);
      count = 0;
      callback();
    } else {
      count++;
      timerID = setTimeout(() => count = 0, 300);
    }
  }
}

// 进入全屏
export function requestFullScreen(element: any): void {
  if (element.requestFullscreen) {
   element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
   element.mozRequestFullScreen();
  } else if (element.msRequestFullscreen) {
   element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
   element.webkitRequestFullScreen();
  } else if (element.webkitEnterFullscreen) {
    element.webkitEnterFullscreen();
  }
 }

 // 退出全屏
 export function exitFull(): void {
  if (document.exitFullscreen) {
   document.exitFullscreen();
  } else if ((document as any).msExitFullscreen) {
   (document as any).msExitFullscreen();
  } else if ((document as any).mozCancelFullScreen) {
    (document as any).mozCancelFullScreen();
  } else if ((document as any).webkitExitFullscreen) {
    (document as any).webkitExitFullscreen();
  } else if((document as any).webkitExitFullscreen) {
    (document as any).webkitExitFullscreen();
  }
 }

//判断是否全屏
export function IsFull(): boolean {
  const fullscreenElement = document.fullscreenElement || (document as any).mozFullscreenElement || (document as any).webkitFullscreenElement;
  const fullscreenEnabled = document.fullscreenEnabled || (document as any).mozFullscreenEnabled || (document as any).webkitFullscreenEnabled;
  return fullscreenElement || fullscreenEnabled;
}

// 定义不可变属性
export function defineFinalProperty(obj: any, key: string, value: any): void {
  Object.defineProperty(obj, key, {
    value,
    writable: false,
    enumerable: false,
    configurable: false
  });
}
