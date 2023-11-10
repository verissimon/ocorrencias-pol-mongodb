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

btnRegister?.addEventListener('click', (event) => {
    const ocorrencia = getFormValues();

    savePoint(ocorrencia, toLngLat(markers[markers.length - 1].getLatLng()));
})

function showPoints() {
    getPoints().then(pnts => {
        for (const p of pnts) {
            showSinglePoint(p)
        }
    }).catch(err => {
        console.error(err);
    });
}
showPoints();

