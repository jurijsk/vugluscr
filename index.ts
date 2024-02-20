import "./vugluscr.css";
export class Vugluscr {
	containsElement: (element: Element) => boolean = () => false;
	addMarker: (marker: {id?: string, element?: HTMLElement | null, topOffset?: number,  color: string}) => boolean;
	crearMarkers: () => void;
	removeMarkers: (id: string) => void;
	constructor(scrollable?: HTMLElement, scrollbar?: HTMLElement) {
		/** Default scrollable element is usially `document.documentElement`. Should use scrollingElement maybe, see mdn */
		let defaultScrollable = document.documentElement;
		const cssClasses = {
			thumb: 'vugluscr-thumb',
			track: 'vugluscr-track',
			marker: 'vugluscr-marker',
			thumbContainer: 'vugluscr-thumb-container'
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
		}

		function publish(this: Vugluscr) {
			this.containsElement = containsElement;
			this.addMarker = addMarker;
			this.crearMarkers = crearMarkers;
			this.removeMarkers = removeMarkers;
		}

		function containsElement(element: Element) {
			return scrollbar.contains(element);
		}

		function initScrollbar(scrollable: HTMLElement) {
			if(!scrollbar) {
				scrollbar = document.createElement('div');
				scrollable.appendChild(scrollbar);
			}
			scrollbar.classList.add('vugluscr');

			if(scrollable === defaultScrollable) {
				scrollbar.style.setProperty('position', 'fixed');
			}

			getTrack();
			return scrollbar;
		}

		let track: HTMLElement;
		function getTrack() {
			if(track == null) {
				track = document.createElement('div');
				track.classList.add(cssClasses.track);
				scrollbar.appendChild(track);
			}
			return track;
		}

		let thumb: HTMLElement;

		function getScrollbarThumb() {
			if(!thumb) {
				let thumbContainer = document.createElement('div');
				thumbContainer.classList.add(cssClasses.thumbContainer);


				thumb = document.createElement('div');
				thumb.classList.add(cssClasses.thumb);
				thumbContainer.appendChild(thumb);
				scrollbar.appendChild(thumbContainer);
			}
			return thumb;
		}

		function updateThumb(){
			let clientHeight = scrollable.clientHeight;
			let scrollHeight = scrollable.scrollHeight;
			let scrollTop = scrollable.scrollTop;
			let thumb = getScrollbarThumb();
			
			thumb.style.setProperty('height', clientHeight / scrollHeight * 100 + '%');

			let pos = scrollTop / scrollHeight;
			thumb.style.setProperty('top', (pos * 100) + '%');
		}


		const markerIdAttr = 'data-marker-id';
		function addMarker(marker: {id?: string, element?: HTMLElement | null, topOffset?: number,  color: string}) {
			let topOffset = marker.topOffset;
			if(topOffset == null) { // if null or undefined
				let element = marker.element;
				if(element == null) {
					return false; // we can't add marker without offset or element
				}

				topOffset = element.offsetTop;
				let offsetParent: HTMLElement = element.offsetParent as HTMLElement;

				while(offsetParent && offsetParent != scrollable) {
					topOffset += offsetParent.offsetTop;
					offsetParent = offsetParent.offsetParent as HTMLElement;
				}
			}

			let pos = topOffset / state.scrollableHeight;

			let track = getTrack();

			let markerElement = getMarket();
			markerElement.style.setProperty('background-color', marker.color);
			markerElement.style.setProperty('top', `calc(${pos * 100}% - var(--vugluscr-marker-size))`);
			marker.id && markerElement.setAttribute(markerIdAttr, marker.id);

			track.append(markerElement);
		}

		function crearMarkers(){
			let track = getTrack();
			track.innerHTML = '';
		}


		function removeMarkers(id: string) {
			let track = getTrack();
			let elements = Array.from(track.querySelectorAll(`[${markerIdAttr}=${id}]`));

			for(const elem of elements) {
				track.removeChild(elem);
			}
		}

		function getMarket() {
			let element = document.createElement('div');
			element.className = cssClasses.marker;
			return element;
		}

		function onScreenChanged() {
			let scrollHeight = scrollable.scrollHeight;
			let height = scrollable.clientHeight;
			let fullscreen = document.fullscreenElement != null;

			if(scrollHeight == state.scrollableHeight 
				&& height == state.scrollbarHeight
				&& fullscreen == state.fullscreen) {
					return;
			}
			state.fullscreen = fullscreen;
			state.scrollableHeight = scrollHeight;
			state.scrollbarHeight = height;


			if(state.fullscreen || state.scrollableHeight == state.scrollbarHeight) {
				if(scrollbar.style.getPropertyValue('display') != 'none') {
					scrollbar.style.setProperty('display', 'none');
					//console.log("hide vugluscr");
				}
			} else {
				if(scrollbar.style.getPropertyValue('display')) {
					scrollbar.style.removeProperty('display');
					//console.log("show vugluscr");
				}
			}
		}

		function onScroll() {
			window.requestAnimationFrame(updateThumb);
		}

		function onPointerMove(event: PointerEvent) {
			const scrollbarHeight = state.scrollbarHeight;
			const scrollbarPosition = event.clientY;
			const percentagePosition = (scrollbarPosition - state.thumbOffet) / scrollbarHeight;
			scrollable.scrollTo({top: percentagePosition * state.scrollableHeight, behavior: 'instant'});
		}
		function onThumbPointerDown(event: PointerEvent) {
			state.thumbOffet = event.offsetY;
			state.thumbInteraction = true;
			document.addEventListener("pointermove", onPointerMove);
			document.addEventListener("pointerup", onThumbPointerUp)
		}

		function onThumbPointerUp() {
			state.thumbInteraction = false;
			document.removeEventListener("pointermove", onPointerMove);
			document.removeEventListener("pointerup", onThumbPointerUp)
		}

		function onTrackPointerUp(event: PointerEvent) {
			if(state.thumbInteraction){
				return;
			}
			let scrollbarHeight = state.scrollbarHeight;
			let scrollbarPosition = event.clientY;
			let percentagePosition = scrollbarPosition / scrollbarHeight;

			let scrollToPosition = state.scrollableHeight * percentagePosition;
			scrollToPosition -= scrollbarHeight / 2;

			//console.log(scrollbarPosition, scrollableHeight, scrollbarHeight, screensNo, scrollbarPosition / scrollbarHeight, percentagePosition)
			scrollable.scrollTo({top: scrollToPosition, behavior: 'auto'});
		}

		function init() {
			if(scrollable == null) {
				scrollable = defaultScrollable;
				//looks like `document.documentElement` does not receive scroll event. 
				//`document` does
				document.addEventListener('scroll', onScroll);
			}else{
				scrollable.addEventListener('scroll', onScroll);
			}
			initScrollbar(scrollable);
			defaultScrollable = null; //just freeing space

			updateThumb();
			
			scrollbar.addEventListener("pointerup", onTrackPointerUp);

			thumb.addEventListener("pointerdown", onThumbPointerDown);
			document.addEventListener('fullscreenchange', onScreenChanged);
			window.addEventListener('resize', onScreenChanged);
			onScreenChanged();

			//let resizeObserver = new ResizeObserver(onScreenChanged);
			//resizeObserver.observe(scrollable);
			//let scrSizeObserver = new ResizeObserver(onscrSizeChanged);
			//scrSizeObserver.observe(scrollable);
		}
		init();

		publish.call(this);
	}
}