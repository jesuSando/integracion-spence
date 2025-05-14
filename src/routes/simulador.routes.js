import { Router } from "express";
import SimuladorController from "../controllers/simulador.controller.js";

const router = Router();

router.get("/frenado", SimuladorController.previewSimuladorFrenado);

export default router;
