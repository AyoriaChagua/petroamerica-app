import React from 'react'
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Portal, Modal, Avatar  } from 'react-native-paper'
import { helpers } from '../helpers/helpers'

export const ModalComponent = ({esVisible, cerrarModal, titulo, subtitulo, tieneMargen = true, tienePadding = true,children}) => {

  const {ResponsiveFont} = helpers()

  return (
    <Portal>
        <Modal visible={esVisible} onDismiss={cerrarModal} 
          contentContainerStyle={{
            ...styles.containerStyle,
            marginHorizontal: (tieneMargen) ? 20 : 0,
            paddingHorizontal: (tienePadding) ? 20 : 0,
            paddingVertical: 20}}>
          {(titulo) ?
            <View style={{
                paddingHorizontal:(!tienePadding) ? 20 : 0,
              }}> 
              <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                <Text style={{...styles.textStyle, fontSize:ResponsiveFont(11.5)}}>{titulo || ''}</Text>  
                <TouchableOpacity 
                  onPress={cerrarModal} >
                    <Avatar.Icon size={ResponsiveFont(17)} icon="close" color='#ebebeb' style={{backgroundColor:'#325288'}}/>
                </TouchableOpacity>
              </View>
              {
                (subtitulo) && <Text style={{...styles.textStyle, fontSize:ResponsiveFont(10)}}>{subtitulo}</Text> 
              }
            </View>
            : null
          }
            {children}
        </Modal>
    </Portal>
  )

}

const styles = StyleSheet.create({
  containerStyle: {
      backgroundColor: 'white',
      maxHeight:Dimensions.get('screen').height/1.5,
      borderRadius:10
  },
  textStyle: {
    fontWeight:'bold',
  }
})