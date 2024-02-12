export class Vugluscr {
	containsElement: (element: Element) => boolean = () => false;
	addMarker: (marker: {id?: string, element?: HTMLElement | null, topOffset?: number,  color: string}) => boolean;
	crearMarkers: () => void;
	removeMarkers: (id: string) => void;
	constructor(scrollable: HTMLElement, scrollbar: HTMLElement) {
		const cssClasses = {
			thumb: 'vugluscr-thumb',
			track: 'vugluscr-track',
			marker: 'vugluscr-marker',
			thumbContainer: 'vugluscr-thumb-container'
		};

		console.log("minimap here")
		function publish(this: Vugluscr) {
			this.containsElement = containsElement;
			this.addMarker = addMarker;
			this.crearMarkers = crearMarkers;
			this.removeMarkers = removeMarkers;
		}

		function containsElement(element: Element) {
			return scrollbar.contains(element);
		}

		function initMinimap() {
			if(!scrollbar) {
				scrollbar = document.createElement('div');
				scrollable.appendChild(scrollbar);
			}
			scrollbar.classList.add('vugluscr');

			getTrack();
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

		function onPointerDown(event: PointerEvent) {
			let screenHeight = screen.height;
			let y = event.clientY;
			let pos = y / screenHeight;
			let totalHeight = screen.scrollHeight;

			let screensNo = Math.floor(totalHeight / screenHeight) + 1;

			let top = totalHeight * pos;
			top -= screenHeight / 2;

			console.log(y, totalHeight, screenHeight, screensNo, y / screenHeight, pos)
			scrollable.scrollTo({top: top, behavior: 'auto'});


			//commenting out the scrollbar thumb (the moving part) because it does not align well with
			//standard thumb 
			updateThumb();

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

			let pos = topOffset / screen.scrollHeight;

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
			screen.fullscreen = document.fullscreenElement != null;
			screen.scrollHeight = scrollable.scrollHeight;
			screen.height = scrollable.clientHeight;
			console.log(screen);
			if(screen.fullscreen || screen.scrollHeight == screen.height) {
				if(scrollbar.style.getPropertyValue('display') != 'none') {
					scrollbar.style.setProperty('display', 'none');
				}
				console.log("minimap no show");
			} else {
				if(scrollbar.style.getPropertyValue('display')) {
					scrollbar.style.removeProperty('display');
				}
				console.log("minimap show show");
			}
		}

		let screen = {
			fullscreen: false,
			/**
			 *  The account of scrolling we have (`document.documentElement.scrollHeight`). Updated or resize
			 */
			scrollHeight: 0,
			/**
			 * Height of the visible document area (`document.documentElement.clientHeight`) Updated on resize 
			 */
			height: 0
		}

		function onScroll() {
			window.requestAnimationFrame(updateThumb);
		}

		function onscrSizeChanged() {
			console.log("scr size changed")
		}

		function init() {
			if(scrollable == null) {
				scrollable = document.body;
			}
			initMinimap();
			updateThumb();

			scrollable.addEventListener('scroll', onScroll)
			scrollbar.addEventListener("pointerdown", onPointerDown);
			document.addEventListener('fullscreenchange', onScreenChanged);
			let resiseObserver = new ResizeObserver(onScreenChanged);
			resiseObserver.observe(document.body);
			window.addEventListener('resize', onScreenChanged);

			let scrSizeObserver = new ResizeObserver(onscrSizeChanged);
			scrSizeObserver.observe(scrollbar);
		}
		init();

		publish.call(this);
	}
}