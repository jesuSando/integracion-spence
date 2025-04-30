import TrackermasgpsService from "../services/trackermasgps.service.js";
import { getHashDB } from "./hash.controller.js";
import { driverInfo } from "../services/driver.service.js";
import { getGiroyOdometro } from "../services/giroscopio.service.js";
import WisetrackService from "../services/wisetrack.service.js"; 



class TrackerController {

    //obtener dispositivos
    static async getDevices(){
        try{
            //obtener hash
            const hash = await getHashDB();
            if (!hash) throw new Error("No se pudo obtrener el hash");


            //obtener dispositivos
            const devices = await TrackermasgpsService.getTrackerList(hash);
            return devices;

        } catch (error) {
            console.error("error en trackerController: ", error);
            throw error;
        }
    }

    //obtener dispositivos con estado
    static async getDevicesState(){
        try{
            //obtener hash
            const hash = await getHashDB();
            if (!hash) throw new Error("No se pudo obtrener el hash");


            //obtener dispositivos
            const devices = await TrackermasgpsService.getTrackerList(hash);
            const results = [];

            for (const device of devices){
                const trackerId = device.id;
                const estado = await TrackermasgpsService.getTrackerState(trackerId, hash);

                if (!estado) continue;

                results.push({
                    id: trackerId,
                    label: device.label,
                    gps: estado.gps,
                    speed: estado.gps?.speed ?? 0,
                    heading: estado.gps?.heading ?? 0,
                    connection_status: estado.connection_status,
                    last_update: estado.last_update,
                    ignicion: estado.inputs?.[0] ? 1 : 0,
                });
            }

            return results;

        } catch (error) {
            console.error("error en getDevicesState: ", error);
            throw error;
        }
    }

    //obtener drivers
    static async getDevicesDriver(){
        try{
            //obtener hash
            const hash = await getHashDB();
            if (!hash) throw new Error("No se pudo obtrener el hash");


            //obtener dispositivos
            const devices = await TrackermasgpsService.getTrackerList(hash);
            const results = [];

            for (const device of devices){
                const info = await driverInfo(device.id, hash);
                results.push({
                    id: device.id,
                    label: device.label,
                    rut: info.rut_conductor,
                    nombre: info.nombre_conductor,
                    ibutton: info.hardware_key
                });
            }
            return results;
        } catch (error) {
            console.error("error en getDevicesDriver: ", error);
            throw error;
        }
    }

    //obtener odometro y giroscopio
    static async getDevicesOdometerAndGyro(){
        try {
            //obtener hash
            const hash = await getHashDB();
            if (!hash) throw new Error("No se pudo obtrener el hash");


            //obtener dispositivos
            const devices = await TrackermasgpsService.getTrackerList(hash);
            const results = [];

            for (const device of devices) {
                const datos = await getGiroyOdometro(device.id, hash);
                results.push({
                    id: device.id,
                    label: device.label,
                    odometro: datos.odometro,
                    eje_x: datos.axisX,
                    eje_y: datos.axisY,
                    eje_z: datos.axisZ
                });
            }
            
            return results;
        } catch (error) {
            console.error("error en getDevicesOdometerAndGyro: ", error);
            throw error;
        }
    }

    //probar antes de enviar
    static async previewPayload() {
        try {
            const hash = await getHashDB();
            if (!hash) throw new Error("No se pudo obtener el hash");
      
            const devices = await TrackermasgpsService.getTrackerList(hash);
            const posiciones = [];
        
            for (const device of devices) {
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
        
            return { posicion: posiciones };
        
            } catch (error) {
            console.error("Error en previewPayload:", error.message);
            throw error;
            }
    }
    
    //enviar a wisetrack
    static async sendWisetrack(){
        try{
            //obtener hash
            const hash = await getHashDB();
            if (!hash) throw new Error("No se pudo obtrener el hash");


            //obtener dispositivos
            const devices = await TrackermasgpsService.getTrackerList(hash);
            const posiciones = [];

            for (const device of devices) {
                const trackerId = device.id;

                const[estado, conductor, sensores] = await Promise.all([
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

                //formato
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

            if (posiciones.length === 0) {
                return { message: "No se generó ninguna posición válida" };
            }

            const payload = { posicion : posiciones };
            return await WisetrackService.sendPayload(payload);
        } catch (error) {
            console.error("error en sendWisetrack: ", error.message);
        }
    }
}

export default TrackerController;