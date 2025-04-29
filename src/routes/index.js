import { Router } from 'express';
import trackerRoutes from './tracker.routes.js';
import { getHash } from '../controllers/hash.controller.js'; // Para la ruta HTTP

const router = Router();

// Ruta para obtener el hash (opcional)
router.get('/hash', getHash);

// Ruta para dispositivos
router.use('/devices', trackerRoutes);

export default router;