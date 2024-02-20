import { Vugluscr } from 'vugluscr';
console.log("test rig");
//let minimapElement = document.getElementById("vugluscr");
let scrollable = document.getElementById("blade");
let vugluscr = new Vugluscr();


let dothethingButton = document.getElementById("dothething");
dothethingButton.addEventListener("click", () => {
	console.log("dothething clicked");
	vugluscr.crearMarkers();
	let list = Array.from(document.getElementsByTagName("i"));

	for (let i = 0; i < list.length; i++) {
		const element = list[i];
		vugluscr.addMarker({ element: element, color: "red", id: "italic" });
	}
	vugluscr.addMarker({ topOffset: 3500, color: "blue", id: "just" })
	vugluscr.addMarker({ topOffset: 3999, color: "black", id: "just" })
});