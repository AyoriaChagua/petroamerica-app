import React, { useContext, useEffect, useRef, useState } from 'react'
import {SafeAreaView} from 'react-native-safe-area-context';
import { Dimensions, Text, View, ScrollView, RefreshControl, Alert, TouchableOpacity, StatusBar } from 'react-native'
import { VictoryAxis, VictoryBar, VictoryChart, VictoryGroup, VictoryLabel, VictoryLegend } from 'victory-native';
import { Button, Colors, Divider, Modal, Portal, Provider, ActivityIndicator } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import DateTimePiker from '@react-native-community/datetimepicker'
import { tokenContext } from '../context/Context'
import moment from 'moment';
import curencyformatter from 'currency-formatter'

import { Header } from '../components/Header'
import { helpers } from '../helpers/helpers';
import {RadioButtonComponent} from '../components/RadioButtonComponent'
import { HeaderModal } from '../components/HeaderModal';
import { ModalComponent } from '../components/ModalComponent';
import { IndicadorDeCarga } from '../components/IndicadorDeCarga';

import HttpGrafico from '../api/HttpGrafico'
import HttpRankingCliente from '../api/HttpRankingCliente'
import Http from '../api/Http'

import stylesGlobal from '../theme/stylesGlobal';

export const VentasTopClienteScreen = () => {
  
    const [listaVentasTop, setListaVentasTop] = useState([])
    const [filtro, setFiltro] = useState({
      fechaI: new Date(),
      fechaF: new Date(),
      tipoCliente: '01',
      condicionPago: '-',
      id_planta: '-',
      asesor: '-'
    })
    const [textoFiltro, setTextoFiltro] = useState({
      textoFechaI: moment(new Date()).format('DD-MM-YYYY'),
      textoFechaF: moment(new Date()).format('DD-MM-YYYY'),
      textoTipoCliente: '01',
      condicionPago: '-',
      planta: '-',
      asesor:'-'

    })
    const [listaPlantas, setListaPlantas] = useState([])
    const [listaAsesores, setListaAsesores] = useState([])
    const [modalFiltroVisible, setModalFiltroVisible] = useState(false)
    const [fechaInicialVisible, setFechaInicialVisible] = useState(false)
    const [fechaFinalVisible, setFechaFinalVisible] = useState(false)
    const [update, setUpdate] = useState(false)
    const [tipoVisualizacionDatos, setTipoVisualizacionDatos] = useState('01');
    const [cambiarEstado, setCambiarEstado] = useState(false);
    const [refrescarPagina, setRefrescarPagina] = useState(false)

    const [cargaGrafico, setCargaGrafico] = useState(false)
    const isMountedRef = useRef(null);

    const {token} = useContext(tokenContext)
    const {ResponsiveFont} = helpers()

    const GraficoTopVenta = async () =>{
      const {fechaI, fechaF, tipoCliente, id_planta, condicionPago, asesor} = filtro
      const res = await HttpGrafico.rankingMejoresClientes(token, moment(fechaI).format('YYYY-MM-DD'), moment(fechaF).format('YYYY-MM-DD'), tipoCliente, id_planta, condicionPago, asesor)
      if(res.error){
        Alert.alert('Mensaje', res.error)
        setUpdate(true)
        setListaVentasTop([])
        return
      }
      res.map((value, index) => ((value.indice = index+1, 
          value.formatTotal = curencyformatter.format(value.cantidad_Total, {code:'', precision:0}),
          value.formatGas = curencyformatter.format(value.cantidad_gas, {code:'', precision:0}),
          value.formatDie = curencyformatter.format(value.cantidad_die, {code:'', precision:0})  )))
      res.reverse()
      setListaVentasTop(res)
      let nombrePlanta = '-'
      let nombreAsesor = '-'
      if(id_planta !== '-'){
        let plantaEncontrada = listaPlantas.find(value => value.id_Planta === id_planta)
        nombrePlanta = plantaEncontrada.descripcion
      }else nombrePlanta = '-'
      if(asesor !== '-'){
        let asesorEncontrado = listaAsesores.find(value => value.id_Asesor === asesor)
        nombreAsesor = asesorEncontrado.nombre
      }else nombreAsesor = '-'
      setTextoFiltro({
        textoFechaI: moment(fechaI).format('DD-MM-YYYY'),
        textoFechaF: moment(fechaF).format('DD-MM-YYYY'),
        textoTipoCliente: tipoCliente,
        planta:nombrePlanta,
        condicionPago:(condicionPago === '-') ? '-' : (condicionPago === '1') ? 'CREDITO' : 'CONTADO',
        asesor:nombreAsesor
      })
      setUpdate(true)
    }

    useEffect(() => {
      isMountedRef.current = true;
      listarPlantasAsesores()
      return () => isMountedRef.current = false;
    }, [])

    const listarPlantasAsesores = async () => {
      const respuesta = await Promise.all([Http.listaPlantas(token), HttpRankingCliente.listaAsesores(token)])
      let resListaPlanta = respuesta[0]
      let resAsesores = respuesta[1] 

      if(resListaPlanta.error || resAsesores.error){
        Alert.alert('Mensaje', resListaPlanta.error || resAsesores.error)
        setUpdate(true)
        setListaVentasTop([])
        return
      }
      setListaPlantas(resListaPlanta)
      setListaAsesores(resAsesores)
      GraficoTopVenta()
    }
    
    const cambiarFiltroFechaInicial = (event, selectedDate) =>{
      setFechaInicialVisible(false)
      if(event.type == 'set'){
        const currentDate = selectedDate || filtro.fechaI;
        setFiltro({...filtro, 'fechaI': currentDate})
        setCambiarEstado(true)
      }
    }

    const cambiarFiltroFechaFinal = (event, selectedDate) =>{
      const {fechaI} = filtro
      setFechaFinalVisible(false)
      if(event.type == 'set'){
        const currentDate = selectedDate || filtro.fechaI;
        let fDate = new Date(currentDate)
        let fechaFormada = moment(fDate).format('YYYY-MM-DD')
        let diffDias = moment(fechaFormada).diff(fechaI, 'days')
        if(diffDias < 0){
          setFiltro({...filtro, 'fechaF': new Date()})
        }else{
          setFiltro({...filtro, 'fechaF': currentDate})
        }
        setCambiarEstado(true)
      }
    }

    const aplicarFiltro = () => {
      setUpdate(false)
      GraficoTopVenta()
      setModalFiltroVisible(false)
    }

    const refrescar = () => {
      setRefrescarPagina(true)
      setTimeout(() => {
        setUpdate(false)
        setRefrescarPagina(false)
        GraficoTopVenta()
      }, 1500);
    }

    const cambiarTipoGrafico = (tipo) => {
      setCargaGrafico(true)
      setTipoVisualizacionDatos(tipo)   
      setTimeout(() => {
        setCargaGrafico(false)
      }, 1000);
    }
    const cerrarModalFiltro = () => setModalFiltroVisible(false)
    const abrirModalFiltro = () => setModalFiltroVisible(true)
    const abrirCalendarioInicial = () => setFechaInicialVisible(true)
    const abrirCalendarioFinal = () => setFechaFinalVisible(true)

    const Rendergrafico = () => {
      if(!update){
        return (
          <IndicadorDeCarga height={50} size={18}/>
        )
      }
      
      if(listaVentasTop.length > 0){
        return (
          <>
            <View>
              <View style={{flexDirection:'row'}}>
                <Text style={{fontSize:ResponsiveFont(12)}}>Del: </Text>
                <Text style={{fontSize: ResponsiveFont(12), fontWeight:'bold', color: '#325288'}}>{textoFiltro.textoFechaI}</Text>
                <Text style={{fontSize:ResponsiveFont(12)}}> al: </Text>
                <Text style={{fontSize: ResponsiveFont(12), fontWeight:'bold', color: '#325288'}}>{textoFiltro.textoFechaF}</Text>
              </View>
              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <View style={{flex:1}}>
                  <View style={{flexDirection:'row'}}>
                    <Text style={{fontSize:ResponsiveFont(12)}}>Tipo de Cliente: </Text>
                    <Text style={{fontSize: ResponsiveFont(12), fontWeight:'bold', color: '#325288'}}>{(textoFiltro.textoTipoCliente === '02') ? 'PROPIAS' : 'TERCEROS'}</Text>
                  </View>
                  <View style={{flexDirection:'row'}}>
                  <Text style={{fontSize:ResponsiveFont(12)}}>Tipo de Pago: </Text>
                    <Text style={{fontSize: ResponsiveFont(12), fontWeight:'bold', color: '#325288'}}>{(textoFiltro.condicionPago === '-') ? 'TODOS' : textoFiltro.condicionPago}</Text>
                  </View>
                </View>
                <View style={{flex:1}}>
                  <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
                    <Text style={{fontSize:ResponsiveFont(12)}}>Planta: </Text>
                    <Text style={{fontSize: ResponsiveFont(12), fontWeight:'bold', color: '#325288'}}>{(textoFiltro.planta === '-') ? 'TODOS': textoFiltro.planta}</Text>
                  </View>
                  <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
                    <Text style={{fontSize:ResponsiveFont(12)}}>Asesor: </Text>
                    <Text numberOfLines={2} style={{fontSize: ResponsiveFont(12), fontWeight:'bold', color: '#325288'}}>{(textoFiltro.asesor === '-') ? 'TODOS': textoFiltro.asesor}</Text>
                  </View>
                </View>
              </View>

            </View>
            <View style={{alignItems:'center'}}>
              {
                (!cargaGrafico)
                  ?
                    <VictoryChart domainPadding={20} height={Dimensions.get('window').height/1.5} >
                      <VictoryAxis dependentAxis style={{ tickLabels: {fontSize: ResponsiveFont(10)} }}/>
                      <VictoryAxis  style={{ tickLabels: {fontSize: ResponsiveFont(10)} }} />
                        {
                          (tipoVisualizacionDatos === '02')
                            ?
                              <VictoryLegend
                                x={(Dimensions.get('window').width/2)-60}
                                y={10}
                                orientation="horizontal"
                                gutter={20}
                                data={[ {name:'GASHOLES', symbol:{fill:'#36AE7C' }}, {name:'DIESEL', symbol:{fill:'#7F8487'}} ]} 
                                style={{ labels: {fontSize: ResponsiveFont(12) } }}
                              />
                            : <VictoryLegend
                                x={(Dimensions.get('window').width/2)-50}
                                y={10}
                                orientation="horizontal"
                                gutter={20}
                                data={[ {name:'Total', symbol:{fill:'#35858B' }} ]} 
                                style={{ labels: {fontSize: ResponsiveFont(12) } }}
                              />
                        }
                        {
                          (tipoVisualizacionDatos === '02')
                            ?
                              <VictoryGroup horizontal offset={16}>                 
                                <VictoryBar horizontal 
                                  style={{ data: { fill: "#36AE7C" } }}
                                  data={listaVentasTop}
                                  x={(d)=>d.indice.toString()}
                                  y="cantidad_gas"
                                  barWidth={15}
                                  labels={({ datum }) => datum.formatGas}
                                  labelComponent={
                                    <VictoryLabel
                                      style={[
                                          { fill: "#36AE7C", fontSize: 11 }
                                      ]}
                                    />
                                  }
                                />
                                <VictoryBar horizontal
                                  style={{ data: { fill: "#7F8487" } }}
                                  data={listaVentasTop}
                                  x={(d)=>d.indice.toString()}
                                  y="cantidad_die"
                                  barWidth={15}
                                  labels={({ datum }) => datum.formatDie}
                                  labelComponent={
                                    <VictoryLabel
                                      style={[
                                        { fill: "#7F8487", fontSize: 11 }
                                      ]}
                                    />
                                  }
                                />
                              </VictoryGroup>
                            : 
                              <VictoryGroup horizontal offset={16}>                 
                                <VictoryBar horizontal 
                                  style={{ data: { fill: "#35858B" } }}
                                  data={listaVentasTop}
                                  x={(d)=>d.indice.toString()}
                                  y="cantidad_Total"
                                  barWidth={23}
                                  labels={({ datum }) => datum.formatTotal}
                                  labelComponent={
                                    <VictoryLabel
                                      style={[
                                          { fill: "#35858B", fontSize: 11 }
                                      ]}
                                    />
                                  }
                                />
                              </VictoryGroup>
                        }
                    </VictoryChart>
                  : <IndicadorDeCarga height={Dimensions.get('window').height/1.5} size={18}/>
              }
            </View>
            <View style={{flex:1, marginTop:-5}}>
              <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:5}}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                  <RadioButtonComponent status={tipoVisualizacionDatos} checkFuncion={()=>cambiarTipoGrafico('01')} texto="Total" valor="01"/>
                  <View style={{width:10}}/>
                  <RadioButtonComponent status={tipoVisualizacionDatos} checkFuncion={()=>cambiarTipoGrafico('02')} texto="Die y Gas" valor="02"/>
                </View>
              </View>
              {
                listaVentasTop.map((value, index) => {
                  return(
                    <Text key={index} style={{fontSize:ResponsiveFont(12)}}>{value.indice}.- {value.cliente}</Text>
                  )
                  }).reverse()
              }  
            </View>
          </>
        )
      }else{
        return (
          <View style={{flex:1}}>
            <Text style={{fontSize:ResponsiveFont(12)}}>Sin registro por mostrar</Text>
          </View>
        )
      }
    }

    return (
      <Provider>
      <SafeAreaView style={{flex:1}}>
          <StatusBar backgroundColor="#325288" />
          <Header tipoMenu='drawer' titulo='Ranking de Mejores Clientes' botonDerecha={abrirModalFiltro} tituloCompleto={true}/>
          <ScrollView style={{flex:1}} disableScrollViewPanResponder={true} 
            refreshControl={ <RefreshControl refreshing={refrescarPagina} onRefresh={refrescar}/> }>
            <View style={stylesGlobal.viewGrafico}>
              <Rendergrafico/>
            </View>
          </ScrollView>

          <ModalComponent titulo={'Filtro'}
            esVisible={modalFiltroVisible} cerrarModal={cerrarModalFiltro}>
            <ScrollView style={{flexDirection:'column'}} disableScrollViewPanResponder={true}>
              <View>
                <Text style={{margin:5 ,fontSize:ResponsiveFont(12), fontWeight:'bold'}}>Fecha</Text>
                <View style={{flexDirection:'row'}}>
                  <View style={{flex:1, flexDirection:'column',alignItems:'center'}}>
                      <Text style={{margin:5 ,fontSize:ResponsiveFont(12)}}>{moment(filtro.fechaI).format('DD-MM-YYYY') || 'Inicial'}</Text>
                      <Button labelStyle={{fontSize:ResponsiveFont(11)}} icon="calendar-range" mode="contained" style={{marginHorizontal:5, backgroundColor:'#35858B'}} onPress={() => abrirCalendarioInicial()} compact={true} >
                        Fecha Inicial
                      </Button>
                  </View>
                  <View style={{flex:1, flexDirection:'column',alignItems:'center'}}>
                      <Text style={{margin:5 ,fontSize:ResponsiveFont(12)}}>{moment(filtro.fechaF).format('DD-MM-YYYY') || 'Final'}</Text>
                      <Button labelStyle={{fontSize:ResponsiveFont(11)}} icon="calendar-range" mode="contained" style={{marginHorizontal:5, backgroundColor:'#35858B'}} onPress={() =>  abrirCalendarioFinal()} compact={true} >
                        Fecha Final
                      </Button>
                  </View>
                  
                </View>
                {fechaInicialVisible && (
                    <DateTimePiker                    
                      testID="dateTimePicker"
                      display="default"
                      mode="date"
                      is24Hour={true}
                      value = {filtro.fechaI}
                      onChange={cambiarFiltroFechaInicial}
                    />
                )}
                {fechaFinalVisible && (
                    <DateTimePiker
                      testID="dateTimePicker"
                      display="default"
                      mode="date"
                      is24Hour={true}
                      value = {filtro.fechaF}
                      onChange={cambiarFiltroFechaFinal}
                    />
                )}
              </View>
              <Divider style={{marginVertical:10, borderColor:'#D8D8D8', borderWidth:0.5}}/>
              <View>
                <Text style={{margin:5 ,fontSize:ResponsiveFont(12), fontWeight:'bold'}}>Tipo de Cliente</Text>
                <View style={{marginLeft:15, flexDirection:'row', marginTop:5}}>
                  <View style={{flex:1, alignItems:'center'}}>
                    <RadioButtonComponent status={filtro.tipoCliente} checkFuncion={() => setFiltro({...filtro, 'tipoCliente': '02'})} texto="Propias" valor="02"/>
                  </View>
                  <View style={{flex:1, alignItems:'center'}}>
                    <RadioButtonComponent status={filtro.tipoCliente} checkFuncion={() => setFiltro({...filtro, 'tipoCliente': '01'})} texto="Terceros" valor="01"/>
                  </View>
                  <View style={{flex:1, alignItems:'center'}}/>
                </View>
              </View>
              <Divider style={{marginVertical:10, borderColor:'#D8D8D8', borderWidth:0.5}}/>
              <View>
                <Text style={{margin:5 ,fontSize:ResponsiveFont(12), fontWeight:'bold'}}>Tipo de Pago</Text>
                <View style={{marginLeft:15, flexDirection:'row', marginTop:5}}>
                  <View style={{flex:1, alignItems:'center'}}>
                    <RadioButtonComponent status={filtro.condicionPago} checkFuncion={() => setFiltro({...filtro, 'condicionPago': '-'})} texto="Todos" valor="-"/>
                  </View>
                  <View style={{flex:1, alignItems:'center'}}>
                    <RadioButtonComponent status={filtro.condicionPago} checkFuncion={() => setFiltro({...filtro, 'condicionPago': '1'})} texto="Credito" valor="1"/>
                  </View>
                  <View style={{flex:1, alignItems:'center'}}>
                    <RadioButtonComponent status={filtro.condicionPago} checkFuncion={() => setFiltro({...filtro, 'condicionPago': '0'})} texto="Contado" valor="0"/>
                  </View>
                </View>
              </View>
              <Divider style={{marginVertical:10, borderColor:'#D8D8D8', borderWidth:0.5}}/>
              <View>
                <Text style={{margin:5 ,fontSize:ResponsiveFont(12), fontWeight:'bold'}}>Planta</Text>
                <Picker mode="dropdown"
                  selectedValue={filtro.id_planta}
                  onValueChange={(itemValue, itemIndex) => {setFiltro({...filtro, 'id_planta': itemValue})}}
                  itemStyle={{fontSize:ResponsiveFont(12), height:100}}
                >
                  <Picker.Item style={{fontSize:ResponsiveFont(12)}} label="Todos" value="-"/> 
                  {
                    listaPlantas.map((value) =>{
                        return (
                            <Picker.Item style={{fontSize:ResponsiveFont(12)}} label={value.descripcion} value={value.id_Planta} key={value.id_Planta}/> 
                        )
                    })
                  }
                </Picker>
              </View>                      
              <Divider style={{marginVertical:10, borderColor:'#D8D8D8', borderWidth:0.5}}/>
              <View>
              <Text style={{margin:5 ,fontSize:ResponsiveFont(12), fontWeight:'bold'}}>Asesor</Text>
              <Picker mode="dropdown"
                selectedValue={filtro.asesor}
                onValueChange={(itemValue, itemIndex) => {setFiltro({...filtro, 'asesor': itemValue})}}
                itemStyle={{fontSize:ResponsiveFont(12), height:100}}
              >
                <Picker.Item style={{fontSize:ResponsiveFont(12)}} label="Todos" value="-"/> 
                {
                  listaAsesores.map((value) =>{
                      return (
                          <Picker.Item style={{fontSize:ResponsiveFont(12)}} label={value.nombre} value={value.id_Asesor} key={value.nombre}/> 
                      )
                  })
                }
              </Picker>
              </View> 
              <Divider style={{marginVertical:10, borderColor:'#D8D8D8', borderWidth:0.5}}/>
              <View>
              <Button  mode="outlined" color='white' style={{backgroundColor:'#005db2'}} labelStyle={{fontSize:ResponsiveFont(11)}} onPress={() => aplicarFiltro()}>
                    filtrar
                </Button>
              </View>
            </ScrollView>
          </ModalComponent>
           
      </SafeAreaView>
      </Provider>  
    )
    
}