import { simuladorPayload } from "../helpers/simuladorPayload.js";

class SimuladorController {
    static async previewSimulador85(req, res) {
        try{
            const data = await simuladorPayload("simulador85");
            res.json(data);
        } catch (error) {
            console.error("error en previewSimulador85: ", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async previewSimuladorFrenado(req, res) {
        try {
            const data = await simuladorPayload("frenado");
            res.json(data);
        } catch (error) {
            console.error("error en previewSimuladorFrenado: ", error.message);
            res.status(500).json({ error: error.message });
        }
    }

    static async previewSimuladorFrenado2(req, res) {
        try {
            const data = await simuladorPayload("frenado2");
            res.json(data);
        } catch (error) {
            console.error("error en previewSimuladorFrenado2: ", error.message);
            res.status(500).json({ error: error.message });
        }
    }
}

export default SimuladorController;