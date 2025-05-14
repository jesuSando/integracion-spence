import { Router } from 'express';
import trackerRoutes from './tracker.routes.js';
import simuladorRoutes from './simulador.routes.js';
import { getHash } from '../controllers/hash.controller.js';

const router = Router();

// Ruta para obtener el hash
router.get('/hash', getHash);

// Ruta para dispositivos
router.use('/devices', trackerRoutes);

// ruta para simuladores
router.use('/simulador', simuladorRoutes);
export default router;