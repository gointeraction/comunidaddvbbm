# 📘 Documentación Maestra Exhaustiva: Plataforma BBMDev & Solución SaaS Multi-Inquilino

**Versión del Documento**: 4.0 (Detalle Funcional Completo)  
**Proyecto**: BBMDev (ComunidadBBM)  
**Repositorio GitHub**: `https://github.com/gointeraction/comunidaddvbbm.git`  
**Última Actualización**: 25 de Julio de 2026  

---

## 🎯 1. Visión General y Propósito del Sistema

**BBMDev** es una plataforma web integral diseñada para comunidades de desarrolladores, estudiantes de Inteligencia Artificial y creadores de software. Combina un entorno de interacción comunitaria (foro, cursos con quizzes, salas de directos con chat en vivo, recursos copiables en 1 clic y gamificación) con una **Arquitectura B2B SaaS Multi-Inquilino (White-Label)** que permite alojar y administrar múltiples comunidades independientes bajo su propio nombre, subdominio, dominio personalizado y paleta de colores.

---

## 💻 2. Stack Tecnológico

- **Framework Web**: Next.js 16.2 (App Router + Híbrido SPA) con Turbopack.
- **UI & Estilos**: React 19, Tailwind CSS 4, Lucide Icons y primitivas accesibles de Radix UI / shadcn.
- **Gestión de Estado**: Zustand (`app-store.ts` y `tenant-store.ts`).
- **Base de Datos & Tiempo Real**: Firebase Auth, Cloud Firestore (NoSQL paginado y `onSnapshot` en tiempo real) y Firebase Storage.
- **Edge Computing**: Next.js Edge Middleware (`middleware.ts`) para resolución de subdominios.

---

## 🔬 3. DETALLE EXHAUSTIVO DE CADA FUNCIONALIDAD Y MÓDULO

---

### 💬 3.1. Módulo de Foro de Discusión e Interacción

- **Ubicación de Código**: [src/components/forum/forum-page.tsx](file:///c:/Users/IAEGEA/ComunidadBBM/src/components/forum/forum-page.tsx)
- **Archivos Relacionados**: [app-store.ts](file:///c:/Users/IAEGEA/ComunidadBBM/src/stores/app-store.ts), [firestore-sync.ts](file:///c:/Users/IAEGEA/ComunidadBBM/src/lib/firestore-sync.ts#L132)

#### Descripción Funcional Detallada
El foro es el canal central de comunicación donde los desarrolladores pueden realizar preguntas técnicas, compartir artículos y debatir sobre herramientas.

#### Características y Flujos Internos
1. **Creación de Publicaciones**:
   - Formulario modal o inline que solicita: `Título`, `Categoría` (`automatizacion` | `ia` | `webapps` | `comunidad`), `Contenido Markdown` y `Etiquetas`.
   - Al enviar, invoca `createPostInFirestore()`, guardando el post en la colección `posts` de Firestore y otorgando **+20 XP** al usuario.
2. **Filtrado y Búsqueda en Tiempo Real**:
   - Barra de búsqueda por texto libre que filtra títulos y contenidos.
   - Pestañas de filtrado por categoría y ordenamiento por `Más Recientes` (`createdAt desc`) o `Más Populares` (`likesCount desc`).
3. **Sistema de Likes con Rate-Limiting**:
   - Botón de Me Gusta con efecto visual instantáneo y acelerador de debounce (`throttle('like-postId', 500ms)` en [firestore-sync.ts](file:///c:/Users/IAEGEA/ComunidadBBM/src/lib/firestore-sync.ts#L141)).
   - Incrementa de forma atómica el contador en Firestore mediante `increment(1)`.
4. **Comentarios y Respuestas**:
   - Subcolección `posts/{postId}/comments`.
   - Permite responder a posts con soporte para bloques de código formatables y otorga **+5 XP** por comentario enviado.
5. **Sanitización de Markdown**:
   - Renderizado seguro mediante `react-markdown` y `react-syntax-highlighter` con tema oscuro.

---

### 📦 3.2. Módulo de Biblioteca de Recursos & Dev-UX

- **Ubicación de Código**: [src/components/resources/resources-page.tsx](file:///c:/Users/IAEGEA/ComunidadBBM/src/components/resources/resources-page.tsx)
- **Archivos Relacionados**: [bbmdev.ts](file:///c:/Users/IAEGEA/ComunidadBBM/src/types/bbmdev.ts#L70)

#### Descripción Funcional Detallada
Catálogo comunitario donde los usuarios descubren, votan y descargan configuraciones de herramientas de IA, servidores MCP, plugins y scripts.

#### Características y Flujos Internos
1. **Clasificación Tipificada**:
   - Tipos soportados: `Skill`, `Plugin`, `Subagent`, `MCP Server`, `Agent Team` y `Tutorial`.
   - Niveles de Dificultad: `Principiante`, `Intermedio`, `Avanzado`.
2. **Herramienta Dev-UX: Copia en 1 Clic**:
   - **Copiar Config MCP (JSON)**: Al hacer clic en un recurso de tipo `MCP Server`, genera y copia al portapapeles la estructura JSON lista para pegar en `antigravity_mcp_config.json` o `claude_desktop_config.json`.
   - **Copiar Skill Prompt**: Copia la instrucción Prompt completa formateada para ser usada directamente por asistentes de IA.
3. **Votación de Recursos (Upvoting)**:
   - Permite votar positivamente recursos útiles llamando a `upvoteResourceInFirestore()`.
4. **Creación e Importación**:
   - Formulario para que miembros con rol de `autor`, `moderador` o `admin` publiquen nuevos recursos o enlacen repositorios externos.

---

### 📚 3.3. Módulo de Cursos, Lecciones y Quizzes de Verificación

- **Ubicación de Código**: [src/components/courses/courses-page.tsx](file:///c:/Users/IAEGEA/ComunidadBBM/src/components/courses/courses-page.tsx)
- **Archivos Relacionados**: [bbmdev.ts](file:///c:/Users/IAEGEA/ComunidadBBM/src/types/bbmdev.ts#L112)

#### Descripción Funcional Detallada
Plataforma de aprendizaje guiado compuesta por cursos estructurados en lecciones secuenciales con validación activa de conocimientos.

#### Características y Flujos Internos
1. **Catálogo e Inscripción**:
   - Muestra el listado de cursos disponibles, nivel de dificultad, cantidad de lecciones e inscritos.
   - Botón de inscripción que rastrea el progreso del estudiante en porcentaje (`0%` a `100%`).
2. **Navegación de Lecciones**:
   - Panel lateral con el listado de lecciones marcando cuáles están completadas (`isCompleted: true`).
   - Visor principal que procesa la lección formateada en Markdown.
3. **Quiz Interactivo de Verificación**:
   - Al final de la lección, se presenta un cuestionario interactivo (`QuizQuestion`) con 4 opciones de respuesta.
   - Si la opción elegida es correcta: Muestra la insignia `✓ ¡Respuesta Correcta!` en verde y habilita el botón para marcar la lección como completada y recibir la recompensa de XP.
   - Si es incorrecta: Muestra `✕ Inténtalo de nuevo` en rojo y mantiene bloqueado el premio hasta responder adecuadamente.
4. **Generador de Certificado Simulado**:
   - Al alcanzar el `100%` del curso, se habilita el botón **Ver Certificado**, el cual abre una nueva ventana con un diploma oficial en HTML imprimible a PDF.

---

### 📺 3.4. Módulo de Directos en Vivo con Chat en Tiempo Real

- **Ubicación de Código**: [src/components/directos/directos-page.tsx](file:///c:/Users/IAEGEA/ComunidadBBM/src/components/directos/directos-page.tsx)
- **Archivos Relacionados**: [bbmdev.ts](file:///c:/Users/IAEGEA/ComunidadBBM/src/types/bbmdev.ts#L127)

#### Descripción Funcional Detallada
Espacio para webinars, talleres en vivo y sesiones de pair-programming transmitidas en directo.

#### Características y Flujos Internos
1. **Modal de Transmisión (`LiveRoomModal`)**:
   - Al hacer clic en un evento `live` o `scheduled`, abre una ventana modal maximizada en diseño grid de 2 columnas.
2. **Reproductor YouTube Embebido**:
   - Extrae automáticamente el ID del video mediante expresiones regulares desde cualquier URL de YouTube (`youtube.com/watch?v=...` o `youtu.be/...`) y lo renderiza en un `<iframe>` responsivo con autoplay.
3. **Chat en Tiempo Real en Firestore**:
   - Escucha la subcolección `liveSessions/{liveId}/chat` ordenada por `createdAt asc` utilizando `onSnapshot()`.
   - Renderiza instantáneamente los mensajes enviados por los usuarios con su avatar, nombre y contenido.
   - Permite enviar mensajes presionando `Enter` o el botón `Enviar`.

---

### 👤 3.5. Módulo de Perfil de Desarrollador & Integración GitHub

- **Ubicación de Código**: [src/components/profile/profile-page.tsx](file:///c:/Users/IAEGEA/ComunidadBBM/src/components/profile/profile-page.tsx)

#### Descripción Funcional Detallada
Tarjeta de identidad del desarrollador (DevCard) donde se resume su trayectoria, nivel, estadísticas e integración con repositorios públicos.

#### Características y Flujos Internos
1. **DevCard & Estadísticas**:
   - Visualiza el avatar del usuario, nivel actual (`Principiante`, `Intermedio`, `Avanzado`), número de nivel (`Nv. 1`, `Nv. 2`...), rol (`Member`, `Autor`, `Moderador`, `Admin`), bio e intereses.
   - Tarjetas de métricas: XP Total, XP Semanal, publicaciones realizadas y comentarios.
2. **Integración con GitHub API (`GitHubReposSection`)**:
   - Si el usuario configura su `githubUsername` en la edición de su perfil, el componente realiza una solicitud cliente a `https://api.github.com/users/{username}/repos?sort=updated&per_page=3`.
   - Muestra automáticamente sus 3 repositorios públicos más recientes con su contador de estrellas (★) y lenguaje principal.
3. **Subida de Avatares a Firebase Storage**:
   - Permite seleccionar un archivo local (PNG, JPG, WebP <2MB) y subirlo a la ruta `avatars/{uid}/avatar.jpg` en Firebase Storage.

---

### 🏆 3.6. Módulo de Gamificación, XP, Niveles y Leaderboard

- **Ubicación de Código**: [src/components/ranking/ranking-page.tsx](file:///c:/Users/IAEGEA/ComunidadBBM/src/components/ranking/ranking-page.tsx), [src/components/gamification/gamification-page.tsx](file:///c:/Users/IAEGEA/ComunidadBBM/src/components/gamification/gamification-page.tsx)

#### Descripción Funcional Detallada
Sistema de incentivos que recompensa la contribución activa en la comunidad.

#### Características y Flujos Internos
1. **Tabla de Clasificación (Leaderboard)**:
   - Pestañas para ver el ranking `Global` (XP Total) o `Semanal` (XP Semanal).
   - Destaca los 3 primeros lugares con medallas de Oro (🥇), Plata (🥈) y Bronce (🥉).
2. **Cálculo de Niveles**:
   - Algoritmo que calcula el `levelNumber` en función de la XP acumulada (cada 100 XP incrementa un nivel).
3. **Misiones Diarias y Logros**:
   - Desafíos como *"Publica 1 post"*, *"Comenta en 2 preguntas"* o *"Completa 1 lección"*.
   - Medallas clasificadas por rareza: `Common`, `Rare`, `Epic` y `Legendary`.

---

### 🛠️ 3.7. Módulo de Administración y Moderación

- **Ubicación de Código**: [src/components/admin/admin-page.tsx](file:///c:/Users/IAEGEA/ComunidadBBM/src/components/admin/admin-page.tsx)
- **Archivos Relacionados**: [firestore.rules](file:///c:/Users/IAEGEA/ComunidadBBM/firestore.rules)

#### Descripción Funcional Detallada
Panel de control exclusivo para usuarios con roles de `moderador` o `admin`.

#### Características y Flujos Internos
1. **Gestión de Usuarios**:
   - Cambiar rol de usuario (`member` ↔ `autor` ↔ `moderador` ↔ `admin`).
   - Suspender o reactivar cuentas.
2. **Moderación de Contenido**:
   - Eliminar publicaciones inapropiadas o cerrar temas de discusión.
3. **Logs de Auditoría**:
   - Registro de acciones administrativas en la colección `auditLogs` para trazabilidad de seguridad.

---

## 🏢 4. DETALLE DEL SUBSISTEMA SAAS MULTI-INQUILINO (WHITE-LABEL)

---

### 🌐 4.1. Edge Subdomain Middleware

- **Ubicación de Código**: [src/middleware.ts](file:///c:/Users/IAEGEA/ComunidadBBM/src/middleware.ts)

#### Descripción Funcional Detallada
Middleware que se ejecuta en la capa Edge de Next.js antes de procesar cualquier ruta de la aplicación.

#### Características Internas
1. Lee el encabezado `Host` de la solicitud (ej: `acme.bbmdev.io` o `comunidad.cliente.com`).
2. Extrae el subdominio del cliente (eliminando el dominio base `bbmdev.io` o `localhost`).
3. Inyecta el encabezado HTTP personalizado `x-tenant-id: acme` en la petición entrante para que el frontend o backend sepan qué comunidad cargar.

---

### 🎨 4.2. Motor de Temas Dinámicos de Marca Blanca

- **Ubicación de Código**: [src/lib/theme.ts](file:///c:/Users/IAEGEA/ComunidadBBM/src/lib/theme.ts)

#### Descripción Funcional Detallada
Motor gráfico responsable de aplicar la identidad visual de la comunidad cliente en tiempo real.

#### Características Internas
1. Recibe el objeto de configuración del inquilino (`TenantConfig`).
2. Modifica directamente las propiedades CSS del elemento `:root` del documento HTML:
   - `--primary`: Color primario (ej: `#10B981` Emerald, `#3B82F6` Royal Blue, `#8B5CF6` Purple).
   - `--background`: Color de fondo principal.
   - `--card`: Color de fondo de las tarjetas Glassmorphism.
   - `--ring`: Color de los anillos de enfoque.
3. Permite alternar entre marcas blancas sin necesidad de refrescar la página.

---

### 🛡️ 4.3. Portal Super-Admin SaaS

- **Ubicación de Código**: [src/components/saas/saas-admin-page.tsx](file:///c:/Users/IAEGEA/ComunidadBBM/src/components/saas/saas-admin-page.tsx)

#### Descripción Funcional Detallada
Panel de control general accesible desde la ruta `/saas-admin` para el propietario del SaaS.

#### Características Internas
1. **Métricas Financieras Globales**:
   - Visualiza indicadores clave: **MRR** (Monthly Recurrent Revenue), **ARR**, Comunidades Alojadas y Miembros Globales.
2. **Simulador de Marcas Blancas**:
   - Tarjetas de comunidades clientes alojadas (ej: *BBMDev*, *Acme AI Lab*, *Devs Latam*). Al hacer clic en cualquiera de ellas, activa su tema gráfico al instante para previsualizar cómo la ven sus miembros.
3. **Aprovisionador de Comunidades en 1 Clic**:
   - Modal interactivo con formulario para dar de alta una nueva comunidad especificando: `Nombre`, `Subdominio`, `Dominio Personalizado`, `Plan SaaS` (*Starter*, *Pro*, *Enterprise*) y `Color Primario`.

---

### 🎛️ 4.4. Centro de Control e Inspección de Inquilinos

- **Ubicación de Código**: [src/components/saas/tenant-control-panel.tsx](file:///c:/Users/IAEGEA/ComunidadBBM/src/components/saas/tenant-control-panel.tsx)

#### Descripción Funcional Detallada
Área de monitoreo operacional y financiero donde se inspecciona el estado de cada cliente alojado.

#### Características Internas
1. **Diagnóstico de Salud Financiera**:
   - Clasifica los inquilinos según su estado de suscripción:
     * 🟢 `active`: Pago al día y servicio habilitado.
     * 🟡 `past_due`: Pago fallido / moroso.
     * 🔵 `trialing`: Período de prueba gratuita.
     * 🔴 `suspended`: Suspendido o bloqueado por falta de pago.
2. **Medidores de Consumo & Cuotas**:
   - Barras de progreso de **Uso de Miembros** (ej: 480 / 500 miembros en plan Starter).
   - Barras de progreso de **Uso de Almacenamiento MB** (ej: 3,800 MB / 10,000 MB en plan Pro).
3. **Botones de Acción Directa en 1 Clic**:
   - 🔴 **Suspender**: Desactiva el acceso al subdominio del cliente inmediatamente.
   - 🟢 **Reactivar**: Restablece el servicio al regularizarse la cuenta.
   - 📧 **Enviar Recordatorio de Cobro**: Notificación enviada al email del administrador del inquilino.

---

### 📣 4.5. Landing Page Comercial B2B & Checkout Stripe

- **Ubicación de Código**: [src/components/saas/saas-landing-page.tsx](file:///c:/Users/IAEGEA/ComunidadBBM/src/components/saas/saas-landing-page.tsx), [src/components/saas/saas-billing-modal.tsx](file:///c:/Users/IAEGEA/ComunidadBBM/src/components/saas/saas-billing-modal.tsx)

#### Descripción Funcional Detallada
Canal de ventas B2B para comercializar la solución SaaS a empresas, academias e instituciones.

#### Características Internas
1. **Hero & Grilla de Capacidades B2B**:
   - Presentación de propuesta de valor y despliegue de las 6 características clave.
2. **Tabla Comparativa de Precios B2B**:
   - **Plan Starter ($49/mes)**: Hasta 500 miembros, Foro, Recursos y Subdominio.
   - **Plan Pro ($149/mes)**: Hasta 5,000 miembros, Cursos con Quizzes, Directos en vivo y Dominio propio.
   - **Plan Enterprise ($499/mes)**: Miembros ilimitados, SSO, Webhooks y SLA 99.9%.
3. **Modal de Facturación Checkout (Stripe Connect Simulator)**:
   - Permite seleccionar el plan deseado y simular el cobro seguro cifrado con SSL.

---

## 🔒 5. REGLAS DE SEGURIDAD NO SQL Y ALMACENAMIENTO (SECOPS)

### 5.1. Reglas de Firestore ([firestore.rules](file:///c:/Users/IAEGEA/ComunidadBBM/firestore.rules))
- Protege los roles impidiendo que los usuarios modifiquen los campos `role` o `status` en sus documentos de perfil:
  ```rules
  allow update: if isOwner(uid) && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role', 'status']);
  ```
- Exige autenticación para la creación de posts, recursos y comentarios.

### 5.2. Reglas de Storage ([storage.rules](file:///c:/Users/IAEGEA/ComunidadBBM/storage.rules))
- Exige que los archivos subidos pertenezcan a la carpeta del propio usuario (`avatars/{uid}/...`).
- Restringe el tipo de archivo únicamente a imágenes (`request.resource.contentType.matches('image/.*')`) y limita el peso a un máximo de 2MB para avatares y 5MB para portadas.

---

## 📌 Conclusión

Esta documentación refleja de forma 100% fiel la arquitectura, modelos de datos, flujos de usuario y código fuente implementado en **BBMDev SaaS**. Todo el sistema ha sido compilado sin errores y versionado en la rama `main` del repositorio oficial.
