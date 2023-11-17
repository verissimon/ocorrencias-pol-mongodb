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
    const buttonUpdate = document.createElement('button')
    const updateAlert = document.createElement('p');

    titulo.textContent = `Título: ${point.titulo}`;
    titulo.style.fontWeight = 'bold';
    titulo.style.fontSize = "12px";

    tipo.textContent = `Tipo: ${point.tipo}`;
    tipo.style.fontWeight = 'bold';
    tipo.style.fontSize = "12px";


    data.textContent = `Data: ${new Date(point.data).toLocaleString()}`;
    data.style.fontWeight = 'bold';
    data.style.fontSize = "12px";


    updateAlert.textContent = '* Para atualizar uma ocorrência, insira os novos valores no formulário e clique no botão "Atualizar ocorrência" em seguida.'

    button.type = 'button';
    button.className = 'delete';
    button.textContent = 'Deletar ocorrencia';

    buttonUpdate.type = 'button';
    buttonUpdate.className = 'update';
    buttonUpdate.textContent = 'Atualizar ocorrencia';

    div.appendChild(titulo);
    div.appendChild(tipo);
    div.appendChild(data);
    div.appendChild(button);
    div.appendChild(buttonUpdate);
    div.appendChild(updateAlert);


    button?.addEventListener('click', () => {
        if (toDelete) { 
            // Verificação para evitar toDelete indefinido
            deleteOccurrence(toDelete);
            
        } else {
            console.error('toDelete é indefinido.');
        }
    });

    buttonUpdate?.addEventListener('click', () =>{
        
        // Verificação para evitar toDelete indefinido
        if (toDelete) { 
            const marker = toDelete.marker;
            marker.closePopup();
            marker.unbindPopup();

            UpdateOccurrence(toDelete);

            const newPopupContent = createPopupContent(point);
            marker.bindPopup(newPopupContent);
            marker.openPopup();
        } else {
            console.error('toDelete é indefinido.');
        }
    })

    return div
}

export async function deleteOccurrence(toDelete: {marker: L.Marker, point: Point}){
    const { marker, point } = toDelete;

    try{
    
    if (point && point._id) {
    const resp = await fetch(`http://localhost:3000/ocorrencias/${point._id}`,{
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        })
        if (!resp.ok) {
           throw new Error('ao deletar ocorrência.');
        }
        marker.closePopup();

        //deleta marcador do mapa
        map.removeLayer(marker)
        console.log(`Ocorrência ${point._id} deletada.`);
        alert(`Ocorrência deletada com sucesso`)
    }

}   catch (error) {
      alert('ERROR: ' + error);
    }

}

export async function UpdateOccurrence(toUpdate: {marker: L.Marker, point: Point}){
    const { marker, point } = toUpdate;

    try{
    
    if (point && point._id) {

        const titulo = (document.getElementById('titulo') as HTMLInputElement)?.value;
        const tipo = (document.getElementById('tipo') as HTMLInputElement)?.value;
        const data = (document.getElementById('data') as HTMLInputElement)?.value;

        if (titulo) point.titulo = titulo;
        if (tipo) point.tipo = tipo;
        if (data) point.data = new Date(data);

    const resp = await fetch(`http://localhost:3000/ocorrencias/${point._id}`,{
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(point) 
        })
        if (!resp.ok) {
           throw new Error('ao atualizar ocorrência');
        }

        console.log(`Ocorrência ${point._id} atualizada.`);
        alert(`Ocorrência atualizada com sucesso`);
    }

}   catch (error) {
      alert('ERROR: ' + error);
    }
    marker.closePopup();
}

export async function showSinglePoint(point: Point) {
    let marker: L.Marker

    if (!point.geom.coordinates) {
        marker = L.marker(toLatLon(point.geom)).addTo(map);
    } 
    else {
        marker = L.marker(toLatLon(point.geom.coordinates)).addTo(map)
    }
    const popupContent = createPopupContent(point)
    marker.bindPopup(popupContent)
    marker.on('click', async () => {
        marker.openPopup()

        toDelete = { marker, point };
        console.log(toDelete.point._id);
        
        const form = document.querySelectorAll("input");
    
        //mostra os valores do marcador no input
        form[0].value = point.titulo;
        form[1].value = point.tipo;
        form[2].value = new Date(point.data).toISOString().slice(0, 16);
        })
}

async function savePoint(infos: any, coordinates: number[]) {
    try {
        const point: Point = {
            _id: new Types.ObjectId().toString(),
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