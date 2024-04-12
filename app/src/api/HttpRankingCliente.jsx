import {httpRuta} from '../helpers/helpersHttp'

const url = httpRuta.api.http
const HttpRankingCliente = {
    listaAsesores: async (token) =>{
        try{
            const headers = new Headers()
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'bearer '+token)
            let listaAsesores = await fetch(`${url}/Asesor`,{mode:'cors',method: 'GET',headers: headers})
            let reslistaAsesores = await listaAsesores.json()
            return reslistaAsesores
        }catch(err){
            return {error: 'No hubo respuesta del servidor, intentelo mas tarde.'}
        }        
    }
}

export default HttpRankingCliente