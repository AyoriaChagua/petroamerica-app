import React, {  createContext, useState } from "react";

export const tokenContext = createContext(
  {
    token: undefined, 
    idUsuario: undefined, 
    cliente: undefined,
    tipoUsuario: undefined,
    tipoListaCliente: undefined,
    ingresarContextAuth: ($token, $idUsuario, $undefined) => {},
    ingresarContextCliente: ($cliente) => {},
    ingresarTipoLista: ($cliente) => {}
})


export const ContextProvider = ({ children }) => {

    const [token, setToken] = useState(undefined)
    const [idUsuario, setIdUsuario] = useState(undefined)
    const [tipoUsuario, setTipoUsuario] = useState(undefined)
    const [cliente, setCliente] = useState(undefined)
    const [tipoListaCliente, setTipoListaCliente] = useState(undefined)

    const ingresarContextAuth = async ($token, $idUsuario, $tipoUsuario) =>{
        setToken($token)
        setIdUsuario($idUsuario)
        setTipoUsuario($tipoUsuario)
    }

    const ingresarContextCliente = ($cliente) =>{
      setCliente($cliente)
    }

    const ingresarTipoLista = ($tipo) => {
      setTipoListaCliente($tipo)
    }

    return (
      <tokenContext.Provider value={{
          token, idUsuario, tipoUsuario, cliente, tipoListaCliente, ingresarContextAuth, ingresarContextCliente, ingresarTipoLista
      }}>
          {children}
      </tokenContext.Provider>
    )
    
}
