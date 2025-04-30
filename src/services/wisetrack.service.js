import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

class WisetrackService {
  static async sendPayload(payload) {
    try {
      const response = await axios.post(
        process.env.WISETRACK_URL,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.WISETRACK_TOKEN}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error al enviar a Wisetrack:", error.response?.data || error.message);
      throw error;
    }
  }
}

export default WisetrackService;
