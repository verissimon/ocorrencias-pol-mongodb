import * as L from 'leaflet'
import { Types } from 'mongoose';

export const map = L.map('map').setView([-6.89, -38.56], 17);

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

export function showMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            ( position ) => {
                map.setView([position.coords.latitude, position.coords.longitude], 17);
                L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
            },
            (err) => {
                window.alert('Erro ao obter a localização do usuário: ' + err.message);
            },
            {
                enableHighAccuracy: true
            }
        )
    } else {
        map.setView([-6.89, -38.56], 17);
        window.alert('Seu navegador não suporta geolocalização!');
    }
}


interface Point {
    _id: string | undefined;
    titulo: string;
    tipo: string;
    data: Date;
    geom: any;
}

type TOcorrenciaMapa = undefined | {
    marker: L.Marker,
    point: Point
}
let selectedOcrr: TOcorrenciaMapa = undefined

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


    button?.addEventListener('click', async () => {
        if(!selectedOcrr){
            console.error('toDelete é indefinido.');
            return
        }
        const deletou = await deleteOccurrence(selectedOcrr)
        if (deletou) {
            const marker = selectedOcrr.marker;
            marker.closePopup();
            map.removeLayer(marker)
        }
    });

    buttonUpdate?.addEventListener('click', async () => {

        // Verificação para evitar toDelete indefinido
        if (!selectedOcrr) {
            console.error('toDelete é indefinido.');
            return
        }
        const atualizou = await UpdateOccurrence(selectedOcrr)
        if (atualizou) {
            const marker = selectedOcrr.marker;
            marker.closePopup();
            const newPopupContent = createPopupContent(point);
            marker.bindPopup(newPopupContent);
            marker.openPopup();
        }
    })

    return div
}

export async function deleteOccurrence(toDelete: { marker: L.Marker, point: Point }) {
    const { point } = toDelete;

    try {

        if (point && point._id) {
            const resp = await fetch(`http://localhost:3000/ocorrencias/${point._id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            })
            if (!resp.ok) {
                throw new Error('ao deletar ocorrência.');
            }

            console.log(`Ocorrência ${point._id} deletada.`);
            alert(`Ocorrência deletada com sucesso`)
            return true
        }
        return false
    } catch (error) {
        alert('ERROR: ' + error);
        return false
    }
}

export async function UpdateOccurrence(toUpdate: { marker: L.Marker, point: Point }) {
    const { point } = toUpdate;

    try {

        if (point && point._id) {

            const titulo = (document.getElementById('titulo') as HTMLInputElement)?.value;
            const tipo = (document.getElementById('tipo') as HTMLInputElement)?.value;
            const data = (document.getElementById('data') as HTMLInputElement)?.value;

            if (titulo) point.titulo = titulo;
            if (tipo) point.tipo = tipo;
            if (data) point.data = new Date(data);

            const resp = await fetch(`http://localhost:3000/ocorrencias/${point._id}`, {
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
            return true
        }
        return false
    } catch (error) {
        alert('ERROR: ' + error);
        return false
    }
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
        marker.getPopup()?.openPopup();

        selectedOcrr = { marker, point };
        console.log(selectedOcrr.point._id);
        
        const titulo = document.querySelector('#titulo') as HTMLInputElement;
        const tipo = document.querySelector("#tipo") as HTMLSelectElement
        const data = document.querySelector("#data") as HTMLInputElement
    
        //mostra os valores do marcador no input
        titulo.value = point.titulo;
        tipo.value = point.tipo;
        data.value = new Date(point.data).toISOString().slice(0, 16);
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
        await showSinglePoint(point)

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