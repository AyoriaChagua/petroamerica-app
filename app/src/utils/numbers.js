export const formatearNumeros = (number = 0) => {
    const montoRedondeado = Math.round(number * 100) / 100;
    
    const partes = montoRedondeado.toFixed(2).split('.');
    const parteEntera = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const parteDecimal = partes[1]; 
    
    const montoFormateado = `${parteEntera}.${parteDecimal}`;
    return montoFormateado;
}