import { useContext, useEffect, useState } from "react"
import moment from 'moment'

import {variableInicial} from '../helpers/variableGlobal'
import { tokenContext } from "../context/Context"
import httpTopAsesores from  '../api/HttpRankingAsesor'
import { Alert } from "react-native"
import { helpers } from "../helpers/helpers"

export const useTopRankingAsesor = () => {

    const [topRankingAsesores, setTopRankingAsesores] = useState(variableInicial.topRankingAsesores)
    const [filtro, setFiltro] = useState(variableInicial.filtroTopRankingAsesor)
    const [filtroCancelado, setFiltroCancelado] = useState(variableInicial.filtroTopRankingAsesor)
    const [valoresFiltro, setValoresFiltro] = useState(variableInicial.filtroTopRankingAsesor)
    const [mesPeriodo, setMesPeriodo] = useState(variableInicial.mesPeriodo)
    const [asesorSelecccionado, setAsesorSeleccionado] = useState([])
    const [documentosAsesor, setDocumentosAsesor] = useState([])
    const [vistaModalFiltro, setVistaModalFiltro] = useState(false)
    const [visibleCarga, setVisibleCarga] = useState(true)
    const [visibleModalDocsAsesor, setVisibleModalDocsAsesor] = useState(false)
    const [visibleCardaModalDocAsesor, setVisibleCargaModalDocAsesor] = useState(true)

    const [visibleCargaFinalFlatList, setVisibleCargaFinalFlatList] = useState(true)

    const {token} = useContext(tokenContext)
    const {obtenerNombreMesCompleto, obtenerNumeroDelMes} = helpers()

    useEffect(() => {
      funcTopRanking()
    }, [])    

    const funcTopRanking = async() => {
      setVisibleCarga(true)
      const {periodo, crecimiento, tipoCliente} = filtro
      setFiltroCancelado(filtro)
      let tipoPeriodo = (periodo === '0' ? 'Actual' : 'Anterior')
      let tipoClienteDescripcion = (tipoCliente === '-') ? 'Todos' : (tipoCliente === '01') ? 'Terceros' : 'Propias'
      setValoresFiltro({periodo: tipoPeriodo, crecimiento: crecimiento, tipoCliente:tipoClienteDescripcion})

      if(periodo === '0'){
        const mes_2 = obtenerNombreMesCompleto(moment().subtract(1, 'months').format('M'))
        const mes_1 = obtenerNombreMesCompleto(moment().format('M'))
        setMesPeriodo({mes_2, mes_1})
      }else{
        const mes_2 = obtenerNombreMesCompleto(moment().subtract(2, 'months').format('M'))
        const mes_1 = obtenerNombreMesCompleto(moment().subtract(1, 'months').format('M'))
        setMesPeriodo({mes_2, mes_1})
      }

      const res = await httpTopAsesores.topAsesores(token, periodo, crecimiento, tipoCliente)
      if(res.error){
        Alert.alert('Mensaje', res.error)
        setTopRankingAsesores(variableInicial.topRankingAsesores)
        setVisibleCarga(false)
        return
      }
      res.map(value => (
        value.icon = (value.crecimiento < 0) ? 'close-circle-outline' : (value.crecimiento === 0) ? 'alert-circle-outline' : 'check-circle-outline',
        value.color = (value.crecimiento < 0) ? '#D2001A' : (value.crecimiento === 0) ? '#F8CB2E' : '#5BB318',
        value.colorTexto = (value.crecimiento < 0) ? '#990000' : '#325288',
        value.tipoCrecimiento = crecimiento
      ))

      setTopRankingAsesores(res)
      setVisibleCarga(false)
      setVisibleCargaFinalFlatList(true)
    }

    const funcAbrirModalFiltro = () => {
      setVistaModalFiltro(true)
    }

    const funcCerrarModalFiltro = () => {
      setFiltro(filtroCancelado)
      setVistaModalFiltro(false)
    }
    
    const funcAplicarFiltro = () => {
      setVistaModalFiltro(false)
      funcTopRanking()
    }

    const funcCambiarDatosFiltro = (nombre, texto) => {
      setFiltro({...filtro, [nombre]: texto})
    }

    const funcCargarFinalFlatList = () => {
      setVisibleCargaFinalFlatList(false)
    }

    const funcMostrarDocumentosPorAsesor = async (value, mes) => {
      setVisibleCargaModalDocAsesor(true)
      setVisibleModalDocsAsesor(true)
      let numeroDelMes = obtenerNumeroDelMes(mesPeriodo[mes].substring(0,3))      
      setAsesorSeleccionado({...value, mes: mesPeriodo[mes]})
      const resultado = await httpTopAsesores.documentosDeAsesores(token, value.id_asesor, filtro.tipoCliente, (numeroDelMes+1))
      if(resultado.error){
        setVisibleModalDocsAsesor(false)
        setVisibleCargaModalDocAsesor(true)
        setDocumentosAsesor([])  
        Alert.alert('Mensaje', resultado.error)
        return
      }
      resultado.map(value => value.fecha = moment(value.fecha).format('YYYY-MM-DD'))
      setDocumentosAsesor(resultado)
      setVisibleCargaModalDocAsesor(false)
    }
    const funcCerrarModalDocAsesor = () => {setVisibleModalDocsAsesor(false)}

    return {
      documentosAsesor,
      visibleCargaFinalFlatList,
      visibleCarga,
      topRankingAsesores,
      mesPeriodo,
      filtro,
      valoresFiltro,
      vistaModalFiltro,
      asesorSelecccionado,
      visibleModalDocsAsesor,
      visibleCardaModalDocAsesor,
      funcCambiarDatosFiltro,
      funcAbrirModalFiltro,
      funcCerrarModalFiltro,
      funcAplicarFiltro,
      funcCargarFinalFlatList,
      funcMostrarDocumentosPorAsesor,
      funcCerrarModalDocAsesor
    }
}
