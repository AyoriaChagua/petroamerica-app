import {httpRuta} from '../helpers/helpersHttp'

const url = httpRuta.api.http

const Http = {
    login: async (data) =>{
        try{
            const headers = new Headers()
            headers.append('Content-Type', 'application/json');
            let login = await fetch(`${url}/login`,{
                method: 'POST', 
                mode:'cors',
                body: JSON.stringify(data), 
                headers: headers
            })
            let res_login = await login.json()
            return res_login
        }catch(err){
            return {error: 'Error de servidor - Login'}
        }
        
    },
    listaClientesActuales: async (token) =>{
        try{
            const headers = new Headers()
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'bearer '+token)
            let cliente = await fetch(`${url}/cliente/t`,{mode:'cors',method: 'GET',headers: headers})
            let res_cliente = await cliente.json()
            return res_cliente
        }catch(err){
            return {error: 'Error de servidor - Clientes'}
        }        
    },
    listaDescuentosActuales: async (token,id_cliente) =>{
        try{
            const headers = new Headers()
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'bearer '+token)
            let detalle = await fetch(`${url}/descuento/${id_cliente}`,{mode:'cors',method: 'GET',headers: headers})
            let res_detalle = await detalle.json()
            return res_detalle
        }catch(err){
            return {error: 'Error de servidor - Descuentos'}
        }
    },
    listaPlantas: async (token) =>{
        try{
            const headers = new Headers()
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'bearer '+token)
            let planta = await fetch(`${url}/planta`,{mode:'cors',method: 'GET',headers: headers})
            let res_planta = await planta.json()
            return res_planta
        }catch(err){
            return {error: 'Error de servidor - Plantas'}
        }
        
    },
    listaCondicionPagos: async (token, id_cliente) =>{
        try{
            const headers = new Headers()
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'bearer '+token)
            let condicionPago = await fetch(`${url}/condipago/${id_cliente}`,{mode:'cors',method: 'GET',headers: headers})
            let res_condicionPago = await condicionPago.json()
            return res_condicionPago
        }catch(err){
            return {error: 'Error de servidor - Condicion de Pago'}
        }
    },
    listarArticulosSubClase: async (token) =>{
        try{
            const headers = new Headers()
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'bearer '+token)
            let articulosubclase = await fetch(`${url}/articulosubclase`,{mode:'cors',method: 'GET',headers: headers})
            let res_articulosubclasea = await articulosubclase.json()
            return res_articulosubclasea
        }catch(err){
            return {error: 'Error de servidor - Lista de Articulos'}
        }
    },
    listaArticulos: async (token, id_cliente) =>{
        try{
            const headers = new Headers()
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'bearer '+token)
            let articulo = await fetch(`${url}/articulo/${id_cliente}`,{mode:'cors',method: 'GET',headers: headers})
            let res_articulo = await articulo.json()
            return res_articulo
        }catch(err){
            return {error: 'Error de servidor - Articulos'}
        }
    },
    listaAlmacen: async (token, id_planta) =>{
        try{
            const headers = new Headers()
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'bearer '+token)
            let almacen = await fetch(`${url}/almacen/${id_planta}`,{mode:'cors',method: 'GET',headers: headers})
            let res_almace = await almacen.json()
            return res_almace
        }catch(err){
            return {error: 'Error de servidor - Almacen'}
        }
    },
    estadoVentaCliente: async (token, id_cliente) =>{
        try{
            const headers = new Headers()
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'bearer '+token)
            let estadoVenta = await fetch(`${url}/EstadoVentasCliente/${id_cliente}`,{mode:'cors',method: 'GET',headers: headers})
            let res_estadoVenta = await estadoVenta.json()
            return res_estadoVenta
        }catch(err){
            return {error: 'Error de servidor - Almacen'}
        }
    },
    tablaDocMes : async(token, id_cliente, fechaI, fechaF) => {
        try{
            const headers = new Headers()
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'bearer '+token)
            let docs_cliente_mes = await fetch(`${url}/docs_cliente_mes/${id_cliente}/${fechaI}/${fechaF}`,{mode:'cors',method: 'GET',headers: headers})
            let res_docs_cliente_mes = await docs_cliente_mes.json()
            return res_docs_cliente_mes
        }catch(err){
            return {error: 'Error de servidor - Documentos del mes de cliente.'}
        }
    },
    tablaDocConSaldo :async (token, id_cliente) =>{
        try{
            const headers = new Headers()
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'bearer '+token)
            let docs_con_saldo = await fetch(`${url}/docs_con_saldo/${id_cliente}`,{mode:'cors',method: 'GET',headers: headers})
            let res_docs_con_saldo = await docs_con_saldo.json()
            return res_docs_con_saldo
        }catch(err){
            return {error: 'Error de servidor - Documentos con saldo.'}
        }
    },
    grabarDescuentos: async (token, data) =>{
        try{
            const headers = new Headers()
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'bearer '+token)
            await fetch(`${url}/descuento`,{mode:'cors', method: 'POST',headers: headers, body: JSON.stringify(data)})
            return {res: true}
        }catch(err){
            return {error: 'Error de servidor - Grabar Descuento'}
        } 
    },
    tablaVencimientoCubicacionVehiculo: async (token, idPlanta) =>{
        try{
            const headers = new Headers()
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'bearer '+token)
            let doc_vencimiento = await fetch(`${url}/vencimientocubicacion/${idPlanta}`,{mode:'cors', method: 'GET',headers: headers})
            let res_doc_vencimiento = await doc_vencimiento.json()
            return res_doc_vencimiento
        }catch(err){
            return {error: 'Error de servidor - Vencimiento Cubicacion Vehiculo'}
        } 
    }
}

export default Http;
