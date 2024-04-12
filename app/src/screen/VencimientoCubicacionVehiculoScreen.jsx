import React, { useContext, useEffect, useRef, useState } from 'react'
import { Alert, Dimensions, FlatList, RefreshControl, ScrollView, StatusBar, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Picker } from '@react-native-picker/picker';
import { ActivityIndicator, Colors, Divider, Modal, Portal, Provider, Button, IconButton } from 'react-native-paper'
import { Header } from '../components/Header'
import { tokenContext } from '../context/Context'
import { helpers } from '../helpers/helpers'
import Http from '../api/Http'
import stylesGlobal from '../theme/stylesGlobal'
import { HeaderModal } from '../components/HeaderModal';
import moment from 'moment';
import { IndicadorDeCarga } from '../components/IndicadorDeCarga';
import { ModalComponent } from '../components/ModalComponent';

export const VencimientoCubicacionVehiculoScreen = () => {

    const [listaPlantas, setListaPlantas] = useState([])
    const [listaDoc, setListaDoc] = useState({ doc: [], planta: '' })
    const [estadoDoc, setEstadoDoc] = useState('')
    const [planta, setPlanta] = useState(undefined)
    const [filtroPlanta, setFiltroPlanta] = useState(undefined)
    const [verModalFiltro, setVerModalFiltro] = useState(false)
    const [refrescarPagina, setRefrescarPagina] = useState(false)
    const isMountedRef = useRef(null);

    const {token} = useContext(tokenContext)
    
    const {ResponsiveFont} = helpers()

    const listarPlantas = async () => {
        const arregloPlantas = await Http.listaPlantas(token)
        if(arregloPlantas.error){
            Alert.alert('Mensaje', arregloPlantas.error)
            return
        }
        setListaPlantas(arregloPlantas)
    }

    useEffect(() => {
        isMountedRef.current = true;
        listarPlantas()
        return () => isMountedRef.current = false;
    }, [])
  
    const filtrarDocumentosConSaldo = async () => {
        let idPlanta = filtroPlanta
        setVerModalFiltro(false)
        setEstadoDoc(true)
        const listar = await Http.tablaVencimientoCubicacionVehiculo(token, idPlanta)
        
        if(listar.error){
            Alert.alert('Mensaje', listar.error)
            return
        }
        
        listar.map(value => ((
            value.fecha_fin = moment(value.fecha_fin).format('DD-MM-YYYY'), 
            value.colorDias = (value.dias === 'V') ? '#E05D5D' : '#F8CB2E',
            value.icon = (value.dias === "V") ? 'close-circle-outline' : 'alert-circle-outline'
        )))
        
        let buscarPlanta = listaPlantas.find(element => element.id_Planta === idPlanta)
        setPlanta(idPlanta)
        setListaDoc({doc: listar, planta: buscarPlanta.descripcion})
        setEstadoDoc(false)
    }

    const agregarPlantaAlFiltro = (planta) => setFiltroPlanta(planta)
    const abrirModalPlanta = () =>  setVerModalFiltro(true)
    const cerrarModalPlanta = () => {
        if(!filtroPlanta){
            setVerModalFiltro(false)
            return
        }
        setFiltroPlanta(planta)
        setVerModalFiltro(false)
    }

    const refrescar = () => {
        setRefrescarPagina(true)
        setTimeout(() => {
            setRefrescarPagina(false)
            filtrarDocumentosConSaldo()
        }, 1500);
    }

    const renderItem = ({item}) =>{
        return(
            <>
                <View style={{flexDirection:'row', padding:3, backgroundColor: '#f2f9ff', alignItems:'center'}}>
                    <View style={{width:'15%'}}>
                        <Text numberOfLines={1} style={{fontSize:ResponsiveFont(11.5)}}>{item.placa}</Text>
                    </View>
                    <View style={{flex:1, paddingRight:5}}>
                        <Text style={{fontSize:ResponsiveFont(11.5)}}>{item.empresa_transporte}</Text>
                    </View>
                    <View style={{width:'20%'}}>
                        <Text numberOfLines={1} style={{fontSize:ResponsiveFont(11.5), textAlign:'center'}}>{item.fecha_fin}</Text>
                    </View>
                    <View style={{minWidth:50, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                        <Text numberOfLines={1} style={{fontSize:ResponsiveFont(11.5), textAlign:'center', color: item.colorDias, fontWeight:'bold'}}>{item.dias}</Text>
                        <Text>{' '}</Text>
                        <IconButton
                            style={{padding:0, margin:0}}
                            color= {item.colorDias} 
                            icon={item.icon}
                            size={ResponsiveFont(17)}
                        />
                    </View>
                 </View> 
                <Divider style={{borderWidth:0.12}}/>
            </>
        )
    }

    return (
        <Provider>
        <SafeAreaView style={{flex:1}}>
            <StatusBar backgroundColor="#325288" />
                <Header tipoMenu='drawer' titulo='Vencimiento Cubicación de Vehiculos' tituloCompleto botonDerecha={abrirModalPlanta}/>
                <View style={{marginTop:5, flex:1}}>
                    <View style={{left:10, flexDirection:'row', alignItems:'center'}}>
                        <Text>Planta: </Text> 
                        <Text style={{fontWeight:'bold'}}>{(listaDoc.planta || '-')}</Text>
                    </View>
                    <View style={{flexDirection:'row', marginTop:10, borderBottomColor: '#73777B', borderBottomWidth:1, padding:3}}>
                        <View style={{width:'15%', padding:2}}>
                            <Text  numberOfLines={1} style={{fontWeight:'bold',  fontSize:ResponsiveFont(12)}}>Placa</Text>
                        </View>
                        <View style={{flex:1, padding:2}}>
                            <Text  numberOfLines={1} style={{fontWeight:'bold', fontSize:ResponsiveFont(12)}}>Empresa Transporte</Text>
                        </View>
                        <View style={{width:'20%', padding:2}}>
                            <Text  numberOfLines={1} style={{fontWeight:'bold',  fontSize:ResponsiveFont(12), textAlign: 'center'}}>F. Venc</Text>
                        </View>
                        <View style={{ padding:2, minWidth:50}}>
                            <Text  numberOfLines={1} style={{fontWeight:'bold',  fontSize:ResponsiveFont(12), textAlign:'center'}}>Dias V.</Text>
                        </View>
                    </View>
                
                    {
                    (estadoDoc) 
                        ? <IndicadorDeCarga height={300} size={18} />
                        :   (listaDoc.doc.length > 0)
                                ?   
                                    <FlatList
                                        refreshControl={ <RefreshControl refreshing={refrescarPagina} onRefresh={refrescar}/> }
                                        data = {listaDoc.doc}
                                        keyExtractor={(value, index)=>index}
                                        renderItem={renderItem}
                                    />
                                :    <Text style={{left:10, fontSize:ResponsiveFont(12), opacity:0.4}}>No hay registros.</Text>
                    }  
                </View>

                <ModalComponent titulo={'Filtrar por Planta'}
                    cerrarModal={cerrarModalPlanta} esVisible={verModalFiltro}>
                    <ScrollView style={{flexDirection:'column'}} disableScrollViewPanResponder={true}>
                        <View>
                            <Text style={{fontWeight:'bold', fontSize:ResponsiveFont(12)}}>Planta</Text>
                            <Picker
                                mode='dropdown'
                                selectedValue={filtroPlanta}
                                onValueChange={(itemValue, itemIndex) => agregarPlantaAlFiltro(itemValue)}
                                itemStyle={{fontSize:ResponsiveFont(12), height:100}}
                                >
                                {
                                    listaPlantas.map(value => {
                                        return (
                                            <Picker.Item style={{fontSize:ResponsiveFont(12)}} label={value.descripcion} value={value.id_Planta} key={value.id_Planta}/> 
                                        )
                                    })
                                }
                            </Picker>
                        </View>
                        <Divider style={{marginBottom:10, height:1}}/>
                        <View style={{flexDirection:'row'}}>
                            <View style={{flex:1}}/>
                            <Button  mode="outlined" title='d' color='white' style={{backgroundColor:'#005db2'}} labelStyle={{fontSize:ResponsiveFont(11)}} onPress={() => {filtrarDocumentosConSaldo()}}>
                                filtrar
                            </Button>
                        </View>
                    </ScrollView>
                </ModalComponent>

        </SafeAreaView>
        </Provider>
    )
}
