// AutoDev — Mock Data Layer
// Simulates Firebase Firestore data for development

import type {
  User, Post, Comment, Resource, Course, Lesson, LiveSession,
  RankingEntry, Mission, Achievement, UserAchievement, Notification,
  AuditLog, Counters, GamificationConfig,
} from '@/types/autodev';

const NOW = new Date().toISOString();
const DAY_AGO = new Date(Date.now() - 86400000).toISOString();
const WEEK_AGO = new Date(Date.now() - 604800000).toISOString();

// ── Users ──────────────────────────────────────────────
export const MOCK_USERS: User[] = [
  {
    uid: 'u-001', email: 'carlos@autodev.dev', displayName: 'Carlos Dev',
    avatarUrl: null, interests: ['automatizacion', 'ia'], level: 'avanzado',
    bio: 'Full-stack developer apasionado por la automatización con n8n y Claude AI. +5 años en webapps con Next.js y Firebase.',
    role: 'admin', status: 'active', suspendedUntil: null,
    xp: 4850, weeklyXP: 320, levelNumber: 12,
    postsCount: 45, commentsCount: 128, fcmToken: null,
    pushEnabled: true, emailNotifications: true,
    createdAt: '2026-01-15T10:00:00Z', updatedAt: NOW, lastActiveAt: NOW,
  },
  {
    uid: 'u-002', email: 'lucia@autodev.dev', displayName: 'Lucia AI',
    avatarUrl: null, interests: ['ia', 'comunidad'], level: 'intermedio',
    bio: 'Especialista en inteligencia artificial y agentes autónomos. Comparto mis experimentos con LLMs y RAG.',
    role: 'autor', status: 'active', suspendedUntil: null,
    xp: 3200, weeklyXP: 210, levelNumber: 9,
    postsCount: 32, commentsCount: 87, fcmToken: null,
    pushEnabled: true, emailNotifications: true,
    createdAt: '2026-02-01T10:00:00Z', updatedAt: NOW, lastActiveAt: NOW,
  },
  {
    uid: 'u-003', email: 'yvan@autodev.dev', displayName: 'Yvan Bot',
    avatarUrl: null, interests: ['automatizacion', 'webapps'], level: 'intermedio',
    bio: 'Automatizando todo lo que se pueda. n8n, Make, Zapier — si se puede automatizar, lo hago.',
    role: 'member', status: 'active', suspendedUntil: null,
    xp: 2100, weeklyXP: 145, levelNumber: 7,
    postsCount: 18, commentsCount: 54, fcmToken: null,
    pushEnabled: false, emailNotifications: true,
    createdAt: '2026-02-20T10:00:00Z', updatedAt: NOW, lastActiveAt: NOW,
  },
  {
    uid: 'u-004', email: 'maria@autodev.dev', displayName: 'Maria Web',
    avatarUrl: null, interests: ['webapps', 'comunidad'], level: 'principiante',
    bio: 'Aprendiendo desarrollo web y automatización. Mi objetivo es crear mi primera app SaaS este año.',
    role: 'member', status: 'active', suspendedUntil: null,
    xp: 450, weeklyXP: 30, levelNumber: 2,
    postsCount: 3, commentsCount: 12, fcmToken: null,
    pushEnabled: true, emailNotifications: false,
    createdAt: '2026-06-01T10:00:00Z', updatedAt: NOW, lastActiveAt: NOW,
  },
  {
    uid: 'u-005', email: 'pedro@autodev.dev', displayName: 'Pedro MCP',
    avatarUrl: null, interests: ['ia', 'automatizacion'], level: 'avanzado',
    bio: 'Contribuidor de MCP Servers y herramientas de IA. Construyo agentes con Claude y herramientas personalizadas.',
    role: 'autor', status: 'active', suspendedUntil: null,
    xp: 5100, weeklyXP: 380, levelNumber: 13,
    postsCount: 52, commentsCount: 156, fcmToken: null,
    pushEnabled: true, emailNotifications: true,
    createdAt: '2026-01-10T10:00:00Z', updatedAt: NOW, lastActiveAt: NOW,
  },
  {
    uid: 'u-006', email: 'ana@autodev.dev', displayName: 'Ana Skills',
    avatarUrl: null, interests: ['ia', 'webapps', 'comunidad'], level: 'intermedio',
    bio: 'Creadora de Skills para Claude AI. Comparto templates y flujos de trabajo para la comunidad.',
    role: 'autor', status: 'active', suspendedUntil: null,
    xp: 2800, weeklyXP: 190, levelNumber: 8,
    postsCount: 28, commentsCount: 72, fcmToken: null,
    pushEnabled: true, emailNotifications: true,
    createdAt: '2026-02-15T10:00:00Z', updatedAt: NOW, lastActiveAt: NOW,
  },
  {
    uid: 'u-007', email: 'jorge@autodev.dev', displayName: 'Jorge Automata',
    avatarUrl: null, interests: ['automatizacion'], level: 'principiante',
    bio: 'Principiante en automatización. Busco aprender n8n y crear mis primeros flujos productivos.',
    role: 'member', status: 'active', suspendedUntil: null,
    xp: 180, weeklyXP: 15, levelNumber: 1,
    postsCount: 1, commentsCount: 5, fcmToken: null,
    pushEnabled: false, emailNotifications: true,
    createdAt: '2026-06-20T10:00:00Z', updatedAt: NOW, lastActiveAt: NOW,
  },
  {
    uid: 'u-008', email: 'sofia@autodev.dev', displayName: 'Sofia IA',
    avatarUrl: null, interests: ['ia', 'automatizacion', 'webapps'], level: 'avanzado',
    bio: 'Investigadora en IA aplicada. Especialista en RAG, fine-tuning y despliegue de modelos en producción.',
    role: 'moderador', status: 'active', suspendedUntil: null,
    xp: 6200, weeklyXP: 410, levelNumber: 15,
    postsCount: 67, commentsCount: 203, fcmToken: null,
    pushEnabled: true, emailNotifications: true,
    createdAt: '2026-01-05T10:00:00Z', updatedAt: NOW, lastActiveAt: NOW,
  },
];

// ── Posts ──────────────────────────────────────────────
export const MOCK_POSTS: Post[] = [
  {
    postId: 'p-001', authorId: 'u-001', authorName: 'Carlos Dev', authorLevel: 'avanzado', authorAvatarUrl: null,
    title: 'Mi primer workflow en n8n para automatizar mi inbox',
    content: 'Hoy logré automatizar completamente mi bandeja de entrada usando n8n + Claude AI. El flujo clasifica correos, genera respuestas draft y las deja listas para revisión. El proceso tomó 3 horas de configuración pero ya me ahorra ~2h diarias. Comparto el JSON del workflow en los recursos.\n\nPasos:\n1. Trigger: Gmail → nuevo email\n2. Claude AI: clasifica y genera respuesta\n3. Router: soporte / ventas / personal\n4. Gmail: guarda como borrador\n\n¿Alguien más ha automatizado su inbox con n8n?',
    tags: ['automatizacion', 'ia'], likesCount: 24, likedByUser: false, commentsCount: 8,
    hidden: false, hiddenReason: null, createdAt: DAY_AGO, updatedAt: DAY_AGO,
  },
  {
    postId: 'p-002', authorId: 'u-002', authorName: 'Lucia AI', authorLevel: 'intermedio', authorAvatarUrl: null,
    title: 'Tutorial: Crear un RAG pipeline con Claude y Pinecone',
    content: 'Acabo de publicar un tutorial completo sobre cómo construir un pipeline RAG desde cero usando Claude API y Pinecone como vector store. Cubro: chunking de documentos, embedding, retrieval y generación aumentada.\n\nEl código está disponible en mi repo y los pasos están detallados paso a paso. Ideal para quienes quieren implementar RAG en producción sin frameworks pesados.\n\nTemas cubiertos:\n- Chunking strategies (fixed, semantic, recursive)\n- Embedding con Claude embeddings\n- Pinecone upsert y query\n- Prompt engineering para RAG\n- Evaluación de calidad del retrieval',
    tags: ['ia'], likesCount: 31, likedByUser: true, commentsCount: 14,
    hidden: false, hiddenReason: null, createdAt: WEEK_AGO, updatedAt: WEEK_AGO,
  },
  {
    postId: 'p-003', authorId: 'u-005', authorName: 'Pedro MCP', authorLevel: 'avanzado', authorAvatarUrl: null,
    title: 'Nuevo MCP Server para control de bases de datos PostgreSQL',
    content: 'Desarrollé un MCP Server que permite a Claude interactuar directamente con bases de datos PostgreSQL. Soporta: ejecución de queries, schema inspection, generación de migraciones y análisis de performance.\n\nCaracterísticas principales:\n- Read-only por defecto (seguro para producción)\n- Modo write con confirmación del usuario\n- Auto-completado de tablas y columnas\n- Explicación de queries en lenguaje natural\n\nLo publiqué como recurso en la plataforma. Déjenme saber qué otras funcionalidades les gustaría ver.',
    tags: ['ia', 'automatizacion'], likesCount: 18, likedByUser: false, commentsCount: 6,
    hidden: false, hiddenReason: null, createdAt: new Date(Date.now() - 172800000).toISOString(), updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    postId: 'p-004', authorId: 'u-003', authorName: 'Yvan Bot', authorLevel: 'intermedio', authorAvatarUrl: null,
    title: 'Comparativa: n8n vs Make vs Zapier para automatización web',
    content: 'Después de usar las 3 plataformas durante 6 meses, aquí va mi comparativa honesta:\n\n**n8n** (mi favorito)\n- Open source, self-hosted\n- Nodes para TODO\n- Curva de aprendizaje media\n- Gratis para self-hosting\n\n**Make**\n- UI más intuitiva\n- Excelente para no-developers\n- Pricing competitivo\n- Menos flexible que n8n\n\n**Zapier**\n- Más integraciones pre-built\n- Más caro\n- Soporte excelente\n- Curva de aprendizaje baja\n\nConclusión: n8n para devs, Make para equipos, Zapier para empresas.',
    tags: ['automatizacion'], likesCount: 42, likedByUser: true, commentsCount: 21,
    hidden: false, hiddenReason: null, createdAt: new Date(Date.now() - 259200000).toISOString(), updatedAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    postId: 'p-005', authorId: 'u-006', authorName: 'Ana Skills', authorLevel: 'intermedio', authorAvatarUrl: null,
    title: 'Skill de generación de documentación automática para APIs REST',
    content: 'Creé una Skill que genera documentación completa para APIs REST a partir del código fuente. Soporta OpenAPI 3.0 y genera: descripciones de endpoints, ejemplos de request/response, esquemas de errores y guías de autenticación.\n\nLa Skill analiza los decorators de tu framework (Express, FastAPI, NestJS) y produce documentación lista para producción.\n\nIncluye:\n- Detección automática de endpoints\n- Generación de ejemplos con datos reales\n- Soporte para autenticación Bearer/API Key\n- Exportación a Markdown y HTML',
    tags: ['ia', 'webapps'], likesCount: 15, likedByUser: false, commentsCount: 9,
    hidden: false, hiddenReason: null, createdAt: new Date(Date.now() - 345600000).toISOString(), updatedAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    postId: 'p-006', authorId: 'u-008', authorName: 'Sofia IA', authorLevel: 'avanzado', authorAvatarUrl: null,
    title: 'Fine-tuning de Claude para tareas especializadas: lecciones aprendidas',
    content: 'Después de 3 meses experimentando con fine-tuning de Claude para dominios específicos, quiero compartir las lecciones más importantes:\n\n1. Datos de entrenamiento: calidad > cantidad. 500 ejemplos bien curados superan a 5000 genéricos.\n2. Prompt templates: definir una estructura clara de entrada/salida mejora la consistencia.\n3. Evaluación: definir métricas claras antes de empezar (accuracy, F1, latencia).\n4. Costos: el fine-tuning se paga solo si el modelo base no alcanza >85% en tu tarea.\n\nEl post completo con código y datasets de ejemplo está en el recurso asociado.',
    tags: ['ia'], likesCount: 56, likedByUser: false, commentsCount: 32,
    hidden: false, hiddenReason: null, createdAt: new Date(Date.now() - 432000000).toISOString(), updatedAt: new Date(Date.now() - 432000000).toISOString(),
  },
];

// ── Comments ───────────────────────────────────────────
export const MOCK_COMMENTS: Record<string, Comment[]> = {
  'p-001': [
    { commentId: 'c-001', postId: 'p-001', authorId: 'u-002', authorName: 'Lucia AI', authorLevel: 'intermedio', authorAvatarUrl: null, content: '¡Increíble workflow! ¿Podrías compartir cómo manejas los attachments en los correos? Me interesa integrar algo similar para mi equipo.', likesCount: 5, likedByUser: false, hidden: false, createdAt: DAY_AGO, updatedAt: DAY_AGO },
    { commentId: 'c-002', postId: 'p-001', authorId: 'u-005', authorName: 'Pedro MCP', authorLevel: 'avanzado', authorAvatarUrl: null, content: 'Lo hice con Make pero me gustaría migrar a n8n. ¿El JSON del workflow es compatible o necesito adaptarlo?', likesCount: 3, likedByUser: true, hidden: false, createdAt: DAY_AGO, updatedAt: DAY_AGO },
    { commentId: 'c-003', postId: 'p-001', authorId: 'u-003', authorName: 'Yvan Bot', authorLevel: 'intermedio', authorAvatarUrl: null, content: '+1 por Claude AI en el pipeline. Yo lo uso para clasificar tickets de soporte y funciona muy bien con el modelo Haiku.', likesCount: 2, likedByUser: false, hidden: false, createdAt: DAY_AGO, updatedAt: DAY_AGO },
  ],
  'p-002': [
    { commentId: 'c-004', postId: 'p-002', authorId: 'u-001', authorName: 'Carlos Dev', authorLevel: 'avanzado', authorAvatarUrl: null, content: 'Excelente tutorial. El chunking semantic que propones es mucho mejor que el fixed para documentos largos. ¿Has probado con documentos en español?', likesCount: 8, likedByUser: false, hidden: false, createdAt: WEEK_AGO, updatedAt: WEEK_AGO },
    { commentId: 'c-005', postId: 'p-002', authorId: 'u-008', authorName: 'Sofia IA', authorLevel: 'avanzado', authorAvatarUrl: null, content: 'Muy buen recurso. Una sugerencia: agrega una sección sobre hybrid search (dense + sparse) que mejora bastante el retrieval en dominios técnicos.', likesCount: 6, likedByUser: false, hidden: false, createdAt: WEEK_AGO, updatedAt: WEEK_AGO },
  ],
};

// ── Resources ──────────────────────────────────────────
export const MOCK_RESOURCES: Resource[] = [
  {
    resourceId: 'r-001', authorId: 'u-001', authorName: 'Carlos Dev', title: 'n8n Inbox Automation Workflow',
    description: 'Workflow completo de n8n para automatizar la clasificación y respuesta de emails usando Claude AI. Incluye nodes de Gmail, Claude API, Router y Gmail Draft.',
    type: 'Plugin', level: 'Intermedio', coverUrl: '', content: '# n8n Inbox Automation\n\nWorkflow JSON listo para importar en n8n.',
    externalUrl: null, attachments: [{ id: 'a1', name: 'inbox-workflow.json', url: '#', size: 45000, mimeType: 'application/json' }],
    downloadsCount: 87, favoritesCount: 34, isFavorited: true, createdAt: DAY_AGO, updatedAt: DAY_AGO,
  },
  {
    resourceId: 'r-002', authorId: 'u-005', authorName: 'Pedro MCP', title: 'MCP Server — PostgreSQL Controller',
    description: 'MCP Server que permite a Claude interactuar con bases de datos PostgreSQL. Modo read-only seguro con opción de write confirmada.',
    type: 'MCP Server', level: 'Avanzado', coverUrl: '', content: '# PostgreSQL MCP Server\n\nInstalación y configuración.',
    externalUrl: 'https://github.com/pedromcp/postgres-mcp', attachments: [],
    downloadsCount: 142, favoritesCount: 56, isFavorited: false, createdAt: WEEK_AGO, updatedAt: WEEK_AGO,
  },
  {
    resourceId: 'r-003', authorId: 'u-002', authorName: 'Lucia AI', title: 'RAG Pipeline Template con Claude + Pinecone',
    description: 'Template completo para construir un pipeline RAG con Claude API y Pinecone. Incluye scripts de chunking, embedding y retrieval.',
    type: 'Skill', level: 'Intermedio', coverUrl: '', content: '# RAG Pipeline Template',
    externalUrl: null, attachments: [{ id: 'a2', name: 'rag-pipeline.zip', url: '#', size: 250000, mimeType: 'application/zip' }],
    downloadsCount: 203, favoritesCount: 78, isFavorited: true, createdAt: WEEK_AGO, updatedAt: WEEK_AGO,
  },
  {
    resourceId: 'r-004', authorId: 'u-006', authorName: 'Ana Skills', title: 'Skill — Generador de Documentación API REST',
    description: 'Skill que genera documentación OpenAPI 3.0 completa a partir del código fuente. Soporta Express, FastAPI y NestJS.',
    type: 'Skill', level: 'Intermedio', coverUrl: '', content: '# API Doc Generator Skill',
    externalUrl: null, attachments: [{ id: 'a3', name: 'api-doc-skill.md', url: '#', size: 12000, mimeType: 'text/markdown' }],
    downloadsCount: 95, favoritesCount: 41, isFavorited: false, createdAt: new Date(Date.now() - 345600000).toISOString(), updatedAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    resourceId: 'r-005', authorId: 'u-008', authorName: 'Sofia IA', title: 'Tutorial: Fine-tuning de Claude para Dominios Específicos',
    description: 'Tutorial completo con datasets de ejemplo, scripts de entrenamiento y métricas de evaluación para fine-tuning de Claude.',
    type: 'Tutorial', level: 'Avanzado', coverUrl: '', content: '# Fine-tuning Tutorial',
    externalUrl: null, attachments: [{ id: 'a4', name: 'finetune-guide.pdf', url: '#', size: 1500000, mimeType: 'application/pdf' }, { id: 'a5', name: 'datasets.zip', url: '#', size: 500000, mimeType: 'application/zip' }],
    downloadsCount: 312, favoritesCount: 89, isFavorited: false, createdAt: new Date(Date.now() - 432000000).toISOString(), updatedAt: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    resourceId: 'r-006', authorId: 'u-003', authorName: 'Yvan Bot', title: 'Agent Team — Automatización de Redes Sociales',
    description: 'Equipo de agentes que gestiona la publicación y respuesta en redes sociales. Incluye agente de contenido, agente de scheduling y agente de respuestas.',
    type: 'Agent Team', level: 'Avanzado', coverUrl: '', content: '# Social Media Agent Team',
    externalUrl: null, attachments: [],
    downloadsCount: 67, favoritesCount: 28, isFavorited: false, createdAt: new Date(Date.now() - 518400000).toISOString(), updatedAt: new Date(Date.now() - 518400000).toISOString(),
  },
  {
    resourceId: 'r-007', authorId: 'u-004', authorName: 'Maria Web', title: 'Subagent — Extractor de Datos de URLs',
    description: 'Subagent que extrae datos estructurados de cualquier URL. Ideal para web scraping ligero y extracción de información.',
    type: 'Subagent', level: 'Principiante', coverUrl: '', content: '# URL Data Extractor',
    externalUrl: null, attachments: [{ id: 'a6', name: 'extractor-subagent.json', url: '#', size: 8000, mimeType: 'application/json' }],
    downloadsCount: 45, favoritesCount: 19, isFavorited: false, createdAt: new Date(Date.now() - 604800000).toISOString(), updatedAt: new Date(Date.now() - 604800000).toISOString(),
  },
];

// ── Courses ────────────────────────────────────────────
export const MOCK_COURSES: Course[] = [
  {
    courseId: 'c-001', authorId: 'u-001', authorName: 'Carlos Dev', title: 'Automatización con n8n: De Cero a Producción',
    description: 'Aprende a crear flujos de automatización profesionales con n8n. Desde conceptos básicos hasta despliegue en producción con Claude AI.',
    coverUrl: '', durationMinutes: 420, lessonsCount: 8, enrolledCount: 156, isEnrolled: true, progress: 62, createdAt: '2026-03-01T10:00:00Z',
  },
  {
    courseId: 'c-002', authorId: 'u-002', authorName: 'Lucia AI', title: 'RAG con Claude: Construye tu Asistente Inteligente',
    description: 'Curso completo sobre Retrieval Augmented Generation con Claude API. Aprende a crear asistentes que responden sobre tus propios documentos.',
    coverUrl: '', durationMinutes: 360, lessonsCount: 6, enrolledCount: 98, isEnrolled: false, progress: 0, createdAt: '2026-04-01T10:00:00Z',
  },
  {
    courseId: 'c-003', authorId: 'u-005', authorName: 'Pedro MCP', title: 'MCP Servers: Crea Herramientas para Claude',
    description: 'Domina el Model Context Protocol y crea servidores de herramientas personalizados que extienden las capacidades de Claude.',
    coverUrl: '', durationMinutes: 300, lessonsCount: 5, enrolledCount: 67, isEnrolled: true, progress: 20, createdAt: '2026-05-01T10:00:00Z',
  },
  {
    courseId: 'c-004', authorId: 'u-008', authorName: 'Sofia IA', title: 'IA en Producción: Deploy de Modelos y MLOps',
    description: 'Aprende a desplegar modelos de IA en producción con buenas prácticas de MLOps, monitoreo y escalabilidad.',
    coverUrl: '', durationMinutes: 480, lessonsCount: 10, enrolledCount: 124, isEnrolled: false, progress: 0, createdAt: '2026-05-15T10:00:00Z',
  },
  {
    courseId: 'c-005', authorId: 'u-006', authorName: 'Ana Skills', title: 'Skills para Claude: Automatiza tu Flujo de Trabajo',
    description: 'Crea Skills personalizadas para Claude que automatiquen tareas repetitivas en tu día a día como desarrollador.',
    coverUrl: '', durationMinutes: 240, lessonsCount: 4, enrolledCount: 89, isEnrolled: false, progress: 0, createdAt: '2026-06-01T10:00:00Z',
  },
];

export const MOCK_LESSONS: Record<string, Lesson[]> = {
  'c-001': [
    { lessonId: 'l-001', courseId: 'c-001', title: 'Introducción a n8n y la automatización', content: '# ¿Qué es n8n?\n\nn8n es un workflow automation tool open-source...', order: 1, xpReward: 50, isCompleted: true },
    { lessonId: 'l-002', courseId: 'c-001', title: 'Instalación y configuración del entorno', content: '# Instalación\n\nPasos para instalar n8n en tu entorno...', order: 2, xpReward: 50, isCompleted: true },
    { lessonId: 'l-003', courseId: 'c-001', title: 'Tu primer workflow: Trigger + HTTP Request', content: '# Primer Workflow\n\nVamos a crear...', order: 3, xpReward: 50, isCompleted: true },
    { lessonId: 'l-004', courseId: 'c-001', title: 'Integración con Claude AI', content: '# Claude API en n8n\n\nConfigura el node de Claude...', order: 4, xpReward: 50, isCompleted: true },
    { lessonId: 'l-005', courseId: 'c-001', title: 'Automatización de emails con Gmail + Claude', content: '# Email Automation\n\nCombina Gmail trigger con Claude...', order: 5, xpReward: 50, isCompleted: true },
    { lessonId: 'l-006', courseId: 'c-001', title: 'Manejo de errores y reintentos', content: '# Error Handling\n\nEstrategias robustas...', order: 6, xpReward: 50, isCompleted: false },
    { lessonId: 'l-007', courseId: 'c-001', title: 'Despliegue en producción con Docker', content: '# Docker Deployment\n\nDockerfile y docker-compose...', order: 7, xpReward: 50, isCompleted: false },
    { lessonId: 'l-008', courseId: 'c-001', title: 'Proyecto final: End-to-end automation pipeline', content: '# Proyecto Final\n\nIntegra todo lo aprendido...', order: 8, xpReward: 100, isCompleted: false },
  ],
  'c-003': [
    { lessonId: 'l-009', courseId: 'c-003', title: '¿Qué es el Model Context Protocol?', content: '# MCP\n\nEl MCP es un protocolo...', order: 1, xpReward: 50, isCompleted: true },
    { lessonId: 'l-010', courseId: 'c-003', title: 'Arquitectura de un MCP Server', content: '# Arquitectura\n\nUn servidor MCP tiene...', order: 2, xpReward: 50, isCompleted: false },
    { lessonId: 'l-011', courseId: 'c-003', title: 'Tu primer MCP Server con TypeScript', content: '# Hello World MCP\n\nVamos a crear...', order: 3, xpReward: 50, isCompleted: false },
    { lessonId: 'l-012', courseId: 'c-003', title: 'MCP Server para bases de datos', content: '# DB MCP Server\n\nConecta Claude...', order: 4, xpReward: 50, isCompleted: false },
    { lessonId: 'l-013', courseId: 'c-003', title: 'Testing y publicación de tu MCP Server', content: '# Testing\n\nEstrategias de test...', order: 5, xpReward: 50, isCompleted: false },
  ],
};

// ── Live Sessions ──────────────────────────────────────
const NEXT_WEEK = new Date(Date.now() + 604800000).toISOString();
const NEXT_WEEK_2 = new Date(Date.now() + 864000000).toISOString();
const NEXT_WEEK_3 = new Date(Date.now() + 1296000000).toISOString();

export const MOCK_LIVES: LiveSession[] = [
  {
    liveId: 'lv-001', title: 'Workshop: Automatiza tu primer flujo n8n en vivo',
    description: 'Sesión en vivo donde construiremos un workflow de automatización completo desde cero. Trae tu laptop y sigue junto a nosotros.',
    hostId: 'u-001', hostName: 'Carlos Dev', scheduledAt: NEXT_WEEK, durationMinutes: 90,
    maxAttendees: 50, attendeesCount: 32, status: 'scheduled', streamUrl: null,
    isUserRegistered: false, isWaitlisted: false, createdAt: WEEK_AGO,
  },
  {
    liveId: 'lv-002', title: 'Ask Me Anything: Claude AI y MCP Servers',
    description: 'Sesión de preguntas y respuestas sobre Claude AI, MCP Servers y el futuro de los agentes autónomos. Todas las preguntas son bienvenidas.',
    hostId: 'u-005', hostName: 'Pedro MCP', scheduledAt: NEXT_WEEK_2, durationMinutes: 60,
    maxAttendees: 100, attendeesCount: 78, status: 'scheduled', streamUrl: null,
    isUserRegistered: true, isWaitlisted: false, createdAt: WEEK_AGO,
  },
  {
    liveId: 'lv-003', title: 'Demo: RAG Pipeline en Producción con 100K documentos',
    description: 'Demostración en vivo de un pipeline RAG escalable que maneja más de 100K documentos con latencia < 2s.',
    hostId: 'u-008', hostName: 'Sofia IA', scheduledAt: NEXT_WEEK_3, durationMinutes: 75,
    maxAttendees: 75, attendeesCount: 75, status: 'scheduled', streamUrl: null,
    isUserRegistered: false, isWaitlisted: true, createdAt: DAY_AGO,
  },
];

// ── Rankings ───────────────────────────────────────────
export const MOCK_RANKING: RankingEntry[] = [
  { uid: 'u-008', displayName: 'Sofia IA', avatarUrl: null, xp: 410, rank: 1, level: 'avanzado' },
  { uid: 'u-005', displayName: 'Pedro MCP', avatarUrl: null, xp: 380, rank: 2, level: 'avanzado' },
  { uid: 'u-001', displayName: 'Carlos Dev', avatarUrl: null, xp: 320, rank: 3, level: 'avanzado' },
  { uid: 'u-002', displayName: 'Lucia AI', avatarUrl: null, xp: 210, rank: 4, level: 'intermedio' },
  { uid: 'u-006', displayName: 'Ana Skills', avatarUrl: null, xp: 190, rank: 5, level: 'intermedio' },
  { uid: 'u-003', displayName: 'Yvan Bot', avatarUrl: null, xp: 145, rank: 6, level: 'intermedio' },
  { uid: 'u-004', displayName: 'Maria Web', avatarUrl: null, xp: 30, rank: 7, level: 'principiante' },
  { uid: 'u-007', displayName: 'Jorge Automata', avatarUrl: null, xp: 15, rank: 8, level: 'principiante' },
];

// ── Missions ───────────────────────────────────────────
export const MOCK_MISSIONS: Mission[] = [
  {
    missionId: 'm-001', title: 'Completa tu perfil', description: 'Agrega foto de perfil, biografía y al menos 1 interés a tu perfil.',
    xpReward: 100, tasks: [
      { id: 't1', type: 'avatar', label: 'Subir foto de perfil', target: 1 },
      { id: 't2', type: 'bio', label: 'Escribir biografía', target: 1 },
      { id: 't3', type: 'interest', label: 'Seleccionar intereses', target: 1 },
    ],
    progress: { t1: 0, t2: 1, t3: 1 }, completed: false, completedAt: null,
  },
  {
    missionId: 'm-002', title: 'Comenta en 3 posts', description: 'Deja comentarios significativos en al menos 3 posts del foro.',
    xpReward: 100, tasks: [
      { id: 't4', type: 'comment', label: 'Comentar en posts', target: 3 },
    ],
    progress: { t4: 2 }, completed: false, completedAt: null,
  },
  {
    missionId: 'm-003', title: 'Publica tu primer post', description: 'Comparte tu primer post en el foro comunitario.',
    xpReward: 100, tasks: [
      { id: 't5', type: 'post', label: 'Publicar en el foro', target: 1 },
    ],
    progress: { t5: 1 }, completed: true, completedAt: DAY_AGO,
  },
  {
    missionId: 'm-004', title: 'Inscríbete en un curso', description: 'Inscríbete en al menos 1 curso de la plataforma.',
    xpReward: 50, tasks: [
      { id: 't6', type: 'enrollment', label: 'Inscribirse en un curso', target: 1 },
    ],
    progress: { t6: 1 }, completed: true, completedAt: WEEK_AGO,
  },
];

// ── Achievements ───────────────────────────────────────
export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { achievementId: 'ach-001', code: 'FIRST_POST', title: 'Primer Post', description: 'Publica tu primer post en el foro', iconUrl: '', rarity: 'common', criteria: { type: 'post_count', threshold: 1 } },
  { achievementId: 'ach-002', code: 'COMMENTER_10', title: 'Comentarista', description: 'Deja 10 comentarios en el foro', iconUrl: '', rarity: 'common', criteria: { type: 'comment_count', threshold: 10 } },
  { achievementId: 'ach-003', code: 'TOP_10_WEEKLY', title: 'Top 10 Semanal', description: 'Termina en el Top 10 del ranking semanal', iconUrl: '', rarity: 'rare', criteria: { type: 'weekly_rank', threshold: 10 } },
  { achievementId: 'ach-004', code: 'ACTIVE_30', title: 'Días Activos', description: 'Alcanza 30 días de actividad consecutivos o acumulados', iconUrl: '', rarity: 'epic', criteria: { type: 'active_days', threshold: 30 } },
  { achievementId: 'ach-005', code: 'RESOURCE_AUTHOR', title: 'Autor de Recursos', description: 'Publica 5 recursos en la plataforma', iconUrl: '', rarity: 'rare', criteria: { type: 'resource_count', threshold: 5 } },
  { achievementId: 'ach-006', code: 'MENTOR', title: 'Mentor', description: 'Obtén 100 likes totales en tus respuestas', iconUrl: '', rarity: 'epic', criteria: { type: 'total_likes_received', threshold: 100 } },
  { achievementId: 'ach-007', code: 'WEEKLY_CHAMPION', title: 'Campeón Semanal', description: 'Termina en el puesto #1 del ranking semanal', iconUrl: '', rarity: 'legendary', criteria: { type: 'weekly_rank', threshold: 1 } },
  { achievementId: 'ach-008', code: 'COURSE_MASTER', title: 'Maestro de Cursos', description: 'Completa 3 cursos al 100%', iconUrl: '', rarity: 'epic', criteria: { type: 'courses_completed', threshold: 3 } },
];

export const MOCK_USER_ACHIEVEMENTS: UserAchievement[] = [
  { achievementId: 'FIRST_POST', unlockedAt: DAY_AGO, achievement: MOCK_ACHIEVEMENTS[0] },
  { achievementId: 'COMMENTER_10', unlockedAt: WEEK_AGO, achievement: MOCK_ACHIEVEMENTS[1] },
];

// ── Notifications ──────────────────────────────────────
export const MOCK_NOTIFICATIONS: Notification[] = [
  { notifId: 'n-001', type: 'new_comment', data: { postId: 'p-001', fromUserId: 'u-002' }, read: false, createdAt: new Date(Date.now() - 3600000).toISOString(), fromUserName: 'Lucia AI', targetTitle: 'Mi primer workflow en n8n para automatizar mi inbox' },
  { notifId: 'n-002', type: 'new_like', data: { postId: 'p-001', fromUserId: 'u-005' }, read: false, createdAt: new Date(Date.now() - 7200000).toISOString(), fromUserName: 'Pedro MCP', targetTitle: 'Mi primer workflow en n8n para automatizar mi inbox' },
  { notifId: 'n-003', type: 'achievement_unlocked', data: { achievementCode: 'FIRST_POST' }, read: true, createdAt: DAY_AGO, targetTitle: 'Primer Post' },
  { notifId: 'n-004', type: 'mission_completed', data: { missionId: 'm-003' }, read: true, createdAt: DAY_AGO, targetTitle: 'Publica tu primer post' },
  { notifId: 'n-005', type: 'rank_update', data: { rank: 3 }, read: false, createdAt: new Date(Date.now() - 14400000).toISOString(), targetTitle: 'Has subido al puesto #3 en el ranking semanal' },
  { notifId: 'n-006', type: 'directo_reminder', data: { liveId: 'lv-002' }, read: false, createdAt: new Date(Date.now() - 1800000).toISOString(), targetTitle: 'Ask Me Anything: Claude AI y MCP Servers' },
  { notifId: 'n-007', type: 'new_comment', data: { postId: 'p-002', fromUserId: 'u-001' }, read: true, createdAt: WEEK_AGO, fromUserName: 'Carlos Dev', targetTitle: 'Tutorial: Crear un RAG pipeline con Claude y Pinecone' },
];

// ── Audit Logs ─────────────────────────────────────────
export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { logId: 'al-001', actorId: 'u-001', actorName: 'Carlos Dev', action: 'hide_post', targetType: 'post', targetId: 'p-999', motivo: 'Contenido spam detectado', metadata: {}, timestamp: new Date(Date.now() - 86400000).toISOString() },
  { logId: 'al-002', actorId: 'u-001', actorName: 'Carlos Dev', action: 'change_role', targetType: 'user', targetId: 'u-008', motivo: 'Promoción a moderador por actividad destacada', metadata: { oldRole: 'autor', newRole: 'moderador' }, timestamp: new Date(Date.now() - 172800000).toISOString() },
  { logId: 'al-003', actorId: 'u-008', actorName: 'Sofia IA', action: 'suspend_user', targetType: 'user', targetId: 'u-999', motivo: 'Violación reiterada de las normas de la comunidad', metadata: { duration: '7d' }, timestamp: new Date(Date.now() - 259200000).toISOString() },
];

// ── Counters (Landing) ─────────────────────────────────
export const MOCK_COUNTERS: Counters = {
  developersCount: 619,
  postsCount: 1247,
  commentsCount: 3856,
  coursesCount: 12,
  resourcesCount: 89,
};

// ── Gamification Config ────────────────────────────────
export const MOCK_GAMIFICATION_CONFIG: GamificationConfig = {
  postXP: 10,
  commentXP: 5,
  taskXP: 15,
  likeReceivedXP: 5,
  weeklyRewards: { top1: 100, top2: 50, top3: 25 },
};

// ── Current User (logged in as u-001) ──────────────────
export const CURRENT_USER: User = MOCK_USERS[0];