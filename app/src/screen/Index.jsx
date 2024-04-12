import React, { useContext } from 'react'
import { Dimensions, Image, StatusBar, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header } from '../components/Header'
import { tokenContext } from '../context/Context'

export const Index = () => {

	const {idUsuario} =  useContext(tokenContext)

	return (
		<SafeAreaView style={{flex:1}}>
      		<StatusBar backgroundColor="#325288" />
			<Header titulo={'Inicio'} tipoMenu={'drawer'} />
			<View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
				<Image source={require('../../assets/fondo.png')} 
					style={{ width:Dimensions.get('window').width-75,
						height:Dimensions.get('window').height/5,
						resizeMode:'stretch',
						marginBottom:150
					}}
				/>
				<View style={{flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
					<Text style={{color:'#325288', fontSize:20}}>Bienvenido: {idUsuario}</Text>
				</View>
				<Text style={{color:'grey', fontSize:15}}>versión: 1.0.9</Text>
			</View>
		</SafeAreaView>
	)
}
