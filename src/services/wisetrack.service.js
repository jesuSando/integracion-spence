import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

class WiseTrackService {
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
                        'Origin': 'http://www.trackermasgps.com',
                        'Referer': 'http://www.trackermasgps.com/',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
                    }
                }
            );
            return response.data.list;
        } catch (error) {
            console.error("Error en getTrackerList: ", error.response?.data || error.message);
            throw error;
        }
    } 
}

export default WiseTrackService;

