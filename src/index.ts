import { savePoint, getPoints, map, markers, toLngLat, showSinglePoint, showMap } from './utils/map';
import { marker } from 'leaflet';

window.addEventListener('load', () => {
    showMap();
})

const form = document.querySelectorAll('input, select');

function getFormValues() {
    const obj: { [key: string]: string } = {};

    form.forEach((element) => {
        if ('value' in element) {
            obj[element.id] = (element as HTMLInputElement).value;
        }
    });

    return obj;
}

map.on('click', (evt) => {
    if (markers.length - 1 >= 0)
        markers[markers.length - 1].remove()
    const coordinates = evt.latlng;
    console.log(evt.latlng);

    markers.push(marker(coordinates).addTo(map));
})

const btnRegister = document.querySelector('#register')

btnRegister?.addEventListener('click', async (event) => {
    const ocorrencia = getFormValues();

    try{
        const coordinates = markers[markers.length - 1].getLatLng()
        await savePoint(ocorrencia, toLngLat(coordinates));
    }
    catch(error) {
        alert('Selecione um local no mapa antes de registrar');
    }
});

function showPoints() {
    getPoints().then(async (pnts) => {
        for (const p of pnts) {
            await showSinglePoint(p)
        }
    }).catch(err => {
        console.error(err);
    });
}
showPoints();

