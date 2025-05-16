import TrackermasgpsService from "../services/trackermasgps.service";
import { getHashDB } from "./hash.controller";
import { driverInfo } from "../services/driver.service";
import { getGiroyOdometro } from "../services/giroscopio.service";

export async function simuladorPayload(tipo ="simulador85") {
    const hash = await getHashDB();
    if (!hash) throw new Error("No se pudo obtrener el hash");

    const devices = await TrackermasgpsService.getTrackerList(hash);
    const posiciones = [];

    for (const device of devices) {
        const trackerId = device.id;

        const [estado, conductor, sensores] = await Promise.all([
            TrackermasgpsService.getTrackerState(trackerId, hash),
            driverInfo(trackerId, hash),
            getGiroyOdometro(trackerId, hash),
        ]);

        if (!estado?.gps?.location) continue;

        const now = new Date();
        const last = new Date(estado.last_update);
        const edadDato = Math.floor((now - last) / 1000);

        const rut = conductor.rut_conductor?.replace("-", "") ?? "00000000";
        const key = conductor.hardware_key ?? "0000000000000000";
        const key_button8 = key.slice(-8);
        const opcionalNegativo = (Math.floor(Math.random() * (740 - 700 + 1)) + 700) / -100;

        const base = {
            patente: (device.label ?? "").slice(0, 7).replace("-", ""),
            fecha_hora: new Date().toISOString().slice(0, 19).replace("T", " "),
            latitud: `${estado.gps.location.lat}`.replace(".", ","),
            longitud: `${estado.gps.location.lng}`.replace(".", ","),
            direccion: `${estado.gps.heading ?? 0}`,
            odometro: `${sensores.odometro}`.replace(".", ","),
            numero_satelites: `${Math.floor(Math.random() * 6 + 10)}`,
            hdop: "1",
            edad_dato: `${edadDato}`
        };  


        if (tipo === "simulador85") {
            posiciones.push({
                ...base,
                velocidad: `${estado.gps.speed ?? 0}`.replace(".", ","),
                estado_registro: "1",
                estado_ignicion: "1", // forzado
                numero_evento: "45",  // forzado
                rut_conductor: key_button8,
                nombre_conductor: rut,
            });
        }

        if (tipo === "frenado") {
            posiciones.push({
                ...base,
                velocidad: "11",
                estado_registro: "1",
                estado_ignicion: "1", // forzado
                numero_evento: "51",  // forzado
                rut_conductor: rut,
                nombre_conductor: rut,
                opcional_1: `${opcionalNegativo}`.replace(".", ",")
            });
        }

        if (tipo === "frenado2") {
            posiciones.push({
                ...base,
                velocidad: "11",
                estado_registro: "1",
                estado_ignicion: "1", // forzado
                numero_evento: "51",  // forzado
                rut_conductor: key_button8,
                nombre_conductor: rut,
                opcional_1: `${opcionalNegativo}`.replace(".", ",")
            });
        }
    }

    return { posicion: posiciones };
}