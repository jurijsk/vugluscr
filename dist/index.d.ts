export declare class Vugluscr {
    containsElement: (element: Element) => boolean;
    addMarker: (marker: {
        id?: string;
        element?: HTMLElement | null;
        topOffset?: number;
        color: string;
    }) => boolean;
    crearMarkers: () => void;
    removeMarkers: (id: string) => void;
    constructor(scrollable?: HTMLElement, scrollbar?: HTMLElement);
}
