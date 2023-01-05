## 浏览器原生组件
```text
这是一个专注于原生态【 Web Component 】开发的项目
```
### 目录
1. 快速开始
2. 组件

### 1.快速开始
```text
页面引入dist下的index.js
```
### 2.组件
1. scroll-view
   * 属性
   ```text
   height: number | string
     说明: 滚动视图的显示内容高度
     默认值: 100%
   duration: number
     说明: 用于控制事件的触发频率
     默认值: 500 - 500ms
   safe-space: number
     说明: 用于控制触发事件的间距
     默认值: 5 - 5px
    ```
   <span style="color: red">* 只有"实际的内容高度"超过"显示的内容高度"才会产生滚动条和触发事件</span>
   * 事件
    ```text
     reachtop：滚动到顶部
     reachbottom：滚动到底部
    ```
   * 使用
   ```html
    <scroll-view id="scroll-view" height="600" duration="1000" safe-space="10"></scroll-view>
    <script>
      let scrollView = document.querySelector("#scroll-view");
      scrollView.addEventListener("reachtop", () => {
        // 滚动到顶部...
      });
      scrollView.addEventListener("reachbottom", () => {
        // 滚动到底部...
      });
    </script> 
   ```
