import * as L from 'leaflet'
import { Types } from 'mongoose';
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
    _id: string | undefined;
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
    titulo.style.fontWeight = 'bold';

    tipo.textContent = `Tipo: ${point.tipo}`;
    tipo.style.fontWeight = 'bold';

    data.textContent = `Data: ${new Date(point.data).toLocaleString()}`;
    data.style.fontWeight = 'bold';

    button.type = 'button';
    button.className = 'delete';
    button.textContent = 'Deletar Ocorrencia';

    div.appendChild(titulo);
    div.appendChild(tipo);
    div.appendChild(data);
    div.appendChild(button);

    return div
}

export async function deleteOccurrence(toDelete: {marker: L.Marker, point: Point}){
    const { marker, point } = toDelete;

    try{
    //deleta marcador do mapa
    map.removeLayer(marker)

    if (point && point._id) {
    const resp = await fetch(`http://localhost:3000/ocorrencias/${point._id}`,{
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        })
        if (!resp.ok) {
            console.error('Erro ao deletar ocorrência.');
        }
        console.log(`Ocorrência ${point._id} deletada.`);
    }

}   catch (error) {
      alert('ERROR: ' + error);
    }
}

export function showSinglePoint(point: Point) {
    let marker: L.Marker

    if (!point.geom.coordinates) {
        marker = L.marker(toLatLon(point.geom)).addTo(map);
    } 
    else {
        marker = L.marker(toLatLon(point.geom.coordinates)).addTo(map)
    }
    const popupContent = createPopupContent(point)
    marker.bindPopup(popupContent)
    marker.on('click', () => {
        marker.openPopup()

        toDelete = { marker, point };
        console.log(toDelete.point._id);

        const deleteButton = popupContent.querySelector('.delete');
        deleteButton?.addEventListener('click', () => {
            if (toDelete) { 
                // Verificação para evitar toDelete indefinido
                deleteOccurrence(toDelete);
                marker.closePopup();
            } else {
                console.error('toDelete é indefinido.');
            }
        });
        })
}

async function savePoint(infos: any, coordinates: number[]) {
    try {
        const point: Point = {
            _id: new Types.ObjectId(),
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