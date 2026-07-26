# 📘 Documentación Maestra: Plataforma BBMDev & Solución SaaS Multi-Inquilino

**Versión del Documento**: 3.0 (Producción Multi-Tenant)  
**Proyecto**: BBMDev (ComunidadBBM)  
**Repositorio GitHub**: `https://github.com/gointeraction/comunidaddvbbm.git`  
**Última Actualización**: 25 de Julio de 2026  

---

## 🎯 1. Visión General y Propósito del Sistema

**BBMDev** es una plataforma web moderna e interactiva diseñada para comunidades de desarrolladores, entusiastas de la Inteligencia Artificial y creadores de software. Combina un motor de interacción comunitaria (foro, cursos, directos con chat en vivo, recursos kopiables en 1 clic y gamificación) con una **Arquitectura B2B SaaS Multi-Inquilino (White-Label)** que permite alojar y parametrizar cientos de comunidades independientes bajo su propia marca, subdominio y paleta de colores.

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

- **Framework Web**: Next.js 16 (App Router + Híbrido SPA) con Turbopack.
- **Librería UI**: React 19 con Lucide Icons y primitivas accesibles de Radix UI / shadcn.
- **Gestión de Estado**: Zustand (`app-store.ts` y `tenant-store.ts`).
- **Base de Datos y Tiempo Real**: Firebase Auth, Cloud Firestore (consultas paginadas y `onSnapshot`) y Firebase Storage.
- **Edge Computing**: Next.js Edge Middleware (`middleware.ts`) para resolución dinámica de subdominios.

---

## 📁 3. Estructura Completa del Proyecto

```
ComunidadBBM/
├── 📄 middleware.ts                      ── Resolución de subdominios en el Edge (acme.bbmdev.io -> acme)
├── 📄 firestore.rules                    ── Reglas de seguridad NoSQL con bloqueo de escalada de roles
├── 📄 storage.rules                      ── Reglas de almacenamiento (tamaño y tipos MIME de imágenes)
├── 📄 next.config.ts                     ── Configuración de headers y build de Next.js
├── 📄 package.json                       ── Scripts y dependencias del proyecto
├── 📄 DOCUMENTACION_PLATAFORMA_BBMDEV_SAAS.md ── Documentación Maestra del Sistema
│
├── 📁 tests/                             ── Pruebas de integración
│   ├── 📄 firestore-rules.test.ts        ── Pruebas de reglas de Firestore
│   └── 📄 storage-rules.test.ts          ── Pruebas de almacenamiento de imágenes
│
└── 📁 src/
    ├── 📁 app/                           ── Enrutamiento y Páginas
    │   ├── 📄 layout.tsx                 ── Layout raíz de la app
    │   ├── 📄 page.tsx                   ── Router SPA dinámico con soporte de historial de navegador (F5)
    │   └── 📄 globals.css                ── Variables de temas CSS Terminal Emerald
    │
    ├── 📁 stores/                        ── Gestión de Estado Global
    │   ├── 📄 app-store.ts               ── Estado de usuario, foro, cursos, recursos y sync
    │   └── 📄 tenant-store.ts            ── Gestión Multi-Tenant, métricas MRR y acciones de inquilinos
    │
    ├── 📁 types/                         ── Tipos TypeScript Estrictos
    │   ├── 📄 bbmdev.ts                  ── Tipos comunitarios (User, Post, Course, Lesson, LiveChatMessage)
    │   └── 📄 saas.ts                    ── Tipos SaaS (TenantConfig, TenantSubscription, TenantUsage, SaaSMetrics)
    │
    ├── 📁 lib/                           ── Utilidades e Infraestructura
    │   ├── 📄 firebase.ts                ── Inicializador Auth, Firestore y Storage
    │   ├── 📄 firestore-sync.ts          ── Escuchador de Firestore optimizado con paginación orderBy/limit
    │   ├── 📄 theme.ts                   ── Motor de Temas Dinámicos de Marca Blanca (:root CSS variables)
    │   └── 📄 utils.ts                   ── Helpers de formato de texto y clases CSS
    │
    └── 📁 components/                    ── Módulos de Interfaz de Usuario
        ├── 📁 saas/                      ── Subsistema SaaS Multi-Inquilino
        │   ├── 📄 saas-admin-page.tsx    ── Portal Super-Admin con métricas MRR/ARR y aprovisionador 1-Click
        │   ├── 📄 tenant-control-panel.tsx ── Centro de Control, Monitoreo de Pagos y Suspensión/Reactivación
        │   ├── 📄 saas-landing-page.tsx  ── Landing Page Comercial B2B para venta de la solución
        │   └── 📄 saas-billing-modal.tsx ── Modal de facturación y checkout simulado con Stripe Connect
        │
        ├── 📁 forum/                     ── Foro de Discusiones, Posts y Comentarios
        ├── 📁 resources/                 ── Biblioteca de Recursos (Skills, MCP Servers 1-Click Copy)
        ├── 📁 courses/                   ── Cursos, Lecciones y Quizzes interactivos
        ├── 📁 directos/                  ── Transmisiones en vivo con Chat en Tiempo Real
        ├── 📁 profile/                   ── Perfil de Usuario & Sincronización de repositorios de GitHub
        ├── 📁 ranking/                   ── Tabla de clasificación semanal y global por XP
        ├── 📁 gamification/              ── Misiones diarias, insignias y niveles
        ├── 📁 members/                   ── Directorio de Desarrolladores de la Comunidad
        ├── 📁 admin/                     ── Panel de Moderación de Contenido
        ├── 📁 auth/                      ── Iniciar Sesión, Registrarse y Recuperar Contraseña
        ├── 📁 onboarding/                ── Wizard de Onboarding Inicial
        ├── 📁 layout/                    ── Header con navegación amigable y botón SaaS
        ├── 📁 bbmdev/                    ── Componentes visuales temáticos (AvatarInitials)
        └── 📁 ui/                        ── Primitivas UI accesibles (Dialog, Card, Button, Progress...)
```

---

## ⚙️ 4. Módulos y Funcionalidades Principales

### 4.1. Foro de Discusión e Interacción
- Permite publicar dudas técnicas, noticias o código formateado.
- Soporta filtros por categorías (`automatizacion`, `ia`, `webapps`, `comunidad`), ordenamiento por más recientes o populares, dar Me Gusta y responder comentarios.

### 4.2. Biblioteca de Recursos & 1-Click Copy
- Colección de recursos técnicos clasificados por tipo (`Skill`, `Plugin`, `Subagent`, `MCP Server`, `Tutorial`).
- **Dev-UX Feature**: Botones para copiar la configuración MCP en JSON para Antigravity IDE / Claude Desktop y el Prompt de la Skill en 1 solo clic.

### 4.3. Cursos, Lecciones y Quizzes Interactivos
- Cursos organizados por lecciones secuenciales.
- Al final de cada lección, se renderiza un **Quiz de Verificación** de conocimientos. Solo al responder correctamente se habilita la entrega de la recompensa de experiencia (XP).

### 4.4. Sala de Directos con Chat en Tiempo Real
- Visualización de transmisiones de YouTube Live integradas.
- Chat interactivo en vivo con subcolección en Firestore (`liveSessions/{liveId}/chat`), permitiendo a los desarrolladores chatear instantáneamente con su avatar y nombre.

### 4.5. Perfil de Desarrollador & Repositorios de GitHub
- Muestra la **DevCard** del perfil del usuario.
- Si el desarrollador ingresa su usuario de GitHub, la aplicación consulta automáticamente la API pública de GitHub (`api.github.com/users/{username}/repos`) para renderizar sus 3 repositorios destacados con estrellas y lenguaje principal.

### 4.6. Gamificación, XP y Niveles
- Recompensas automáticas por actividad (publicar, comentar, completar lecciones).
- Leaderboard global y semanal ordenado por experiencia acumulada ([ranking-page.tsx](file:///c:/Users/IAEGEA/ComunidadBBM/src/components/ranking/ranking-page.tsx)).

---

## 🏢 5. Arquitectura SaaS Multi-Inquilino (White-Label)

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
                 └──────────────────────────┘
```

### 5.1. Resolutor de Subdominios Edge ([middleware.ts](file:///c:/Users/IAEGEA/ComunidadBBM/src/middleware.ts))
Intercepta el encabezado `Host` en el borde del servidor, extrae el subdominio del cliente (ej: `acme.bbmdev.io`) e inyecta el header `x-tenant-id` en la petición.

### 5.2. Motor de Temas Dinámicos ([theme.ts](file:///c:/Users/IAEGEA/ComunidadBBM/src/lib/theme.ts))
Reescribe en tiempo de ejecución las variables CSS del documento HTML (`--primary`, `--background`, `--card`, `--ring`), permitiendo que cada comunidad adopte su propia identidad visual en 1 instante.

### 5.3. Portal Super-Admin SaaS ([saas-admin-page.tsx](file:///c:/Users/IAEGEA/ComunidadBBM/src/components/saas/saas-admin-page.tsx))
Panel centralizado con:
- Métricas financieras globales: **MRR**, **ARR**, Comunidades Activas y Churn.
- Simulador de Marcas Blancas para previsualizar la interfaz desde el punto de vista de cualquier comunidad cliente.
- Aprovisionador en 1 Clic para crear nuevas comunidades clientes.

### 5.4. Centro de Control e Inspección de Inquilinos ([tenant-control-panel.tsx](file:///c:/Users/IAEGEA/ComunidadBBM/src/components/saas/tenant-control-panel.tsx))
- **Monitoreo Financiero**: Diagnóstico visual de comunidades `🟢 Al día`, `🟡 Morosas (Past Due)`, `🔵 En Prueba` y `🔴 Suspendidas`.
- **Medidores de Consumo**: Barras de progreso de miembros activos y almacenamiento consumido vs. límites.
- **Acciones Rápidas de Administrador**:
  * 🔴 **Suspender**: Desactiva el acceso a la comunidad por falta de pago.
  * 🟢 **Reactivar**: Restablece el servicio al recibir el pago.
  * 📧 **Enviar Recordatorio de Cobro**: Notificación enviada al dueño del inquilino.

### 5.5. Landing Page B2B Commercial ([saas-landing-page.tsx](file:///c:/Users/IAEGEA/ComunidadBBM/src/components/saas/saas-landing-page.tsx))
Página de ventas orientada a empresas y academias para comercializar la solución marca blanca, con matriz comparativa de precios y checkout simulado con Stripe Connect.

---

## 🔒 6. Seguridad y Reglas NoSQL (SecOps)

### 6.1. Reglas de Firestore ([firestore.rules](file:///c:/Users/IAEGEA/ComunidadBBM/firestore.rules))
- Bloquea cualquier intento de usuarios no autorizados de alterar campos de rol (`role`) o estado (`status`).
- Las colecciones `users`, `posts`, `resources`, `courses` y `liveSessions` requieren autenticación explícita para la escritura.

### 6.2. Reglas de Storage ([storage.rules](file:///c:/Users/IAEGEA/ComunidadBBM/storage.rules))
- Limita las subidas de imágenes a formatos soportados (`image/*`).
- Valida límites de tamaño por carpeta: Avatars (<2MB), Portadas de Cursos (<5MB), Adjuntos (<10MB).

---

## 🛠️ 7. Manual de Operaciones y Comandos

### Servidor de Desarrollo
```bash
npm run dev
```

### Verificación Estricta de Tipos
```bash
npm run typecheck
```

### Ejecución de Pruebas Unitarias
```bash
npx vitest run
```

### Compilación para Producción (Turbopack)
```bash
npm run build
```

---

## 📌 Conclusión

**BBMDev** se encuentra 100% lista y optimizada como una solución de comunidad técnica y plataforma SaaS de Marca Blanca de alto rendimiento. Toda la base de código ha sido verificada y sincronizada en el repositorio oficial de GitHub.
