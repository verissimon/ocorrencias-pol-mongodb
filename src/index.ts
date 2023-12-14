import {
    savePoint,
    getPoints,
    map,
    markers,
    toLngLat,
    showSinglePoint,
    getFilteredOcrrId,
    getCachedOcrr,
} from "./utils/map"
import { marker } from "leaflet"

const form = document.querySelectorAll("input, select")

function getFormValues() {
    const obj: { [key: string]: string } = {}

    form.forEach((element) => {
        if ("value" in element) {
            obj[element.id] = (element as HTMLInputElement).value
        }
    })

    return obj
}

map.on("click", (evt) => {
    if (markers.length - 1 >= 0) markers[markers.length - 1].remove()
    const coordinates = evt.latlng
    console.log(evt.latlng)

    markers.push(marker(coordinates).addTo(map))
})

const btnSearch = document.querySelector("#geosearch")
const btnRegister = document.querySelector("#register")

btnSearch?.addEventListener("click", async (event) => {
    event.preventDefault()

    const raio = document.querySelector("#kmInput") as HTMLInputElement

    try {
        if (markers.length > 0) {
            const coordinates = markers[markers.length - 1].getLatLng()
            showFilteredPoints(
                coordinates.lat,
                coordinates.lng,
                Number(raio.value)
            )
        } else {
            throw new Error(
                "Selecione um local no mapa antes de realizar a busca"
            )
        }
    } catch (error) {
        alert(error)
    }
})

btnRegister?.addEventListener("click", async (event) => {
    const ocorrencia = getFormValues()

    try {
        const coordinates = markers[markers.length - 1].getLatLng()
        await savePoint(ocorrencia, toLngLat(coordinates))
    } catch (error) {
        alert("Selecione um local no mapa antes de registrar")
    }
})

function showPoints() {
    getPoints()
        .then(async (pnts) => {
            for (const p of pnts) {
                await showSinglePoint(p)
            }
        })
        .catch((err) => {
            console.error(err)
        })
}
showPoints()

function showFilteredPoints(
    latitude: number,
    longitude: number,
    radius: number
) {
    getFilteredOcrrId(latitude, longitude, radius).then(async (ids) => {
        const divOcorrencias = document.querySelector('#listaOcorrencias');

        const listaAntiga = divOcorrencias?.querySelector('ul');
        if (listaAntiga) {
            listaAntiga.remove();
        }

        const listaNova = document.createElement('ul')

        for (const id of ids) {
        const p = await getCachedOcrr(id).catch((err) => console.log(err))
            if (p) { 
                const lista = document.createElement('ul');
                const elementoLi = document.createElement('li');

                const titulo = document.createElement('div');
                titulo.textContent = `Título: ${p.titulo}`;

                const tipo = document.createElement('div');
                tipo.textContent = `Tipo: ${p.tipo}`;

                const data = document.createElement('div');
                data.textContent = `Data: ${p.data}`;

                const espaco = document.createElement('br');


                elementoLi.appendChild(titulo);
                elementoLi.appendChild(tipo);
                elementoLi.appendChild(data);
                elementoLi.appendChild(espaco);


                lista.appendChild(elementoLi);

                listaNova.appendChild(lista);
            }
        }
        divOcorrencias?.appendChild(listaNova);
    })
}

