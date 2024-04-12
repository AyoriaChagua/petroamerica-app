import { httpRuta } from '../helpers/helpersHttp'
const url = httpRuta.api.http

const HttpInfoCliente = {
    docConSaldo: async (token, id_cliente, tipoDoc) => {
        try {
            const headers = new Headers()
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'bearer ' + token)
            let docConSaldo = await fetch(`${url}/Docs_con_saldo/${id_cliente}/${tipoDoc}`, { mode: 'cors', method: 'GET', headers: headers })
            let resdocConSaldo = await docConSaldo.json()
            return resdocConSaldo
        } catch (err) {
            return { error: 'No hubo respuesta del servidor, intentelo mas tarde.' }
        }
    },
    docConSaldoCredito: async (token, id_cliente) => {
        try {
            const headers = new Headers()
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'bearer ' + token)
            let docConSaldoCredito = await fetch(`${url}/Docs_con_saldo_Credito/${id_cliente}`, { mode: 'cors', method: 'GET', headers: headers })
            let resdocConSaldoCredito = await docConSaldoCredito.json()
            return resdocConSaldoCredito
        } catch (err) {
            return { error: 'No hubo respuesta del servidor, intentelo mas tarde.' }
        }
    },
    infoSaldosCliente: async (token, id_cliente) => {
        try {
            const headers = new Headers()
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'bearer ' + token)
            let infoSaldosCliente = await fetch(`${url}/Info_Saldos_Cliente/${id_cliente}`, { mode: 'cors', method: 'GET', headers: headers })
            let resinfoSaldosCliente = await infoSaldosCliente.json()
            return resinfoSaldosCliente
        } catch (err) {
            return { error: 'No hubo respuesta del servidor, intentelo mas tarde.' }
        }
    },
    docDeudasTotal: async (token, id_cliente) => {
        try {
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', 'bearer ' + token);
            const infoDeudas = await fetch(`${url}/Docs_con_Saldo_Credito/Total/${id_cliente}`, { mode: 'cors', method: 'GET', headers: headers });
            const resInfoDeudas = await infoDeudas.json();
            return resInfoDeudas;
        } catch (error) {
            return { error: 'No hubo respuesta del servidor, intentelo mas tarde.' }
        }
    }
}

export default HttpInfoCliente