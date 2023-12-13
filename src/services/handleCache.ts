import { redisClient } from "../database/redis"

export const EXPIRATION_TIME = 3600
export const DISTANCE_UNIT = "km"

interface PointCached {
    _id: string
    geom: { coordinates: number[] }
}
interface GeoSearchParams {
    longitude: number
    latitude: number
    radius: number
}

export const getOrSetCache = (key: string, callback: Function) => {
    return new Promise((resolve, reject) => {
        redisClient
            .get(key)
            .then(async (data) => {
                if (data != null) {
                    console.log("cache hit")
                    resolve(JSON.parse(data))
                    return
                }
                console.log("cache miss")
                const newData = await callback()
                    redisClient.setEx(
                        key,
                        EXPIRATION_TIME,
                        JSON.stringify(newData)
                    )
                    resolve(newData)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

export const geoSearchSetOrGetCache = (
    key: string,
    value: GeoSearchParams,
    callback: Function
) => {
    return new Promise(async (resolve, reject) => {
        await wrapGeoSearch(key, value)
            .then(async (resp) => {
                if (resp && resp.length > 0) {
                    console.log("cache hit")
                    return resolve(resp)
                }
                console.log("cache miss")
                const newData = await callback()
                newData.map(async (data: PointCached) => {
                    await redisClient
                        .geoAdd(key, {
                            longitude: data.geom.coordinates[0],
                            latitude: data.geom.coordinates[1],
                            member: data._id.toString(),
                        })
                        .catch((error) => {
                            reject(error)
                        })
                })
                resolve(await wrapGeoSearch(key, value))
            })
            .catch((error) => {
                reject(error)
            })
    })
}

function wrapGeoSearch(key: string, value: GeoSearchParams) {
    return redisClient.geoSearch(
        key,
        {
            longitude: value.longitude,
            latitude: value.latitude,
        },
        { radius: value.radius, unit: DISTANCE_UNIT }
    )
}
