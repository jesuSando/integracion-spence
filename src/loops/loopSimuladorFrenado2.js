import { simuladorPayload } from "../helpers/simuladorPayload";
import WisetrackService from "../services/wisetrack.service";
import delay from "delay";

async function loopFrenado2() {
    while (true) {
        const payload = await simuladorPayload("frenado2");

        if (payload.posicion.length > 0) {
            const response = await WisetrackService.sendPayload(payload);
            console.log("enviado a wisetrack: ", response);
        }
        await delay(3600000)
    }
}

loopFrenado2();