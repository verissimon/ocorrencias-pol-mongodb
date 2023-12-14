import * as L from "leaflet"
import { Types } from "mongoose"
import { createPopupContent } from "./createPopupContent"

export const map = L.map('map').setView([-6.89, -38.56], 15)
    // .locate({setView: true, maxZoom: 15})
    // .on('locationfound', (e) => {
    //     const userLocate = L.marker(e.latlng).addTo(map);
    //     markers.push(userLocate);
    // })
    // .on('locationerror', (e) => {
    //     alert('Acesso a localização negado');
    // })

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map)

export let markers = [] as L.Marker[]

export function toLngLat(coordinates: L.LatLng) {
    return [coordinates.lng, coordinates.lat]
}

export function toLatLon(coordinates: number[]) {
    return { lat: coordinates[1], lng: coordinates[0] }
}

interface Point {
    map(arg0: (item: any) => HTMLLIElement): unknown
    _id: string | undefined
    titulo: string
    tipo: string
    data: Date
    geom: any
}

type TOcorrenciaMapa =
    | undefined
    | {
          marker: L.Marker
          point: Point
      }
export let selectedOcrr: TOcorrenciaMapa = undefined

export async function deleteOccurrence(toDelete: {
    marker: L.Marker
    point: Point
}) {
    const { point } = toDelete

    try {
        if (point && point._id) {
            const resp = await fetch(
                `http://localhost:3000/ocorrencias/${point._id}`,
                {
                    method: "DELETE",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                }
            )
            if (!resp.ok) {
                throw new Error("ao deletar ocorrência.")
            }

            console.log(`Ocorrência ${point._id} deletada.`)
            alert(`Ocorrência deletada com sucesso`)
            return true
        }
        return false
    } catch (error) {
        alert(error);
        return false
    }
}

export async function UpdateOccurrence(toUpdate: {
    marker: L.Marker
    point: Point
}) {
    const { point } = toUpdate

    try {
        if (point && point._id) {
            const titulo = (
                document.getElementById("titulo") as HTMLInputElement
            )?.value
            const tipo = (document.getElementById("tipo") as HTMLInputElement)
                ?.value
            const data = (document.getElementById("data") as HTMLInputElement)
                ?.value

            if (titulo) point.titulo = titulo
            if (tipo) point.tipo = tipo
            if (data) point.data = new Date(data)

            const resp = await fetch(
                `http://localhost:3000/ocorrencias/${point._id}`,
                {
                    method: "PUT",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(point),
                }
            )
            if (!resp.ok) {
                throw new Error("ao atualizar ocorrência")
            }
            console.log(`Ocorrência ${point._id} atualizada.`)
            alert(`Ocorrência atualizada com sucesso`)
            return true
        }
        return false
    } catch (error) {
        alert( error);
        return false
    }
}

export async function showSinglePoint(point: Point) {
    let marker: L.Marker

    if (!point.geom.coordinates) {
        marker = L.marker(toLatLon(point.geom)).addTo(map)
    } else {
        marker = L.marker(toLatLon(point.geom.coordinates)).addTo(map)
    }
    const popupContent = createPopupContent(point)
    marker.bindPopup(popupContent)

    marker.on("click", async () => {
        marker.getPopup()?.openPopup()

        selectedOcrr = { marker, point }
        console.log(selectedOcrr.point._id)

        const titulo = document.querySelector("#titulo") as HTMLInputElement
        const tipo = document.querySelector("#tipo") as HTMLSelectElement
        const data = document.querySelector("#data") as HTMLInputElement

        //mostra os valores do marcador no input
        titulo.value = point.titulo
        tipo.value = point.tipo
        data.value = new Date(point.data).toISOString().slice(0, 16)
    })
}

async function savePoint(infos: any, coordinates: number[]) {
    try {
        const point: Point = {
            _id: new Types.ObjectId().toString(),
            ...infos,
            geom: coordinates,
        }

        const resp = await fetch(`http://localhost:3000/ocorrencias`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(point),
        })

        if (!resp.ok) {
            throw new Error("ERROR IN REQUEST")
        }
        alert("SUCESS")
        markers[markers.length - 1].remove()
        await showSinglePoint(point)
    } catch (error) {
        alert(error);
    }
}

async function getPoints(): Promise<Point[]> {
    try {
        const resp = await fetch(`http://localhost:3000/ocorrencias`, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        })

        if (!resp.ok) {
            throw new Error("ERROR IN REQUEST")
        }
        const locals = await resp.json()

        return locals as Point[]
    } catch (error) {
        throw error
    }
}

export async function getFilteredOcrrId(
    latitude: number,
    longitude: number,
    radius: number
): Promise<string[]> {
    try {
        const resp = await fetch(
            `http://localhost:3000/ocorrencias/filter/?` +
                new URLSearchParams({
                    latitude: latitude.toString(),
                    longitude: longitude.toString(),
                    radius: radius.toString(),
                }),
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            }
        )

        if (!resp.ok) {
            throw new Error("ERROR IN REQUEST")
        }
        const _idarray = await resp.json()
        console.log(_idarray)
        return _idarray as string[]
    } catch (error) {
        throw error
    }
}
export async function getCachedOcrr(id: string): Promise<Point> {
    try {
        const resp = await fetch(`http://localhost:3000/ocorrencias/${id}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
        })

        if (!resp.ok) {
            throw new Error("ERROR IN REQUEST")
        }
        const local = await resp.json()
        return local as Point
    } catch (error) {
        console.log(error);
        throw error
    }
}
export { savePoint, getPoints, Point }
