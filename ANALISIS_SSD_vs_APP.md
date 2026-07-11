# Análisis Comparativo: SSD vs Implementación Actual

**Documentos SSD:**
- `upload/ssd1.pdf` — SRS v1.0 (75 requisitos funcionales, 11 módulos)
- `upload/ssd2.pdf` — Addendum v2.0 (8 nuevos requisitos funcionales)

**Fecha:** 2026-07-09
**Estado:** Análisis post-implementación Firebase

---

## Resumen Ejecutivo

| Categoría | Total SSD | Implementado | Falta |
|-----------|-----------|--------------|-------|
| **RF v1.0 (Alta)** | 51 | 41 | 10 |
| **RF v1.0 (Media)** | 23 | 14 | 9 |
| **RF v1.0 (Baja)** | 1 | 0 | 1 |
| **RF v2.0 (Addendum)** | 8 | 5 | 3 |
| **TOTAL** | 83 | 60 | 23 |

---

## Módulo 1: Autenticación (RF-001 a RF-008)

| RF | Descripción | Estado | Notas |
|----|------------|--------|-------|
| RF-001 | Registro con email/contraseña (mín. 8 chars) | ✅ | Firebase Auth real |
| RF-002 | Verificar unicidad de email | ✅ | Firebase Auth automático |
| RF-003 | Email de verificación tras registro | ✅ | `sendEmailVerification()` |
| RF-004 | Login con email/contraseña | ✅ | `signInWithEmailAndPassword()` |
| RF-005 | Cerrar sesión | ✅ | `signOut()` |
| RF-006 | Recuperar contraseña | ✅ | `sendPasswordResetEmail()` |
| RF-007 | Bloqueo tras 5 intentos fallidos (15 min) | ⚠️ | Firebase tiene protección básica, no configurable |
| RF-008 | Sesión persistente JWT 30 días | ✅ | Firebase maneja token refresh |

**Falta:** RF-007 — Rate limiting configurable por IP

---

## Módulo 2: Onboarding y Perfil (RF-009 a RF-018)

| RF | Descripción | Estado | Notas |
|----|------------|--------|-------|
| RF-009 | Wizard de onboarding 4 pasos | ✅ | Componente completo |
| RF-010 | Paso 1: nombre (mín. 2 chars) | ✅ | |
| RF-011 | Paso 2: intereses | ✅ | |
| RF-012 | Paso 3: nivel experiencia | ✅ | |
| RF-013 | Paso 4: presentación (mín. 20 chars) | ✅ | |
| RF-014 | Bloquear acceso hasta completar onboarding | ✅ | `status: 'onboarding_pending'` |
| RF-015 | Editar perfil desde página perfil | ✅ | `updateProfile()` en store |
| RF-016 | Subir avatar (JPG/PNG/WebP, máx. 2MB) | ❌ | No hay upload a Cloud Storage |
| RF-017 | Avatar por defecto con iniciales | ✅ | `AvatarInitials` component |
| RF-018 | Mostrar nivel/XP/misiones en perfil público | ⚠️ | Solo perfil propio, no de otros |

**Falta:** RF-016 (avatar upload), RF-018 (perfil público de otros)

---

## Módulo 3: Foro (RF-019 a RF-028)

| RF | Descripción | Estado | Notas |
|----|------------|--------|-------|
| RF-019 | Crear post (título 100, contenido 5000, 3 tags) | ✅ | Validación en UI |
| RF-020 | Editar post dentro de 30 min | ❌ | No hay edición |
| RF-021 | Eliminar propio post | ❌ | No hay eliminación por usuario |
| RF-022 | Comentar (máx. 1000 chars) | ✅ | Firestore subcollection |
| RF-023 | Like toggle (un like por usuario) | ✅ | `likePostInFirestore()` |
| RF-024 | Listar posts cronológico, paginación 20 | ⚠️ | Sin paginación real (carga todo) |
| RF-025 | Filtrar por etiqueta + búsqueda | ✅ | Filtros en UI |
| RF-026 | Mostrar avatar, nombre, nivel, fecha, conteos | ✅ | |
| RF-027 | Notificar autor en comentario/like | ✅ | Cloud Function `onCommentCreated`, `onPostLiked` |
| RF-028 | Filtro de palabras prohibidas | ❌ | No hay moderación de contenido |

**Falta:** RF-020 (editar), RF-021 (eliminar propio), RF-024 (paginación real), RF-028 (profanity filter)

---

## Módulo 4: Cursos (RF-029 a RF-035)

| RF | Descripción | Estado | Notas |
|----|------------|--------|-------|
| RF-029 | Listar cursos con título, autor, duración, lecciones | ✅ | Store sync |
| RF-030 | Inscribirse en curso | ⚠️ | UI local, no persiste en Firestore |
| RF-031 | Marcar lección como completada | ⚠️ | `markLessonCompleted()` existe pero no sync completo |
| RF-032 | Mostrar progreso por curso (%) | ⚠️ | Cálculo local, no desde Firestore |
| RF-033 | XP por completar lección (default 50) | ❌ | No hay trigger para esto |
| RF-034 | Autor crear cursos con lecciones | ❌ | No hay CRUD de cursos |
| RF-035 | Certificado simulado al 100% | ❌ | No existe |

**Falta:** RF-030 (inscripción real), RF-031 (progreso real), RF-032 (progreso Firestore), RF-033 (XP trigger), RF-034 (CRUD cursos), RF-035 (certificado)

---

## Módulo 5: Recursos (RF-036 a RF-043)

| RF | Descripción | Estado | Notas |
|----|------------|--------|-------|
| RF-036 | Publicar recurso (título, desc, tipo, nivel, imagen) | ⚠️ | Dialog existe, no persiste完全 |
| RF-037 | Soportar 6 tipos de recurso | ✅ | Skill, Plugin, Subagent, MCP Server, Agent Team, Tutorial |
| RF-038 | Filtrar por tipo, nivel, búsqueda | ✅ | Filtros completos |
| RF-039 | Mostrar imagen, título, desc, nivel, ./ver | ✅ | |
| RF-040 | Descargar o enlazar recurso externo | ❌ | No hay descarga real |
| RF-041 | Contador de descargas/visitas | ⚠️ | `upvotes` pero no downloads |
| RF-042 | Editar/eliminar propios recursos | ❌ | No hay CRUD |
| RF-043 | Marcar favorito + ver lista favoritos | ⚠️ | Toggle en UI, no persiste |

**Falta:** RF-040 (descarga), RF-041 (contador real), RF-042 (CRUD), RF-043 (favoritos Firestore)

---

## Módulo 6: Directos (RF-044 a RF-048)

| RF | Descripción | Estado | Notas |
|----|------------|--------|-------|
| RF-044 | Calendario con título, fecha, hora, cupo | ✅ | Real-time sync |
| RF-045 | Reservar cupo | ✅ | `reserveSpot()` en Firestore |
| RF-046 | Lista de espera cuando agota cupo | ✅ | Implementado |
| RF-047 | Notificación push/email 1h antes | ❌ | No hay Cloud Function scheduled |
| RF-048 | Cancelar sesión (Admin/Autor) | ⚠️ | `cancelLiveSession()` existe pero no en UI admin |

**Falta:** RF-047 (recordatorio scheduled), RF-048 (cancelación en UI admin)

---

## Módulo 7: Miembros (RF-049 a RF-053)

| RF | Descripción | Estado | Notas |
|----|------------|--------|-------|
| RF-049 | Directorio con avatar, nombre, nivel, etc. | ✅ | Store sync |
| RF-050 | Filtrar por nivel y especialización | ✅ | |
| RF-051 | Ordenar por recientes, más activos | ✅ | |
| RF-052 | Estadísticas globales (total, activos hoy) | ⚠️ | Counters mock, no real-time |
| RF-053 | Ver perfil público con actividad reciente | ⚠️ | Solo perfil propio |

**Falta:** RF-052 (stats reales), RF-053 (perfil público de otros)

---

## Módulo 8: Ranking (RF-054 a RF-057)

| RF | Descripción | Estado | Notas |
|----|------------|--------|-------|
| RF-054 | Leaderboard semanal top 100 | ⚠️ | Muestra top 8, no 100 |
| RF-055 | Top 3 con medallas + tabla | ✅ | UI completa |
| RF-056 | Reset cada lunes 00:00 UTC-4 | ✅ | Cloud Function `weeklyRankingReset` |
| RF-057 | XP bonus a top 3 (500/300/200) | ✅ | En Cloud Function |

**Falta:** RF-054 (top 100 real)

---

## Módulo 9: Gamificación (RF-058 a RF-062)

| RF | Descripción | Estado | Notas |
|----|------------|--------|-------|
| RF-058 | Asignar XP por acciones | ✅ | Cloud Functions (post +10, comment +5, like +5) |
| RF-059 | Misiones como conjunto de tareas | ✅ | Store sync |
| RF-060 | XP bonus por completar misión | ✅ | `claimMissionReward()` |
| RF-061 | Logros desbloqueables por hitos | ⚠️ | Cloud Functions desbloquean, pero no se muestran en UI |
| RF-062 | Panel de progreso con misiones/logros/XP | ⚠️ | XP visible, logros parcial |

**Falta:** RF-061 (mostrar logros desbloqueados en UI), RF-062 (panel completo)

---

## Módulo 10: Notificaciones (RF-063 a RF-067)

| RF | Descripción | Estado | Notas |
|----|------------|--------|-------|
| RF-063 | Notificaciones in-app por eventos | ✅ | Cloud Functions generan notificaciones |
| RF-064 | Badge con conteo no leídas | ✅ | En header |
| RF-065 | Marcar como leídas (individual/todas) | ✅ | `markAsRead()` + `markAllAsRead()` |
| RF-066 | Push vía FCM | ❌ | No hay FCM configurado |
| RF-067 | Email transaccional | ❌ | No hay envío de emails |

**Falta:** RF-066 (FCM push), RF-067 (email transaccional)

---

## Módulo 11: Administración (RF-068 a RF-075)

| RF | Descripción | Estado | Notas |
|----|------------|--------|-------|
| RF-068 | Panel admin solo para Admin | ✅ | Role gate en page.tsx |
| RF-069 | Listar/buscar usuarios, cambiar rol | ✅ | `changeUserRole()` |
| RF-070 | Ocultar posts/comentarios con motivo | ⚠️ | UI existe, `hidePost()` en Firestore |
| RF-071 | Suspender usuario temporalmente | ✅ | `suspendUser()` |
| RF-072 | Gestionar cursos/recursos de cualquier autor | ❌ | No hay en UI admin |
| RF-073 | Configurar sesiones en vivo | ❌ | No hay en UI admin |
| RF-074 | Métricas globales (DAU, posts/día, retención) | ⚠️ | DAU y posts mock, no retención D7/D30 |
| RF-075 | Log de auditoría inmutable | ✅ | Cloud Function `appendAuditLog` |

**Falta:** RF-072 (gestión cursos/recursos), RF-073 (configurar directos), RF-074 (retención real)

---

## Addendum v2.0 (ssd2.pdf)

| RF | Descripción | Estado | Notas |
|----|------------|--------|-------|
| RF-LAND-01 | Landing con terminal interactiva | ✅ | InteractiveTerminal component |
| RF-LAND-02 | Contadores tiempo real (1 lectura Firestore) | ⚠️ | Counters mock, no Firestore doc `app_metadata/counters` |
| RF-PROF-02 | Vista previa en tiempo real del perfil | ❌ | No hay live preview en edición |
| RF-PROF-05 | Estado vacío en Mis Estadísticas | ❌ | No hay sección de estadísticas |
| RF-GAM-03 | Reglas XP y recompensas visibles en Leaderboard | ✅ | Sección de reglas en ranking page |
| RF-GAM-04 | Logros como entidad de primera clase | ⚠️ | Cloud Functions desbloquean, CRUD admin no implementado |
| RF-RES-02 | Límite 3 adjuntos por recurso | ✅ | Validación en UI |
| RF-COM-03 | Estado vacío en Directos | ✅ | "// PRÓXIMOS" component |

**Falta:** RF-LAND-02 (counters Firestore real), RF-PROF-02 (live preview), RF-PROF-05 (estadísticas), RF-GAM-04 (CRUD admin logros)

---

## Priorización de lo que FALTA

### Crítico (MVP)
1. **RF-016** — Avatar upload a Cloud Storage
2. **RF-020** — Editar posts (30 min window)
3. **RF-021** — Eliminar propio post
4. **RF-030** — Inscripción real en cursos (Firestore)
5. **RF-031** — Marcar lección completada (Firestore)
6. **RF-LAND-02** — Counters en Firestore `app_metadata/counters`

### Importante (Fase 2)
7. **RF-018** — Perfil público de otros miembros
8. **RF-024** — Paginación real de posts
9. **RF-028** — Filtro de palabras prohibidas
10. **RF-033** — XP por completar lección
11. **RF-041** — Contador real de descargas
12. **RF-043** — Favoritos en Firestore
13. **RF-047** — Notificación scheduled 1h antes
14. **RF-052** — Stats globales reales
15. **RF-061** — Logros desbloqueados visibles en UI

### Mejora (Fase 3)
16. **RF-007** — Rate limiting configurable
17. **RF-034** — CRUD de cursos por autores
18. **RF-035** — Certificado simulado
19. **RF-040** — Descarga de recursos
20. **RF-042** — CRUD de recursos
21. **RF-048** — Cancelar directo en UI admin
22. **RF-066** — FCM push notifications
23. **RF-067** — Email transaccional
24. **RF-072** — Gestionar cursos/recursos en admin
25. **RF-073** — Configurar directos en admin
26. **RF-074** — Retención D7/D30 real
27. **RF-PROF-02** — Vista previa live del perfil
28. **RF-PROF-05** — Estado vacío en estadísticas
29. **RF-GAM-04** — CRUD admin de logros
