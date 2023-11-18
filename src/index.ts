import { savePoint, getPoints, map, markers, toLngLat, showSinglePoint } from './utils/map';
import { marker } from 'leaflet';

const form = document.querySelectorAll('input');

function getFormValues() {
    const obj: { [key: string]: string } = {};

    form.forEach((element) => {
        obj[element.id] = element.value;
    })

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

