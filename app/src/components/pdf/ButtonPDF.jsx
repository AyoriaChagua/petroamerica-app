import { View, Text, Image, TouchableOpacity } from "react-native";
import { ActivityIndicator, Colors } from "react-native-paper"
import React, { useEffect, useState } from "react";
import { helpers } from "../../helpers/helpers";
import { printToFileAsync } from "expo-print";
import * as FileSystem  from "expo-file-system";
import { shareAsync } from "expo-sharing";
import { footerPDF, headerPDF, stylesPDF, tablaCuentasPDF, tablasInformativasPDF } from "./strings-body";
import { formatearNumeros } from "../../utils/numbers";


export default function ButtonPDF({ dataDeudas, dataCliente }) {

  const { ResponsiveFont } = helpers();
  const [loading, setLoading] = useState(false);
  const [html, setHtml] = useState("");
  useEffect(() => {
    let montoCorriente = 0;
    let montoVencido1a2 = 0; 
    let montoVencido = 0;
    let nroDocVencido = 0;

   

    let stringHTMLTablaDeuda = "";
    let backgroundFila = "";
    dataDeudas.map((item, index) => {
      switch (item.status) {
        case "VENCIDO":
          montoVencido += parseFloat(item.saldo.replace(",", ""));
          montoVencido1a2 += parseInt(item.days_difference) <= 2 ?  parseFloat(item.saldo.replace(",", "")) : 0;
          nroDocVencido += 1;
          backgroundFila = index % 2 ? '#FC8585' : '#FCA9A9'
          break;
        case "VENCE HOY":
          montoCorriente += parseFloat(item.saldo);
          backgroundFila = index % 2 ? '#F3F77D' : '#FCFDD6';
          break;
        case "POR VENCER":
          montoCorriente += parseFloat(item.saldo.replace(",", ""));
         
          backgroundFila = index % 2 ? '#abf391' : '#d6f8cb'
          break;
        default:
          backgroundFila = "#fff"
          break;
      }
      
      stringHTMLTablaDeuda += `
      <tr style="background-color: ${backgroundFila};">
        <td>${item.fecha}</td>
        <td>${item.document}</td>
        <td>${item.fecha_vencimiento}</td>
        <td>${item.cond_pago}</td>
        <td>${item.cond_pago_dias}</td>
        <td>${item.total_fac}</td>
        <td>${item.total_per}</td>
        <td>${item.total}</td>
        <td>${item.saldo}</td>
        <td>${item.status}</td>
        <td>${item.days_difference ?? ""}</td>
    </tr>`;
    });
    
    
    
    const newHTML = `<html>
    <head>
    <style>
      ${stylesPDF}
    </style>
    </head>
    <body style="margin: 10px 50px; font-family: sans-serif;">
        <header style="margin-bottom: 0px;">
           ${headerPDF()}
        </header>
        <main>
            <section>
            <p style="margin: 0px; padding: 0px;">Estimado (a) Cliente:<p>
            <p style="margin-left: 20px; margin-top: 0px; margin-bottom: 0px; padding: 0px;">${dataCliente.ruc} - ${dataCliente.descripcion}</p>
            </section>
            <section>
                <p>Reciban nuestros cordiales saludos. De acuerdo a la información recogida de nuestro sistema, le enviamos
                    el estado de cuenta de su representada al día de hoy:</p>
                <div class="contenedor">
                <div class="tabla">
                  <table class="table-1">
                      <thead>
                          <tr>
                              <th colspan="3">LINEA - SOLES</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr>
                              <td>ASIGNADO</td>
                              <td>150,000.00</td>
                          </tr>
                          <tr>
                              <td>UTILIZADO</td>
                              <td>82,223.83</td>
                          </tr>
                          <tr>
                              <td>DISPONIBLE</td>
                              <td>67,776.17</td>
                          </tr>
                      </tbody>
                  </table>
                </div>
                <div class="tabla">
                  <table class="table-1">
                      <thead>
                          <tr>
                              <th colspan="3" style="text-align: center;">VENCIMIENTOS</th>
                          </tr>
                          <tr>
                              <th colspan="1">PERIODO</th>
                              <th colspan="2">MONTO</th>
                          </tr>
                      </thead>
                      <tbody>
                          <tr>
                              <td colspan="2">CORRIENTE</td>
                              <td>${formatearNumeros(montoCorriente)}</td>
                          </tr>
                          <tr>
                              <td colspan="2">VENC 1-2 DÍAS</td>
                              <td>${formatearNumeros(montoVencido1a2)}</td>
                          </tr>
                          <tr>
                              <td colspan="2">TOTAL VENCIDO</td>
                              <td>${formatearNumeros(montoVencido)}</td>
                          </tr>
                          <tr>
                              <td colspan="2">NRO. DOC. VENC.</td>
                              <td>${nroDocVencido}</td>
                          </tr>
                      </tbody>
                  </table>
                </div>
                </div>
                <div class="tabla">
                    <table class="table-1 tabla-listado-fac">
                        <thead>
                            <tr>
                                <th colspan="11" style="text-align: center;">LISTADO DE FACTURAS POR PAGAR</th>
                            </tr>
                            <tr>
                                <th>FECHA</th>
                                <th>NRO. FACTURA</th>
                                <th>FEC. VCMT.</th>
                                <th>COND. PAGO</th>
                                <th>DIAS</th>
                                <th>TOT. FAC</th>
                                <th>TOT. PER</th>
                                <th>TOTAL</th>
                                <th>SALDO</th>
                                <th>ESTADO</th>
                                <th>DIAS</th>
                            </tr>
                        </thead>
                        <tbody>
                        ${stringHTMLTablaDeuda}
                        </tbody>
                    </table>
                </div>
                <p>Le agradeceríamos informarnos la fecha de pago de los documentos vencidos y la confirmación de registro de los documentos por vencer.</p>
            </section>
            <section>
                ${tablaCuentasPDF}
                <p style="margin-bottom: 0px; margin-top: 3px; padding: 0px;">Si al momento de recibir esta comunicación Ud. ya canceló su deuda, comuníquese vía correo electrónico a
                    <a href="mailto:richard.cadillo@petroamerica.com.pe"
                        style="text-decoration: none;">richard.cadillo@petroamerica.com.pe</a>, indicando el detalle de lo
                    cancelado.
                </p>
                <p style="margin: 3px; padding: 0px;">Quedamos atentos,</p>
            </section>
        </main>
        <footer>
          ${footerPDF}
        </footer>
    </body>
    
    </html>`
    setHtml(newHTML);
  }, []);

  const generateAndSavePDF = async () => {
    try {
      setLoading(true);
      const file = await printToFileAsync({
        html: html,
        base64: false,

      });
      await shareAsync(file.uri);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    try {
      setLoading(true);
      
      const pdfContent = html;
  
      const pdfUri = FileSystem.documentDirectory + 'archivo.pdf';
      await FileSystem.writeAsStringAsync(pdfUri, pdfContent, { encoding: FileSystem.EncodingType.UTF8 });
  
      await saveFile(pdfUri, 'archivo.pdf', 'application/pdf');
    } catch (error) {
      console.error('Error al crear el archivo:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const saveFile = async (uri, filename, mimetype) => {
    if (Platform.OS === 'android') {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      console.log(permissions)
      if (permissions.granted) {
        await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, filename, mimetype)
          .then(async (createdUri) => {
            await FileSystem.copyAsync({ from: uri, to: createdUri });
          })
          .catch((error) => {
            console.error('Error al crear el archivo:', error);
          });
      } else {
        console.log('Permiso denegado para acceder a la carpeta.');
      }
    } else {
      console.log('La funcionalidad de guardar archivos no está implementada para esta plataforma.');
    }
  };

  return (
    <>
      {loading ? <ActivityIndicator animating={true} color={Colors.blue500} /> : <View>

        <TouchableOpacity
          style={{
            padding: 5,
            backgroundColor: "#325288",
            borderRadius: 5,
            borderWidth: 1,
            borderColor: "#e9e9e9",
            borderRadius: 5,
          }}
          onPress={generatePDF}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              
            }}
          >
             <Image
              source={require("../../img/pdf-icon.png")}
              style={{ width: 22, height: 22, marginRight: 5 }}
            />
            <Text
              style={{
                fontWeight: "bold",
                fontSize: ResponsiveFont(12),
                color: "white",
              }}
            >
              Generar PDF
            </Text>
          </View>
        </TouchableOpacity>
      </View>}
    </>
  )
}