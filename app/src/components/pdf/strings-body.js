export const stylesPDF = `
body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 0;
}

.contenedor {
    display: flex;
    width: 100%;
    gap: 10px;
    margin-bottom: 20px;
}

.tabla {
    flex: 1;
}

.table-1 {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    font-size: .7rem;
}

th,
td {
    padding: 2px 4px;
    text-align: left;
    border-bottom: 1px solid #dddddd;
    text-align: center;
    font-size: x-small;
}

th {
    background-color: #e7eeff;
    font-weight: bold;
    text-align: center;
}

table.table-1.tabla-thin>thead>tr>th,
table.table-1.tabla-thin>tbody>tr>td {
    padding: 3px 4px;
    font-size: x-small;
}

table.table-1.tabla-listado-fac>thead>tr>th {
    padding: 3px;
    font-size: x-small;
    
}
table.table-1.tabla-listado-fac>tbody>tr>td {
    padding: 2px;
    font-size: x-small;
    border-bottom: 0px solid #dddddd;
}

@media print {

    @page {
        margin-top: 0.4in;
        margin-bottom: 0.4in;
    }
}

p {
    font-size: 14px;
}

`

export const headerPDF = () =>  {
    const nombresMeses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    
    const fechaActual = new Date();
    
    const dia = fechaActual.getDate();
    const mes = nombresMeses[fechaActual.getMonth()];
    const año = fechaActual.getFullYear();
    
    const fechaFormateada = `Lima, ${dia} de ${mes} de ${año}`;
    return `
<div style="display: flex; flex-direction: row; justify-content: center; align-items: center;">
<div style="display: flex; width: 33%; justify-content: center; align-items: center;"></div>
<div style="display: flex; flex-direction: column;width: 33%; justify-content: center; align-items: center;">
    <span style="font-size: small; font-weight: bold;">Estado de Cuenta Hidromundo S.A.C.</span>
    <h1 style=" color: #060EDE; font-size: x-large; margin: 7px;">Estado de Cuenta</h1>
</div>
<div style="width: 33%; display: flex; justify-content: flex-end;">
    <img src="https://res.cloudinary.com/dcxg13hqx/image/upload/v1713211177/petroamerica/suh4ddjuomulsfjjphad.jpg" width="200" alt="">
</div>
</div>
<div style="display: flex; flex-direction: row-reverse;">
<p style="margin: 0px; padding: 0px;">${fechaFormateada}</p>
</div>`
}


export const tablasInformativasPDF = `<div class="tabla">
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
            <td>68,519.86</td>
        </tr>
        <tr>
            <td colspan="2">VENC 1-2 DÍAS</td>
            <td>13,703.97</td>
        </tr>
        <tr>
            <td colspan="2">TOTAL VENCIDO</td>
            <td>13,703.97</td>
        </tr>
        <tr>
            <td colspan="2">NRO. DOC. VENC.</td>
            <td>1</td>
        </tr>
    </tbody>
</table>
</div>`;


export const tablaCuentasPDF = `
<p>Cabe señalar que las cuentas bancarias que debe considerar para los pagos hacia nuestra representada son las siguientes:</p>
                <table class="table-1 tabla-thin">
                    <thead>
                        <tr>
                            <th colspan="10" style="text-align: center;">HIDROMUNDO S.A.C. - RUC: 20600427734</th>
                        </tr>
                        <tr>
                            <th>BANCO</th>
                            <th>CUENTA S/</th>
                            <th>NRO. C.C.I.</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>SCOTIABANK</td>
                            <td>0004024672</td>
                            <td>009-255-000004024672-10</td>
                        </tr>
                        <tr>
                            <td>BANCO DE CRÉDITO</td>
                            <td>194-2656073-0-19</td>
                            <td>002-194-002656073019-99</td>
                        </tr>
                        <tr>
                            <td>BBVA</td>
                            <td>0011-0378-0100060333</td>
                            <td>011-378-000100060333-70</td>
                        </tr>
                        <tr>
                            <td>INTERBANK</td>
                            <td>107-3001875813</td>
                            <td>003-107-003001875813-03</td>
                        </tr>
                        <tr>
                            <td>BANBIF</td>
                            <td>00700674740</td>
                            <td>03850110700067474038</td>
                        </tr>
                        <tr>
                            <td>BANCO DE LA NACIÓN</td>
                            <td>00-068372224</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>`

export const footerPDF = `
<div style="display: flex; flex-direction: row; gap: 10px; font-size: 12px; font-weight: bold;">
<div style="width: 50%;">
    <ul style="list-style: none; margin: 0px; padding: 0px;">
        <li>Yuliana Marquez | Dpt. Cred. y Cobrz. | Hidromundo S.A.C.</li>
        <li>Av. Benavides nro. 620 int. 703 </li>
        <li>Miraflores | Lima | Perú</li>
        <li>yuliana.marquez@petroamerica.com.pe</li>
    </ul>
</div>
<div style="width: 50%;">
    <ul style="list-style: none; margin: 0px; padding: 0px;">
        <li>Richard Cadillo | Dpt. Cred. y Cobrz. | Hidromundo S.A.C.</li>
        <li>Av. Benavides nro. 620 int. 703 </li>
        <li>Miraflores | Lima | Perú</li>
        <li>richard.cadillo@petroamerica.com.pe</li>
    </ul>
</div>`