import { Router } from 'express';
import TrackerController from '../controllers/tracker.controller.js';

const router = Router();

//dispositivos
router.get('/', async (req, res) => {
    try{
        const devices = await TrackerController.getDevices();
        res.json(devices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//estado del dispositivo
router.get('/estado', async (req, res) => {
    try {
        const data = await TrackerController.getDevicesState();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//datos driver
router.get('/driver', async (req, res) => {
    try {
        const data = await TrackerController.getDevicesDriver();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//odometro y giroscopio
router.get('/giro', async (req, res) => {
    try {
        const data = await TrackerController.getDevicesOdometerAndGyro();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//preview
router.get('/preview', async (req, res) => {
    try {
        const payload = await TrackerController.previewPayload();
        res.json(payload);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//send
router.post('/send', async (req, res) => {
    try {
        const data = await TrackerController.sendWisetrack();
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;