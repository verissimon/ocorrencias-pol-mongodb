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
    _id: string | undefined
    titulo: string;
    tipo: string;
    data: Date;
    geom: any;
}

type occorenciaToDelete = undefined | {
    marker: L.Marker,
    point: Point
}
let toDelete: occorenciaToDelete = undefined

function createPopupContent(point: Point) {
    const div = document.createElement('div')
    const titulo = document.createElement('p')
    const tipo = document.createElement('p')
    const data = document.createElement('p')
    const button = document.createElement('button')

    titulo.textContent = `Título: ${point.titulo}`;
    tipo.textContent = `Tipo: ${point.tipo}`;
    data.textContent = `Data: ${new Date(point.data).toLocaleString()}`;
    button.type = 'button';
    button.className = 'delete';
    button.textContent = 'Deletar Ocorrencia';

    div.appendChild(titulo);
    div.appendChild(tipo);
    div.appendChild(data);
    div.appendChild(button)

    return div
}

export function showSinglePoint(point: Point) {
    let marker: L.Marker
    if (!point.geom.coordinates) {
        marker = L.marker(toLatLon(point.geom)).addTo(map);
    } else {
        marker = L.marker(toLatLon(point.geom.coordinates)).addTo(map)
    }
    const popupContent = createPopupContent(point)
    marker.bindPopup(popupContent)
    marker.on('click', () => {
        marker.openPopup()
        // pegando infos da ocorrencia pra deletar:
        // variavel global toDelete
        // atualiza sempre depois de abrir um popup.
        // passar essa variavel pro metodo delete
        toDelete = { marker, point }
        console.log(toDelete.point._id)
        // deletar ocorrencia deve:
        // 1. remover o marcador do mapa. toDelete.marker.remove()
        // 2. remover dados do banco. passando toDelete.point._id
    })
}
async function savePoint(infos: any, coordinates: number[]) {
    try {
        const point: Point = {
            ...infos,
            geom: coordinates
        }

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