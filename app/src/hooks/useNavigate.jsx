import { datastorage } from '../helpers/storage'
import moment from 'moment/moment';

export const useNavigate = (props) => {
  
    const {clearAll, getTime} = datastorage()

    const validarTiempoExpiracion = async () => {
        let getTimes = await getTime()
        if(getTimes.error) return
        if(!getTimes.respuesta) props.navigation.popToTop()
        else{
          let fechaI = getTimes.respuesta
          if(moment().diff(fechaI, 'hours') > 13){
            await clearAll()
            props.navigation.popToTop()
          }
        }
    }

  return {
    validarTiempoExpiracion
  }
}
