import * as L from 'leaflet'

export const map = L.map('map').setView([-6.89, -38.56], 15);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map)

export let markers = [] as L.Marker[]

export function toLngLat(coordinates: L.LatLng) {
    return [coordinates.lng, coordinates.lat];
}

export function toLatLon(coordinates: number[]) {
    return { lat: coordinates[1], lng: coordinates[0] };
}


interface Point {
    titulo: string;
    tipo: string;
    data: Date;
    geom: any;
}

function showInfos(point: Point) {

    const titulo = document.createElement('p') as Element;
    const tipo = document.createElement('p') as Element;
    const data = document.createElement('p') as Element;

    titulo.textContent = `Título: ${point.titulo}`;
    tipo.textContent = `Tipo: ${point.tipo}`;
    data.textContent = `Data: ${new Date(point.data).toLocaleString()}`;
    return { titulo, tipo, data }
}

export function showSinglePoint(point: Point) {
    let m: L.Marker
    if (!point.geom.coordinates) {
        m = L.marker(toLatLon(point.geom)).addTo(map);
    } else { 
        m = L.marker(toLatLon(point.geom.coordinates)).addTo(map)
    }
    const infos = showInfos(point)
    m.bindPopup(`
  ${infos.titulo.textContent}<br>
  ${infos.tipo.textContent}<br>
  ${infos.data.textContent}<br>
  <button class="delete" type="button">Deletar Ocorrencia</button>`)
    m.on('click', () => {
        m.openPopup()
    })
}
async function savePoint(infos: any, coordinates: number[]) {
    try {
        const point: Point = {
            ...infos,
            geom: coordinates
        }

        console.log(point);

        const resp = await fetch(`http://localhost:3000/ocorrencias`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(point)
        });

        if (!resp.ok) {
            throw new Error('ERROR IN REQUEST');
        }
        alert('SUCESS');
        markers[markers.length - 1].remove()
        showSinglePoint(point)

    } catch (error) {
        alert('ERROR: ' + error);
    }
}

async function getPoints(): Promise<Point[]> {
    try {
        const resp = await fetch(`http://localhost:3000/ocorrencias`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
        });

        if (!resp.ok) {
            throw new Error('ERROR IN REQUEST');
        }

        const locals = await resp.json();

        return locals as Point[];
    } catch (error) {
        alert('ERROR: ' + error);
        throw error;
    }
}

export { savePoint, getPoints, Point };