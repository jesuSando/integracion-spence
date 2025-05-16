import TrackermasgpsService from "../services/trackermasgps.service.js";
import { getHashDB } from "./hash.controller.js";
import { driverInfo } from "../services/driver.service.js";
import { getGiroyOdometro } from "../services/giroscopio.service.js";
import WisetrackService from "../services/wisetrack.service.js";

import delay from "delay";

export async function loopPrincipal() {
    //obtener hash
    const hash = await getHashDB();
    if (!hash) throw new Error("No se pudo obtrener el hash");

    //obtener dispositivos
    const devices = await TrackermasgpsService.getTrackerList(hash);

    while (true) {

        const inicio = Date.now();

        for (let i = 0; i < devices.length; i += 10) {
            const chunk = devices.slice(i, i + 10);
            const posiciones = [];

            for (const device of chunk) {
                const trackerId = device.id;

                const [estado, conductor, sensores] = await Promise.all([
                    TrackermasgpsService.getTrackerState(trackerId, hash),
                    driverInfo(trackerId, hash),
                    getGiroyOdometro(trackerId, hash)
                ]);

                if (!estado?.gps?.location) continue;

                const now = new Date();
                const last = new Date(estado.last_update);
                const edadDato = Math.floor((now - last) / 1000);
                const ignicion = estado.inputs?.[0] ? 1 : 0;
                const evento = ignicion === 1 ? "45" : "46";

                posiciones.push({
                    patente: (device.label ?? '').slice(0, 7).replace('-', ''),
                    fecha_hora: estado.last_update,
                    latitud: `${estado.gps.location.lat}`.replace('.', ','),
                    longitud: `${estado.gps.location.lng}`.replace('.', ','),
                    direccion: `${estado.gps.heading ?? 0}`,
                    velocidad: `${estado.gps.speed ?? 0}`,
                    estado_registro: "1",
                    estado_ignicion: `${ignicion}`,
                    numero_evento: evento,
                    odometro: `${sensores.odometro}`.replace('.', ','),
                    numero_satelites: `${Math.floor(Math.random() * 6 + 10)}`,
                    hdop: "1",
                    edad_dato: `${edadDato}`,
                    rut_conductor: `${conductor.rut_conductor ?? ''}`,
                    nombre_conductor: `${conductor.nombre_conductor ?? ''}`,
                    opcional_1: `${sensores.axisX}`.replace('.', ',')
                });
            }

            if (posiciones.length > 0) {
                const payload = { posicion: posiciones };
                const response = await WisetrackService.sendPayload(payload)
                console.log("enviado a wisetrack. tramas: ", posiciones.length, "respuesta: ", response)
            }

            await delay(1000); //1 segundo
        }

        const duracion = ((Date.now() - inicio) / 1000).toFixed(2);
        console.log(`ciclo completado en ${duracion}S, reiniciando`)
    }
}

loopPrincipal();