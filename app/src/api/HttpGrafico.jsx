import { httpRuta } from "../helpers/helpersHttp";

const url = httpRuta.api.http
const HttpGrafico = {
    rankingMejoresClientes: async (token, fechaI, fechaF, tipo, id_planta, id_condicion_pago, id_asesor) =>{
        try{
            const headers = new Headers()
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'bearer '+token)
            let topclientes = await fetch(`${url}/topclientes/${fechaI}/${fechaF}/${tipo}/${id_planta}/${id_condicion_pago}/${id_asesor}`,{mode:'cors',method: 'GET',headers: headers})
            let res_topclientes = await topclientes.json()
            return res_topclientes
        }catch(err){
            return {error: 'Error de servidor - Grafico Top Ventas Clientes'}
        }        
    },
    infoCliente : async (token, id_cliente) =>{
        try{
            const headers = new Headers()
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'bearer '+token)
            let ventasCliente = await fetch(`${url}/ventasAlCliente/${id_cliente}`,{mode:'cors',method: 'GET',headers: headers})
            let res_ventasCliente = await ventasCliente.json()
            return res_ventasCliente
        }catch(err){
            return {error: 'Error de servidor - Diagrama de ventas al cliente'}
        }
    },
}

export default HttpGrafico