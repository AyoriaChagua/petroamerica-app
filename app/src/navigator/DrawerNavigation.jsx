import React, { useContext, useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { Divider } from 'react-native-paper';
import { ButtonNavegation } from '../components/ButtonNavegation';
import { useNavigate } from '../hooks/useNavigate'
import { datastorage } from '../helpers/storage'
import { tokenContext } from '../context/Context';

import { VentasTopClienteScreen } from '../screen/VentasTopClienteScreen';
import { VencimientoCubicacionVehiculoScreen } from '../screen/VencimientoCubicacionVehiculoScreen';
import { TopRankingAsesorScreen } from '../screen/TopRankingAsesorScreen';
import { ResumenIngresoScreen } from '../screen/ResumenIngresoScreen';
import { ResumenVentasScreen } from '../screen/ResumenVentasScreen';
import { Index } from '../screen/Index';
import { InfoClienteScreen } from '../screen/InfoClienteScreenX';
import { ListaClientesScreen } from '../screen/ListaClientesScreen';
import { DescuentosClienteScreen } from '../screen/DescuentosClienteScreen';
import { OrdenDePedidoScreen } from "../screen/OrdenDePedidoScreen";
const Drawer = createDrawerNavigator();

export const DrawerNavigation = (props) =>  {

const {validarTiempoExpiracion} = useNavigate(props)
	useEffect(() => {
		validarTiempoExpiracion()
	}, [])

	return (
		<Drawer.Navigator backBehavior="history"
			screenOptions={{
				headerShown: false,
				headerStyle:{
					elevation:0,
					shadowColor:'transparent'
				},
				sceneContainerStyle:{
					backgroundColor:'white'
				}
			}}
			
			drawerContent={ (props) => <MenuLateral { ...props} /> }
		>
			<Drawer.Screen name="Index"                               component={Index} />
			<Drawer.Screen name="OrdenPedidoScreen"		  		      component={OrdenDePedidoScreen} />
			<Drawer.Screen name="ListaClientesScreenDescuento"		  component={ListaClientesScreen} />
			<Drawer.Screen name="DescuentosClienteScreen"             component={DescuentosClienteScreen} 					options={{swipeEnabled:false}} />
			<Drawer.Screen name="ListaClientesScreen"				  component={ListaClientesScreen} />
			<Drawer.Screen name="InfoClienteScreen"                   component={InfoClienteScreen} 						options={{swipeEnabled:false}} />
			<Drawer.Screen name="VencimientoCubicacionVehiculoScreen" component={VencimientoCubicacionVehiculoScreen} />
			<Drawer.Screen name="VentasTopClienteScreen"              component={VentasTopClienteScreen}  />
			<Drawer.Screen name="ResumenVentasScreen"                 component={ResumenVentasScreen} />
			<Drawer.Screen name="TopRankingAsesorScreen"              component={TopRankingAsesorScreen} />
			<Drawer.Screen name="ResumenIngresoScreen"                component={ResumenIngresoScreen} />
		</Drawer.Navigator>
	);
}

const MenuLateral = (props) => {
	const {navigation} = props
	const {tipoUsuario, idUsuario, ingresarTipoLista} = useContext(tokenContext)
	const {clearAll} = datastorage()
	const cerrarSesion = async () => {
		await clearAll()
		navigation.popToTop()
	}

  	return (
		<DrawerContentScrollView>
		<View style={ styles.avatarContainer }>
			<Image source={require("../img/logoP.jpg")} style={ styles.avatar } />
		</View>
		<View style={ styles.menuContainer }>
			
			<ButtonNavegation 
				icono='account-circle-outline'  
				nombre='Inicio'               
				ruta={() => navigation.navigate('Index')} />
			<Divider style={styles.dividerStyle}/>
			{
				((idUsuario || '').toLowerCase() === 'admin') && 
					<ButtonNavegation 
						icono='pencil-outline' 
						nombre='Orden de Pedido' 
						ruta={() => navigation.navigate('OrdenPedidoScreen')} />
			}
			<Divider style={styles.dividerStyle}/>
			{
				((idUsuario || '').toLowerCase() === 'admin') && 
					<ButtonNavegation 
						icono='pencil-outline' 
						nombre='Registro Descuentos' 
						ruta={() => {ingresarTipoLista(1); navigation.navigate('ListaClientesScreenDescuento')}} />
			}
			<ButtonNavegation 
				icono='account-details-outline' 
				nombre='Clientes Información' 
				ruta={() => {ingresarTipoLista(2); navigation.navigate('ListaClientesScreenDescuento')}} />
			<ButtonNavegation 
				icono='car-outline'
				nombre={'Vencimiento Cubic. \nde Vehiculos'} 
				ruta={() => navigation.navigate('VencimientoCubicacionVehiculoScreen')} />
			<Divider style={styles.dividerStyle}/>
			<ButtonNavegation 
				icono='chart-box-outline'
				nombre='Top Ranking Clientes'
				ruta={() => navigation.navigate('VentasTopClienteScreen')} />
			<ButtonNavegation 
				icono='chart-box-outline'
				nombre='Top Ranking Asesores'
				ruta={() => navigation.navigate('TopRankingAsesorScreen')} />
			<Divider style={styles.dividerStyle}/>
			<ButtonNavegation 
				icono='chart-box-outline'
				nombre='Resumen de Ventas'
				ruta={() => navigation.navigate('ResumenVentasScreen')}
				esVisible={(tipoUsuario < 1) ? true : false}/>
			<ButtonNavegation 
				icono='chart-box-outline'
				nombre={'Resumen de Ingresos \npor ventas'}
				ruta={() => navigation.navigate('ResumenIngresoScreen')}
				esVisible={(tipoUsuario < 1) ? true : false}/>
			<Divider style={styles.dividerStyle}/>
			<ButtonNavegation 
				icono='keyboard-return'
				nombre='Cerrar Sesión'
				ruta={() => cerrarSesion()} />
		</View>
		</DrawerContentScrollView>
	);
}

const styles = StyleSheet.create({
  globalMargin: {
      marginHorizontal: 20
  },
  title: {
      fontSize: 30,
      marginBottom: 10
  },
  botonGrande: {
      width: 100,
      height: 100,
      backgroundColor: 'white',
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10
  },
  botonGrandeTexto: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold'
  },
  avatarContainer: {
      alignItems: 'center',
      marginTop: 20
  },
  avatar: {
      width: 120,
      height: 120,
      borderRadius: 100
  },
  menuContainer: {
      marginVertical: 30,
      marginHorizontal: 30
  },
  menuBoton: {
      marginVertical: 10,
      alignItems:'center'
  },
  menuTexto: {
      fontSize: 18
  },
  dividerStyle:{
    backgroundColor:'#D8D8D8', 
    marginTop:10, 
    height:1
  }
});