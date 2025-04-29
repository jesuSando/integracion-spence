import { Router } from 'express';
import { getHash } from '../controllers/hash.controller.js';

const router = Router();

router.get('/', getHash); // GET /api/hash

export default router;