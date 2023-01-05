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
    const value: string = getUnitStyleValue(entry[1]);
    let property: string = entry[0];
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
