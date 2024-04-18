import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { IndicadorDeCarga } from './IndicadorDeCarga'
import { helpers } from "../helpers/helpers";

export default function BotonDeudasTotal({ cargandoInfo, titulo, deudaTotal, accionBoton }) {
    const { ResponsiveFont } = helpers();
    return (
        <>
            {(cargandoInfo) ?
                <TouchableOpacity style={styles.container} onPress={()=>accionBoton("xdeudastotal", titulo)}>
                    <View style={{  flexDirection: "row", }} >
                        <Text style={{ fontSize: ResponsiveFont(12) }}>
                            {`${titulo} `}
                        </Text>
                        <Text style={{ fontWeight: "bold", fontSize: ResponsiveFont(12) }} >
                            {deudaTotal}
                        </Text>
                    </View>
                </TouchableOpacity>
                :
                <View style={{ ...styles.loadcontainer, justifyContent: 'center', alignItems: 'center' }}>
                    <IndicadorDeCarga height={100} size={20} />
                </View>
            }
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        widht: 10,
        padding: 10,
        backgroundColor: "#f2f9ff",
        borderRadius: 5,
        backgroundColor: "#f2f9ff",
        borderWidth: 1,
        borderColor: "#e9e9e9",
        borderRadius: 5,
    },
    loadcontainer: {
        flex: 1,
        height: 150,
        backgroundColor: '#f2f9ff',
        borderWidth: 1,
        borderColor: '#e9e9e9',
        margin: 10,
        padding: 5,
        borderRadius: 5
    }
})