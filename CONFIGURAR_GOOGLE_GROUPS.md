# 📧 Configuración de Google Groups para Recibir Correos de Inspección

## Problema

Los correos enviados desde Resend (`noreply@mail.luxepropertiespr.com`) no llegan al grupo `luxepr-forwards@googlegroups.com` debido a restricciones de permisos de Google Groups.

## ✅ Solución: Configurar Permisos del Grupo

### Opción 1: Permitir Correos Externos (Recomendado)

1. **Accede a Google Groups**
   - Ve a: https://groups.google.com/
   - Inicia sesión con la cuenta que administra el grupo

2. **Selecciona el grupo `luxepr-forwards`**

3. **Ve a Configuración**
   - Haz clic en el engranaje ⚙️ (Settings)
   - O ve a: `Manage` → `Settings`

4. **Configura "Who can post"** (Quién puede publicar)
   - En el menú lateral, busca: `Permissions` → `Posting permissions`
   - Cambia `Who can post` a una de estas opciones:
     - ✅ **"Anyone on the web"** (Cualquiera en la web) - *Más fácil*
     - ✅ **"Public on the web"** (Público en la web)
     - ⚠️ **"All members of the group"** (requiere agregar el correo como miembro)

5. **Guarda los cambios**

### Opción 2: Agregar el Correo como Remitente Permitido

Si no quieres abrir el grupo a todos, puedes agregar específicamente el correo de Resend:

1. **Ve a Settings → Permissions**

2. **Busca "Allowed senders"** (Remitentes permitidos)

3. **Agrega el correo:**
   ```
   noreply@mail.luxepropertiespr.com
   ```

4. **Guarda los cambios**

### Opción 3: Agregar el Correo como Miembro del Grupo

Si prefieres mayor control:

1. **Ve a Members** (Miembros)

2. **Haz clic en "Add members"** (Agregar miembros)

3. **Agrega el correo:**
   ```
   noreply@mail.luxepropertiespr.com
   ```

4. **Rol:** Selecciona "Member" (Miembro)

5. **Desmarca** "Send welcome message" (para no enviar mensaje de bienvenida)

6. **Guarda**

---

## 🔍 Verificar Configuración Actual

Para ver la configuración actual de tu grupo:

1. Ve a: https://groups.google.com/g/luxepr-forwards/settings
2. Revisa la sección `Permissions` → `Who can post`
3. Revisa si hay filtros de spam activos

---

## 📨 Verificar si el Correo Llegó

### 1. Revisa SPAM en Gmail

Si tienes acceso al grupo como miembro:

1. Abre Gmail
2. Ve a la carpeta **SPAM** o **Correo no deseado**
3. Busca correos de: `noreply@mail.luxepropertiespr.com`
4. Si está ahí:
   - Márcalo como "No es spam"
   - Esto ayudará a que futuros correos no vayan a spam

### 2. Revisa los Logs de Google Groups

Los administradores pueden ver los correos rechazados:

1. Ve a Google Groups: https://groups.google.com/g/luxepr-forwards
2. Click en `Settings` → `Moderation`
3. Revisa `Pending messages` (Mensajes pendientes)
4. Revisa `Rejected messages` (Mensajes rechazados)

---

## 🧪 Probar Nuevamente

Una vez configurado Google Groups, prueba el envío nuevamente:

```bash
npm run test-email
```

O desde una página de inspección:
1. Abre: http://localhost:8888/pages/Inspections/oceangrace/OceanGrace.html
2. Completa el formulario
3. Envía

---

## 📊 Verificación del Email

El último correo de prueba fue enviado exitosamente:
- **ID del correo**: `ebfb0972-f328-4881-aa8d-f33c0f3c97f6`
- **De**: noreply@mail.luxepropertiespr.com
- **Para**: luxepr-forwards@googlegroups.com
- **Estado**: ✅ Enviado correctamente desde Resend

---

## ⚠️ Notas Importantes

### SPF y DKIM

Si los correos siguen yendo a spam, verifica que tu dominio tenga configurados:

1. **SPF Record**: Permite que Resend envíe correos desde tu dominio
   ```
   v=spf1 include:resend.com ~all
   ```

2. **DKIM**: Firma digital para autenticar correos
   - Configurado automáticamente por Resend cuando verificas tu dominio

Puedes verificar esto en:
- Resend Dashboard → Domains → luxepropertiespr.com
- Verifica que tenga el check verde ✅

### Alternativa: Usar un Correo Personal para Testing

Si el grupo está muy restringido, puedes temporalmente cambiar el destinatario para testing:

**Edita**: `/netlify/functions/send-inspection.js`

```javascript
// Cambiar temporalmente para testing
to: 'tu-correo-personal@gmail.com',  // En lugar de luxepr-forwards@googlegroups.com
```

Una vez confirmes que funciona, regresa al correo del grupo.

---

## 🆘 ¿Aún No Llegan los Correos?

Posibles causas:

1. **Google Groups está rechazando activamente** → Revisa logs de moderación
2. **Delay de entrega** → Espera 5-10 minutos
3. **Correo en spam de Gmail** → Revisa carpeta spam
4. **Grupo requiere aprobación manual** → Desactiva moderación

Para soporte adicional:
- Resend Status: https://resend.com/status
- Google Groups Help: https://support.google.com/groups/

---

**Última actualización**: Noviembre 2025
