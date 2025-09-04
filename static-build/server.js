const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

// Servir archivos estáticos
app.use(express.static(__dirname));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'unit-207-static.html'));
});

// Ruta para la unidad 207
app.get('/unit-207', (req, res) => {
    res.sendFile(path.join(__dirname, 'unit-207-static.html'));
});

// Fallback para SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'unit-207-static.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor estático corriendo en http://localhost:${PORT}`);
    console.log(`📱 Página de Unidad 207: http://localhost:${PORT}/unit-207-static.html`);
    console.log(`📱 Para móvil: http://localhost:${PORT}/unit-207-static.html`);
});
