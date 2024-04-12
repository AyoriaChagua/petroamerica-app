import 'react-native-gesture-handler';
import { ContextProvider } from './src/context/Context';
import { NavigationContainer } from '@react-navigation/native';
import { MyStack } from './src/navigator/RouteNavigator';
import * as Linking from 'expo-linking'

const AppState = ({ children }) => {
  return (
    <ContextProvider>
      { children }
    </ContextProvider>
  )
}

const App = () => {

  const linking = {
    prefixes: [Linking.createURL('/')],
    config: {
      screens: {
        DrawerNavigation: {
          screens: {
            StackCliente: {
              screens:{
                DrawerCliente: {
                  screens:{
                    InfoClienteScreen: 'infoCliente/:id_cliente'
                  }
                }
              }
            }
          },
        },
      }
    },
  };

  return (
    <NavigationContainer linking={linking}>
      <AppState>
        <MyStack />
      </AppState>
    </NavigationContainer>
  );
}

export default App