import { Dimensions, PixelRatio } from "react-native";

export const helpers = () => {

    const { width: SCREEN_WIDTH } = Dimensions.get('window')
    const escala = SCREEN_WIDTH / 320

    const ResponsiveFont = (size)  => {
        const newSize = size * escala 
        if (Platform.OS === 'ios') {
            return Math.round(PixelRatio.roundToNearestPixel(newSize))
        } else {
            return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2
        }
    }

    const obtenerNombreDelDiaIngles = (value) =>{
        const dia = {
            Sunday: {
                corto: 'D',
                largo: 'Domingo'
            },
            Monday: {
                corto: 'L',
                largo: 'Lunes'
            },
            Tuesday: {
                corto: 'M',
                largo: 'Martes'
            },
            Wednesday: {
                corto: 'M',
                largo: 'Miercoles'
            },
            Thursday: {
                corto: 'J',
                largo: 'Jueves'
            },
            Friday:{
                corto: 'V',
                largo: 'Viernes'
            },
            Saturday:{
                corto: 'S',
                largo: 'Sabado'
            }
        }
        return dia[value]
    }

    const obtenerNombreDelMesIngles = (value) =>{
        const mes = {
            January: {
                corto: 'En',
                largo: 'Enero'
            },
            February:{
                corto: 'Fe',
                largo: 'Febrero'
            },
            March:{
                corto: 'Ma',
                largo: 'Marzo'
            },
            April:{
                corto: 'Ab',
                largo: 'Abril'
            },
            May:{
                corto: 'Ma',
                largo: 'Mayo'
            },
            June:{
                corto: 'Ju',
                largo: 'Junio'
            },
            July:{
                corto: 'Ju',
                largo: 'Julio'
            },
            August:{
                corto: 'Ag',
                largo: 'Agosto'
            },
            September:{
                corto: 'Se',
                largo: 'Septiembre'
            },
            October:{
                corto: 'Oc',
                largo: 'Octubre'
            },
            November:{
                corto: 'No',
                largo: 'Noviembre'
            },
            December:{
                corto: 'Di',
                largo: 'Diciembre'
            }
        }
        return mes[value]
    }

    const obtenerNombreMes = (index) =>{
        const meses = ['','Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
        return meses[index]
    }

    const obtenerNombreMesCompleto = (index) =>{
        const meses = ['','Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
        return meses[index]
    }

    const obtenerNumeroDelMes = (val) => {
        return ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].indexOf(val)
    }

    return {
        ResponsiveFont,
        obtenerNombreDelDiaIngles,
        obtenerNombreDelMesIngles,
        obtenerNombreMes,
        obtenerNumeroDelMes,
        obtenerNombreMesCompleto
    }
}




    

   