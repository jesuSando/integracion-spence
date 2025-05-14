import TrackermasgpsService from "../services/trackermasgps.service.js";
import { getHashDB } from "./hash.controller.js";
import { driverInfo } from "../services/driver.service.js";
import { getGiroyOdometro } from "../services/giroscopio.service.js";

class SimuladorController {
    static async previewSimuladorFrenado(req, res) {
        try {
            //obtener hash
            const hash = await getHashDB();
            if (!hash) throw new Error("No se pudo obtrener el hash");


            //obtener dispositivos
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
                const opcionalNegativo = (Math.floor(Math.random() * (740 - 700 + 1)) + 700) / -100;

                posiciones.push({
                    patente: (device.label ?? "").slice(0, 7).replace("-", ""),
                    fecha_hora: new Date().toISOString().slice(0, 19).replace("T", " "),
                    latitud: `${estado.gps.location.lat}`.replace(".", ","),
                    longitud: `${estado.gps.location.lng}`.replace(".", ","),
                    direccion: `${estado.gps.heading ?? 0}`,
                    velocidad: "11", // Forzado
                    estado_registro: "1",
                    estado_ignicion: "1", // Forzado
                    numero_evento: "51", // Forzado
                    odometro: `${sensores.odometro}`.replace(".", ","),
                    numero_satelites: `${Math.floor(Math.random() * 6 + 10)}`,
                    hdop: "1",
                    edad_dato: `${edadDato}`,
                    rut_conductor: rut,
                    nombre_conductor: rut,
                    opcional_1: `${opcionalNegativo}`.replace(".", ","),
                });
            }
            return res.json({ posicion: posiciones });
        } catch (error) {
            console.error("error en previewSimuladorFrenado: ", error.message);
            res.status(500).json({ error: error.message });
        }
    } 
}

export default SimuladorController;