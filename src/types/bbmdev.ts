// BBMDev — Type Definitions (v2.0)
// Based on SRS v1.0 + Addendum v2.0

export type UserRole = 'member' | 'autor' | 'moderador' | 'admin';
export type UserStatus = 'onboarding_pending' | 'active' | 'suspended';
export type ExperienceLevel = 'principiante' | 'intermedio' | 'avanzado';
export type Interest = 'automatizacion' | 'ia' | 'webapps' | 'comunidad';
export type ResourceLevel = 'Principiante' | 'Intermedio' | 'Avanzado';
export type ResourceType = 'Skill' | 'Plugin' | 'Subagent' | 'MCP Server' | 'Agent Team' | 'Tutorial';
export type LiveStatus = 'scheduled' | 'live' | 'ended' | 'cancelled';
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type NotificationType = 'new_comment' | 'new_like' | 'mention' | 'mission_completed' | 'rank_update' | 'directo_reminder' | 'achievement_unlocked';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  interests: Interest[];
  level: ExperienceLevel;
  bio: string;
  role: UserRole;
  status: UserStatus;
  suspendedUntil: string | null;
  xp: number;
  weeklyXP: number;
  levelNumber: number;
  postsCount: number;
  commentsCount: number;
  fcmToken: string | null;
  pushEnabled: boolean;
  emailNotifications: boolean;
  createdAt: string;
  updatedAt: string;
  lastActiveAt: string;
}

export interface Post {
  postId: string;
  authorId: string;
  authorName: string;
  authorLevel: ExperienceLevel;
  authorAvatarUrl: string | null;
  title: string;
  content: string;
  tags: string[];
  likesCount: number;
  likedByUser: boolean;
  commentsCount: number;
  hidden: boolean;
  hiddenReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  commentId: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorLevel: ExperienceLevel;
  authorAvatarUrl: string | null;
  content: string;
  likesCount: number;
  likedByUser: boolean;
  hidden: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  resourceId: string;
  authorId: string;
  authorName: string;
  title: string;
  description: string;
  type: ResourceType;
  level: ResourceLevel;
  coverUrl: string;
  content: string;
  externalUrl: string | null;
  attachments: Attachment[];
  downloadsCount: number;
  favoritesCount: number;
  isFavorited: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
}

export interface Course {
  courseId: string;
  authorId: string;
  authorName: string;
  title: string;
  description: string;
  coverUrl: string;
  durationMinutes: number;
  lessonsCount: number;
  enrolledCount: number;
  isEnrolled: boolean;
  progress: number;
  createdAt: string;
  externalUrl?: string | null;
}

export interface Lesson {
  lessonId: string;
  courseId: string;
  title: string;
  content: string;
  order: number;
  xpReward: number;
  isCompleted: boolean;
}

export interface LiveSession {
  liveId: string;
  title: string;
  description: string;
  hostId: string;
  hostName: string;
  scheduledAt: string;
  durationMinutes: number;
  maxAttendees: number;
  attendeesCount: number;
  status: LiveStatus;
  streamUrl: string | null;
  isUserRegistered: boolean;
  isWaitlisted: boolean;
  createdAt: string;
}

export interface RankingEntry {
  uid: string;
  displayName: string;
  avatarUrl: string | null;
  xp: number;
  rank: number;
  level: ExperienceLevel;
}

export interface Mission {
  missionId: string;
  title: string;
  description: string;
  xpReward: number;
  tasks: MissionTask[];
  progress: Record<string, number>;
  completed: boolean;
  completedAt: string | null;
}

export interface MissionTask {
  id: string;
  type: string;
  label: string;
  target: number;
}

export interface Achievement {
  achievementId: string;
  code: string;
  title: string;
  description: string;
  iconUrl: string;
  rarity: AchievementRarity;
  criteria: { type: string; threshold: number };
}

export interface UserAchievement {
  achievementId: string;
  unlockedAt: string;
  contextSnapshot?: Record<string, unknown>;
  achievement?: Achievement;
}

export interface Notification {
  notifId: string;
  type: NotificationType;
  data: Record<string, unknown>;
  read: boolean;
  createdAt: string;
  fromUserName?: string;
  fromUserAvatar?: string | null;
  targetTitle?: string;
}

export interface AuditLog {
  logId: string;
  actorId: string;
  actorName: string;
  action: string;
  targetType: string;
  targetId: string;
  motivo: string;
  metadata: Record<string, unknown>;
  timestamp: string;
}

export interface Counters {
  developersCount: number;
  postsCount: number;
  commentsCount: number;
  coursesCount: number;
  resourcesCount: number;
}

export interface GamificationConfig {
  postXP: number;
  commentXP: number;
  taskXP: number;
  likeReceivedXP: number;
  weeklyRewards: { top1: number; top2: number; top3: number };
}

export type Route =
  | 'landing'
  | 'login'
  | 'registro'
  | 'recuperar-contrasena'
  | 'onboarding'
  | 'foro'
  | 'foro-detalle'
  | 'recursos'
  | 'recurso-detalle'
  | 'cursos'
  | 'curso-detalle'
  | 'leccion'
  | 'directos'
  | 'miembros'
  | 'miembro-perfil'
  | 'ranking'
  | 'perfil'
  | 'perfil-editar'
  | 'mis-estadisticas'
  | 'gamificacion'
  | 'notificaciones'
  | 'admin';