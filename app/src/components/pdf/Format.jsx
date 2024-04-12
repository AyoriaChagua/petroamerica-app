export const getFormatData = (data = []) => {
    const format = `
    <html> 
        <body>
        <h1>Datos de la API</h1>
            <ul>
                ${data
                .map((item) => `<li>${item.nombre}: ${item.valor}</li>`)
                .join("")}
            </ul>
        </body>
    </html>
    `;
    return format;
};
