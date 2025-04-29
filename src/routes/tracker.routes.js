import { Router } from 'express';
import TrackerController from '../controllers/tracker.controller.js';

const router = Router();

router.get('/', async (req, res) => {
    try{
        const devices = await TrackerController.getDevices();
        res.json(devices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;