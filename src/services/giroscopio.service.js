import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const getGiroyOdometro = async (trackerId, hash) => {
    try{
        const response = await axios.post(
            `${process.env.TRACKER_API}/tracker/readings/list`,
            {
                tracker_id: trackerId,
                hash
            },
            {
                headers:{
                    'Content-Type': 'application/json',
                    'Accept': 'application/json, text/plain, */*',
                    'Origin': process.env.ORIGIN_TRACKER,
                    'Referer': `${process.env.ORIGIN_TRACKER}/`,
                    'User-Agent': process.env.USER_AGENT
                }
            }
        );

        const data = response.data;

        //convertir a string con coma
        const formatDecimal = (value) => {
            const num = parseFloat(value?.toString().replace(',', '.') || '0');
            return num.toFixed(2).replace('.', ',');
        }

        const axisX = formatDecimal(data.inputs?.[1]?.value);
        const axisY = formatDecimal(data.inputs?.[3]?.value);
        const axisZ = formatDecimal(data.inputs?.[2]?.value);

        let odometro = formatDecimal(data.counters?.[0]?.value);


        //validacion formato
        const odometroValido = /^\d+,\d{2}$/.test(odometro);

        if (!odometroValido) {
            odometro = "0,00";
        }

        return{
            axisX,
            axisY,
            axisZ,
            odometro
        };

    } catch (error) {
        console.error("error en getGiroyOdometro: ", error.message);
        return{
            axisX: "0,00",
            axisY: "0,00",
            axisZ: "0,00",
            odometro: "0,00"
        };
    }
};