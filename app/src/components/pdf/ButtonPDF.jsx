import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { helpers } from "../../helpers/helpers";
import { getFormatData } from "./Format";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";

export default function ButtonPDF() {
  const [pdfPath, setPdfPath] = useState(null);
  const { ResponsiveFont } = helpers();
  const generatePDF = async () => {
    try {
      const data = [
        { nombre: "UVA", valor: "10.40" },
        { nombre: "UVA", valor: "10.40" },
        { nombre: "UVA", valor: "10.40" },
      ];
      const format = getFormatData(data);
      const tempHtmlPath = `${FileSystem.cacheDirectory}temp.html`;
      await FileSystem.writeAsStringAsync(tempHtmlPath, format);
      const pdfOptions = {
        html: tempHtmlPath,
      };
      const pdfUri = await Print.printToFileAsync(pdfOptions);
      const pdfPath = `${FileSystem.cacheDirectory}datos_test.pdf`;
      await FileSystem.moveAsync({ from: pdfUri.uri, to: pdfPath });
      setPdfPath(pdfPath);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    }
  };
  return (
    <View>
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
      {pdfPath && <Text>{pdfPath}</Text>}
    </View>
  );
}
