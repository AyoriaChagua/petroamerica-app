import { useContext, useEffect, useState } from "react"
import curencyformatter from 'currency-formatter'
import { variableInicial } from "../helpers/variableGlobal"
import HttpResumenIngreso from '../api/HtttpResumenIngreso'
import { tokenContext } from "../context/Context";
import { helpers } from "../helpers/helpers";

import moment from "moment";

export const useResumenIngreso = () => {

    const [resumenVentas, setResumenVentas] = useState([])
    const [resumenVentasTabla, setResumenVentasTabla] = useState([])
    const [filtro, setFiltro] = useState(variableInicial.ResumenIngresoFiltro)
    const [tipoDeGrafico, setTipoDeGrafico] = useState('7D')

    const [totalTabla, setTotalTabla] = useState('')

    const [fechaInicialVisible, setFechaInicialVisible] = useState(false)
    const [fechaFinalVisible, setFechaFinalVisible] = useState(false)
    const [verModalFiltro, setVerModalFiltro] = useState(false)
    const [verCargaGrafica, setVerCargaGrafica] = useState(true)
    const [verTablaInicial, setVerTablaInicial] = useState(true)
    const [verCargaTabla, setVerCargaTabla] = useState(true)

    const {obtenerNombreDelDiaIngles, obtenerNombreDelMesIngles} = helpers()
    const {token} = useContext(tokenContext)

    useEffect(() => {
        listaResumenIngreso('7D')
    }, [])

    const listaResumenIngreso = async (valor) => {
        
        setVerCargaGrafica(true)
        setVerCargaTabla(true)
        setVerTablaInicial(true)
        let ejeXGraficoNuevo = []
        if(valor === '7D'){
            let dia = obtenerNombreDelDiaIngles(moment().format('dddd'))
            ejeXGraficoNuevo.push(dia.corto+'/'+moment().date())
            for (let index = 1; index < 7; index++) {
                let dia = obtenerNombreDelDiaIngles(moment().add(-index, 'days').format('dddd'))
                ejeXGraficoNuevo.push(dia.corto+'/'+moment().add(-index, 'days').date())
            }
        }else if(valor === '7M'){
            let mes = obtenerNombreDelMesIngles(moment().format('MMMM'))
            ejeXGraficoNuevo.push(mes.corto)
            for (let index = 1; index < 7; index++) {
                let mes = obtenerNombreDelMesIngles(moment().add(-index, 'month').format('MMMM'))
                ejeXGraficoNuevo.push(mes.corto)
            }
        }else{
            let ano = moment().format('YYYY')
            ejeXGraficoNuevo.push(ano)
            for (let index = 1; index < 7; index++) {
                let ano = moment().add(-index, 'year').format('YYYY')
                ejeXGraficoNuevo.push(ano)
            }
        }

        const resultado = await HttpResumenIngreso.ingresoResumen(token, valor)
        let nuevoArreglo = []
        if(resultado.error){
            for (let index = 0; index < 7; index++) {
                nuevoArreglo.push({
                    x: ejeXGraficoNuevo[index],
                    y: parseFloat(0),
                    id: index+1
                })
            }
            setResumenVentas(nuevoArreglo)
            setVerCargaGrafica(false)
            return
        }
        let total = 0
        for (let index = 0; index < 7; index++) {
            nuevoArreglo.push({
                x: ejeXGraficoNuevo[index],
                fechaF: resultado[2]['periodo_'+index],
                fechaI: resultado[1]['periodo_'+index],
                y: parseFloat(resultado[0]['periodo_'+index]),
                label: curencyformatter.format(resultado[0]['periodo_'+index], {code:'', precision:2}),
                id: index+1
            })
        }
        
        
        nuevoArreglo.reverse()
        setResumenVentas(nuevoArreglo)
        setVerCargaGrafica(false)
    }

    const funcSeleccionarGrafico = async (valor) => {
        const {fechaI, fechaF} = valor
        setVerTablaInicial(false)
        setVerCargaTabla(true)
        
        let fechaITransformado = new Date(fechaI)
        fechaITransformado.setMinutes(fechaITransformado.getMinutes() + fechaITransformado.getTimezoneOffset())

        let FechaFTransformado = new Date(fechaF)
        FechaFTransformado.setMinutes(FechaFTransformado.getMinutes() + FechaFTransformado.getTimezoneOffset())
        setFiltro({...filtro, fechaI: fechaITransformado, fechaF: FechaFTransformado})
        
        setVerModalFiltro(false)
        const resultado = await HttpResumenIngreso.ingresoResumenTabla(token, fechaI, fechaF)
        resultado.map(value => value.montoFormat = curencyformatter.format(parseFloat(value.monto), {code:'', precision:2}))
        if(resultado.error){
            setResumenVentasTabla([])
            setVerCargaTabla(false)
            setTotalTabla('')
            return
        }
        let sumaTotal = resultado.reduce((a, b) => a + (b['monto'] || 0), 0);
        setTotalTabla(curencyformatter.format(sumaTotal, {code:'', precision:2}))
        setResumenVentasTabla(resultado)
        setVerCargaTabla(false)
    }

    const funcIniciarModalFiltro = () => {
        setVerModalFiltro(true)
    }

    const funcOcultarModalFiltro = () => {
        setVerModalFiltro(false)
    }

    const funcCambiarDatosFiltro = (nombre, valor) => {
        setFiltro({...filtro, [nombre]: valor})
    }

    const funcSeleccionarTipoGrafico = (valor) => {
        setTipoDeGrafico(valor)
        listaResumenIngreso(valor)
    }

    const abrirCalendarioInicial = () => {
        setFechaInicialVisible(true)
    }
    
    const abrirCalendarioFinal = () => {
        setFechaFinalVisible(true)
    }

    const funcCambiarFiltroFechaInicial = (event, selectedDate) =>{
        setFechaInicialVisible(false)
        if(event.type === 'set'){
          const currentDate = selectedDate || filtro.fechaI
          setFiltro({...filtro, 'fechaI': currentDate})
        }
    }

    const funcCambiarFiltroFechaFinal = (event, selectedDate) =>{
        setFechaFinalVisible(false)
        if(event.type === 'set'){
            const currentDate = selectedDate || filtro.fechaF;
            setFiltro({...filtro, 'fechaF': currentDate})
        }
    }

    const funcAplicarFiltro = async () => {
        const {fechaI, fechaF} = filtro
        funcSeleccionarGrafico({fechaI: moment(fechaI).format('YYYY-MM-DD'), fechaF: moment(fechaF).format('YYYY-MM-DD')})
    }

    return {
        totalTabla,
        verCargaGrafica,
        resumenVentas,
        resumenVentasTabla,
        filtro,
        verModalFiltro,
        tipoDeGrafico,
        verTablaInicial,
        verCargaTabla,
        fechaInicialVisible,
        fechaFinalVisible,
        funcIniciarModalFiltro,
        funcOcultarModalFiltro,
        funcCambiarDatosFiltro,
        funcSeleccionarTipoGrafico,
        funcSeleccionarGrafico,
        abrirCalendarioInicial,
        abrirCalendarioFinal,
        funcCambiarFiltroFechaInicial,
        funcCambiarFiltroFechaFinal,
        funcAplicarFiltro
    }
}
