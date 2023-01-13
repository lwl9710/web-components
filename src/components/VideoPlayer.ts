import BaseComponent from "@/base/BaseComponent";
import { getStyleText, createElement, createDoubleClickCallback, requestFullScreen } from "@/utils/common";

const ICON = {
  PLAY: require("@/assets/images/icon_play.png"),
  PAUSE: require("@/assets/images/icon_pause.png"),
  FULL: require("@/assets/images/icon_full.png")
}

export default class VideoPlayer extends BaseComponent<HTMLElement> {
  public static readonly _name = "video-player";
  private currentTimeRatio: number = -1;
  private videoElement: HTMLVideoElement = createElement("video", { className: "video-main" });
  private activedElement: HTMLElement = createElement("div", { className: "actived" });
  private loadedElement: HTMLElement = createElement("div", { className: "loaded" });
  private progressElement: HTMLElement = createElement("div", { className: "progress", childrens: [ this.activedElement, this.loadedElement ] });
  private btnStatus: HTMLElement = createElement("div", {
    className: "status",
    childrens: [
      createElement("img", { src: ICON.PLAY })
    ]
  });
  private btnFull: HTMLElement = createElement("div", {
    className: "fullscreen",
    childrens: [
      createElement("img", { src: ICON.FULL })
    ]
  })
  private controls: HTMLElement = createElement("div", {
    className: "controls",
    childrens: [
      this.progressElement,
      createElement("div", {
        className: "btns",
        childrens: [
          createElement("div", { className: "left", childrens: [ this.btnStatus ] }),
          createElement("div", { className: "right", childrens: [ this.btnFull ] })
        ]
      })
    ]
  })
  

  public get duration() {
    return this.videoElement.duration;
  }

  public get currentTime() {
    return this.videoElement.currentTime;
  }

  public get paused() {
    return this.videoElement.paused;
  }


  private onPlay = () => {
    (this.btnStatus.firstChild as HTMLImageElement).src = ICON.PAUSE;
  }

  private onPause = () => {
    (this.btnStatus.firstChild as HTMLImageElement).src = ICON.PLAY;
  }

  private onLoadedmetadata = (event: any) => {
    // console.log(this.duration, this.paused);
  }

  private onTimeupdate = () => {
    this.activedElement.style.width = `${ this.currentTime / this.duration * 100 }%`
  }

  private onProgress = () => {
    const buffered = this.videoElement.buffered;
    if(buffered.length > 0) {
      this.loadedElement.style.width = `${ buffered.end(0) / this.duration * 100 }%`;
    }
  }


  private connectedCallback() {
    this.htmlElement.appendChild(this.videoElement);
    this.htmlElement.appendChild(this.controls);
    this.videoElement.addEventListener("play", this.onPlay);
    this.videoElement.addEventListener("pause", this.onPause);
    this.videoElement.addEventListener("stop", this.onPause);
    this.videoElement.addEventListener("loadedmetadata", this.onLoadedmetadata);
    this.videoElement.addEventListener("timeupdate", this.onTimeupdate);
    this.videoElement.addEventListener("progress", this.onProgress);
    const changePlayStatus = () => {
      if(this.paused) {
        if(this.currentTimeRatio !== -1) {
          this.videoElement.currentTime = this.currentTimeRatio * this.duration;
          this.currentTimeRatio = -1;
        }
        this.videoElement.play();
      } else {
        console.log(this.videoElement.currentTime);
        this.videoElement.pause();
      }
    }

    this.btnStatus.addEventListener("click", changePlayStatus);
    this.htmlElement.addEventListener("click", createDoubleClickCallback(changePlayStatus));
    this.controls.addEventListener("click", event => {
      event.stopPropagation();
      return false;
    });
    this.btnFull.addEventListener("click", () => {
      requestFullScreen(this.videoElement);
    })
    this.progressElement.addEventListener("click", (event) => {
      const currentTimeRatio = event.offsetX / this.progressElement.offsetWidth;
      this.currentTimeRatio = currentTimeRatio;
      if(!this.paused) {
        this.videoElement.currentTime = currentTimeRatio * this.duration;
      }
      this.activedElement.style.width = `${ currentTimeRatio * 100 }%`;
    });
  }


  private static get observedAttributes(): Array<string> {
    return [ "src", "autoplay", "loop", "muted", "poster", "controls", "playsinline" ];
  }

  private attributeChangedCallback(propName: string, oldValue: string, newValue: string): void {
    switch(propName) {
      case "poster":
      case "src":
        if(newValue) {
          this.videoElement.setAttribute(propName, newValue);
        } else {
          this.videoElement.removeAttribute(propName);
        }
        break;
      case "playsinline":
      case "muted":
      case "loop":
      case "autoplay":
        if(this.hasAttribute(propName) && newValue !== "false") {
          this.videoElement.setAttribute(propName, "true");
        } else {
          this.videoElement.removeAttribute(propName);
        }
      break;
    }
  }

  protected createHTMLElement(): HTMLElement {
    const videoPlayerElement = document.createElement("div");
    videoPlayerElement.className = "video-player";
    return videoPlayerElement;
  }
  protected createStyleElement(): HTMLElement {
    const styleElement = document.createElement("style");
    // 外层
    styleElement.textContent = getStyleText(".video-player", {
      position: "relative",
      width: "100%",
      height: "100%",
      backgroundColor: "#000"
    });
    styleElement.textContent += getStyleText(".video-player video", {
      width: "100%",
      height: "100%"
    });

    styleElement.textContent += getStyleText(".video-player .controls", {
      position: "absolute",
      left: 0,
      bottom: 0,
      width: "100%",
      minHeight: 30,
      backgroundColor: "rgba(0, 0, 0, .8)"
    });
    // 进度条
    styleElement.textContent += getStyleText(".progress", {
      position: "relative",
      width: "100%",
      height: "5px",
      cursor: "pointer",
      backgroundColor: "rgba(255, 255, 255, .5)"
    })
    styleElement.textContent += getStyleText(".progress .actived", {
      position: "absolute",
      left: 0,
      top: 0,
      height: "100%",
      backgroundColor: "#FFF",
      zIndex: 2,
      borderRadius: 3
    })
    styleElement.textContent += getStyleText(".progress .loaded", {
      position: "absolute",
      left: 0,
      top: 0,
      height: "100%",
      backgroundColor: "#CCC",
      zIndex: 1,
      borderRadius: 3
    })
    // 按钮
    styleElement.textContent += getStyleText(".btns, .btns .left, .btns .right", {
      display: "flex",
    })
    styleElement.textContent += getStyleText(".btns", {
      userSelect: "none",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 3
    })
    styleElement.textContent += getStyleText(".btns img", {
      verticalAlign: "top",
      width: 20,
      height: 20,
      cursor: "pointer"
    })

    return styleElement;
  }
}