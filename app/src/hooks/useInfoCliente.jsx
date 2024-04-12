import moment from "moment"
import { useContext, useEffect, useRef, useState } from "react"
import curencyformatter from 'currency-formatter'
import { Alert } from "react-native"
import Http from "../api/Http"
import HttpGrafico from '../api/HttpGrafico'
import HttpInfoCliente from '../api/HttpInfoCliente'
import { tokenContext } from "../context/Context"
import { helpers } from "../helpers/helpers"

export const useInfoCliente = () => {

    const [estadoVenta, setEstadoVenta] = useState(undefined)
    const [data, setData] = useState({
        gas: [
            {x:'ENE', y:0},
            {x:'FEB', y:0},
            {x:'MAR', y:0},
            {x:'ABR', y:0}
        ],
        die: [
            {x:'ENE', y:0},
            {x:'FEB', y:0},
            {x:'MAR', y:0},
            {x:'ABR', y:0}
        ]
    })
    const [dataTotales, setDataTotales] = useState({
        totales: [
            {x:'ENE', y:0},
            {x:'FEB', y:0},
            {x:'MAR', y:0},
            {x:'ABR', y:0}
        ]
    })
    const [mesesVenta, setMesesVentas] = useState([])
    const [docConSaldo, setDocConSaldo] = useState([])
    const [tituloDoc, setTituloDoc] = useState("")
    const [listaPlantas, setListaPlantas] = useState([])
    const [docClienteMes, setDocClienteMes] = useState({titulo: '', doc: [], sumatoria : 0})
    const [estadoDeudas, setEstadoDeudas] = useState({dedudaSinVender: false, dedudaVencida: false, montoaFavor: false})
    const [valoresDeudas, setValoresDeudas] = useState({
        dedudaSinVender: {
            color: '#F8CB2E',
            icon: 'alert-circle-outline',
            texto: '0'
        }, 
        dedudaVencida: {
            color: '#5BB318',
            icon: 'check-circle-outline',
            texto: '0'
        }, 
        deudaTotal: 0,
        montoaFavor: {
            color: 'gray',
            icon: 'emoticon-neutral-outline',
            texto: '0'
        }
    })
    const [saldoTotalDoc, setSaldoTotalDoc] = useState(0)
    const [filtroPlanta, setFiltroPlanta] = useState("")
    const [ventanaEmergenteModal, setVentanaEmergenteModal] = useState(false)
    const [tipoVentaDocDeuda, setTipoVentanaDocDeuda] = useState("1")
    const [cargaGrafico, setCargaGrafico] = useState(true)
    const [cargaInformacion, setCargaInformacion] = useState(true)
    const [tipoDiagrama, setTipoDiagrama] = useState(true)
    const [verModalDocMes, setVerModalDocMes] = useState(false)
    const [estadoDocMes, setEstadoDocMes] = useState(false)

    const gasPromedio = useRef(0)
    const diePromedio = useRef(0)
    const totalPromedio = useRef(0)
    const isMountedRef = useRef(null);

    const {cliente, token} = useContext(tokenContext)
    const {obtenerNombreMes, obtenerNumeroDelMes} = helpers()

    useEffect(() => {
        isMountedRef.current = true;
        estadoVentaCliente()
        return () => isMountedRef.current = false;
    }, [cliente])
    
    const estadoVentaCliente = async () =>{
        setCargaGrafico(true)
        setEstadoDeudas({dedudaSinVender: false, dedudaVencida: false, montoaFavor: false})
        const response = await Promise.all([ Http.estadoVentaCliente(token, cliente.id_cliente), HttpGrafico.infoCliente(token, cliente.id_cliente), HttpInfoCliente.infoSaldosCliente(token, cliente.id_cliente)])
        if(response[0].error){
            Alert.alert('Mensaje', response[0].error + "\nSalir y volver a intentar.")
            setEstadoVenta("Sin respuesta")
        }else{
            let {estadO_VENTAS_CLIENTE} = response[0][0]
            setEstadoVenta(estadO_VENTAS_CLIENTE)
        }
        const mes1 = obtenerNombreMes(moment().format('M'))
        const mes2 = obtenerNombreMes(moment().subtract(1, 'months').format('M'))
        const mes3 = obtenerNombreMes(moment().subtract(2, 'months').format('M'))
        const mes4 = obtenerNombreMes(moment().subtract(3, 'months').format('M'))
        if(response[1].error){
            Alert.alert('Mensaje', response[1].error + "\nSalir y volver a intentar.")
            setData(
                {
                    gas: [
                        {x:mes4, y:0, label: 0},
                        {x:mes3, y:0, label: 0},
                        {x:mes2, y:0, label: 0},
                        {x:mes1, y:0, label: 0}
                    ],
                    die: [
                        {x:mes4, y:0, label: 0},
                        {x:mes3, y:0, label: 0},
                        {x:mes2, y:0, label: 0},
                        {x:mes1, y:0, label: 0}
                    ]
                }
            )
            setDataTotales(
                {
                    totales: [
                        {x:mes4, y:0, label: 0},
                        {x:mes3, y:0, label: 0},
                        {x:mes2, y:0, label: 0},
                        {x:mes1, y:0, label: 0}
                    ]   
                }
            )
        }else{
            let matrizCuadroEstadistico = {}
            let matrizCuadroEstadisticoTotal = {}
            if(response[1].length < 1 ){
                setData(
                    {
                        gas: [
                            {x:mes4, y:0, label: 0},
                            {x:mes3, y:0, label: 0},
                            {x:mes2, y:0, label: 0},
                            {x:mes1, y:0, label: 0}
                        ],
                        die: [
                            {x:mes4, y:0, label: 0},
                            {x:mes3, y:0, label: 0},
                            {x:mes2, y:0, label: 0},
                            {x:mes1, y:0, label: 0}
                        ]
                    }
                )
                setDataTotales(
                    {
                        totales: [
                            {x:mes4, y:0, label: 0},
                            {x:mes3, y:0, label: 0},
                            {x:mes2, y:0, label: 0},
                            {x:mes1, y:0, label: 0}
                        ]   
                    }
                )
            }else{
                response[1].forEach(element => {
                    matrizCuadroEstadistico.gas = [
                        {x:mes4, y: element.mes_3_gas, label: element.mes_3_gas},
                        {x:mes3, y: element.mes_2_gas, label: element.mes_2_gas},
                        {x:mes2, y: element.mes_1_gas, label: element.mes_1_gas},
                        {x:mes1, y: element.mes_act_gas, label: element.mes_act_gas}
                    ]
                    matrizCuadroEstadistico.die = [
                        {x:mes4, y: element.mes_3_die, label: element.mes_3_die},
                        {x:mes3, y: element.mes_2_die, label: element.mes_2_die},
                        {x:mes2, y: element.mes_1_die, label: element.mes_1_die},
                        {x:mes1, y: element.mes_act_die, label: element.mes_act_die}
                    ]
                    matrizCuadroEstadisticoTotal.totales=[
                        {x:mes4, y: (parseInt(element.mes_3_gas || 0) + parseInt(element.mes_3_die || 0)), label: (parseInt(element.mes_3_gas || 0) + parseInt(element.mes_3_die || 0))},
                        {x:mes3, y: (parseInt(element.mes_2_die || 0) + parseInt(element.mes_2_gas || 0)), label: (parseInt(element.mes_2_die || 0) + parseInt(element.mes_2_gas || 0))},
                        {x:mes2, y: (parseInt(element.mes_1_die || 0) + parseInt(element.mes_1_gas || 0)), label: (parseInt(element.mes_1_die || 0) + parseInt(element.mes_1_gas || 0))},
                        {x:mes1, y: (parseInt(element.mes_act_die || 0) + parseInt(element.mes_act_gas || 0)), label: (parseInt(element.mes_act_die || 0) + parseInt(element.mes_act_gas || 0))}
                    ]
                    let total = (parseInt(element.mes_3_gas || 0) + parseInt(element.mes_3_die || 0)) + 
                                (parseInt(element.mes_2_die || 0) + parseInt(element.mes_2_gas || 0)) + 
                                (parseInt(element.mes_1_die || 0) + parseInt(element.mes_1_gas || 0)) + 
                                (parseInt(element.mes_act_die || 0) + parseInt(element.mes_act_gas || 0))
                    totalPromedio.current = curencyformatter.format((total/4), {code:'', precision:1})            
                    gasPromedio.current = curencyformatter.format((element.prom_1_3_gas), {code:'', precision:1})
                    diePromedio.current = curencyformatter.format((element.prom_1_3_die), {code:'', precision:1})
                });
                setDataTotales(matrizCuadroEstadisticoTotal)
                setData(matrizCuadroEstadistico)
            }
        }
        setMesesVentas([mes4, mes3, mes2])
        setCargaGrafico(false)
        if(response[2].error){
            Alert.alert('Mensaje', response[2].error)
            setValoresDeudas({
                dedudaSinVender: {
                    color: '#F8CB2E',
                    icon: 'alert-circle-outline',
                    texto: '0'
                }, 
                dedudaVencida: {
                    color: '#5BB318',
                    icon: 'check-circle-outline',
                    texto: '0'
                }, 
                deudaTotal:0,
                montoaFavor: {
                    color: 'gray',
                    icon: 'emoticon-neutral-outline',
                    texto: '0'
                }
            })
        }else{
            const {deuda_sin_vencer, deuda_vencida, monto_a_favor, deuda_vencida_min} = response[2][0]
            let totalDeuda = parseFloat(deuda_sin_vencer) + parseFloat(deuda_vencida) 
            setValoresDeudas({
                dedudaSinVender: {
                    color: (parseFloat(deuda_sin_vencer) < 1) ? '#5BB318' : '#F8CB2E',
                    icon: (parseFloat(deuda_sin_vencer) < 1) ? 'check-circle-outline' : 'alert-circle-outline',
                    texto: curencyformatter.format((deuda_sin_vencer), {code:'', precision:2})
                }, 
                dedudaVencida: {
                    color: (parseFloat(deuda_vencida) <= parseFloat(deuda_vencida_min)) ? '#5BB318': '#D2001A',
                    icon: (parseFloat(deuda_vencida) <= parseFloat(deuda_vencida_min)) ? 'check-circle-outline' : 'close-circle-outline',
                    texto: curencyformatter.format((deuda_vencida), {code:'', precision:2})
                }, 
                deudaTotal:  curencyformatter.format((totalDeuda), {code:'', precision:2}),
                montoaFavor: {
                    color: (parseFloat(monto_a_favor) >= 10) ? '#5BB318': 'gray',
                    icon: (parseFloat(monto_a_favor) >= 10) ? 'emoticon-happy-outline': 'emoticon-neutral-outline',
                    texto: curencyformatter.format((monto_a_favor), {code:'', precision:2})
                }
            })
        }

        setEstadoDeudas({dedudaSinVender: true, dedudaVencida: true, montoaFavor: true})
    }    

    const mostrardocumentosClientePorMes = async ({xName}) => {
        setEstadoDocMes(true)
        setVerModalDocMes(true)
        const numeroMes = obtenerNumeroDelMes(xName)
        const fechaI = moment().month(numeroMes).startOf('months').format('YYYY-MM-DD')
        const fechaF = moment().month(numeroMes).endOf('months').format('YYYY-MM-DD')        
        const res = await Http.tablaDocMes(token, cliente.id_cliente, fechaI, fechaF)
        if(res.error){
            Alert.alert('Mensjae', res.error)
            setEstadoDocMes(false)
            setDocClienteMes({titulo: "No encontrado", doc: [], sumatoria: '0'})
            return
        }
        let estado = true
        let validPk = ''
        res.map(val => { (val.fecha = moment(val.fecha).format('YYYY-MM-DD'), val.pk = val.fecha+val.documento)})
        res.forEach(value => {
            if(validPk !== value.pk){
                value.backgroundColor = (estado) ? '#C3DBD9' : 'white'
                validPk = value.pk
                estado = !estado
            }else{
                value.backgroundColor = (!estado) ? '#C3DBD9' : 'white'
                validPk = value.pk
            }
        })
        let sumatoria = res.reduce((a, b) => a + (b['cantidad'] || 0), 0);
        sumatoria = curencyformatter.format((sumatoria), {code:'', precision: 0})
        setDocClienteMes({titulo: xName, doc: res, sumatoria})
        setEstadoDocMes(false)
    }

    const cambiarVistaVentasClientes = () => {
        setCargaGrafico(true)
        setTipoDiagrama(!tipoDiagrama)
        setTimeout(() => {
            setCargaGrafico(false)
        }, 1000);
    }

    const mostrarVentanaEmergente = async (tipoDoc, titulo) => {
        setSaldoTotalDoc(0)
        setTipoVentanaDocDeuda("1")
        setFiltroPlanta("")
        setTituloDoc("")
        setDocConSaldo([])
        setListaPlantas([])
        setVentanaEmergenteModal(true)
        setCargaInformacion(true)
        const documentos = await HttpInfoCliente.docConSaldo(token, cliente.id_cliente, tipoDoc)
        if(documentos.error){
            Alert.alert('Mensaje', documentos.error)
            setTituloDoc("Sin conexión")
            setCargaInformacion(false)
            return
        }
        setFiltroPlanta("")
        setTituloDoc(titulo)
        setDocConSaldo(documentos)
        let sumatoria = documentos.reduce((a, b) => a + parseFloat(b['saldo']), 0);
        sumatoria = curencyformatter.format((sumatoria), {code:'', precision: 2})
        setSaldoTotalDoc(sumatoria)
        documentos.map(value => (
            (   
                value.fecha = moment(value.fecha).format('DD-MM-YY'), 
                value.fecha_vencimiento = moment(value.fecha_vencimiento).format('DD-MM-YY'),
                value.cantidad = value.saldo,
                value.saldo = curencyformatter.format((value.saldo), {code:''})
            )
        ))
        let plantas = []
        documentos.forEach(value => plantas.push(value.planta))
        let plantasNoRepetidos = [...new Set(plantas)]
        setListaPlantas(plantasNoRepetidos)
        setCargaInformacion(false)
    }

    const mostrarVentanaEmergenteCredito = async (tipoDoc, titulo) => {
        setSaldoTotalDoc(0)
        setTipoVentanaDocDeuda("2")
        setFiltroPlanta("")
        setTituloDoc("")
        setDocConSaldo([])
        setListaPlantas([])
        setVentanaEmergenteModal(true)
        setCargaInformacion(true)
        const documentos = await HttpInfoCliente.docConSaldoCredito(token, cliente.id_cliente)
        if(documentos.error){
            Alert.alert('Mensaje', documentos.error)
            setTituloDoc("Sin conexión")
            setCargaInformacion(false)
            return
        }
        setFiltroPlanta("")
        setTituloDoc(titulo)
        setDocConSaldo(documentos)
        let sumatoria = documentos.reduce((a, b) => a + parseFloat(b['saldo']), 0);
        sumatoria = curencyformatter.format((sumatoria), {code:'', precision: 2})
        setSaldoTotalDoc(sumatoria)
        documentos.map(value => (
            (   
                value.fecha = moment(value.fecha).format('DD-MM-YY'), 
                value.saldo = curencyformatter.format((value.saldo), {code:''}),
                value.cantidad = value.saldo,
                value.monto_credito = curencyformatter.format((value.monto_credito), {code:''})
            )
        ))
        let plantas = []
        documentos.forEach(value => plantas.push(value.planta))
        let plantasNoRepetidos = [...new Set(plantas)]
        setListaPlantas(plantasNoRepetidos)
        setCargaInformacion(false)
    }

    const cerrarVentanaEmergente = () => { setVentanaEmergenteModal(false) }

    const agregarPlantaAlFiltro = (planta) => {
        setFiltroPlanta(planta)
        setCargaInformacion(true)
        if(planta === ""){
            let sumatoria = docConSaldo.reduce((a, b) => a + parseFloat(b['cantidad']), 0);
            sumatoria = curencyformatter.format((sumatoria), {code:'', precision: 2})
            setSaldoTotalDoc(sumatoria)
        }else{
            let nuevoDocumento = docConSaldo.filter(value => value.planta === planta)
            let sumatoria = nuevoDocumento.reduce((a, b) => a + parseFloat(b['cantidad']), 0);
            sumatoria = curencyformatter.format((sumatoria), {code:'', precision: 2})
            setSaldoTotalDoc(sumatoria)
        }
        setTimeout(() => {
            setCargaInformacion(false)
        }, 500);
        
        
    }
    const cerrarModalDocMes = () => setVerModalDocMes(false)

    return {
        estadoVenta,
        data,
        dataTotales,
        cargaGrafico,
        mesesVenta,
        docConSaldo,
        listaPlantas,
        filtroPlanta,
        gasPromedio,
        diePromedio,
        totalPromedio,
        cliente,
        verModalDocMes,
        docClienteMes,
        estadoDocMes,
        tipoDiagrama,
        ventanaEmergenteModal,
        estadoDeudas,
        valoresDeudas,
        tituloDoc,
        cargaInformacion,
        tipoVentaDocDeuda,
        saldoTotalDoc,
        mostrarVentanaEmergente,
        cerrarVentanaEmergente,
        agregarPlantaAlFiltro,
        mostrardocumentosClientePorMes,
        cerrarModalDocMes,
        cambiarVistaVentasClientes,
        mostrarVentanaEmergenteCredito
    }
}
