import React, { useState } from 'react'
import {SafeAreaView} from 'react-native-safe-area-context';
import { Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform, FlatList, StatusBar } from 'react-native'
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { ActivityIndicator, Button, Colors, Divider, FAB, HelperText, IconButton, Modal, Portal, ProgressBar, Provider, Snackbar } from 'react-native-paper'
import { Picker } from '@react-native-picker/picker';
import { Descuento } from '../components/Descuento';
import { Header } from '../components/Header';
import { useDescuentoClientes } from '../hooks/useDescuentoClientes';
import {helpers as Helpers} from '../helpers/helpers'
import stylesGlobal from '../theme/stylesGlobal';
import {HeaderModal} from '../components/HeaderModal'
import {ModalComponent} from '../components/ModalComponent'
import { IndicadorDeCarga } from '../components/IndicadorDeCarga';

export const DescuentosClienteScreen = () => {

    const [mostrarFAB, setMostrarFAB] = useState(false)

    const {
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
        //mostrarFAB,
        procesoGrabarDescuento,
        helpers,
        modalActualizarDescuento,
        eliminarSolicitud,
        cerrarModal,
        agregarDatosASolicitud,
        filtrarListaAlmacen,
        filtrarListaArticulos,
        agregarPrecioIgv,
        agregarSolicitud,
        actualizarDatos,
        hideSnackbar,
        estadoModalNuevaSolicitud,
        //desplegarFAB,
        abrirFiltro,
        cerrarModalFiltro,
        agregarDatosFiltro,
        aplicarFiltro,
        limpiarFiltro,
        grabarDescuentos,
        incrementarREnderizado,
    } = useDescuentoClientes()    
    const {ResponsiveFont} = Helpers()

    const renderItem = (val, rowMap) =>{
        return (
            <SwipeRow
                key={1}
                disableLeftSwipe={val.item.tipoOperacion === 'I'? false: true}
                rightOpenValue={-75}
                leftOpenValue={75}
            >
                <View style={styles.rowBack}>
                    <TouchableOpacity
                        style={[styles.backRightBtn, styles.backRightBtnLeft]}
                        onPress={() => modalActualizarDescuento(val, rowMap)}
                    >
                        <IconButton
                            icon = "file-edit-outline"
                            color = "white"
                            size = {20}
                        />
                        <Text style={styles.backTextWhite}>Editar</Text>

                    </TouchableOpacity>            

                    <TouchableOpacity
                        style={[styles.backRightBtn, styles.backRightBtnRight]}
                        onPress={() => eliminarSolicitud(val, rowMap)}
                    >
                        <IconButton
                            icon = "close"
                            color = "white"
                            size = {20}
                        />
                        <Text style={styles.backTextWhite}>Eliminar</Text>

                    </TouchableOpacity>
                </View>

                <View style={{backgroundColor: val.item.flagModificacion=== '1' ? '#E4EFE7' : 'white',height:80}}>
                    <Descuento  
                        key={val.index} 
                        data={val.item} 
                        index = {val.index}/>
                    <Divider style={{height:1.5}}/>
                </View>

            </SwipeRow>
        )
    }

    const busqueda = () => {
        incrementarREnderizado()
    }

    const desplegarFAB = () =>{ 
        setMostrarFAB(!mostrarFAB)
    }

    return (
        <SafeAreaView style={{flex:1}}>
            <Provider>
            <StatusBar backgroundColor="#325288" />
            <Header titulo={cliente.descripcion} tipoMenu='stack' botonDerecha={abrirFiltro} />
            <View style={styles.propiedadesEncabezado}>
                <View style={{flexDirection:'column'}}>
                    <View style={{ flexDirection:'row'}}>
                        <View style={{flex:4}}>
                            <Text  numberOfLines={1} style={{...styles.TextoEncabezado, fontSize:ResponsiveFont(12)}}>PLANTA</Text>
                        </View>
                        <View style={{flex:1}}>
                            <Text  numberOfLines={1} style={{...styles.TextoEncabezado, fontSize:ResponsiveFont(12)}}>-</Text>
                        </View>
                        <View style={{flex:4}}>
                            <Text  numberOfLines={1} style={{...styles.TextoEncabezado, fontSize:ResponsiveFont(12)}}>CONDICION</Text>
                        </View>
                        <View style={{flex:1}}>
                            <Text  numberOfLines={1} style={{...styles.TextoEncabezado, fontSize:ResponsiveFont(12)}}>-</Text>
                        </View>
                        <View style={{flex:4}}>
                            <Text numberOfLines={1}  style={{...styles.TextoEncabezado, fontSize:ResponsiveFont(12)}}>ARTICULO</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection:'row', marginTop: 10}}>
                        <View style={{flex:4}}>
                            <Text  numberOfLines={1} style={{...styles.TextoEncabezado, fontSize:ResponsiveFont(12)}}>SIN IGV</Text>
                        </View>
                        <View style={{flex:4}}>
                            <Text  numberOfLines={1} style={{...styles.TextoEncabezado, fontSize:ResponsiveFont(12)}}>ALMACEN</Text>
                        </View>
                        <View style={{flex:4, alignItems:'center'}}>
                            <Text  numberOfLines={1} style={{...styles.TextoEncabezado, fontSize:ResponsiveFont(12)}}>CON IGV</Text>
                        </View>
                    </View>
                </View>
            </View>
            {
            (estadoCarga)
                ?   listas.listaDescuentosRender.length > 0 
                        ?   <SwipeListView                                                     
                                onEndReached={busqueda}
                                onEndReachedThreshold={0.5}
                                ListFooterComponent={()=> 
                                    (!cantidadRenderizada.termina)
                                        ?    <IndicadorDeCarga height={50} size={18}/>
                                        :    null
                                }
                                renderItem={ renderItem }
                                data={listas.listaDescuentosRender} 
                                keyExtractor={ (item, index) => index.toString() }
                                style={ {backgroundColor:'white', height:Dimensions.get('screen').height} } 
                                contentContainerStyle={{ paddingBottom: 100 }}
                            /> 
                        :   <Text style={{fontSize:ResponsiveFont(12), left:15, top:15}}>No se encontraron resultado</Text>
                :
                    <IndicadorDeCarga height={300} size={18}/>
                // :   <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                //         <ActivityIndicator color={Colors.blue400}/>
                //     </View>

            }
            
            
                <Portal>
                    <FAB.Group
                        color='white'
                        fabStyle={{backgroundColor:'#005db2'}}
                        open={mostrarFAB}
                        icon={mostrarFAB ? 'close' : 'plus'}
                        actions={[
                            {
                                icon: 'file-send-outline',
                                label: 'Grabar Descuentos',
                                onPress: () => grabarDescuentos(),
                            },
                            {
                                icon: 'pencil-plus-outline',
                                label: 'Nuevo Descuento',
                                onPress: () => estadoModalNuevaSolicitud()
                            }
                        ]}
                        onStateChange={desplegarFAB}
                    />
                </Portal>
                        
                <ModalComponent 
                    titulo={(tipoModal === '01') ? 'Crear nuevo descuento' : 'Actualizar Descuento'}
                    esVisible={mostrarModal} cerrarModal={cerrarModal} esChico={false}
                >
                    <ScrollView style={{flexDirection:'column'}} disableScrollViewPanResponder={true}>
                        <View>
                            <Text style={{fontWeight:'bold', fontSize:ResponsiveFont(12)}}>Planta</Text>
                            <View style={{justifyContent:'center'}}>
                                <Picker mode="dialog"
                                    selectedValue={nuevaSolicitud.id_planta}
                                    onValueChange={(itemValue, itemIndex) => {agregarDatosASolicitud(itemValue, 'id_planta') }}
                                    itemStyle={{fontSize:ResponsiveFont(12), height:100}}
                                >
                                    <Picker.Item style={{fontSize:ResponsiveFont(12)}} label="Seleccionar" value="//"/> 
                                    {
                                        listas.listaPlantas.map((value) =>{
                                            return (
                                                <Picker.Item style={{fontSize:ResponsiveFont(12)}} label={value.descripcion} value={value.id_Planta} key={value.id_Planta}/> 
                                            )
                                        })
                                    }
                                </Picker>
                            </View>
                            <View style={{display:helpers.planta}}>
                                <HelperText type="error" visible={true}  padding='none' style={{margin:0}}>
                                    Debe seleccionar una Planta.
                                </HelperText>
                            </View>
                        </View>    

                        <Divider style={{marginVertical:5, height:1}}/>

                        <View>
                            <Text style={{fontWeight:'bold', fontSize:ResponsiveFont(12)}}>Condición de Pago</Text>
                            <View>
                                <Picker mode="dialog" 
                                    selectedValue={nuevaSolicitud.id_condicion_pago}
                                    onValueChange={(itemValue, itemIndex) => { agregarDatosASolicitud(itemValue, 'id_condicion_pago') }}
                                    itemStyle={{fontSize:ResponsiveFont(12), height:100}}
                                > 
                                    <Picker.Item style={{fontSize:ResponsiveFont(12)}} label="Seleccionar" value=""/> 
                                    {
                                    listas.listaCondiciones.map((value) =>{
                                        return (
                                            <Picker.Item style={{fontSize:ResponsiveFont(12)}} label={value.descripcion} value={value.id_Condicion_Pago} key={value.id_Condicion_Pago}/> 
                                        )
                                    })
                                    }
                                </Picker>
                            </View>
                            <View style={{display:helpers.condi_pago}}>
                            <HelperText type="error" visible={true}  padding='none' style={{margin:0}}>
                                Debe seleccionar una Condición de Pago.
                            </HelperText>
                        </View>
                        </View>

                        <Divider style={{marginVertical:5, height:1}}/>

                        <View>
                            <Text style={{fontWeight:'bold', fontSize:ResponsiveFont(12)}}>Articulo Sub Clase</Text>
                            <View>
                                <Picker mode="dialog" 
                                    selectedValue={nuevaSolicitud.id_articulo_subclase}
                                    onValueChange={(itemValue, itemIndex) => { agregarDatosASolicitud(itemValue, 'id_articulo_subclase') }}
                                    itemStyle={{fontSize:ResponsiveFont(12), height:100}}
                                > 
                                    <Picker.Item style={{fontSize:ResponsiveFont(12)}} label="Seleccionar" value=""/> 
                                    {
                                    listas.listaArticulosSubClase.map((value) =>{
                                        return (
                                            <Picker.Item style={{fontSize:ResponsiveFont(12)}} label={value.id_articulo_Subclase} value={value.id_articulo_Subclase} key={value.id_articulo_Subclase}/> 
                                        )
                                    })
                                    }
                                </Picker>
                            </View>
                            <View style={{display:helpers.articulo}}>
                                <HelperText type="error" visible={true}  padding='none' style={{margin:0}}>
                                    Debe seleccionar un Articulo Sub Clase.
                                </HelperText>
                            </View>
                        </View>

                        <Divider style={{marginVertical:5, height:1}}/>

                        <View>
                            <Text style={{fontWeight:'bold', fontSize:ResponsiveFont(12)}}>Articulo</Text>
                            <View>
                                <Picker mode="dialog" 
                                    selectedValue={nuevaSolicitud.id_articulo_grupo}
                                    onValueChange={(itemValue, itemIndex) => { agregarDatosASolicitud(itemValue, 'id_articulo_grupo') }}
                                    itemStyle={{fontSize:ResponsiveFont(12), height:100}}
                                > 
                                    <Picker.Item style={{fontSize:ResponsiveFont(12)}} label="Seleccionar" value=""/> 
                                    {
                                    listArticulosFiltrados.map((value) =>{
                                        return (
                                            <Picker.Item style={{fontSize:ResponsiveFont(12)}} label={value.descripcion_corta} value={value.id_articulo_grupo} key={value.id_articulo_grupo}/> 
                                        )
                                    })
                                    }
                                </Picker>
                            </View>
                        </View>

                        <Divider style={{marginVertical:5, height:1}}/>

                        <View>
                            <Text style={{fontWeight:'bold', fontSize:ResponsiveFont(12)}}>Almacén</Text>
                            <View>
                                <Picker mode="dialog" 
                                    selectedValue={nuevaSolicitud.id_almacen}
                                    onValueChange={(itemValue, itemIndex) => { agregarDatosASolicitud(itemValue, 'id_almacen') }}
                                    itemStyle={{fontSize:ResponsiveFont(12), height:100}}
                                    //onFocus={()=>{filtrarListaAlmacen(nuevaSolicitud.id_planta)}}
                                    > 
                                    <Picker.Item style={{fontSize:ResponsiveFont(12)}} label="Seleccionar" value=""/> 
                                    {
                                    listaAlmacen.map((value) =>{
                                        return (
                                            <Picker.Item style={{fontSize:ResponsiveFont(12)}} label={value.descripcion} value={value.id_almacen} key={value.id_almacen}/> 
                                        )
                                    })
                                    }
                                </Picker>
                            </View>
                        </View>

                        <Divider style={{marginVertical:5, height:1}}/>

                        <View style={{justifyContent:'space-around', flexDirection:'row'}}>
                            <View style={{flexDirection:'column', alignItems:'center'}}>
                                <Text style={{fontWeight:'bold', fontSize:ResponsiveFont(12)}}>Precio sin IGV</Text>
                                <View style={{ marginVertical:10}}>
                                    <TextInput editable={false} textAlign='center' 
                                    style={{paddingVertical:Platform.OS === 'ios' ? 5 : 0, backgroundColor:'#d8ecff', width:60, fontSize:ResponsiveFont(12)}} value={nuevaSolicitud.factor_sin_igv.toString() || ''} /> 
                                </View>
                            </View>
                            <View style={{flexDirection:'column', alignItems:'center'}}>
                                <Text style={{fontWeight:'bold', fontSize:ResponsiveFont(12)}}>Precio con IGV</Text>
                                <View style={{ marginVertical:10}}>
                                    <TextInput textAlign='center' style={{paddingVertical:Platform.OS === 'ios' ? 5 : 0,backgroundColor:'#d8ecff', width:60, fontSize:ResponsiveFont(12)}} 
                                        keyboardType='number-pad'
                                        onChangeText={(val)=>agregarPrecioIgv(val)}
                                        value={nuevaSolicitud.factor_con_igv.toString() || ''}
                                    /> 
                                </View>
                            </View>
                        </View>

                        <Divider style={{marginVertical:10, height:1}}/>
                        
                        <View>
                            {
                                tipoModal === '01' ? 
                                    <Button 
                                        mode="outlined" 
                                        color='white' 
                                        style={{backgroundColor:'#005db2'}} 
                                        labelStyle={{fontSize:ResponsiveFont(12)}} 
                                        onPress={() => {agregarSolicitud(1)}}>
                                        Agregar
                                    </Button>
                                :
                                    <Button 
                                        mode="outlined" 
                                        color='white' 
                                        style={{backgroundColor:'#EEC373'}} 
                                        labelStyle={{fontSize:ResponsiveFont(12)}} 
                                        onPress={() => {actualizarDatos()}}>
                                        Modificar
                                    </Button>
                            }
                        </View>
                    </ScrollView>
                </ModalComponent>
                            
                <ModalComponent
                    titulo={'Filtro'}
                    cerrarModal={cerrarModalFiltro} esVisible={mostrarModalFiltro} esChico={false} 
                >
                    <ScrollView style={{flexDirection:'column'}} disableScrollViewPanResponder={true}>
                        <View>
                            <Text style={{fontWeight:'bold', fontSize:ResponsiveFont(12)}}>Planta</Text>
                            <View style={{justifyContent:'center', marginTop:10}}>
                                <Picker mode="dialog" 
                                    selectedValue={filtro.id_planta}
                                    onValueChange={(itemValue, itemIndex) => {agregarDatosFiltro(itemValue, 'id_planta') }}
                                    itemStyle={{fontSize:ResponsiveFont(12), height:100}}
                                >
                                    <Picker.Item style={{fontSize:ResponsiveFont(12)}} label="Seleccionar" value=""/> 
                                    {
                                        listas.listaPlantas.map((value) =>{
                                            return (
                                                <Picker.Item style={{fontSize:ResponsiveFont(12)}} label={value.descripcion} value={value.id_Planta} key={value.id_Planta}/> 
                                            )
                                        })
                                    }
                                </Picker>
                            </View>
                            <View style={{display:helpers.planta}}>
                                <HelperText type="error" visible={true}  padding='none' style={{margin:0}}>
                                    Debe seleccionar una Planta
                                </HelperText>
                            </View>
                        </View>    

                        <Divider style={{marginVertical:5, height:1}}/>

                        <View>
                            <Text style={{fontWeight:'bold', fontSize:ResponsiveFont(12)}}>Condición de Pago</Text>
                            <View>
                                <Picker mode="dialog" 
                                    selectedValue={filtro.id_condicion_pago}
                                    onValueChange={(itemValue, itemIndex) => { agregarDatosFiltro(itemValue, 'id_condicion_pago') }}
                                    itemStyle={{fontSize:ResponsiveFont(12), height:100}}
                                > 
                                    <Picker.Item style={{fontSize:ResponsiveFont(12)}} label="Seleccionar" value=""/> 
                                    {
                                    listas.listaCondiciones.map((value) =>{
                                        return (
                                            <Picker.Item style={{fontSize:ResponsiveFont(12)}} label={value.descripcion} value={value.id_Condicion_Pago} key={value.id_Condicion_Pago}/> 
                                        )
                                    })
                                    }
                                </Picker>
                            </View>
                            <View style={{display:helpers.condi_pago}}>
                            <HelperText type="error" visible={true}  padding='none' style={{margin:0}}>
                                Debe seleccionar una Planta
                            </HelperText>
                        </View>
                        </View>

                        <Divider style={{marginVertical:5, height:1}}/>

                        <View>
                            <Text style={{fontWeight:'bold', fontSize:ResponsiveFont(12)}}>Articulo Sub Clase</Text>
                            <View>
                                <Picker mode="dialog" 
                                    selectedValue={filtro.id_articulo_subclase}
                                    onValueChange={(itemValue, itemIndex) => { agregarDatosFiltro(itemValue, 'id_articulo_subclase') }}
                                    itemStyle={{fontSize:ResponsiveFont(12), height:100}}
                                > 
                                    <Picker.Item style={{fontSize:ResponsiveFont(12)}} label="Seleccionar" value=""/> 
                                    {
                                    listas.listaArticulosSubClase.map((value) =>{
                                        return (
                                            <Picker.Item style={{fontSize:ResponsiveFont(12)}} label={value.id_articulo_Subclase} value={value.id_articulo_Subclase} key={value.id_articulo_Subclase}/> 
                                        )
                                    })
                                    }
                                </Picker>
                            </View>
                            <View style={{display:helpers.articulo}}>
                            <HelperText type="error" visible={true}  padding='none' style={{margin:0}}>
                                Debe seleccionar una Planta
                            </HelperText>
                        </View>
                        </View>


                        <Divider style={{marginVertical:5, height:1}}/>

                        <View>
                            <Text style={{fontWeight:'bold', fontSize:ResponsiveFont(12)}}>Articulo</Text>
                            <View>
                                <Picker mode="dialog" 
                                    selectedValue={filtro.id_articulo_grupo}
                                    onValueChange={(itemValue, itemIndex) => { agregarDatosFiltro(itemValue, 'id_articulo_grupo') }}
                                    onFocus={()=>{filtrarListaArticulos(filtro.id_articulo_subclase)}}
                                    itemStyle={{fontSize:ResponsiveFont(12), height:100}}
                                > 
                                    <Picker.Item style={{fontSize:ResponsiveFont(12)}} label="Seleccionar" value=""/> 
                                    {
                                    listArticulosFiltrados.map((value) =>{
                                        return (
                                            <Picker.Item style={{fontSize:ResponsiveFont(12)}} label={value.descripcion_corta} value={value.id_articulo_grupo} key={value.id_articulo_grupo}/> 
                                        )
                                    })
                                    }
                                </Picker>
                            </View>
                            <View style={{display:helpers.articulo}}>
                            <HelperText type="error" visible={true}  padding='none' style={{margin:0}}>
                                Debe seleccionar una Planta
                            </HelperText>
                        </View>
                        </View>

                        <Divider style={{marginVertical:5, height:1}}/>

                        <View>
                            <Text style={{fontWeight:'bold', fontSize:ResponsiveFont(12)}}>Almacén</Text>
                            <View>
                                <Picker mode="dialog" 
                                    selectedValue={filtro.id_almacen}
                                    onValueChange={(itemValue, itemIndex) => { agregarDatosFiltro(itemValue, 'id_almacen') }}
                                    onFocus={()=>{filtrarListaAlmacen(filtro.id_planta)}}
                                    itemStyle={{fontSize:ResponsiveFont(12), height:100}}
                                    > 
                                    <Picker.Item style={{fontSize:ResponsiveFont(12)}} label="Seleccionar" value=""/> 
                                    {
                                    listaAlmacen.map((value) =>{
                                        return (
                                            <Picker.Item style={{fontSize:ResponsiveFont(12)}} label={value.descripcion} value={value.id_almacen} key={value.id_almacen}/> 
                                        )
                                    })
                                    }
                                </Picker>
                            </View>
                        </View>

                        <Divider style={{marginVertical:10, height:1}}/>
                        
                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                            <Button  mode="outlined" color='white' style={{backgroundColor:'#EC9B3B'}} labelStyle={{fontSize:ResponsiveFont(12)}} onPress={() => {limpiarFiltro()}}>
                                Limpiar
                            </Button>
                            <Button  mode="outlined" color='white' style={{backgroundColor:'#005db2'}} labelStyle={{fontSize:ResponsiveFont(12)}} onPress={() => {aplicarFiltro()}}>
                                filtrar
                            </Button>
                        </View>

                    </ScrollView>
                </ModalComponent>
            

            <View style={{position:'absolute', top:0, right:0, left:0, bottom:0, zIndex:1000, backgroundColor:'rgba(52, 52, 52, 0.7)',
                display:procesoGrabarDescuento.current}}>
                <View style={{flex:1, flexDirection:'column', justifyContent:'center', alignContent:'center'}}>
                    <ActivityIndicator animating={true} color={Colors.blue700} size={90}/>
                </View>
            </View>
            </Provider>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    detalle : {
        flex:1
    },
    propiedadesTitulo: {
        padding: 7
    },
    TextTitulo: {
        color:'black'
    },
    propiedadesEncabezado:{
        backgroundColor:'#325288',
        display:'flex', 
        padding: 10
    },
    TextoEncabezado: {
        color: 'white',
        textAlign:'center'
    },
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    backTextWhite: {
        color: '#FFF'
    },
    rowBack: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#DDD',
        justifyContent: 'space-between',
        paddingLeft: 15,
        height:80
    },
    rowBack2: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#DDD',
        justifyContent: 'space-between',
        paddingLeft: 15,
        height:160
    },
    backRightBtn: {
        position: 'absolute',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        bottom: 0,
        top: 0,
        width: 75,
    },
    backRightBtn: {
        position: 'absolute',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        bottom: 0,
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: '#F05454',
        right: 0,
    },
    backRightBtnLeft: {
        backgroundColor: '#EEC373',
        left: 0,
    }
})