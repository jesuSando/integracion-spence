import WiseTrackService from "../services/wisetrack.service.js";
import { getHashDB } from "./hash.controller.js";

class TrackerController {
    static async getDevices(){
        try{
            //obtener hash
            const hash = await getHashDB();
            if (!hash) throw new Error("No se pudo obtrener el hash");


            //obtener dispositivos
            const devices = await WiseTrackService.getTrackerList(hash);
            return devices;

        } catch (error) {
            console.error("error en trackerController: ", error);
            throw error;
        }
    }
}

export default TrackerController;