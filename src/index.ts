import ScrollView from "@/components/ScrollView";
import { SwiperWrapper, SwiperItem } from "@/components/Swiper";
import VideoPlayer from "@/components/VideoPlayer";
import ScrollText from "@/components/ScrollText";

// import("vconsole").then(({ default: VConsole }) => {
//   new VConsole();
// })

window.customElements.define(ScrollView._name, ScrollView);
window.customElements.define(SwiperItem._name, SwiperItem);
window.customElements.define(SwiperWrapper._name, SwiperWrapper);
window.customElements.define(VideoPlayer._name, VideoPlayer);
window.customElements.define(ScrollText._name, ScrollText);
