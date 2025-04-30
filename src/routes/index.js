import { Router } from 'express';
import trackerRoutes from './tracker.routes.js';
import { getHash } from '../controllers/hash.controller.js';

const router = Router();

// Ruta para obtener el hash
router.get('/hash', getHash);

// Ruta para dispositivos
router.use('/devices', trackerRoutes);

export default router;