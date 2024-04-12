import {httpRuta} from '../helpers/helpersHttp'

const url = httpRuta.api.http
const HttpResumenVenta = {
    resumenDeVenta: async (token, fecha1, fecha2, tipo) =>{
        try{
            const headers = new Headers()
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'bearer '+token)
            let resumenDeVenta = await fetch(`${url}/VentasResumen/${fecha1}/${fecha2}/${tipo}`,{mode:'cors',method: 'GET',headers: headers})
            let resResumenDeVenta = await resumenDeVenta.json()
            return resResumenDeVenta
        }catch(err){
            return {error: 'No hubo respuesta del servidor, intentelo mas tarde.'}
        }        
    },
    resumenDeVentaGrafico: async (token, tipoGrafico) =>{
        try{
            const headers = new Headers()
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'bearer '+token)
            let resumenDeVentaGrafico = await fetch(`${url}/VentasResumen/${tipoGrafico}`,{mode:'cors',method: 'GET',headers: headers})
            let resresumenDeVentaGrafico = await resumenDeVentaGrafico.json()
            return resresumenDeVentaGrafico
        }catch(err){
            return {error: 'No hubo respuesta del servidor, intentelo mas tarde.'}
        }        
    }
}

export default HttpResumenVenta