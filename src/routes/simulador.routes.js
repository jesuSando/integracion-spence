import { Router } from "express";
import SimuladorController from "../controllers/simulador.controller.js";

const router = Router();

router.get("/simulador85", SimuladorController.previewSimulador85);

router.get("/frenado1", SimuladorController.previewSimuladorFrenado);

router.get("/frenado2", SimuladorController.previewSimuladorFrenado2);

export default router;
