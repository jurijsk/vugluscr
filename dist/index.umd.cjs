(function() {
  "use strict";
  try {
    if (typeof document != "undefined") {
      var elementStyle = document.createElement("style");
      elementStyle.appendChild(document.createTextNode(".vugluscr {\n	--vugluscr-width: 12px;\n	--vugluscr-marker-size: 3px;\n	padding: 0;\n	margin: 0;\n	background-color: rgba(204, 204, 204, 0.3);\n	height: 100%;\n	min-width: var(--vugluscr-width);\n	width: var(--vugluscr-width);\n	position: sticky;\n	top: 0px;\n	left: unset;\n	right: 0px;\n	z-index: 99999;\n	box-sizing: border-box;\n	overflow: hidden;\n\n	& * {\n		left: unset;\n	}\n\n	&>* {\n		position: relative;\n		width: 100%;\n		box-sizing: border-box;\n	}\n\n	& .vugluscr-track {\n		margin: 0;\n		padding: 0;\n		height: 100vh;\n		opacity: 0.5;\n		background-color: rgba(204, 204, 204, 0.2);\n\n		& :hover {\n			opacity: 1;\n			transition-duration: 0.2s;\n		}\n	}\n\n	& .vugluscr-thumb-container {\n		position: absolute;\n		top: 0;\n		left: 0;\n		width: 100%;\n		height: 100%;\n		overflow: hidden;\n\n		& .vugluscr-thumb {\n			background-color: rgba(0, 0, 0, 0.514);\n			opacity: 0.6;\n			position: relative;\n			min-height: 20px;\n			width: 72%;\n			margin: 0px auto;\n			border-radius: var(--vugluscr-width);\n			user-select: none;\n			cursor: default;\n\n			&:hover, &:active  {\n				opacity: 0.8;\n				transition-duration: 0.2s;\n			}\n		}\n	}\n\n	& .vugluscr-marker {\n		height: var(--vugluscr-marker-size);\n		width: 100%;\n		position: absolute;\n\n		& :hover {\n			box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.3);\n			transition-duration: 0.3s;\n		}\n	}\n}"));
      document.head.appendChild(elementStyle);
    }
  } catch (e) {
    console.error("vite-plugin-css-injected-by-js", e);
  }
})();
(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.index = {}));
})(this, function(exports2) {
  "use strict";var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

  class Vugluscr {
    constructor(scrollable, scrollbar) {
      __publicField(this, "containsElement", () => false);
      __publicField(this, "addMarker");
      __publicField(this, "crearMarkers");
      __publicField(this, "removeMarkers");
      let defaultScrollable = document.documentElement;
      const cssClasses = {
        thumb: "vugluscr-thumb",
        track: "vugluscr-track",
        marker: "vugluscr-marker",
        thumbContainer: "vugluscr-thumb-container"
      };
      const state = {
        fullscreen: false,
        /**
         *  The height of the content of the scrollable area
         */
        scrollableHeight: 0,
        /**
         * Height of the visible area of the scrollable element 
         */
        scrollbarHeight: 0,
        /**
         * Y coordinate offset between pointer location  and the padding edge of the thumb
         */
        thumbOffet: 0,
        /** indicates if the interaction was started with a pointer down on the scrollbar thumb. */
        thumbInteraction: false
      };
      function publish() {
        this.containsElement = containsElement;
        this.addMarker = addMarker;
        this.crearMarkers = crearMarkers;
        this.removeMarkers = removeMarkers;
      }
      function containsElement(element) {
        return scrollbar.contains(element);
      }
      function initScrollbar(scrollable2) {
        if (!scrollbar) {
          scrollbar = document.createElement("div");
          scrollable2.appendChild(scrollbar);
        }
        scrollbar.classList.add("vugluscr");
        if (scrollable2 === defaultScrollable) {
          scrollbar.style.setProperty("position", "fixed");
        }
        getTrack();
        return scrollbar;
      }
      let track;
      function getTrack() {
        if (track == null) {
          track = document.createElement("div");
          track.classList.add(cssClasses.track);
          scrollbar.appendChild(track);
        }
        return track;
      }
      let thumb;
      function getScrollbarThumb() {
        if (!thumb) {
          let thumbContainer = document.createElement("div");
          thumbContainer.classList.add(cssClasses.thumbContainer);
          thumb = document.createElement("div");
          thumb.classList.add(cssClasses.thumb);
          thumbContainer.appendChild(thumb);
          scrollbar.appendChild(thumbContainer);
        }
        return thumb;
      }
      function updateThumb() {
        let clientHeight = scrollable.clientHeight;
        let scrollHeight = scrollable.scrollHeight;
        let scrollTop = scrollable.scrollTop;
        let thumb2 = getScrollbarThumb();
        thumb2.style.setProperty("height", clientHeight / scrollHeight * 100 + "%");
        let pos = scrollTop / scrollHeight;
        thumb2.style.setProperty("top", pos * 100 + "%");
      }
      const markerIdAttr = "data-marker-id";
      function addMarker(marker) {
        let topOffset = marker.topOffset;
        if (topOffset == null) {
          let element = marker.element;
          if (element == null) {
            return false;
          }
          topOffset = element.offsetTop;
          let offsetParent = element.offsetParent;
          while (offsetParent && offsetParent != scrollable) {
            topOffset += offsetParent.offsetTop;
            offsetParent = offsetParent.offsetParent;
          }
        }
        let pos = topOffset / state.scrollableHeight;
        let track2 = getTrack();
        let markerElement = getMarket();
        markerElement.style.setProperty("background-color", marker.color);
        markerElement.style.setProperty("top", `calc(${pos * 100}% - var(--vugluscr-marker-size))`);
        marker.id && markerElement.setAttribute(markerIdAttr, marker.id);
        track2.append(markerElement);
      }
      function crearMarkers() {
        let track2 = getTrack();
        track2.innerHTML = "";
      }
      function removeMarkers(id) {
        let track2 = getTrack();
        let elements = Array.from(track2.querySelectorAll(`[${markerIdAttr}=${id}]`));
        for (const elem of elements) {
          track2.removeChild(elem);
        }
      }
      function getMarket() {
        let element = document.createElement("div");
        element.className = cssClasses.marker;
        return element;
      }
      function onScreenChanged() {
        let scrollHeight = scrollable.scrollHeight;
        let height = scrollable.clientHeight;
        let fullscreen = document.fullscreenElement != null;
        if (scrollHeight == state.scrollableHeight && height == state.scrollbarHeight && fullscreen == state.fullscreen) {
          return;
        }
        state.fullscreen = fullscreen;
        state.scrollableHeight = scrollHeight;
        state.scrollbarHeight = height;
        if (state.fullscreen || state.scrollableHeight == state.scrollbarHeight) {
          if (scrollbar.style.getPropertyValue("display") != "none") {
            scrollbar.style.setProperty("display", "none");
          }
        } else {
          if (scrollbar.style.getPropertyValue("display")) {
            scrollbar.style.removeProperty("display");
          }
        }
      }
      function onScroll() {
        window.requestAnimationFrame(updateThumb);
      }
      function onPointerMove(event) {
        const scrollbarHeight = state.scrollbarHeight;
        const scrollbarPosition = event.clientY;
        const percentagePosition = (scrollbarPosition - state.thumbOffet) / scrollbarHeight;
        scrollable.scrollTo({ top: percentagePosition * state.scrollableHeight, behavior: "instant" });
      }
      function onThumbPointerDown(event) {
        state.thumbOffet = event.offsetY;
        state.thumbInteraction = true;
        document.addEventListener("pointermove", onPointerMove);
        document.addEventListener("pointerup", onThumbPointerUp);
      }
      function onThumbPointerUp() {
        state.thumbInteraction = false;
        document.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerup", onThumbPointerUp);
      }
      function onTrackPointerUp(event) {
        if (state.thumbInteraction) {
          return;
        }
        let scrollbarHeight = state.scrollbarHeight;
        let scrollbarPosition = event.clientY;
        let percentagePosition = scrollbarPosition / scrollbarHeight;
        let scrollToPosition = state.scrollableHeight * percentagePosition;
        scrollToPosition -= scrollbarHeight / 2;
        scrollable.scrollTo({ top: scrollToPosition, behavior: "auto" });
      }
      function init() {
        if (scrollable == null) {
          scrollable = defaultScrollable;
          document.addEventListener("scroll", onScroll);
        } else {
          scrollable.addEventListener("scroll", onScroll);
        }
        initScrollbar(scrollable);
        defaultScrollable = null;
        updateThumb();
        scrollbar.addEventListener("pointerup", onTrackPointerUp);
        thumb.addEventListener("pointerdown", onThumbPointerDown);
        document.addEventListener("fullscreenchange", onScreenChanged);
        window.addEventListener("resize", onScreenChanged);
        onScreenChanged();
      }
      init();
      publish.call(this);
    }
  }
  exports2.Vugluscr = Vugluscr;
  Object.defineProperty(exports2, Symbol.toStringTag, { value: "Module" });
});
