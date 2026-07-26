# 🚀 BBMDev — Plataforma de Comunidad Tech, IA & Solución SaaS Multi-Inquilino (White-Label)

![Next.js 16](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)
![React 19](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-Auth%20%7C%20Firestore%20%7C%20Storage-ffca28?style=for-the-badge&logo=firebase)
![SaaS Multi-Tenant](https://img.shields.io/badge/SaaS-Multi--Tenant-emerald?style=for-the-badge)

---

## 🎯 1. Visión General del Proyecto

**BBMDev** es una plataforma web moderna e interactiva diseñada para comunidades de desarrolladores, entusiastas de la Inteligencia Artificial y creadores de software. Combina un motor de interacción comunitaria (foro de discusión, cursos con quizzes interactivos, salas de directos con chat en vivo, biblioteca de recursos copiables en 1 clic y gamificación) con una **Arquitectura B2B SaaS Multi-Inquilino (White-Label)** que permite alojar y parametrizar cientos de comunidades independientes bajo su propia marca, subdominio y paleta de colores.

---

## 💻 2. Stack Tecnológico

```
┌────────────────────────────────────────────────────────────────────────┐
│                          STACK TECNOLÓGICO                              │
├───────────────────┬──────────────────────┬─────────────────────────────┤
│ 🚀 Core & UI      │ ⚡ Estado & Sync     │ 🛡️ Backend & Seguridad      │
│ ─ Next.js 16.2    │ ─ Zustand 5.0        │ ─ Firebase Auth             │
│ ─ React 19        │ ─ Firestore Realtime │ ─ Cloud Firestore (NoSQL)   │
│ ─ Turbopack       │ ─ Tenant Store       │ ─ Firebase Storage          │
│ ─ Tailwind CSS 4  │ ─ Dynamic Theme CSS  │ ─ Edge Subdomain Middleware │
└───────────────────┴──────────────────────┴─────────────────────────────┘
```

---

## 🔬 3. Módulos y Funcionalidades Principales

### 💬 A. Foro de Discusiones e Interacción
- Publicación de dudas técnicas, noticias y fragmentos de código formateados.
- Filtros por categorías (`automatizacion`, `ia`, `webapps`, `comunidad`) y ordenamiento por `Más Recientes` o `Más Populares`.
- Contador de Likes atómico con rate-limiting (`throttle`).
- Subcolección de comentarios `posts/{postId}/comments` con renderizado Markdown.
- Asignación de XP por participación (+20 XP post, +5 XP comentario).

### 📦 B. Biblioteca de Recursos & Dev-UX
- Clasificación por tipo: `Skill`, `Plugin`, `Subagent`, `MCP Server`, `Agent Team` y `Tutorial`.
- **Herramientas Copiar en 1 Clic**:
  * **Copiar Config MCP (JSON)**: Genera y copia la configuración JSON lista para pegar en `antigravity_mcp_config.json` o `claude_desktop_config.json`.
  * **Copiar Skill Prompt**: Copia la instrucción formateada para asistentes de IA.
- Votación de recursos útiles (`upvoteResourceInFirestore`).

### 📚 C. Cursos, Lecciones y Quizzes de Verificación
- Cursos estructurados en lecciones secuenciales con seguimiento de progreso porcentual (`0%` a `100%`).
- **Quiz Interactivo de Verificación**: Evaluación de opción múltiple al final de cada lección. La XP y el marcado de lección como completada requieren responder correctamente.
- Generador de Certificado Digital Oficial en HTML/PDF al completar el 100% del curso.

### 📺 D. Directos en Vivo con Chat en Tiempo Real
- Modal de transmisión en vivo (`LiveRoomModal`) con reproductor embebido de YouTube Live (extracción dinámica de Video ID por Regex).
- Panel de chat en tiempo real escuchando la subcolección `liveSessions/{liveId}/chat` con `onSnapshot()`.

### 👤 E. Perfil de Desarrollador & GitHub Sync
- **DevCard** de perfil con avatar dinámico, nivel, rol e intereses.
- **GitHub Sync**: Fetching en vivo a `api.github.com/users/{username}/repos` para renderizar los 3 repositorios públicos destacados del usuario con sus estrellas y lenguaje principal.
- Subida de avatares a Firebase Storage (`avatars/{uid}/avatar.jpg`).

### 🏆 F. Gamificación, XP y Ranking
- Tabla de clasificación (`Leaderboard`) global y semanal por experiencia acumulada.
- Niveles automáticos calculados por umbrales de XP.
- Misiones diarias y medallas clasificadas por rareza (`common`, `rare`, `epic`, `legendary`).

---

## 🏢 4. Subsistema SaaS Multi-Inquilino (White-Label)

```
                       [ Petición del Cliente ]
                        acme.bbmdev.io
                              │
                              ▼
                 ┌──────────────────────────┐
                 │  Next.js Edge Middleware │ ─── (Resuelve tenantId: 'acme')
                 └────────────┬─────────────┘
                              │
                              ▼
                 ┌──────────────────────────┐
                 │ Dynamic Theme Engine     │ ─── (Aplica variables CSS :root)
                 └────────────┬─────────────┘
                              │
                              ▼
                 ┌──────────────────────────┐
                 │ Cloud Firestore Query    │ ─── (Filtra por tenantId)
                 └────────────┬─────────────┘
```

1. **Resolutor de Subdominios Edge ([middleware.ts](file:///c:/Users/IAEGEA/ComunidadBBM/src/middleware.ts))**: Extrae el subdominio del cliente (`acme.bbmdev.io`) e inyecta el encabezado `x-tenant-id`.
2. **Motor de Temas Dinámicos ([theme.ts](file:///c:/Users/IAEGEA/ComunidadBBM/src/lib/theme.ts))**: Modifica las variables CSS `:root` (`--primary`, `--background`, `--card`) en tiempo de ejecución.
3. **Portal Super-Admin SaaS ([saas-admin-page.tsx](file:///c:/Users/IAEGEA/ComunidadBBM/src/components/saas/saas-admin-page.tsx))**: Métricas globales MRR/ARR, simulador de marcas y aprovisionador en 1 clic (incluyendo plan **Exonerado de $0 / 150 miembros**).
4. **Centro de Control de Inquilinos ([tenant-control-panel.tsx](file:///c:/Users/IAEGEA/ComunidadBBM/src/components/saas/tenant-control-panel.tsx))**: Monitoreo de estados de pago (`active`, `past_due`, `trialing`, `suspended`, `canceled`), cuotas de consumo y botones de acción (🔴 Suspender, 🟢 Reactivar, 📧 Cobrar).
5. **Dashboard de Analítica de Inquilinos ([tenant-analytics-dashboard.tsx](file:///c:/Users/IAEGEA/ComunidadBBM/src/components/saas/tenant-analytics-dashboard.tsx))**: Fuentes de adquisición, tasa de conversión Trial->Paid %, desglose por país, actividad diaria y **Exportador de Contactos a CSV**.
6. **Página Dedicada de Ventas SaaS B2B & Stripe Checkout ([saas-landing-page.tsx](file:///c:/Users/IAEGEA/ComunidadBBM/src/components/saas/saas-landing-page.tsx))**: Demostrador interactivo de marca blanca, ventajas por vertical y pasarela de pago segura.

---

## 🌐 5. Rutas de la Plataforma (`Route`)

| URL / Ruta | Nombre (`Route`) | Descripción |
| :--- | :--- | :--- |
| `https://bbmdev.io/` | `landing` | Landing Page de Bienvenida |
| `https://bbmdev.io/login` | `login` | Iniciar Sesión |
| `https://bbmdev.io/registro` | `registro` | Crear Cuenta |
| `https://bbmdev.io/recuperar-contrasena` | `recuperar-contrasena` | Recuperación de Clave |
| `https://bbmdev.io/onboarding` | `onboarding` | Wizard Inicial de Intereses |
| `https://bbmdev.io/foro` | `foro` | Foro de Discusiones |
| `https://bbmdev.io/foro?post={id}` | `foro-detalle` | Detalle de Publicación con Comentarios |
| `https://bbmdev.io/recursos` | `recursos` | Biblioteca MCP & Skills |
| `https://bbmdev.io/recursos?id={id}` | `recurso-detalle` | Detalle de Recurso |
| `https://bbmdev.io/cursos` | `cursos` | Catálogo de Cursos |
| `https://bbmdev.io/cursos?id={id}` | `curso-detalle` | Temario del Curso |
| `https://bbmdev.io/leccion` | `leccion` | Lección con Quiz Interactivo |
| `https://bbmdev.io/directos` | `directos` | Transmisiones en Vivo + Chat Firestore |
| `https://bbmdev.io/miembros` | `miembros` | Directorio de Desarrolladores |
| `https://bbmdev.io/miembro?uid={uid}` | `miembro-perfil` | Perfil Público de Miembro |
| `https://bbmdev.io/ranking` | `ranking` | Tabla de Clasificación por XP |
| `https://bbmdev.io/perfil` | `perfil` | Mi Perfil & GitHub Repos Sync |
| `https://bbmdev.io/perfil-editar` | `perfil-editar` | Editar Datos de Perfil |
| `https://bbmdev.io/mis-estadisticas` | `mis-estadisticas` | Estadísticas Personales de XP |
| `https://bbmdev.io/gamificacion` | `gamificacion` | Misiones Diarias y Medallas |
| `https://bbmdev.io/notificaciones` | `notificaciones` | Centro de Notificaciones |
| `https://bbmdev.io/saas-landing` | `saas-landing` | **Página Dedicada de Ventas SaaS B2B & Stripe Checkout** |
| `https://bbmdev.io/saas-admin` | `saas-admin` | **Portal Super-Admin SaaS & Analítica** |
| `https://bbmdev.io/admin` | `admin` | Moderación de Contenido |
| `https://bbmdev.io/reglas` | `reglas` | Reglas de la Comunidad |
| `https://bbmdev.io/privacidad` | `privacidad` | Políticas de Privacidad |
| `https://bbmdev.io/terminos` | `terminos` | Términos de Servicio |
| `https://{subdominio}.bbmdev.io/` | Multi-Tenant | Comunidad Inquilino Marca Blanca |

---

## 🛠️ 6. Instalación y Despliegue Local

### Requisitos Previos
- Node.js 18+ y npm / pnpm.

### Pasos de Instalación
```bash
# 1. Clonar el repositorio
git clone https://github.com/gointeraction/comunidaddvbbm.git
cd ComunidadBBM

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo (Next.js 16 + Turbopack)
npm run dev

# 4. Verificación estricta de TypeScript
npm run typecheck

# 5. Compilar para producción
npm run build
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
