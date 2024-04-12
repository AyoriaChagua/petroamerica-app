export const variableInicial = {
    //SCREEN RESUMEN DE INGRESOS
    ResumenIngresoFiltro:{
      fechaI: new Date(),
      fechaF: new Date(),
      tipoCliente: '01'
    },

    //SCREEN RESUMEN DE VENTAS
    datosGrafico:[
        {
          id: 1,
          valor: 0,
          fecha1: '2022-09-14',
          fecha2: '2022-09-14',
        },
        {
          id: 2,
          valor: 0,
          fecha1: '2022-09-14',
          fecha2: '2022-09-14',
        },
        {
          id: 3,
          valor: 0,
          fecha1: '2022-09-14',
          fecha2: '2022-09-14',
        },
        {
          id: 4,
          valor: 0,
          fecha1: '2022-09-14',
          fecha2: '2022-09-14',
        },
        {
          id: 5,
          valor: 0,
          fecha1: '2022-09-14',
          fecha2: '2022-09-14',
        },
        {
          id: 6,
          valor: null,
          fecha1: '0-09-14',
          fecha2: '2022-09-14',
        },
        {
          id: 7,
          valor: 0,
          fecha1: '2022-09-14',
          fecha2: '2022-09-14',
        },
        {
          id: 8,
          valor: 0,
          fecha1: '2022-09-14',
          fecha2: '2022-09-14',
        }
    ],
    totalResumenVenta:{
        propias_credito: 0,
        terceros_contado: 0,
        total: 0
    },
    tooltipPos:{ x: 0, y: 0, visible: false, value: 0 },
    puntoSeleccionado:{
        valor: -1,
        indice: -1
    },
    filtroResumenVentas:{
        fecha1: new Date(),
        fecha2: new Date(),
        tipo: 'TIPOPAGO'
    },
    valoresResumenVentas:{
        id: 1,
        valor: 0,
        fecha1: '',
        fecha2: '',
    },

    //SCREEN TOP RANKING ASESOR
    topRankingAsesores: [],
    filtroTopRankingAsesor: { periodo: '0', crecimiento: 'porcentaje', tipoCliente: '01'},
    mesPeriodo: { mes_2: 'ENE', mes_1: 'ENE'}
}