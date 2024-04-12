import { useContext, useEffect, useState } from "react"
import HttpResumenVenta from '../api/HttpResumenVenta'
import HttpGeneral from '../api/Http'
import { tokenContext } from "../context/Context"
import curencyformatter from 'currency-formatter'
import moment from "moment/moment"
import {helpers} from '../helpers/helpers'
import { Alert } from "react-native"
import {variableInicial}  from '../helpers/variableGlobal'

export const useResumenVentas = () => {
  const [datosGrafico, setDatosGrafico] = useState(variableInicial.datosGrafico)
  const [ejeXGrafico, setEjeXGrafico] = useState([])
  const [listaPlantas, setListaPlantas] = useState([])
  const [tipoDeGrafico, setTipoDeGrafico] = useState('7D')
  const [valoresResumenVenta, setValoresResumenVenta] = useState([])
  const [totalResumenVenta, setTotalResumenVenta] = useState(variableInicial.totalResumenVenta)
  const [tooltipPos, setTooltipPos] = useState(variableInicial.tooltipPos)
  const [puntoSeleccionado, setPuntoSeleccionado] = useState(variableInicial.puntoSeleccionado)
  const [valores, setValores] = useState(variableInicial.valoresResumenVentas)
  const [filtro, setFiltro] = useState(variableInicial.filtroResumenVentas)
  const [filtroFalso, setFiltroFalso] = useState(variableInicial.filtroResumenVentas)
  const [nombreTablaVentas, setNombreTablaVentas] = useState({
      columna1: 'Contado',
      columna2: 'Credito'
  })

  const [fechaInicialVisible, setFechaInicialVisible] = useState(false)
  const [fechaFinalVisible, setFechaFinalVisible] = useState(false)
  const [tablaInicial, setTablaInicial] = useState(true)
  const [verModalFiltro, setVerModalFiltro] = useState(false)
  const [verCargaTabla, setVerCargaTabla] = useState(false)
  const [verCargaGrafico, setVerCargaGrafico] = useState(false)
  const [update, setUpdate] = useState(false)

  const {token} = useContext(tokenContext)
  const {obtenerNombreDelDiaIngles, obtenerNombreDelMesIngles} = helpers()

  useEffect(() => {
    funcSeleccionarTipoGrafico('7D')
    funcListaPlantas()
  }, [])
  
  const funcListaPlantas = async () => {
    setTablaInicial(true)
    setVerCargaTabla(false)
    const plantas = await HttpGeneral.listaPlantas(token)
    if(plantas.error){
      setListaPlantas([])  
      setTotalResumenVenta(variableInicial.totalResumenVenta)
      setVerCargaTabla(true)
      return
    }
    setListaPlantas(plantas)
    setTotalResumenVenta(variableInicial.totalResumenVenta)
    setVerCargaTabla(true)
  }

  const funcFiltrarResumenVenta = async(valoresGrafico = false, graficoTipo = '', graficoFecha1 = '', graficoFecha2 = '') => {
    let nuevoTipo = ''
    let nuevaFecha1 = ''
    let nuevaFecha2 = ''
    if(valoresGrafico){
      nuevoTipo = graficoTipo, 
      nuevaFecha1 = graficoFecha1, 
      nuevaFecha2 = graficoFecha2
    }else{
      setTooltipPos(variableInicial.tooltipPos)
      const {fecha1, fecha2, tipo} = filtro
      nuevoTipo = tipo
      nuevaFecha1 = fecha1
      nuevaFecha2 = fecha2
    }
    if(moment(nuevaFecha2).diff(nuevaFecha1, 'days') < 0){
      Alert.alert('Mensaje', 'Ingresar de manera correcta el rango de fecha.')
      return
    }
    setFiltroFalso(filtro)
    setValoresResumenVenta([])
    setTotalResumenVenta(variableInicial.totalResumenVenta)
    setVerCargaTabla(false)
    setNombreTablaVentas({columna1: (nuevoTipo === 'TIPOCLIENTE') ? 'Propias' : 'Credito', columna2: (nuevoTipo === 'TIPOCLIENTE') ? 'Terceros' : 'Contado'})
    setVerModalFiltro(false)
    const resultado = await HttpResumenVenta.resumenDeVenta(token, moment(nuevaFecha1).format('YYYY-MM-DD'), moment(nuevaFecha2).format('YYYY-MM-DD'), nuevoTipo)
    resultado.map(value => ((
      value.valor_cont_terce = curencyformatter.format(value.cont_terce, {code:'', precision: 0}),
      value.valor_cred_Propi =  curencyformatter.format(value.cred_Propi, {code:'', precision: 0}),
      value.valor_total =  curencyformatter.format(value.total, {code:'', precision: 0})
    )))
    let propias_credito = resultado.reduce((a, b) => a + (b['cred_Propi'] || 0), 0);
    let terceros_contado = resultado.reduce((a, b) => a + (b['cont_terce'] || 0), 0);
    let total = resultado.reduce((a, b) => a + (b['total'] || 0), 0);
    propias_credito = curencyformatter.format((propias_credito), {code:'', precision: 0})
    terceros_contado = curencyformatter.format((terceros_contado), {code:'', precision: 0})
    total = curencyformatter.format((total), {code:'', precision: 0})
    setValoresResumenVenta(resultado)
    setTotalResumenVenta({propias_credito, terceros_contado, total})
    setTablaInicial(false)
    setVerCargaTabla(true)
  }

  const funcSeleccionarTipoGrafico = async (valor) => {
      funcListaPlantas()
      setVerCargaGrafico(false)
      setTooltipPos({ x: 0, y: 0, visible: false, value: 0 })
      setPuntoSeleccionado({valor: -1, indice: -1})
      setTipoDeGrafico(valor)
      let ejeXGraficoNuevo = []
      if(valor === '7D'){
        let dia = obtenerNombreDelDiaIngles(moment().format('dddd'))
        ejeXGraficoNuevo.push(dia.corto)
        for (let index = 1; index < 7; index++) {
          let dia = obtenerNombreDelDiaIngles(moment().add(-index, 'days').format('dddd'))
          ejeXGraficoNuevo.push(dia.corto)
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
      setEjeXGrafico(ejeXGraficoNuevo.reverse())
      const res = await HttpResumenVenta.resumenDeVentaGrafico(token, valor)
      if(res.error){
        Alert.alert('Mensaje', res.error)
        setDatosGrafico(variableInicial.datosGrafico)
        setVerCargaGrafico(true)
        return
      }
      let nuevoArreglo = []
      for (let index = 0; index < 7; index++) {
        nuevoArreglo.push({
          FechaF: res[2]['periodo_'+index],
          fechaI: res[1]['periodo_'+index],
          valor: res[0]['periodo_'+index],
          id: index+1
        })
      }
      setDatosGrafico(nuevoArreglo.reverse())
      setVerCargaGrafico(true)
  }

  const funcSeleccionarPunto = ({value, index}) => {
      if(value === null) return
      setPuntoSeleccionado({valor: value, indice: index})
      let extraerDatos = datosGrafico.find((valores, indice) => valores.valor === value && indice === index)
      
      let fechaI = new Date(extraerDatos.fechaI)
      fechaI.setMinutes(fechaI.getMinutes() + fechaI.getTimezoneOffset())

      let FechaF = new Date(extraerDatos.FechaF)
      FechaF.setMinutes(FechaF.getMinutes() + FechaF.getTimezoneOffset())
      
      setValores(extraerDatos)

      setFiltro({...filtro, 'fecha2': FechaF, 'fecha1':fechaI})

      funcFiltrarResumenVenta(true, filtro.tipo, extraerDatos.fechaI, extraerDatos.FechaF)
  }

  const functCambiarTipoFiltro = (valor) => {
    setFiltro({...filtro, 'tipo': valor})
  }

  const funcCerrarModalFiltro = () => {
    setFiltro(filtroFalso)
    setVerModalFiltro(false)
  }

  const funcAbrrirModalFiltro = () => {
    setVerModalFiltro(true)
  }

  const funcCambiarFiltroFechaInicial = (event, selectedDate) =>{
    setFechaInicialVisible(false)
    if(event.type === 'set'){
      const currentDate = selectedDate || filtro.fecha1
      setFiltro({...filtro, 'fecha1': currentDate})
      setUpdate(!update)
    }
  }

  const funcCambiarFiltroFechaFinal = (event, selectedDate) =>{
    setFechaFinalVisible(false)
    if(event.type === 'set'){
      const currentDate = selectedDate || filtro.fecha2;
      setFiltro({...filtro, 'fecha2': currentDate})
      setUpdate(!update)
    }
  }

  const abrirCalendarioInicial = () => {
    setFechaInicialVisible(true)
  }

  const abrirCalendarioFinal = () => {
    setFechaFinalVisible(true)
  }

  return {
    nombreTablaVentas,
    tablaInicial,
    listaPlantas,
    totalResumenVenta,
    filtro,
    valoresResumenVenta,
    datosGrafico,
    tipoDeGrafico,
    puntoSeleccionado,
    valores,
    ejeXGrafico,
    tooltipPos,
    verModalFiltro,
    verCargaTabla,
    verCargaGrafico,
    fechaInicialVisible,
    fechaFinalVisible,
    abrirCalendarioInicial,
    abrirCalendarioFinal,
    funcCambiarFiltroFechaInicial,
    setTooltipPos,
    funcFiltrarResumenVenta,
    funcSeleccionarPunto,
    funcSeleccionarTipoGrafico,
    funcAbrrirModalFiltro,
    funcCerrarModalFiltro,
    functCambiarTipoFiltro,
    funcCambiarFiltroFechaFinal
  }

}
