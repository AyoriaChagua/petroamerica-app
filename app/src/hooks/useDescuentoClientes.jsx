import { useState, useRef, useContext, useEffect } from 'react'
import { Alert } from 'react-native'
import { tokenContext } from "../context/Context";
import moment from 'moment';
import Http from '../api/Http'

export const useDescuentoClientes = () => {

    //const [listaDescuentosFiltroBK, setListaDescuentosFiltroBK] = useState([])
    const [listArticulosFiltrados, setListArticulosFiltrados] = useState([])

    const [listas, setListas] = useState({
        listaDescuentos: [],
        listaDescuentosFiltroBK: [],
        listaDescuentosRender: [],
        listaPlantas: [],
        listaCondiciones: [],
        listaArticulosSubClase: [],
        listaArticulos: []
    })

    const [cantidadRenderizada, setCantidadRenderizada] = useState({
        cantidad: 8,
        termina: false
    })
    const [listaAlmacen, setListaAlmacen] = useState([])
    const [nuevaSolicitud, setNuevaSolicitud] = useState({
        id_descuento: 0,
        id_articulo_subclase: '',
        desc_almacen: '',
        desc_articulo: '',
        desc_condicion_pago: '',
        desc_planta: '',
        id_articulo_grupo: '',
        id_condicion_pago: '',
        id_planta: '',
        factor_con_igv: '',
        factor_sin_igv: '',
        id_moneda: '01',
        id_almacen: '',
        usuario_sistema: ''
    })

    const [filtro, setFiltro] = useState({ id_planta: '', id_condicion_pago: '', id_articulo_subclase: '', id_articulo_grupo: '', id_almacen: '' })
    const [helpers, setHelpers] = useState({ planta: 'none', condi_pago: 'none', articulo: 'none' })

    const [tipoModal, setTipoModal] = useState('01')
    const [mostrarModal, setMostrarModal] = useState(false)
    const [estadoSnackbar, setEstadoSnackbar] = useState(false)
    const [mostrarFAB, setMostrarFAB] = useState(false)
    const [mostrarModalFiltro, setMostrarModalFiltro] = useState(false)
    const [actualizar, setActualizar] = useState(false)
    const [estadoCarga, setEstadoCarga] = useState(false)

    const { token, cliente, idUsuario } = useContext(tokenContext)
    const correlativoNuevasSolicitudes = useRef(0)
    const procesoGrabarDescuento = useRef('none')
    const isMountedRef = useRef(null);

    useEffect(() => {
        isMountedRef.current = true;
        setEstadoCarga(false)
        const listar = async () => {
            let resListaDescuentos = Http.listaDescuentosActuales(token, cliente.id_cliente)
            let resListaPlanta = Http.listaPlantas(token)
            let resListaCondicion = Http.listaCondicionPagos(token, cliente.id_cliente)
            let resListaArticuloSubClase = Http.listarArticulosSubClase(token)
            let resListaArticulo = Http.listaArticulos(token, cliente.id_cliente)
            const response = await Promise.all([resListaDescuentos, resListaPlanta, resListaCondicion, resListaArticuloSubClase, resListaArticulo])
            if (response[0].error || response[1].error || response[2].error || response[3].error || response[4].error) {
                Alert.alert('Mensaje', response[0].error || response[1].error || response[2].error || response[3].error || response[4].error + "\nSalir y volver a intentar.")
                return
            }
            response[0].map(value => value.flagModificacion = '0')
            response[4].map(value => value.id_articulo_grupo = value.id_articulo)

            let primeraRenderizacion = response[0].slice(0, cantidadRenderizada.cantidad)

            setListas({
                listaDescuentos: response[0],
                listaDescuentosFiltroBK: response[0],
                listaDescuentosRender: primeraRenderizacion,
                listaPlantas: response[1],
                listaCondiciones: response[2],
                listaArticulosSubClase: response[3],
                listaArticulos: response[4]
            })

            setEstadoCarga(true)
        }
        listar()
        return () => isMountedRef.current = false;
    }, [cliente])

    const incrementarREnderizado = () => {
        let cantidadTotalListas = listas.listaDescuentosFiltroBK.length
        let cantidadRenderizado = cantidadRenderizada.cantidad

        if (cantidadTotalListas <= 8 || cantidadTotalListas <= cantidadRenderizado) {
            setCantidadRenderizada({ cantidad: cantidadTotalListas, termina: true })
            return
        }
        let cantidadSiguiente = cantidadRenderizado + 8
        let nuevaLista = listas.listaDescuentosFiltroBK.slice(0, cantidadSiguiente)
        setCantidadRenderizada({ cantidad: cantidadSiguiente, termina: false })
        setListas({ ...listas, listaDescuentosRender: nuevaLista })
        setActualizar(!actualizar)

    }

    const modalActualizarDescuento = (val, rowMap) => {
        filtrarListaAlmacen(val.item.id_planta)
        filtrarListaArticulos(val.item.id_articulo_subclase)
        setTipoModal('02')
        setNuevaSolicitud(val.item)
        setMostrarModal(true)
        cerrarFila(rowMap, val.index)
    }

    const eliminarSolicitud = (val, rowMap) => {
        let nuevoDescuento = listas.listaDescuentos
        let indexSolicitud = nuevoDescuento.findIndex(value => value.id_descuento === val.item.id_descuento)
        nuevoDescuento.splice(indexSolicitud, 1)
        let nuevaListaRenderizada = nuevoDescuento.slice(0, cantidadRenderizada.cantidad)
        setListas({ ...listas, listaDescuentosFiltroBK: nuevoDescuento, listaDescuentosRender: nuevaListaRenderizada })
        cerrarFila(rowMap, val.index)
        setActualizar(!actualizar)
    }

    const cerrarFila = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    }

    const cerrarModal = () => {
        setTipoModal('01')
        setMostrarModal(false)
    }

    const agregarDatosASolicitud = (itemValue, id) => {

        if (id === 'id_planta') {
            let resPlanta = listas.listaPlantas.find(value => value.id_Planta === itemValue)
            if (!resPlanta) {
                return
            }
            setNuevaSolicitud({
                ...nuevaSolicitud,
                ['id_planta']: resPlanta.id_Planta,
                ['desc_planta']: resPlanta.descripcion
            })
            filtrarListaAlmacen(itemValue)
        }

        if (id === 'id_condicion_pago') {
            let resCondicionPago = listas.listaCondiciones.find(value => value.id_Condicion_Pago === itemValue)
            if (!resCondicionPago) {
                return
            }
            setNuevaSolicitud({ ...nuevaSolicitud, ['id_condicion_pago']: resCondicionPago.id_Condicion_Pago, ['desc_condicion_pago']: resCondicionPago.descripcion })
        }

        if (id === 'id_articulo_subclase') {
            let resArticuloSubClase = listas.listaArticulosSubClase.find(value => value.id_articulo_Subclase === itemValue)
            if (!resArticuloSubClase) {
                return
            }
            setNuevaSolicitud({
                ...nuevaSolicitud,
                ['id_articulo_subclase']: resArticuloSubClase.id_articulo_Subclase,
                ['id_articulo_grup']: null,
                ['desc_articulo']: null
            })
            filtrarListaArticulos(itemValue)
        }

        if (id === 'id_articulo_grupo') {
            let resArticulo = listArticulosFiltrados.find(value => value.id_articulo_grupo === itemValue)
            if (!resArticulo) {
                setNuevaSolicitud({ ...nuevaSolicitud, ['id_articulo_grupo']: null, ['desc_articulo']: null })
            } else {
                setNuevaSolicitud({ ...nuevaSolicitud, ['id_articulo_grupo']: resArticulo.id_articulo_grupo, ['desc_articulo']: resArticulo.descripcion_corta })
            }
        }

        if (id === 'id_almacen') {
            let resAlmacen = listaAlmacen.find(value => value.id_almacen === itemValue)
            if (!resAlmacen) {
                setNuevaSolicitud({ ...nuevaSolicitud, ['id_almacen']: null, ['desc_almacen']: null })
            } else {
                setNuevaSolicitud({ ...nuevaSolicitud, ['id_almacen']: resAlmacen.id_almacen, ['desc_almacen']: resAlmacen.descripcion })
            }
        }

        setActualizar(!actualizar)
    }

    const filtrarListaAlmacen = async (id_planta) => {
        if (id_planta != "") {
            let resAlmacen = await Http.listaAlmacen(token, id_planta)
            if (resAlmacen.error) {
                Alert.alert('Mensaje', resAlmacen.error)
                return
            }
            setListaAlmacen(resAlmacen)
        } else {
            setListaAlmacen([])
        }
    }

    const filtrarListaArticulos = (idSubClase) => {
        if (idSubClase != "") {
            let resultadoArticulos = listas.listaArticulos.filter(value => value.id_articulo_subclase === idSubClase)
            setListArticulosFiltrados(resultadoArticulos)
            setActualizar(!actualizar)
        } else {
            setListArticulosFiltrados([])
        }
    }

    const agregarPrecioIgv = (val) => {
        let valor_sin_igv = ""
        if (val !== "") valor_sin_igv = (parseFloat(val) / 1.18).toFixed(4)
        setNuevaSolicitud({ ...nuevaSolicitud, 'factor_con_igv': val, 'factor_sin_igv': valor_sin_igv })
    }

    const agregarSolicitud = (num) => {
        let solicitud = nuevaSolicitud
        if (solicitud.id_planta === '') {
            setHelpers({ planta: 'flex', condi_pago: 'none', articulo: 'none' })
            return false
        }
        if (solicitud.id_condicion_pago === '') {
            setHelpers({ planta: 'none', condi_pago: 'flex', articulo: 'none' })
            return false
        }
        if (solicitud.id_articulo_subclase === '') {
            setHelpers({ planta: 'none', condi_pago: 'none', articulo: 'flex' })
            return false
        }
        if (isNaN(solicitud.factor_con_igv)) {
            return false
        }
        setHelpers({ planta: 'none', condi_pago: 'none', articulo: 'none' })

        solicitud.flagModificacion = '1'
        solicitud.tipoOperacion = 'I'
        solicitud.id_descuento = correlativoNuevasSolicitudes.current
        let nuevaLista = listas.listaDescuentos
        nuevaLista.unshift(solicitud)
        let nuevaListaRenderizada = listas.listaDescuentos.slice(0, cantidadRenderizada.cantidad)
        setListas({ ...listas, listaDescuentos: nuevaLista, listaDescuentosRender: nuevaListaRenderizada, listaDescuentosFiltroBK: nuevaLista })
        aplicarFiltro()
        setMostrarModal(false)
        correlativoNuevasSolicitudes.current = correlativoNuevasSolicitudes.current + num
    }

    const actualizarDatos = () => {
        let descuentoaSolicitud = nuevaSolicitud
        if (descuentoaSolicitud.id_planta === '') {
            setHelpers({ planta: 'flex', condi_pago: 'none', articulo: 'none' })

            return false
        }
        if (descuentoaSolicitud.id_condicion_pago === '') {
            setHelpers({ planta: 'none', condi_pago: 'flex', articulo: 'none' })
            return false
        }
        if (descuentoaSolicitud.id_articulo_subclase === '') {
            setHelpers({ planta: 'none', condi_pago: 'none', articulo: 'flex' })
            return false
        }
        if (isNaN(descuentoaSolicitud.factor_con_igv)) {
            return false
        }
        setHelpers({ planta: 'none', condi_pago: 'none', articulo: 'none' })
        descuentoaSolicitud.flagModificacion = '1'
        descuentoaSolicitud.tipoOperacion = 'U'
        let indexSolicitud = listas.listaDescuentos.findIndex(value => value.id_descuento === descuentoaSolicitud.id_descuento)
        let nuevaListaDescuento = listas.listaDescuentos
        nuevaListaDescuento.splice(indexSolicitud, 1)
        nuevaListaDescuento.push(descuentoaSolicitud)
        nuevaListaDescuento.sort(function (a, b) { return parseInt(a.flagModificacion) - parseInt(b.flagModificacion) }).reverse()
        let nuevaListaRenderizada = listas.listaDescuentos.slice(0, cantidadRenderizada.cantidad)
        setListas({ ...listas, listaDescuentos: nuevaListaDescuento, listaDescuentosRender: nuevaListaRenderizada, listaDescuentosFiltroBK: nuevaListaDescuento })
        aplicarFiltro()
        setMostrarModal(false)
    }

    const hideSnackbar = () => {
        setEstadoSnackbar(false)
    }

    const estadoModalNuevaSolicitud = () => {
        setNuevaSolicitud({
            id_descuento: 0,
            id_articulo_subclase: '',
            desc_almacen: '',
            desc_articulo: '',
            desc_condicion_pago: '',
            desc_planta: '',
            id_articulo_grupo: '',
            id_condicion_pago: '',
            id_planta: '',
            factor_con_igv: '',
            factor_sin_igv: '',
            id_moneda: '01',
            id_almacen: '',
            usuario_sistema: ''
        })
        setHelpers({ planta: 'none', condi_pago: 'none', articulo: 'none' })
        setListaAlmacen([])
        setListArticulosFiltrados([])
        setTipoModal('01')
        setMostrarModal(true)
    }

    const desplegarFAB = () => {
        setMostrarFAB(!mostrarFAB)
    }

    const abrirFiltro = () => {
        if (filtro.id_planta === '') {
            filtrarListaAlmacen('')
        }
        if (filtro.id_articulo_grupo === '') {
            filtrarListaArticulos('')
        }
        setMostrarModalFiltro(true)
    }

    const cerrarModalFiltro = () => {
        setMostrarModalFiltro(false)
    }

    const agregarDatosFiltro = (item, valor) => {
        if (item === 'id_articulo_subclase') {
            setFiltro({ ...filtro, [valor]: item, [id_articulo_grupo]: '' })
        } else if (item === 'id_planta') {
            setFiltro({ ...filtro, [valor]: item, [id_almacen]: '' })
        } else {
            setFiltro({ ...filtro, [valor]: item })
        }
    }

    const aplicarFiltro = () => {
        const { id_planta, id_condicion_pago, id_almacen, id_articulo_grupo, id_articulo_subclase } = filtro
        if (id_planta === '' && id_condicion_pago === '' && id_almacen === '' && id_articulo_grupo === '' && id_articulo_subclase === '') {
            let nuevaLista = listas.listaDescuentos.slice(0, 8)
            setListas({ ...listas, listaDescuentosFiltroBK: listas.listaDescuentos, listaDescuentosRender: nuevaLista })
            setCantidadRenderizada({ cantidad: 8, termina: false })
            setMostrarModalFiltro(false)
            return
        }
        const nuevofiltro = listas.listaDescuentos.filter(value =>
            (value.id_planta !== null ? value.id_planta.indexOf(id_planta) !== -1 : true) &&
            (value.id_articulo_grupo !== null ? value.id_articulo_grupo.indexOf(id_articulo_grupo) !== -1 : true) &&
            (value.id_articulo_subclase !== null ? value.id_articulo_subclase.indexOf(id_articulo_subclase) !== -1 : true) &&
            (value.id_condicion_pago !== null ? value.id_condicion_pago.indexOf(id_condicion_pago) !== -1 : true) &&
            (value.id_almacen !== null ? value.id_almacen.indexOf(id_almacen) !== 1 : true)
        )
        let nuevaLista = nuevofiltro.slice(0, 8)
        setListas({ ...listas, listaDescuentosFiltroBK: nuevofiltro, listaDescuentosRender: nuevaLista })
        setCantidadRenderizada({ cantidad: 8, termina: false })
        setActualizar(!actualizar)
        setMostrarModalFiltro(false)
    }

    const limpiarFiltro = () => {
        setFiltro({ id_planta: '', id_condicion_pago: '', id_articulo_subclase: '', id_articulo_grupo: '', id_almacen: '' })
        let nuevaLista = listas.listaDescuentos.slice(0, 8)
        setListas({
            ...listas,
            listaDescuentosFiltroBK: listas.listaDescuentos,
            listaDescuentosRender: nuevaLista
        })
        setCantidadRenderizada({ cantidad: 8, termina: false })
        setMostrarModalFiltro(false)
    }

    const grabarDescuentos = async () => {
        let guardarDescuentos = listas.listaDescuentos.filter(value => ((value.flagModificacion === '1')))
        let JSONEnvio = []
        if (guardarDescuentos.length < 1) {
            return
        }
        procesoGrabarDescuento.current = 'flex'
        guardarDescuentos.forEach(element => {
            let arreglo = {}
            if (element.tipoOperacion === 'I') {
                arreglo.id_descuento = null
                arreglo.fecha_ini = moment().format('YYYY-MM-DD')
                arreglo.fecha_fin = moment().add(8, 'M').format('YYYY-MM-DD')
            } else {
                arreglo.id_descuento = element.id_descuento
                arreglo.fecha_ini = moment(element.fecha_ini).format('YYYY-MM-DD')
                arreglo.fecha_fin = moment(element.fecha_fin).format('YYYY-MM-DD')
            }
            arreglo.id_moneda = '01'
            arreglo.factor_con_igv = (element.factor_con_igv && element.factor_con_igv !== '') ? parseFloat(element.factor_con_igv) : 0.00
            arreglo.id_condicion_pago = element.id_condicion_pago
            arreglo.id_cliente = cliente.id_cliente
            arreglo.id_punto_venta = null
            arreglo.id_planta = element.id_planta
            arreglo.id_almacen = (element.id_almacen && element.id_almacen !== '') ? element.id_almacen : null
            arreglo.id_articulo_grupo = (element.id_articulo_grupo && element.id_articulo_grupo !== '') ? element.id_articulo_grupo : null
            arreglo.id_articulo_clase = 'COM'
            arreglo.id_articulo_subclase = (element.id_articulo_subclase && element.id_articulo_subclase !== '') ? element.id_articulo_subclase : null
            arreglo.id_estado = '01'
            arreglo.usuario_sistema = idUsuario.toLocaleUpperCase()
            JSONEnvio.push(arreglo)
        });
        const resDescuentos = await Http.grabarDescuentos(token, JSONEnvio)
        if (resDescuentos.error) {
            procesoGrabarDescuento.current = 'none'
            setActualizar(!actualizar)
            Alert.alert('Mensaje', resDescuentos.error + "\nIntentarlo Nuevamente.")
            return
        }
        Alert.alert('Mensaje', "Descuentos registrados Correctamente.")
        refrescar()
        procesoGrabarDescuento.current = 'none'
        setActualizar(!actualizar)
    }

    const refrescar = async () => {
        let resListaDescuentos = await Http.listaDescuentosActuales(token, cliente.id_cliente)
        if (resListaDescuentos.error) {
            Alert.alert('Mensaje', resListaDescuentos.error + "\nSalir y volver a intentar.")
            return
        }
        resListaDescuentos.map(value => value.flagModificacion = '0')
        setListas({ ...listas, listaDescuentos: resListaDescuentos })
        setListas({ ...listas, listaDescuentosFiltroBK: listas.listaDescuentos })
    }

    return {
        cliente,
        listas,
        cantidadRenderizada,
        listArticulosFiltrados,
        listaAlmacen,
        nuevaSolicitud,
        filtro,
        tipoModal,
        mostrarModal,
        estadoSnackbar,
        mostrarModalFiltro,
        estadoCarga,
        mostrarFAB,
        procesoGrabarDescuento,
        helpers,
        modalActualizarDescuento,
        eliminarSolicitud,
        incrementarREnderizado,
        cerrarModal,
        agregarDatosASolicitud,
        filtrarListaAlmacen,
        filtrarListaArticulos,
        agregarPrecioIgv,
        agregarSolicitud,
        actualizarDatos,
        hideSnackbar,
        estadoModalNuevaSolicitud,
        desplegarFAB,
        abrirFiltro,
        cerrarModalFiltro,
        agregarDatosFiltro,
        aplicarFiltro,
        limpiarFiltro,
        grabarDescuentos,
    }
}
