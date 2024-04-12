import {httpRuta} from '../helpers/helpersHttp'

const url = httpRuta.api.http
const HttpRankingAsesor = {
    topAsesores : async (token, periodo, tipoCrecimiento, tipoCliente) => {
        try{
            const headers = new Headers()
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'bearer '+token)
            let topAsesores = await fetch(`${url}/TopAsesores/${periodo}/${tipoCrecimiento}/${tipoCliente}`,{mode:'cors',method: 'GET',headers: headers})
            let resTopAsesores = await topAsesores.json()
            return resTopAsesores
        }catch(err){
            return {error: 'No hubo respuesta del servidor, intentelo mas tarde.'}
        } 
    },
    documentosDeAsesores : async(token, idAsesor, idTipoNegocio, mes) => {
        try{
            const headers = new Headers()
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'bearer '+token)    
            let documentosDeAsesores = await fetch(`${url}/Docs_asesor/${idAsesor}/${idTipoNegocio}/${mes}`,{mode:'cors',method: 'GET',headers: headers})
            let resdocumentosDeAsesores = await documentosDeAsesores.json()
            return resdocumentosDeAsesores
        }catch(err){
            return {error: 'No hubo respuesta del servidor, intentelo mas tarde.'}
        } 
    }
}

export default HttpRankingAsesor