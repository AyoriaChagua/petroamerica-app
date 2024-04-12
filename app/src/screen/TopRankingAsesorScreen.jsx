import React from 'react'
import { Dimensions, FlatList, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import { Button, Divider, IconButton, Provider } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Header } from '../components/Header'
import { IndicadorDeCarga } from '../components/IndicadorDeCarga'
import { useTopRankingAsesor } from '../hooks/useTopRankingAsesor'
import { helpers } from '../helpers/helpers'
import { ModalComponent } from '../components/ModalComponent'
import { RadioButtonComponent } from '../components/RadioButtonComponent'


export const TopRankingAsesorScreen = () => {
    const {
        documentosAsesor,
        visibleCargaFinalFlatList,
        topRankingAsesores,
        visibleCarga,
        filtro,
        mesPeriodo,
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
        funcCerrarModalDocAsesor} = useTopRankingAsesor()

    const {ResponsiveFont} = helpers()

    const renderItem = ({item, index}) => {
        return (
            <>
                <View style={{flexDirection:'row', paddingLeft:4, paddingVertical:4, backgroundColor: '#f2f9ff', alignItems:'center', marginHorizontal:5}}>
                    <View style={{flex:1}}>
                        <Text numberOfLines={2} style={{fontSize:ResponsiveFont(11.5)}}>{(index+1) +'. ' + item.asesor}</Text>
                    </View>
                    <View style={{width:'20%'}}>
                        <TouchableOpacity onPress={()=> funcMostrarDocumentosPorAsesor(item, 'mes_2')}>
                            <Text numberOfLines={1} style={{fontSize:ResponsiveFont(11.5), textAlign:'center'}}>{item.total_mes_2}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{width:'20%'}}>
                        <TouchableOpacity onPress={()=> funcMostrarDocumentosPorAsesor(item, 'mes_1')}>
                            <Text numberOfLines={1} style={{fontSize:ResponsiveFont(11.5), textAlign:'center'}}>{item.total_mes_1}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{width:'21%'}}>
                        <Text style={{fontSize:ResponsiveFont(11.5), textAlign:'center', color:item.colorTexto, fontWeight:'bold'}}>{item.crecimiento}{(item.tipoCrecimiento === 'porcentaje') ? '%' : ' '}</Text>
                    </View>
                    <View style={{minWidth:30}}>
                        <IconButton
                            style={{padding:0, margin:0}}
                            color= {item.color} 
                            icon={item.icon}
                            size={ResponsiveFont(17)}
                        />
                    </View>
                </View> 
                <Divider style={{borderWidth:0.12}}/>
            </>
        )
    }

    const renderItemDocAsesor = ({item, index}) => {
        return (
            <View style={{flexDirection:'row', paddingHorizontal:3, paddingVertical:4, backgroundColor: (index%2) ? 'white' : '#C3DBD9' }}>
                <View style={{flex:2}}>
                    <Text numberOfLines={2} style={{textAlign:'left', fontSize:ResponsiveFont(11)}}>{item.cliente}</Text>
                </View>
                <View style={{flex:1}}>
                    <Text numberOfLines={1} style={{textAlign:'center', fontSize:ResponsiveFont(11)}}>{item.planta}</Text>
                </View>
                <View style={{flex:1.2}}>
                    <Text numberOfLines={1} style={{textAlign:'center', fontSize:ResponsiveFont(11)}}>{item.documento}</Text>
                </View>
                <View style={{flex:1.2}}>
                    <Text numberOfLines={1} style={{textAlign:'center', fontSize:ResponsiveFont(11)}}>{item.fecha}</Text>
                </View>
                <View style={{minWidth:'10%'}}>
                    <Text numberOfLines={1} style={{textAlign:'right' ,fontSize:ResponsiveFont(11)}}>{parseInt(item.cantidad) || 0}</Text>
                </View>
            </View>
        )
    }

    return (
        <Provider>
            <SafeAreaView style={{flex:1}}>
                <StatusBar backgroundColor="#325288" />
                    <Header tipoMenu='drawer' titulo='Asesor Top Ranking (Gl.)' botonDerecha={funcAbrirModalFiltro} tituloCompleto={true}/>
                    <View style={{flexDirection:'row', marginTop:5, marginHorizontal:10, justifyContent:'space-between'}}>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{fontSize: ResponsiveFont(12)}}>Tipo: </Text>
                            <Text style={{fontSize: ResponsiveFont(12), fontWeight:'bold', color: '#325288'}}>{valoresFiltro.tipoCliente}</Text>
                        </View>
                        <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
                            <Text style={{fontSize: ResponsiveFont(12)}}>Periodo: </Text>
                            <Text style={{fontSize: ResponsiveFont(12), fontWeight:'bold', color: '#325288'}}>{valoresFiltro.periodo}</Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Text style={{fontSize: ResponsiveFont(12)}}>Por: </Text>
                            <Text style={{fontSize: ResponsiveFont(12), fontWeight:'bold', color: '#325288', textTransform:'capitalize'}}>{valoresFiltro.crecimiento}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'row', marginTop:5, borderBottomColor: '#73777B', borderBottomWidth:1, padding:3, marginHorizontal:5}}>
                        <View style={{flex:1, padding:2}}>
                            <Text  numberOfLines={1} style={{fontWeight:'bold',  fontSize:ResponsiveFont(12)}}>Asesor</Text>
                        </View>
                        <View style={{width:'20%'}}>
                            <Text  numberOfLines={1} style={{fontWeight:'bold',  fontSize:ResponsiveFont(12), textAlign:'center'}}>{mesPeriodo.mes_2}</Text>
                        </View>
                        <View style={{width:'20%', padding:2}}>
                            <Text  numberOfLines={1} style={{fontWeight:'bold',  fontSize:ResponsiveFont(12), textAlign:'center'}}>{mesPeriodo.mes_1}</Text>
                        </View>
                        <View style={{width:'21%', padding:2}}>
                            <Text  numberOfLines={1} style={{fontWeight:'bold', fontSize:ResponsiveFont(12), textAlign:'center'}}>Crecimiento</Text>
                        </View>
                        <View style={{minWidth:30}}/>
                    </View>

                    {
                        (visibleCarga)
                            ?   <IndicadorDeCarga height={300} size={20}/>
                            :   
                                (topRankingAsesores.length < 1)
                                    ?   <View style={{margin:10}}>
                                            <Text style={{fontSize:ResponsiveFont(12)}}>No hay registros para mostrar</Text>
                                        </View>
                                    :   <FlatList
                                            disableScrollViewPanResponder={true}
                                            data={topRankingAsesores}
                                            renderItem={renderItem}
                                            key={(value) => value.id_asesor}
                                            onEndReached={funcCargarFinalFlatList}
                                            ListFooterComponent={() => 
                                                (visibleCargaFinalFlatList)
                                                    ?   <IndicadorDeCarga height={50} size={20}/>
                                                    : null
                                            }
                                        />
                                
                    }

                    <ModalComponent titulo={'Filtrar Ranking de Asesor'} tieneMargen={true} tienePadding={true}
                        cerrarModal={funcCerrarModalFiltro} esVisible={vistaModalFiltro} >
                            <ScrollView style={{flexDirection:'column'}} disableScrollViewPanResponder={true}>
                                <View>
                                    <Text style={{margin:5 ,fontSize:ResponsiveFont(12), fontWeight:'bold'}}>Tipo de Cliente:</Text>
                                    <View style={{flexDirection:'row', marginTop:5, marginHorizontal:20}}>
                                        <View style={{flex:1}}>
                                            <RadioButtonComponent status={filtro.tipoCliente} checkFuncion={() => funcCambiarDatosFiltro('tipoCliente', '-')} texto="Todos" valor='-'/>
                                        </View>
                                        <View style={{flex:1}}>
                                            <RadioButtonComponent status={filtro.tipoCliente} checkFuncion={() => funcCambiarDatosFiltro('tipoCliente', '02')} texto="Propias" valor='02'/>
                                        </View>
                                        <View style={{flex:1}}>
                                            <RadioButtonComponent status={filtro.tipoCliente} checkFuncion={() => funcCambiarDatosFiltro('tipoCliente', '01')} texto="Terceros" valor='01'/>
                                        </View>
                                    </View>
                                </View>

                                <Divider style={{marginVertical:10, borderColor:'#D8D8D8', borderWidth:0.5}}/>

                                <View>
                                    <Text style={{margin:5 ,fontSize:ResponsiveFont(12), fontWeight:'bold'}}>Periodo:</Text>
                                    <View style={{flexDirection:'row', marginTop:5, marginHorizontal:20}}>
                                        <View style={{flex:1}}>
                                            <RadioButtonComponent status={filtro.periodo} checkFuncion={() => funcCambiarDatosFiltro('periodo', '1')} texto="Mes Terminado" valor='1'/>
                                        </View>
                                        <View style={{flex:1}}>
                                            <RadioButtonComponent status={filtro.periodo} checkFuncion={() => funcCambiarDatosFiltro('periodo', '0')} texto="Mes Actual" valor='0'/>
                                        </View>
                                    </View>
                                </View>

                                <Divider style={{marginVertical:10, borderColor:'#D8D8D8', borderWidth:0.5}}/>

                                <View>
                                    <Text style={{margin:5 ,fontSize:ResponsiveFont(12), fontWeight:'bold'}}>Crecimiento:</Text>
                                    <View style={{flexDirection:'row', marginTop:5, marginHorizontal:20}}>
                                        <View style={{flex:1}}>
                                            <RadioButtonComponent status={filtro.crecimiento} checkFuncion={() => funcCambiarDatosFiltro('crecimiento', 'volumen')} texto="Volumen" valor='volumen'/>
                                        </View>
                                        <View style={{flex:1}}>
                                            <RadioButtonComponent status={filtro.crecimiento} checkFuncion={() => funcCambiarDatosFiltro('crecimiento', 'porcentaje')} texto="Porcentaje" valor='porcentaje'/>
                                        </View>
                                    </View>
                                </View>

                                <Divider style={{marginVertical:10, borderColor:'#D8D8D8', borderWidth:0.5}}/>

                                <View>
                                    <Button  mode="outlined" color='white' style={{backgroundColor:'#005db2'}} 
                                        labelStyle={{fontSize:ResponsiveFont(11)}} onPress={() => {funcAplicarFiltro()}}>
                                        filtrar
                                    </Button>
                                </View>

                            </ScrollView>
                    </ModalComponent>

                    

                    <ModalComponent 
                        titulo={`Documentos del Asesor: ${asesorSelecccionado.asesor}`} 
                        subtitulo={`Mes: ${asesorSelecccionado.mes}`} tieneMargen={false} tienePadding={false}
                        cerrarModal={funcCerrarModalDocAsesor} esVisible={visibleModalDocsAsesor}>
                        {
                            (visibleCardaModalDocAsesor)
                                ?   <IndicadorDeCarga height={200} size={15} />
                                :   
                                    <>
                                        <View style={{flexDirection:'row', borderBottomColor: '#73777B', borderBottomWidth:1, padding:3}}>
                                            <View style={{flex:2}}>
                                                <Text  numberOfLines={1} style={{fontWeight:'bold', textAlign:'center', fontSize:ResponsiveFont(11)}}>Cliente</Text>
                                            </View>
                                            <View style={{flex:1}}>
                                                <Text  numberOfLines={1} style={{fontWeight:'bold', textAlign:'center', fontSize:ResponsiveFont(11)}}>Planta</Text>
                                            </View>
                                            <View style={{flex:1.2}}>
                                                <Text  numberOfLines={1} style={{fontWeight:'bold', textAlign:'center', fontSize:ResponsiveFont(11)}}>Doc</Text>
                                            </View>
                                            <View style={{flex:1.2}}>
                                                <Text  numberOfLines={1} style={{fontWeight:'bold', textAlign:'center', fontSize:ResponsiveFont(11)}}>Fecha</Text>
                                            </View>
                                            <View style={{minWidth:'10%'}}>
                                                <Text  numberOfLines={1}  style={{fontWeight:'bold', textAlign:'right', fontSize:ResponsiveFont(11)}}>Cant.</Text>
                                            </View>
                                        </View>
                                        {
                                            (documentosAsesor.length > 0)
                                                ?   <FlatList
                                                        data={documentosAsesor}
                                                        renderItem={renderItemDocAsesor}
                                                        keyExtractor={(value, index) => index.toString()}
                                                    />
                                                :   <View>
                                                        <Text style={{fontSize:ResponsiveFont(11), color:'grey', margin:15}}>No se encontro información...</Text>   
                                                    </View>
                                        }
                                    </>
                        }
                    </ModalComponent>

            </SafeAreaView>
        </Provider>
    )
}