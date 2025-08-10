# Smoke Test

- Fecha: 2025-08-10T23:13:48.333Z
- Sitio: http://localhost:3000

### Resumen
- **site**: http://localhost:3000
- **estado**: 5/15 PASS
- **home**: 1º=200, 2º=200, cache=no header
- **canonical home**: https://elkisrealtor.cl
- **sitemap**: urls=6, propiedades=5
- **muestra propiedad**: https://elkisrealtor.cl/property/edificio-vista-las-condes
- **robots Allow /**: no

### Detalles
```json
{
  "site": "http://localhost:3000",
  "checks": [
    {
      "name": "home-200-first",
      "pass": true,
      "status": 200
    },
    {
      "name": "home-200-second",
      "pass": true,
      "status": 200
    },
    {
      "name": "home-cache-header",
      "pass": false,
      "detail": "no header"
    },
    {
      "name": "home-cache-hit",
      "pass": false,
      "detail": "no header"
    },
    {
      "name": "home-canonical",
      "pass": false,
      "detail": "https://elkisrealtor.cl"
    },
    {
      "name": "sitemap-200",
      "pass": true,
      "status": 200
    },
    {
      "name": "sitemap-has-home",
      "pass": false,
      "count": 6
    },
    {
      "name": "sitemap-has-property",
      "pass": true,
      "count": 5
    },
    {
      "name": "property-200",
      "pass": false,
      "status": 404,
      "url": "https://elkisrealtor.cl/property/edificio-vista-las-condes"
    },
    {
      "name": "property-og-title",
      "pass": false,
      "detail": "not found"
    },
    {
      "name": "property-og-image",
      "pass": false,
      "detail": "not found"
    },
    {
      "name": "property-canonical",
      "pass": false,
      "detail": "not found"
    },
    {
      "name": "property-whatsapp",
      "pass": false,
      "detail": "no encontrado (posible dinámico)"
    },
    {
      "name": "robots-200",
      "pass": true,
      "status": 200
    },
    {
      "name": "robots-allow-root",
      "pass": false,
      "detail": "No Allow: /"
    }
  ],
  "propertySample": {
    "url": "https://elkisrealtor.cl/property/edificio-vista-las-condes",
    "status": 404,
    "whatsapp": null
  }
}
```