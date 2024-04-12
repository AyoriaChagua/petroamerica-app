import React, { useContext, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Dimensions,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
} from "react-native";
import {
  Badge,
  ActivityIndicator,
  Colors,
  Provider,
  Portal,
  Modal,
  Button,
  Divider,
  Avatar,
} from "react-native-paper";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryLegend,
  VictoryLabel,
  Bar,
} from "victory-native";
import { Picker } from "@react-native-picker/picker";
import { Header } from "../components/Header";
import { helpers } from "../helpers/helpers";
import { useInfoCliente } from "../hooks/useInfoCliente";
import stylesGlobal from "../theme/stylesGlobal";
import { HeaderModal } from "../components/HeaderModal";
import { IndicadorDeCarga } from "../components/IndicadorDeCarga";
import { ModalInfoClienteComponent } from "../components/ModalInfoClienteComponent";
import { ModalComponent } from "../components/ModalComponent";
import { BotonesInfoClienteComponent } from "../components/BotonesInfoClienteComponent";
import ButtonPDF from "../components/pdf/ButtonPDF";
import BotonDeudasTotal from "../components/BotonDeudasTotal";

const altura = Dimensions.get("screen").height;

export const InfoClienteScreen = () => {
  const {
    estadoVenta,
    data,
    dataTotales,
    cargaGrafico,
    mesesVenta,
    docConSaldo,
    listaPlantas,
    filtroPlanta,
    gasPromedio,
    diePromedio,
    totalPromedio,
    cliente,
    verModalDocMes,
    docClienteMes,
    estadoDocMes,
    tipoDiagrama,
    ventanaEmergenteModal,
    estadoDeudas,
    valoresDeudas,
    tituloDoc,
    cargaInformacion,
    tipoVentaDocDeuda,
    saldoTotalDoc,
    mostrarVentanaEmergente,
    cerrarVentanaEmergente,
    agregarPlantaAlFiltro,
    mostrardocumentosClientePorMes,
    cerrarModalDocMes,
    cambiarVistaVentasClientes,
    mostrarVentanaEmergenteCredito,
    handleCheckboxChange,
    isChecked
  } = useInfoCliente();

  const { ResponsiveFont } = helpers();

  const renderDocCliente = ({ item }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 3,
          paddingVertical: 4,
          backgroundColor: item.backgroundColor,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={1}
            style={{ textAlign: "center", fontSize: ResponsiveFont(11) }}
          >
            {(item.planta || "").substring(0, 5)}
          </Text>
        </View>
        <View style={{ flex: 1.5 }}>
          <Text
            numberOfLines={1}
            style={{ textAlign: "center", fontSize: ResponsiveFont(11) }}
          >
            {item.documento}
          </Text>
        </View>
        <View style={{ flex: 1.5 }}>
          <Text
            numberOfLines={1}
            style={{ textAlign: "center", fontSize: ResponsiveFont(11) }}
          >
            {item.fecha}
          </Text>
        </View>
        <View style={{ flex: 1.5 }}>
          <Text style={{ textAlign: "center", fontSize: ResponsiveFont(11) }}>
            {item.articulo}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={1}
            style={{ textAlign: "right", fontSize: ResponsiveFont(11) }}
          >
            {parseInt(item.cantidad) || 0}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Provider>
        <StatusBar backgroundColor="#325288" />
        <Header titulo="Información del Cliente" tipoMenu={"stack"} />

        <View style={{ height: 90, flexDirection: "row" }}>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: 90,
            }}
          >
            <Image
              source={require("../img/dispensador.png")}
              style={{ maxHeight: 60, maxWidth: 60 }}
            />
          </View>
          <View style={{ flexDirection: "column", flex: 1, padding: 10 }}>
            <Text numberOfLines={2} style={{ fontSize: ResponsiveFont(15) }}>
              {cliente.descripcion}
            </Text>
            <Text
              numberOfLines={1}
              style={{ fontSize: ResponsiveFont(11), color: "grey" }}
            >
              Cod: {cliente.id_cliente} - RUC: {cliente.nro_di}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontSize: ResponsiveFont(11),
                color: "red",
                fontWeight: "bold",
              }}
            >
              Tipo: {estadoVenta}
            </Text>
          </View>
        </View>

        <View style={stylesGlobal.viewGrafico}>
          <View
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              marginTop: 5,
              marginRight: 5,
              zIndex: 999,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                cambiarVistaVentasClientes();
              }}
              style={{
                padding: 5,
                backgroundColor: !tipoDiagrama ? "#35858B" : "#325288",
                borderRadius: 5,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: ResponsiveFont(11.5) }}>
                {!tipoDiagrama ? "Die y Gas" : "Total"}
              </Text>
            </TouchableOpacity>
          </View>
          <Text
            numberOfLines={1}
            style={{ fontSize: ResponsiveFont(13), fontWeight: "bold" }}
          >
            Ventas al cliente en GLs - ultimos meses
          </Text>
          <View style={{ alignItems: "center" }}>
            {cargaGrafico ? (
              <IndicadorDeCarga
                height={Dimensions.get("window").height / 3}
                size={18}
              />
            ) : (
              <VictoryChart
                height={Dimensions.get("window").height / 3}
                domainPadding={{ x: 50 }}
                animate={{ duration: 1000 }}
              >
                <VictoryAxis
                  width={600}
                  style={{
                    tickLabels: { fontSize: ResponsiveFont(12) },
                  }}
                />
                {tipoDiagrama ? (
                  <VictoryGroup offset={27}>
                    <VictoryBar
                      cornerRadius={{ topLeft: () => 5, topRight: () => 5 }}
                      labels={({ datum }) => datum.gas}
                      data={data.gas}
                      style={{ data: { fill: "#36AE7C" } }}
                      labelComponent={
                        <VictoryLabel
                          style={[{ fill: "#36AE7C", fontSize: 11 }]}
                        />
                      }
                      events={[
                        {
                          target: "data",
                          eventHandlers: {
                            onPressOut: (event, data) => {
                              mostrardocumentosClientePorMes(data.datum);
                            },
                          },
                        },
                      ]}
                    />
                    <VictoryBar
                      cornerRadius={{ topLeft: () => 5, topRight: () => 5 }}
                      labels={({ datum }) => datum.die}
                      data={data.die}
                      style={{ data: { fill: "#7F8487" } }}
                      labelComponent={
                        <VictoryLabel
                          style={[{ fill: "#7F8487", fontSize: 11 }]}
                        />
                      }
                      events={[
                        {
                          target: "data",
                          eventHandlers: {
                            onPressOut: (event, data) => {
                              mostrardocumentosClientePorMes(data.datum);
                            },
                          },
                        },
                      ]}
                    />
                  </VictoryGroup>
                ) : (
                  <VictoryGroup offset={25}>
                    <VictoryBar
                      cornerRadius={{ topLeft: () => 5, topRight: () => 5 }}
                      data={dataTotales.totales}
                      labels={({ datum }) => datum.label}
                      style={{ data: { fill: "#325288" } }}
                      labelComponent={
                        <VictoryLabel
                          style={[{ fill: "#325288", fontSize: 11 }]}
                        />
                      }
                      events={[
                        {
                          target: "data",
                          eventHandlers: {
                            onPressOut: (event, data) => {
                              mostrardocumentosClientePorMes(data.datum);
                            },
                          },
                        },
                      ]}
                    />
                  </VictoryGroup>
                )}

                {tipoDiagrama ? (
                  <VictoryLegend
                    x={100}
                    orientation="horizontal"
                    gutter={20}
                    data={[
                      { name: "GASHOLES", symbol: { fill: "#36AE7C" } },
                      { name: "DIESEL", symbol: { fill: "#7F8487" } },
                    ]}
                    style={{ labels: { fontSize: ResponsiveFont(11.5) } }}
                  />
                ) : (
                  <VictoryLegend
                    x={150}
                    orientation="horizontal"
                    gutter={20}
                    data={[{ name: "Totales", symbol: { fill: "#325288" } }]}
                    style={{ labels: { fontSize: ResponsiveFont(11.5) } }}
                  />
                )}
              </VictoryChart>
            )}
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 2 }}>
              <Text
                numberOfLines={1}
                style={{ textAlign: "right", fontSize: ResponsiveFont(12) }}
              >
                Promedio ({mesesVenta.join(", ")}){" "}
              </Text>
            </View>
            {tipoDiagrama ? (
              <>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <Badge
                    size={ResponsiveFont(9)}
                    style={{ backgroundColor: "#36AE7C" }}
                  ></Badge>
                  <Text
                    numberOfLines={1}
                    style={{ fontSize: ResponsiveFont(12) }}
                  >
                    {gasPromedio.current || 0}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                  }}
                >
                  <Badge
                    size={ResponsiveFont(9)}
                    style={{ backgroundColor: "#7F8487" }}
                  ></Badge>
                  <Text
                    numberOfLines={1}
                    style={{ fontSize: ResponsiveFont(12) }}
                  >
                    {diePromedio.current || 0}
                  </Text>
                </View>
              </>
            ) : (
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-start",
                }}
              >
                <Badge
                  size={ResponsiveFont(9)}
                  style={{ backgroundColor: "#325288" }}
                ></Badge>
                <Text
                  numberOfLines={1}
                  style={{ fontSize: ResponsiveFont(12) }}
                >
                  {totalPromedio.current || 0}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View
          style={{
            justifyContent: "space-between",
            flexDirection: "row",
            height: 170,
          }}
        >
          <BotonesInfoClienteComponent
            accionBoton={mostrarVentanaEmergente}
            cantidad={valoresDeudas.dedudaSinVender.texto}
            cargandoInfo={estadoDeudas.dedudaSinVender}
            color={valoresDeudas.dedudaSinVender.color}
            parametro="xvencer"
            icono={valoresDeudas.dedudaSinVender.icon}
            titulo="DEUDA SIN VENCER"
          />

          <BotonesInfoClienteComponent
            accionBoton={mostrarVentanaEmergente}
            cantidad={valoresDeudas.dedudaVencida.texto}
            cargandoInfo={estadoDeudas.dedudaVencida}
            color={valoresDeudas.dedudaVencida.color}
            parametro="vencido"
            icono={valoresDeudas.dedudaVencida.icon}
            titulo="DEUDA VENCIDA"
          />

          <BotonesInfoClienteComponent
            accionBoton={mostrarVentanaEmergenteCredito}
            cantidad={valoresDeudas.montoaFavor.texto}
            cargandoInfo={estadoDeudas.montoaFavor}
            color={valoresDeudas.montoaFavor.color}
            parametro="credito"
            icono={valoresDeudas.montoaFavor.icon}
            titulo="MONTO A FAVOR"
          />
        </View>

        {/* <View style={{marginHorizontal:15, flexDirection:'row'}}>
                    <View style={{flex:2, flexDirection:'row', justifyContent:'center'}}>
                        <Text style={{fontSize: ResponsiveFont(12)}}>DEDUDA TOTAL: </Text>
                        <Text style={{fontWeight:'bold', fontSize: ResponsiveFont(12)}}>{valoresDeudas.deudaTotal}</Text>
                    </View>
                    <View style={{flex:1}}/>
                </View> */}
        <View
          style={{
            marginHorizontal: 10,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              marginHorizontal: 10,
            }}
          >
           
            <BotonDeudasTotal
              cargandoInfo={estadoDeudas.dedudaSinVender && estadoDeudas.dedudaVencida}
              titulo={"DEUDA TOTAL"}
              deudaTotal={valoresDeudas.deudaTotal}
              accionBoton={mostrarVentanaEmergente}
            />
          </View>
          <View
            style={{
              marginHorizontal: 10,
              justifyContent: "center",
            }}
          >
          </View>
        </View>
        <ModalComponent
          titulo={"Documentos del mes: " + docClienteMes.titulo}
          cerrarModal={cerrarModalDocMes}
          esVisible={verModalDocMes}
          tieneMargen={false}
          tienePadding={false}
        >
          <View
            style={{
              flexDirection: "row",
              borderBottomColor: "#73777B",
              borderBottomWidth: 1,
              padding: 3,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                numberOfLines={1}
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: ResponsiveFont(11),
                }}
              >
                Planta
              </Text>
            </View>
            <View style={{ flex: 1.5 }}>
              <Text
                numberOfLines={1}
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: ResponsiveFont(11),
                }}
              >
                Doc
              </Text>
            </View>
            <View style={{ flex: 1.5 }}>
              <Text
                numberOfLines={1}
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: ResponsiveFont(11),
                }}
              >
                Fecha
              </Text>
            </View>
            <View style={{ flex: 1.5 }}>
              <Text
                numberOfLines={1}
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: ResponsiveFont(11),
                }}
              >
                Articulo
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                numberOfLines={1}
                style={{
                  fontWeight: "bold",
                  textAlign: "right",
                  fontSize: ResponsiveFont(11),
                }}
              >
                Cantidad
              </Text>
            </View>
          </View>
          {estadoDocMes ? (
            <View
              style={{
                height: 50,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ActivityIndicator animating={true} color={Colors.blue500} />
            </View>
          ) : (
            <>
              <FlatList
                data={docClienteMes.doc}
                renderItem={renderDocCliente}
                keyExtractor={(value, index) => index}
              />
              <View>
                <Divider />
                <Text style={{ textAlign: "right", fontWeight: "bold" }}>
                  Total (GL.): {docClienteMes.sumatoria}
                </Text>
              </View>
            </>
          )}
        </ModalComponent>

        <ModalInfoClienteComponent
          botonEfeact={true}
          cargaInformacion={cargaInformacion}
          titulo={tituloDoc}
          verModal={ventanaEmergenteModal}
          documentos={docConSaldo}
          listaPlantas={listaPlantas}
          filtroSeleccionado={filtroPlanta}
          tipoVentaDocDeuda={tipoVentaDocDeuda}
          saldoTotalDoc={saldoTotalDoc}
          cerrarModal={cerrarVentanaEmergente}
          seleccionarDelFiltro={agregarPlantaAlFiltro}
          isChecked={isChecked}
          onCheckboxChange={handleCheckboxChange}
        />
      </Provider>
    </SafeAreaView>
  );
};
