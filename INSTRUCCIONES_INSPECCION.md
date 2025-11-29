# Componente de Envío de Inspección

## Descripción

Sistema completo para enviar notificaciones por correo cuando se completa una inspección. El sistema incluye:

- **Backend seguro**: Netlify Function que maneja el envío de correos sin exponer la API key
- **Componente reutilizable**: JavaScript que se puede agregar a cualquier página de inspección
- **Diseño minimalista**: Estilo azul claro profesional

## Archivos Creados

```
/netlify/functions/send-inspection.js  → Endpoint API para enviar correos
/js/inspection-submit.js               → Componente JS reutilizable
/css/inspection-submit.css             → Estilos del formulario
```

## Configuración de Variables de Entorno

### 1. Configurar el archivo `.env`

Copia el archivo `.env.example` a `.env` y configura las siguientes variables:

```bash
# API Key de Resend (obtenerla de https://resend.com/api-keys)
RESEND_API_KEY=tu_api_key_aquí

# Email remitente (debe ser un dominio verificado en Resend)
SENDER_EMAIL=noreply@tudominio.com
```

### 2. Variables requeridas en Netlify (para producción)

Si despliegas en Netlify, configura estas variables de entorno en:
`Netlify Dashboard → Site Settings → Environment Variables`

- `RESEND_API_KEY`
- `SENDER_EMAIL`

## Implementación en HTML

Para agregar el formulario de inspección a cualquier página HTML de inspección, sigue estos pasos:

### Paso 1: Agregar el CSS en el `<head>`

```html
<head>
  <!-- ... otros links ... -->
  <link rel="stylesheet" href="/css/style.css">
  <link rel="stylesheet" href="/css/inspection-submit.css">
</head>
```

### Paso 2: Agregar el JavaScript antes de `</body>`

```html
  <!-- Componente de envío de inspección -->
  <script src="/js/inspection-submit.js"></script>

</body>
</html>
```

## Ejemplo Completo

Ya implementado en: `/pages/Inspections/oceanhaven/OceanHaven.html`

## Requisitos del HTML

Para que el componente funcione correctamente, la página debe tener un elemento `<h1>` con la clase `title_inspect` que contenga el nombre de la villa:

```html
<h1 class="title_inspect">
  Inspección 2-208 Ocean Haven
</h1>
```

El componente automáticamente extraerá "Ocean Haven" del título.

## Patrón de Nomenclatura

El sistema espera que el título siga este patrón:
```
Inspección [número] [Nombre de Villa]
```

Ejemplos:
- "Inspección 2-208 Ocean Haven" → Extrae "Ocean Haven"
- "Inspección 101 Villa Paloma" → Extrae "Villa Paloma"
- "Inspección 5-A Casa Paraiso" → Extrae "Casa Paraiso"

## Funcionalidades

1. **Validación**: No permite enviar si el campo de nombre está vacío
2. **Feedback visual**: Muestra mensajes de éxito o error
3. **Deshabilitación del botón**: Previene envíos duplicados
4. **Responsive**: Funciona en móviles y tablets
5. **Loading state**: Muestra "Enviando..." mientras procesa
6. **Enter key**: Permite enviar con la tecla Enter

## Mensaje del Correo

El correo que se envía tiene el siguiente formato:

**Para**: luxepr-forwards@googlegroups.com
**Asunto**: Inspección completada: [Nombre de Villa]
**Cuerpo**:
> **[Nombre del Inspector]** informa que ha terminado de completar la inspección para **[Nombre de Villa]** y cumple con los requisitos de Luxe Properties.

## Testing Local

Para probar localmente con Netlify Dev:

```bash
# 1. Asegúrate de tener las variables en .env
# 2. Instala Netlify CLI si no lo tienes
npm install -g netlify-cli

# 3. Inicia el servidor de desarrollo
netlify dev
```

Esto iniciará el servidor local y las Netlify Functions estarán disponibles en:
`http://localhost:8888/.netlify/functions/send-inspection`

## Archivos a Actualizar

Para agregar este componente a todas las páginas de inspección, actualiza estos archivos:

```
✓ /pages/Inspections/oceanhaven/OceanHaven.html (Ya actualizado)
□ /pages/Inspections/casaparaiso/CasaParaiso.html
□ /pages/Inspections/casaprestige/CasaPrestige.html
□ /pages/Inspections/villapaloma/VillaPaloma.html
□ /pages/Inspections/villaclara/VillaClara.html
□ /pages/Inspections/villaflora/VillaFlora.html
□ /pages/Inspections/villapalacio/VillaPalacio.html
□ /pages/Inspections/villatiffany/VillaTiffany.html
□ /pages/Inspections/oceangrace/OceanGrace.html
```

## Solución de Problemas

### El correo no se envía

1. Verifica que `RESEND_API_KEY` esté configurado correctamente
2. Verifica que `SENDER_EMAIL` use un dominio verificado en Resend
3. Revisa los logs de Netlify Functions para ver errores

### El formulario no aparece

1. Verifica que los archivos CSS y JS estén enlazados correctamente
2. Verifica que la ruta sea absoluta (empiece con `/`)
3. Abre la consola del navegador para ver errores

### El nombre de la villa no se extrae correctamente

1. Verifica que el H1 tenga la clase `title_inspect`
2. Verifica que el formato sea: "Inspección [número] [Nombre]"

## Seguridad

✓ La API key de Resend NO se expone en el frontend
✓ Las solicitudes son validadas en el backend
✓ Se usan Netlify Functions serverless para mayor seguridad

## Mantenimiento

Para actualizar el diseño o comportamiento:

- **Estilos**: Edita `/css/inspection-submit.css`
- **Lógica**: Edita `/js/inspection-submit.js`
- **Backend**: Edita `/netlify/functions/send-inspection.js`

---

**Última actualización**: Noviembre 2025
**Desarrollado para**: Luxe Properties
