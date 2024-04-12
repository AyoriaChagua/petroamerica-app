import React, { useEffect, useState } from 'react'
import { Dimensions, FlatList, Image, Linking, Text, TouchableOpacity, View } from 'react-native'
import { ActivityIndicator, Colors, Divider, Modal, Portal, Checkbox } from 'react-native-paper'
import { HeaderModal } from './HeaderModal'
import { helpers } from '../helpers/helpers'
import { Picker } from '@react-native-picker/picker'
import moment from 'moment'

export const ModalInfoClienteComponent = ({ verModal, cerrarModal, documentos, listaPlantas, titulo, filtroSeleccionado, seleccionarDelFiltro, cargaInformacion, tipoVentaDocDeuda, saldoTotalDoc, botonEfeact = false, isChecked = false, onCheckboxChange = () => { } }) => {

  const { ResponsiveFont } = helpers()
  const renderItem = ({ item, index }) => {
    const fechaHoy = moment();
    const fechaVencimiento = moment(item.fecha_vencimiento, 'DD-MM-YY');
    let colorFondo;
    if (fechaHoy.isBefore(fechaVencimiento)) {
      colorFondo = index % 2 ? '#95E776' : '#E0F7D8';
    } else if (fechaHoy.isSame(fechaVencimiento, 'day')) {
      colorFondo = index % 2 ? '#F3F77D' : '#FCFDD6';
    } else {
      colorFondo = index % 2 ? '#FC8585' : '#FCA9A9';
    }

    return (
      <View style={{
        flexDirection: 'row', paddingHorizontal: 3, paddingVertical: 2,
        backgroundColor: titulo === "DEUDA TOTAL" ? colorFondo : (index % 2) ? '#C3DBD9' : 'white',
      }}>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={{ textAlign: 'center', fontSize: ResponsiveFont(11.5) }}>{(item.planta || '').substring(0, 5)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={{ textAlign: 'center', fontSize: ResponsiveFont(11.5) }}>{item.documento}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={{ textAlign: 'center', fontSize: ResponsiveFont(11.5) }}>{item.fecha}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={{ textAlign: 'center', fontSize: ResponsiveFont(11.5) }}>{item.fecha_vencimiento}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={{ textAlign: 'center', fontSize: ResponsiveFont(11.5) }}>{item.saldo || 0}</Text>
        </View>
      </View>
    )
  }

  const renderItemCredito = ({ item, index }) => {
    return (
      <View style={{ flexDirection: 'row', paddingHorizontal: 3, paddingVertical: 2, backgroundColor: (index % 2) ? '#C3DBD9' : 'white' }}>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={{ textAlign: 'center', fontSize: ResponsiveFont(11.5) }}>{(item.planta || '').substring(0, 5)}</Text>
        </View>
        <View style={{ flex: 2 }}>
          <Text numberOfLines={1} style={{ textAlign: 'center', fontSize: ResponsiveFont(11.5) }}>{item.autogenerado}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={{ textAlign: 'center', fontSize: ResponsiveFont(11.5) }}>{item.fecha}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={{ textAlign: 'center', fontSize: ResponsiveFont(11.5) }}>{item.monto_credito}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={{ textAlign: 'center', fontSize: ResponsiveFont(11.5) }}>{item.saldo || 0}</Text>
        </View>
      </View>
    )
  }

  return (
    <Portal>
      <Modal visible={verModal}
        onDismiss={cerrarModal}
        contentContainerStyle={{ paddingVertical: 20, marginVertical: 15, backgroundColor: 'white' }}>
        <View style={{ flexDirection: 'column', maxHeight: Dimensions.get('screen').height / 1.7 }} >
          <View style={{ margin: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: ResponsiveFont(12), fontWeight: 'bold' }}>{titulo}</Text>
            </View>
            {
              (botonEfeact && titulo !== "DEUDA TOTAL") &&
              (<TouchableOpacity style={{ marginRight: 15 }} onPress={() => Linking.openURL('https://web.efact.pe/login')}>
                <Image source={require("../img/logoEfact.png")} style={{ resizeMode: 'center', width: 30, height: 30, borderRadius: 5 }} />
              </TouchableOpacity>)

            }
            {
              (titulo === "DEUDA TOTAL") &&
              (
                <>
                  <Text style={{
                    fontSize: ResponsiveFont(11),
                  }}>Mayor a 1.00</Text>
                  <Checkbox
                    status={isChecked ? 'checked' : 'unchecked'}
                    color='#2C58FE'
                    onPress={() => onCheckboxChange(!isChecked)}
                  />
                </>
              )
            }
            <View style={{ borderColor: 'black', borderWidth: 1, flex: 1 }}>
              <Picker
                mode='dropdown'
                selectedValue={filtroSeleccionado}
                style={{ flex: 1 }}
                onValueChange={(itemValue, itemIndex) => seleccionarDelFiltro(itemValue)}
                itemStyle={{ fontSize: ResponsiveFont(12) }}
              >
                <Picker.Item style={{ fontSize: ResponsiveFont(12) }} label="TODAS" value="" />
                {
                  listaPlantas.map(value => {
                    return (
                      <Picker.Item style={{ fontSize: ResponsiveFont(12) }} label={value} value={value} key={value} />
                    )
                  })
                }
              </Picker>
            </View>

          </View>
          {
            (tipoVentaDocDeuda === "1")
              ? <View style={{ flexDirection: 'row', marginTop: 10, borderBottomColor: '#73777B', borderBottomWidth: 1, padding: 3 }}>
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={{ fontWeight: 'bold', textAlign: 'center', fontSize: ResponsiveFont(12) }}>Planta</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={{ fontWeight: 'bold', textAlign: 'center', fontSize: ResponsiveFont(12) }}>Doc</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={{ fontWeight: 'bold', textAlign: 'center', fontSize: ResponsiveFont(12) }}>Fecha</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={{ fontWeight: 'bold', textAlign: 'center', fontSize: ResponsiveFont(12) }}>Fec. Venc.</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={{ fontWeight: 'bold', textAlign: 'center', fontSize: ResponsiveFont(12) }}>Saldo</Text>
                </View>
              </View>
              : <View style={{ flexDirection: 'row', marginTop: 10, borderBottomColor: '#73777B', borderBottomWidth: 1, padding: 3 }}>
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={{ fontWeight: 'bold', textAlign: 'center', fontSize: ResponsiveFont(12) }}>Planta</Text>
                </View>
                <View style={{ flex: 2 }}>
                  <Text numberOfLines={1} style={{ fontWeight: 'bold', textAlign: 'center', fontSize: ResponsiveFont(12) }}>Autogenerado</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={{ fontWeight: 'bold', textAlign: 'center', fontSize: ResponsiveFont(12) }}>Fecha</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={{ fontWeight: 'bold', textAlign: 'center', fontSize: ResponsiveFont(12) }}>Credito</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={{ fontWeight: 'bold', textAlign: 'center', fontSize: ResponsiveFont(12) }}>Saldo</Text>
                </View>
              </View>
          }

          {
            (cargaInformacion)
              ? <View style={{ height: 50, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator animating={true} color={Colors.blue500} />
              </View>
              :
              <>
                <FlatList
                  data={filtroSeleccionado === "" ?
                    (isChecked ?
                      documentos.filter(value => parseFloat(value['cantidad']) >= 1.00)
                      : documentos)
                    : documentos.filter(value => value.planta === filtroSeleccionado)}
                  keyExtractor={(value, index) => index}
                  renderItem={(tipoVentaDocDeuda === "1") ? renderItem : renderItemCredito}
                />
                <View style={{ marginRight: 10, flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <View style={{ flex: 1 }} />
                  <View style={{ flex: 2 }} />
                  <View style={{ flex: 1 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: ResponsiveFont(11.5), textAlign: 'right' }}>Total: </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: ResponsiveFont(11.5), textAlign: 'center' }}>{saldoTotalDoc}</Text>
                  </View>
                </View>
              </>
          }

        </View>
      </Modal>
    </Portal>
  )
}
