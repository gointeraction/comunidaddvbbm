# 🚀 BBMDev — Plataforma Comunitaria para Desarrolladores

<div align="center">


**Una comunidad moderna, gamificada y en tiempo real para desarrolladores de automatización, IA y desarrollo web.**

[![Next.js](https://img.shields.io/badge/Next.js-16.x-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.x-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Private-red?style=flat-square)](LICENSE)

🌐 **Live:** [https://bbmdevcomunidad.web.app](https://bbmdevcomunidad.web.app)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Características Principales](#-características-principales)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Módulos y Funcionalidades](#-módulos-y-funcionalidades)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Variables de Entorno](#-variables-de-entorno)
- [Scripts Disponibles](#-scripts-disponibles)
- [Estructura de Carpetas](#-estructura-de-carpetas)
- [Despliegue](#-despliegue)

---

## 🎯 Descripción General

**BBMDev** es una plataforma comunitaria SaaS diseñada para desarrolladores especializados en automatización, inteligencia artificial, aplicaciones web y ecosistemas de agentes de IA. La plataforma combina un foro de discusión, biblioteca de recursos, cursos, sesiones en vivo, gamificación y herramientas de colaboración en tiempo real en un único producto cohesivo.

La aplicación está construida como una **Single Page Application (SPA)** con Next.js, utilizando Firebase como backend principal (autenticación, base de datos en tiempo real Firestore, notificaciones push FCM) e integración con YouTube Live para transmisiones en directo.

---

## ✨ Características Principales

| Módulo | Funcionalidad | Estado |
|--------|--------------|--------|
| 🔐 Autenticación | Login, registro, recuperación de contraseña | ✅ Activo |
| 🧭 Onboarding | Wizard de configuración de perfil inicial | ✅ Activo |
| 💬 Foro | Posts, comentarios, likes, tags, moderación | ✅ Activo |
| 📚 Recursos | Skills, Plugins, Subagents, MCP Servers, Tutoriales | ✅ Activo |
| 🎓 Cursos | Cursos con lecciones, progreso y XP | ✅ Activo |
| 📡 Directos | Sesiones en vivo con YouTube Live | ✅ Activo |
| 👥 Miembros | Directorio de la comunidad con perfiles | ✅ Activo |
| 🏆 Ranking | Tabla de líderes semanal y global por XP | ✅ Activo |
| 🎮 Gamificación | Misiones, logros, niveles y recompensas XP | ✅ Activo |
| 👤 Perfil | Perfil personal, estadísticas, DevCard | ✅ Activo |
| 🔔 Notificaciones | Notificaciones push (FCM) y en-app | ✅ Activo |
| 🛡️ Administración | Panel admin con moderación y auditoría | ✅ Activo |

---

## 🛠️ Stack Tecnológico

### Frontend
- **[Next.js 16](https://nextjs.org/)** — Framework React con SSR y output standalone
- **[React 19](https://react.dev/)** — Biblioteca de UI
- **[TypeScript 5](https://www.typescriptlang.org/)** — Tipado estático
- **[Tailwind CSS 4](https://tailwindcss.com/)** — Framework de estilos utilitarios
- **[shadcn/ui](https://ui.shadcn.com/)** + **[Radix UI](https://www.radix-ui.com/)** — Componentes accesibles
- **[Framer Motion](https://www.framer.com/motion/)** — Animaciones
- **[Lucide React](https://lucide.dev/)** — Iconografía

### Backend & Servicios
- **[Firebase 11](https://firebase.google.com/)**
  - **Firestore** — Base de datos NoSQL en tiempo real
  - **Firebase Auth** — Autenticación de usuarios
  - **FCM (Firebase Cloud Messaging)** — Notificaciones push
  - **Firebase Hosting** — Despliegue y CDN
- **YouTube Live** — Integración de directos y transmisiones en vivo
- **[Prisma](https://www.prisma.io/)** + **SQLite** — ORM para datos locales/secundarios
- **[NextAuth](https://next-auth.js.org/)** — Capa de autenticación adicional

### Estado & Datos
- **[Zustand](https://zustand-demo.pmnd.rs/)** — Gestión de estado global
- **[TanStack Query](https://tanstack.com/query)** — Server state y caché
- **[TanStack Table](https://tanstack.com/table)** — Tablas de datos avanzadas
- **[React Hook Form](https://react-hook-form.com/)** + **[Zod](https://zod.dev/)** — Formularios y validación

### Utilidades
- **[next-pwa](https://github.com/DuCanh2912/next-pwa)** — Progressive Web App
- **[next-intl](https://next-intl-docs.vercel.app/)** — Internacionalización
- **[date-fns](https://date-fns.org/)** — Manipulación de fechas
- **[Recharts](https://recharts.org/)** — Gráficas y estadísticas
- **[MDXEditor](https://mdxeditor.dev/)** — Editor de Markdown rico

---

## 🏗️ Arquitectura del Proyecto

```
┌─────────────────────────────────────────────────┐
│                  Cliente (Browser)               │
│  Next.js SPA + Zustand Store + TanStack Query    │
└────────────────────────┬────────────────────────┘
                         │
          ┌──────────────┴──────────────┐
          │                             │
  ┌───────▼───────┐           ┌─────────▼──────┐
  │  Firebase     │           │   LiveKit       │
  │  ─ Auth       │           │  (Audio/Video)  │
  │  ─ Firestore  │           └────────────────┘
  │  ─ FCM        │
  │  ─ Hosting    │
  └───────────────┘
```

### Flujo de Navegación

```
Landing Page (pública)
    │
    ├── Login / Registro / Recuperar contraseña
    │
    └── [Autenticado]
            │
            ├── Onboarding Wizard (solo nuevos usuarios)
            │
            └── App Principal
                    ├── Foro
                    ├── Recursos
                    ├── Cursos
                    ├── Directos
                    ├── Miembros
                    ├── Ranking
                    ├── Gamificación
                    ├── Perfil
                    ├── Notificaciones
                    └── Admin (solo rol admin)
```

---

## 📦 Módulos y Funcionalidades

### 🔐 Autenticación (`/components/auth`)
- Formulario de **Login** con email y contraseña
- Formulario de **Registro** de nueva cuenta
- **Recuperación de contraseña** por email
- Integración con **Firebase Auth** + **NextAuth**
- Redirección automática según estado del usuario

### 🧭 Onboarding (`/components/onboarding`)
- Wizard multi-paso para nuevos usuarios
- Configuración de **nombre**, **intereses** y **nivel de experiencia**
- Escritura de **bio** personal
- Transición automática a la app al completar

### 💬 Foro (`/components/forum`)
- **Feed de posts** con ordenamiento por recientes o populares
- **Creación de posts** con título, contenido enriquecido y etiquetas
- **Sistema de comentarios** anidados
- **Likes** en posts y comentarios
- **Filtros por tags**: `automatizacion`, `ia`, `webapps`, `comunidad`
- **Moderación**: ocultar/mostrar posts (moderadores y admins)
- Integración con **Firestore** para datos en tiempo real

### 📚 Recursos (`/components/resources`)
Biblioteca comunitaria de recursos técnicos categorizada por tipo y nivel:

| Tipo | Descripción |
|------|-------------|
| **Skill** | Habilidades y capacidades para agentes |
| **Plugin** | Extensiones y plugins |
| **Subagent** | Subagentes especializados |
| **MCP Server** | Servidores de Model Context Protocol |
| **Agent Team** | Equipos de agentes coordinados |
| **Tutorial** | Guías y tutoriales paso a paso |

- Niveles: `Principiante`, `Intermedio`, `Avanzado`
- Sistema de **favoritos** y contador de **descargas**
- **Búsqueda** y filtros combinados
- **Subida de recursos** con adjuntos

### 🎓 Cursos (`/components/courses`)
- Catálogo de **cursos estructurados** con lecciones
- **Progreso por lección** con XP rewards
- Sistema de **inscripción**
- Vista de detalle con reproductor de contenido
- Indicador de **duración** y número de lecciones

### 📡 Directos (`/components/directos`)
- Calendario de **sesiones en vivo** programadas
- Estados: `Programado`, `En vivo`, `Finalizado`, `Cancelado`
- Integración con **YouTube Live** (reproductor integrado de directos y enlaces externos)
- Creación y edición de directos (para roles autorizados: administradores y autores)
- Ocultación automática de sesiones finalizadas y canceladas tras 24 horas de su programación

### 👥 Miembros (`/components/members`)
- **Directorio completo** de la comunidad
- **Búsqueda** por nombre y filtros por nivel e interés
- Tarjeta de perfil con XP, nivel y badges
- Vista de **perfil detallado** de cada miembro
- Indicador de **presencia online** en tiempo real

### 🏆 Ranking (`/components/ranking`)
- **Tabla de líderes semanal** por XP
- **Ranking global** histórico
- Visualización de posición propia dentro de la comunidad
- Podio con los **top 3** miembros destacados

### 🎮 Gamificación (`/components/gamification`)
Sistema completo de motivación y recompensas:

- **Puntos XP** por acciones: crear posts, comentar, recibir likes, completar lecciones
- **Sistema de niveles** con número de nivel y barra de progreso
- **Misiones** (diarias, semanales) con tareas específicas y recompensas XP
- **Logros** con rareza: `Common`, `Rare`, `Epic`, `Legendary`
- **Recompensas semanales** automáticas para el Top 3 del ranking
- Configuración flexible de XP por acción desde el panel admin

### 👤 Perfil (`/components/profile`)
- Visualización y **edición de perfil** completo
- **DevCard** exportable como imagen
- Estadísticas personales: posts, comentarios, XP, logros
- Historial de **actividad** y **logros desbloqueados**
- Gestión de **notificaciones** (push y email)

### 🔔 Notificaciones (`/components/notifications`)
Tipos de notificaciones soportadas:
- `new_comment` — Nuevo comentario en tu post
- `new_like` — Nuevo like en tu contenido
- `mention` — Mención de otro usuario
- `mission_completed` — Misión completada
- `rank_update` — Cambio en el ranking
- `directo_reminder` — Recordatorio de sesión en vivo
- `achievement_unlocked` — Logro desbloqueado

- **Notificaciones push** vía Firebase Cloud Messaging (FCM)
- Marcado como leída individual o **marcar todas como leídas**
- Badge con contador de no leídas en el header

### 🛡️ Administración (`/components/admin`)
Panel exclusivo para el rol `admin`:
- **Moderación de contenido**: ocultar/mostrar posts y comentarios
- **Gestión de usuarios**: suspender, cambiar rol
- **Log de auditoría**: registro de todas las acciones administrativas
- **Configuración de gamificación**: ajustar XP por acción y recompensas
- **Métricas de la plataforma**: usuarios, posts, cursos y recursos

---

## ⚙️ Instalación y Configuración

### Requisitos Previos
- **Node.js** >= 18.x
- **Bun** >= 1.x (recomendado) o npm/yarn
- **Firebase CLI** (`npm install -g firebase-tools`)
- Proyecto en **Firebase** configurado

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/gointeraction/comunidaddvbbm.git
cd comunidaddvbbm

# Instalar dependencias (con Bun)
bun install

# O con npm
npm install
```

### Configuración de Prisma

```bash
# Generar cliente de Prisma
bun run db:generate

# Aplicar esquema a la base de datos
bun run db:push
```

### Iniciar en Desarrollo

```bash
bun run dev
# o
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

---

## 🔑 Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Base de datos (Prisma + SQLite)
DATABASE_URL="file:./db/custom.db"

# Firebase Web SDK
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_VAPID_KEY=

# Firebase Admin SDK (servidor)
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

# NextAuth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
```

---

## 📜 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `bun run dev` | Inicia el servidor de desarrollo en el puerto 3000 |
| `bun run build` | Genera el build de producción |
| `bun run start` | Inicia el servidor de producción |
| `bun run lint` | Ejecuta ESLint para verificar el código |
| `bun run db:generate` | Genera el cliente de Prisma |
| `bun run db:push` | Sincroniza el esquema con la base de datos |
| `bun run db:migrate` | Crea y aplica migraciones |
| `bun run db:reset` | Resetea la base de datos |

---

## 📁 Estructura de Carpetas

```
comunidaddvbbm/
├── public/                    # Assets estáticos
│   ├── logo.svg
│   ├── manifest.json          # PWA manifest
│   └── robots.txt
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   └── livekit/       # Endpoint de tokens LiveKit
│   │   ├── globals.css        # Estilos globales
│   │   ├── layout.tsx         # Layout raíz
│   │   └── page.tsx           # Entrada principal (router SPA)
│   ├── components/
│   │   ├── admin/             # Panel de administración
│   │   ├── auth/              # Login, registro, recuperación
│   │   ├── bbmdev/           # Componentes específicos (Avatar, etc.)
│   │   ├── courses/           # Catálogo de cursos y lecciones
│   │   ├── directos/          # Sesiones en vivo
│   │   ├── forum/             # Foro de discusión
│   │   ├── gamification/      # Misiones, logros y niveles
│   │   ├── landing/           # Página de inicio pública
│   │   ├── layout/            # Header y Sidebar de la app
│   │   ├── members/           # Directorio de miembros
│   │   ├── notifications/     # Centro de notificaciones
│   │   ├── onboarding/        # Wizard de configuración inicial
│   │   ├── profile/           # Perfil de usuario
│   │   ├── ranking/           # Tabla de líderes
│   │   ├── resources/         # Biblioteca de recursos
│   │   └── ui/                # Componentes base (shadcn/ui)
│   ├── hooks/
│   │   ├── use-fcm.ts         # Hook para Firebase Cloud Messaging
│   │   ├── use-mobile.ts      # Detección de dispositivo móvil
│   │   ├── use-presence.ts    # Presencia online en tiempo real
│   │   ├── use-realtime.ts    # Suscripciones Firestore
│   │   └── use-toast.ts       # Notificaciones toast
│   ├── lib/
│   │   ├── auth.ts            # Configuración NextAuth
│   │   ├── db.ts              # Cliente Prisma
│   │   ├── firebase-admin.ts  # Firebase Admin SDK
│   │   ├── firebase-config.ts # Firebase Web SDK
│   │   ├── mock-data.ts       # Datos de desarrollo/demo
│   │   ├── queries/           # Funciones de consulta a Firestore
│   │   └── utils.ts           # Utilidades generales
│   ├── stores/
│   │   └── app-store.ts       # Store global con Zustand
│   └── types/
│       └── bbmdev.ts         # Definiciones TypeScript completas
├── prisma/
│   └── schema.prisma          # Esquema de base de datos
├── functions/                 # Firebase Cloud Functions
├── scripts/                   # Scripts de utilidad (seed, etc.)
├── examples/                  # Ejemplos de integraciones
├── .firebaserc                # Configuración proyecto Firebase
├── firebase.json              # Configuración despliegue Firebase
├── firestore.rules            # Reglas de seguridad Firestore
├── firestore.indexes.json     # Índices de Firestore
├── next.config.ts             # Configuración Next.js
├── tailwind.config.ts         # Configuración Tailwind CSS
└── package.json
```

---

## 🚀 Despliegue

### Firebase Hosting

Este proyecto está configurado para desplegarse en **Firebase Hosting** con **Cloud Functions** para el runtime de Next.js.

```bash
# Login en Firebase
firebase login

# Seleccionar proyecto
firebase use bbmdevcomunidad

# Build de producción
bun run build

# Desplegar
firebase deploy
```

### Variables de entorno en producción

Configura las variables de entorno en **Firebase Functions** antes del deploy:

```bash
firebase functions:config:set \
  nextauth.secret="TU_SECRET"
```

---

## 🧩 Modelo de Datos

### Entidades Principales

| Entidad | Descripción |
|---------|-------------|
| `User` | Perfil completo de usuario con XP, nivel y rol |
| `Post` | Publicación en el foro con tags y moderación |
| `Comment` | Comentario en un post |
| `Resource` | Recurso técnico (Skill, Plugin, MCP, etc.) |
| `Course` | Curso con lecciones y progreso |
| `Lesson` | Lección individual con recompensa XP |
| `LiveSession` | Sesión en vivo programada con YouTube Live |
| `Mission` | Misión gamificada con tareas y recompensas |
| `Achievement` | Logro desbloqueable por criterios específicos |
| `Notification` | Notificación in-app y/o push |
| `AuditLog` | Registro de acciones de moderación |

### Roles de Usuario

| Rol | Permisos |
|-----|----------|
| `member` | Leer, crear posts y comentarios, acceder recursos |
| `autor` | Mismos que member + publicar recursos y cursos |
| `moderador` | Mismos que autor + moderar contenido |
| `admin` | Acceso total + panel de administración |

---

## 📄 Licencia

Este proyecto es de uso privado. Todos los derechos reservados © 2026 BBMDev / GoInteraction.

---

<div align="center">

Hecho con ❤️ por el equipo de **BBMDev**

[🌐 bbmdevcomunidad.web.app](https://bbmdevcomunidad.web.app) · [📧 Contacto](mailto:contacto@bbmdev.com)

</div>

---

*Última actualización: Julio 2026*
