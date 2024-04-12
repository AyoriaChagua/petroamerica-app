import {Dimensions, StyleSheet} from 'react-native'

const altura = Dimensions.get('screen').height

const stylesGlobal = StyleSheet.create({
  modalContainer : {
    backgroundColor: 'white', 
    padding: 20, 
    margin:15
  },
  viewGrafico:{
    borderRadius:8, 
    marginTop: 10,
    margin:15, 
    padding:10, 
    backgroundColor:'#f2f9ff', 
    shadowColor: "#000",
    shadowOffset: 
      { width: 0, 
        height: 3 
      }, 
    shadowOpacity: 0.25, 
    shadowRadius: 3.84, 
    elevation: 2 
  }
})

export default stylesGlobal
