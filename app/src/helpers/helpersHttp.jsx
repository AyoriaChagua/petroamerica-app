// eas build -p android --profile appdescuentos

const desarrollo  = 'http://192.168.1.12:8083/api' // privada
const produccion = 'http://190.116.6.12:8083/api' // publica

export const httpRuta = {
    api: {

        http: produccion
    }
}