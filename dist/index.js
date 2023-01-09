(()=>{"use strict";class e extends HTMLElement{htmlElement;styleElement;mode;constructor(e="closed"){super(),this.htmlElement=this.createHTMLElement(),this.styleElement=this.createStyleElement(),this.mode=e,this.render()}render(){const e=this.attachShadow({mode:this.mode});e.appendChild(this.styleElement),e.appendChild(this.htmlElement)}}class t extends e{triggerEvent(e,t){const n=this.createEventInstance(e,t);null!==n&&this.dispatchEvent(n)}}function n(e,t){return`${e} {${Object.entries(t).map((e=>{const t=s(e[1]);let n=e[0];return n=n.replace(/[A-Z]/g,(e=>`-${e.toLowerCase()}`)),`${n}: ${t}`})).join(";")}}`}function s(e){let t=function(e){return"number"==typeof e?e.toString():e}(e);return/^\d+$/.test(t)?`${t}px`:t}class i extends Event{constructor(e,t){super(e,t)}}class r extends t{static _name="scroll-view";safeSpace=5;duration=500;beforeScrollTop=0;isTriggerTopEvent=!0;isTriggerBottomEvent=!0;static get observedAttributes(){return["height","duration","safe-space"]}attributeChangedCallback(e,t,n){switch(e){case"height":this.htmlElement.style.height=s(n);break;case"duration":/^\d+$/.test(n)&&(this.duration=parseInt(n));break;case"safe-space":/^\d+$/.test(n)&&(this.safeSpace=parseInt(n))}}connectedCallback(){this.htmlElement.addEventListener("scroll",this.onScrollCallback)}disconnectedCallback(){this.htmlElement.removeEventListener("scroll",this.onScrollCallback)}onScrollCallback=()=>{const{scrollTop:e}=this.htmlElement;if(e-this.beforeScrollTop>0){const{scrollHeight:t,clientHeight:n}=this.htmlElement;if(t-n-e<=this.safeSpace&&this.isTriggerBottomEvent){this.isTriggerBottomEvent=!1;try{this.triggerEvent("reachbottom")}finally{setTimeout((()=>this.isTriggerBottomEvent=!0),this.duration)}}}else if(e<=this.safeSpace&&this.isTriggerTopEvent){this.isTriggerTopEvent=!1;try{this.triggerEvent("reachtop")}finally{setTimeout((()=>this.isTriggerTopEvent=!0),this.duration)}}this.beforeScrollTop=e};createEventInstance(e){return new i(e,{bubbles:!1,composed:!1,cancelable:!1})}createHTMLElement(){if(this.htmlElement)return this.htmlElement;{const e=document.createElement("div");return e.className="scroll-view",e.innerHTML="<slot></slot>",e}}createStyleElement(){if(this.styleElement)return this.styleElement;{const e=document.createElement("style");return e.textContent=n(".scroll-view",{overflow:"auto",width:"100%",height:"100%"}),e}}}class l extends Event{constructor(e,t){super(e,t)}}class a extends t{static _name="swiper-wrapper";lastElement;moveElement;moveDistance=0;timerID=-1;duration=3e3;animationTime=300;maxCurrent=0;_current=0;items=[];get current(){return this._current}set current(e){this.moveElement&&e<=this.maxCurrent&&(this._current=e,this.moveElement.style.transform=`translateX(-${this.moveDistance*this.current}px)`,this._current<this.maxCurrent&&this.triggerEvent("change",{current:this._current}))}toCurrent(e,t=!0){this.moveElement&&(this.moveElement.style.transition=t?`transform linear ${this.animationTime}ms`:"none",this.current=e)}static get observedAttributes(){return["duration","animation-time"]}attributeChangedCallback(e,t,n){switch(console.log(`属性变更[${e}]======${n}`),e){case"duration":/^\d+$/.test(n)&&(this.duration=parseInt(n));break;case"animation-time":/^\d+$/.test(n)&&(this.animationTime=parseInt(n))}}connectedCallback(){this.moveElement=this.htmlElement.querySelector(".move-element"),this.moveElement.className="move-element"}disconnectedCallback(){clearInterval(this.timerID)}refresh(){if(clearInterval(this.timerID),this.lastElement&&this.removeChild(this.lastElement),this.toCurrent(0,!1),this.moveDistance=this.htmlElement.clientWidth,this.maxCurrent=this.childElementCount,this.maxCurrent>0){const e=Array.from(this.querySelectorAll(o._name));this.lastElement=e[0].cloneNode(!0),this.items=e,e.push(this.lastElement),this.appendChild(this.lastElement),this.moveElement&&(this.moveElement.style.width=this.moveDistance*(this.maxCurrent+1)+"px"),e.forEach((e=>e.setAttribute("width",this.moveDistance+"px"))),this.startMove()}else this.items=[]}startMove(){this.timerID=setInterval((()=>{this.current<this.maxCurrent&&this.toCurrent(this.current+1),this.current===this.maxCurrent&&setTimeout((()=>this.toCurrent(0,!1)),this.animationTime+10)}),this.duration+this.animationTime+15)}onSwiperItemConnected(e){this.lastElement===e||this.items.includes(e)||this.refresh()}onSwiperItemDisconnected(e){this.lastElement!==e&&this.items.includes(e)&&this.refresh()}createHTMLElement(){const e=document.createElement("div"),t=this.createMoveElement();return e.className=a._name,e.appendChild(t),e}createMoveElement(){const e=document.createElement("ul");return e.className="move-element",e.innerHTML="<slot></slot>",e}createStyleElement(){const e=document.createElement("style"),t=n(`.${a._name}`,{overflow:"hidden",width:"100%",height:"100%"}),s=n(".move-element",{display:"flex",height:"100%",margin:0,padding:0,listStyleType:"none"});return e.textContent=t+s,e}createEventInstance(e,t){const n=new l(e,{bubbles:!1,cancelable:!1,composed:!1});return n.eventData=t,n}}class o extends e{static _name="swiper-item";swiperWrapper;constructor(){super("closed")}connectedCallback(){setTimeout((()=>{var e;null!==(e=this.parentElement)&&"SWIPER-WRAPPER"===e.tagName&&(this.swiperWrapper=this.parentElement,this.swiperWrapper.onSwiperItemConnected(this))}))}disconnectedCallback(){this.swiperWrapper?.onSwiperItemDisconnected(this)}static get observedAttributes(){return["width"]}attributeChangedCallback(e,t,n){"width"===e&&(this.htmlElement.style.width=s(n))}createHTMLElement(){const e=document.createElement("li");return e.className=a._name,e.innerHTML="<slot></slot>",e}createStyleElement(){const e=document.createElement("style");return e.textContent=n(`.${a._name}`,{height:"100%"}),e}}window.customElements.define(r._name,r),window.customElements.define(o._name,o),window.customElements.define(a._name,a)})();