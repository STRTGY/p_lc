// Test simple de MapBox GL
import mapboxgl from "npm:mapbox-gl@3";

export function testMapbox() {
  console.log("MapBox GL version:", mapboxgl.version);
  
  // Inject CSS
  if (!document.getElementById('mapbox-gl-css')) {
    const style = document.createElement("link");
    style.id = 'mapbox-gl-css';
    style.rel = "stylesheet";
    style.href = "https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css";
    document.head.appendChild(style);
  }
  
  const container = document.createElement("div");
  container.style.width = "100%";
  container.style.height = "400px";
  container.style.border = "2px solid #ccc";
  
  mapboxgl.accessToken = "pk.eyJ1Ijoic3RydGd5IiwiYSI6ImNtNTd0d3U4NzBhcGEyanM5YjVpeXYycDUifQ.8yBR0-bLr3VJl0-HQwXVHA";
  
  const map = new mapboxgl.Map({
    container,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [-99.133209, 19.432608],
    zoom: 10
  });
  
  return container;
}

