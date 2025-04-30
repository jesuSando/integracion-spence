import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

class TrackermasgpsService {

    //lista de dispositivos
    static async getTrackerList(hash) {
        try{
            const response = await axios.post(
                `${process.env.TRACKER_API}/tracker/list`,
                { hash },
                {
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Accept-Language': 'es-419,es;q=0.9,en;q=0.8',
                        'Connection': 'keep-alive',
                        'Content-Type': 'application/json',
                        'Cookie': '_ga=GA1.2.728367267.1665672802; locale=es; _gid=GA1.2.967319985.1673009696; _gat=1; session_key=5d7875e2bf96b5966225688ddea8f098',
                        'Origin': process.env.ORIGIN_TRACKER,
                        'Referer': `${process.env.ORIGIN_TRACKER}/`,
                        'User-Agent': process.env.USER_AGENT
                    }
                }
            );
            return response.data.list;
        } catch (error) {
            console.error("Error en getTrackerList: ", error.response?.data || error.message);
            throw error;
        }
    } 


    //estado de los dispositivos
    static async getTrackerState(trackerId, hash) {
        try{
            const response = await axios.post(
                `${process.env.TRACKER_API}/tracker/get_state`,
                {
                    hash,
                    tracker_id: trackerId
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data.state;
        } catch (error) {
            console.error(`Error al obtener estado del tracker ${trackerId}:`, error.response?.data || error.message);
            return null;
        }
    }
}

export default TrackermasgpsService;

