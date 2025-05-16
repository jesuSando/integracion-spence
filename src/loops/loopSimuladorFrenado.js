import { simuladorPayload } from "../helpers/simuladorPayload";
import WisetrackService from "../services/wisetrack.service";
import delay from "delay";

async function loopFrenado() {
    while (true) {
        const payload = await simuladorPayload("frenado");

        if (payload.posicion.length > 0) {
            const response = await WisetrackService.sendPayload(payload);
            console.log("enviado a wisetrack: ", response);
        }
        await delay(3600000)
    }
}

loopFrenado();