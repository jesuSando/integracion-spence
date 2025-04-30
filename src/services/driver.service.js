import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();



export const driverInfo = async (trackerId, hash) => {

    try {
        const response = await axios.get(
            `${process.env.TRACKER_API}/tracker/employee/read`,
            {
            data: { tracker_id: trackerId, hash },
            headers: { 'Content-Type': 'application/json' }
            }
        );
        const data = response.data?.current;

        if (!data) {
            //rut, ibutton
            return { 
                nombre_conductor: "",   
                rut_conductor: ""
            };
        }

        //quitar primeros 4 digitos
        const hardwareKey = data.hardware_key ? data.hardware_key.slice(4) : "";

        //validacion ibutton
        const rutConductor = hardwareKey.length >= 7 && hardwareKey.length <= 70;

        //rut conductor
        let rut = data.personnel_number || "";
        rut = rut.replace(/[.\-]/g, "");

        const rutValido = rut.length >= 7 && !["NoIdentificado", "prueba_ibutton"].includes(rut.toLowerCase());

        return {
            nombre_conductor: rutValido ? rut : "",
            rut_conductor: rutConductor ? hardwareKey : ""
        }

    } catch (error) {
        console.error("error en driverInfo: ", error.message);
        return{
                nombre_conductor: "",   
                rut_conductor: ""
        };
    }
    
};