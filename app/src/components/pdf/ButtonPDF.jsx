import { View, Text, Image, TouchableOpacity } from "react-native";
import { ActivityIndicator, Colors } from "react-native-paper"
import React, { useEffect, useState } from "react";
import { helpers } from "../../helpers/helpers";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";
import { footerPDF, headerPDF, stylesPDF, tablaCuentasPDF, tablasInformativasPDF } from "./strings-body";


export default function ButtonPDF({ dataDeudas, dataCliente }) {

  const { ResponsiveFont } = helpers();
  const [loading, setLoading] = useState(false);
  const [html, setHtml] = useState("");
  useEffect(() => {
    let stringHTMLTablaDeuda = "";
    let backgroundFila = "";
    dataDeudas.map((item, index) => {
      switch (item.status) {
        case "VENCIDO":
          backgroundFila = index % 2 ? '#FC8585' : '#FCA9A9'
          break;
        case "VENCE HOY":
          backgroundFila = index % 2 ? '#F3F77D' : '#FCFDD6';
          break;
        case "POR VENCER":
          backgroundFila = index % 2 ? '#95E776' : '#E0F7D8'
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
        <td>${item.status}</td>
        <td>${item.days_difference ?? ""}</td>
    </tr>`;
    })
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
                    ${tablasInformativasPDF}
                </div>
                <div class="tabla">
                    <table class="table-1 tabla-listado-fac">
                        <thead>
                            <tr>
                                <th colspan="10" style="text-align: center;">LISTADO DE FACTURAS POR PAGAR</th>
                            </tr>
                            <tr>
                                <th>FECHA</th>
                                <th>NRO. FACTURA</th>
                                <th>FEC. VCMT.</th>
                                <th>COND. PAGO</th>
                                <th>DIAS</th>
                                <th>TOTAL FAC</th>
                                <th>TOTAL PER</th>
                                <th>TOTAL FAC + PER</th>
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

  const generatePDF = async () => {
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
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
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