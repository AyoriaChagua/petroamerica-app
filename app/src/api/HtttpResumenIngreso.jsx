
import {httpRuta} from '../helpers/helpersHttp'

const url = httpRuta.api.http
const HttpResumenIngreso = {
    ingresoResumen: async (token, periodo) =>{
        try{
            const headers = new Headers()
            headers.append('Content-Type', 'application/json')
            headers.append('Authorization', 'bearer '+token)
            let listaReumenIngresos = await fetch(`${url}/IngresosResumen/${periodo}`,{mode:'cors',method: 'GET',headers: headers})
            let reslistaReumenIngresos = await listaReumenIngresos.json()
            return reslistaReumenIngresos
        }catch(err){
            return {error: 'No hubo respuesta del servidor, intentelo mas tarde.'}
        }        
    },
    ingresoResumenTabla: async (token, fecha1, fecha2) => {
        try {
            const headers = new Headers()
            headers.append('Content-Type', 'application/json')
            headers.append('Authorization', 'bearer '+token)
            let ingresoResumenTabla = await fetch(`${url}/IngresosResumen/${fecha1}/${fecha2}`,{mode:'cors',method: 'GET',headers: headers})
            let resingresoResumenTabla = await ingresoResumenTabla.json()
            return resingresoResumenTabla
        } catch (err) {
            return {error: 'No hubo respuesta del servidor, intentelo mas tarde.'}
        }
    }
}

export default HttpResumenIngreso