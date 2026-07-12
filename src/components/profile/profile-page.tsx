'use client';

import { useState, useRef, useCallback } from 'react';
import {
  MessageSquare,
  Eye,
  Bookmark,
  CalendarDays,
  Trophy,
  Edit3,
  Plus,
  Upload,
  Terminal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AvatarInitials } from '@/components/bbmdev/avatar-initials';
import { useAppStore } from '@/stores/app-store';
import { uploadAvatar } from '@/lib/firebase';
import type { Interest, ExperienceLevel } from '@/types/bbmdev';

const ALL_INTERESTS: Interest[] = ['automatizacion', 'ia', 'webapps', 'comunidad'];

const INTEREST_LABELS: Record<Interest, string> = {
  automatizacion: 'Automatización',
  ia: 'IA',
  webapps: 'WebApps',
  comunidad: 'Comunidad',
};

const LEVEL_LABELS: Record<ExperienceLevel, string> = {
  principiante: 'Principiante',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
};

const ROLE_LABELS: Record<string, string> = {
  member: 'Member',
  autor: 'Autor',
  moderador: 'Moderador',
  admin: 'Admin',
};

const ROLE_COLORS: Record<string, string> = {
  member: 'bg-slate-700 text-slate-200',
  autor: 'bg-blue-700/40 text-blue-300 border border-blue-700/50',
  moderador: 'bg-amber-700/40 text-amber-300 border border-amber-700/50',
  admin: 'bg-red-700/40 text-red-300 border border-red-700/50',
};

const LEVEL_COLORS: Record<string, string> = {
  principiante: 'bg-gray-600/50 text-gray-300',
  intermedio: 'bg-blue-600/50 text-blue-300',
  avanzado: 'bg-purple-600/50 text-purple-300',
};

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `hace ${days}d`;
}

// ── View Mode ────────────────────────────────────────────
function ProfileView() {
  const { currentUser, navigate } = useAppStore();
  if (!currentUser) return null;

  const hasNoActivity = currentUser.postsCount === 0 && currentUser.commentsCount === 0;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Large profile card */}
      <div className="glass-card rounded-xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <AvatarInitials
            name={currentUser.displayName}
            avatarUrl={currentUser.avatarUrl}
            size="xl"
            level={currentUser.level}
          />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-foreground truncate">
                {currentUser.displayName}
              </h2>
              <Badge className={ROLE_COLORS[currentUser.role] || ''}>
                {ROLE_LABELS[currentUser.role] || currentUser.role}
              </Badge>
              <Badge className={LEVEL_COLORS[currentUser.level] || ''}>
                Nv. {currentUser.levelNumber} · {LEVEL_LABELS[currentUser.level]}
              </Badge>
            </div>
            {currentUser.bio && (
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {currentUser.bio}
              </p>
            )}
            {currentUser.interests.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {currentUser.interests.map((i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="text-[#10B981] border-[#10B981]/30 bg-[#10B981]/5"
                  >
                    {INTEREST_LABELS[i]}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <Button
            variant="outline"
            className="border-[#10B981]/40 text-[#10B981] hover:bg-[#10B981]/10 shrink-0"
            onClick={() => navigate('perfil-editar')}
          >
            <Edit3 className="size-4" />
            Editar perfil
          </Button>
        </div>

        <Separator className="bg-border" />

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { label: 'XP Total', value: currentUser.xp.toLocaleString() },
            { label: 'XP Semanal', value: currentUser.weeklyXP.toLocaleString() },
            { label: 'Nivel', value: currentUser.levelNumber },
            { label: 'Posts', value: currentUser.postsCount },
            { label: 'Comentarios', value: currentUser.commentsCount },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-lg font-bold text-[#10B981]">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* My Stats section */}
      <div className="space-y-3">
        <div className="terminal-text flex items-center gap-2 text-sm">
          <span className="terminal-prompt">$</span>
          <span className="terminal-path">~/estadisticas</span>
        </div>
        {hasNoActivity ? (
          <div className="glass-card rounded-xl p-8 flex flex-col items-center justify-center gap-4 text-center">
            <p className="terminal-text terminal-comment text-sm">
              {'// sin datos aún'}
            </p>
            <Button
              onClick={() => navigate('foro')}
              className="bg-accent-blue hover:bg-accent-blue/80 text-white"
            >
              <Plus className="size-4" />
              Crear Post
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
            {[
              { icon: MessageSquare, label: 'Engagement', value: '85%', color: 'text-[#10B981]' },
              { icon: Eye, label: 'Views', value: '1.2K', color: 'text-terminal-green' },
              { icon: Bookmark, label: 'Saves', value: '47', color: 'text-terminal-amber' },
              { icon: CalendarDays, label: 'Active Days', value: '23', color: 'text-terminal-purple' },
            ].map((metric) => (
              <div
                key={metric.label}
                className="glass-card rounded-lg p-4 flex flex-col items-center gap-2 opacity-0 animate-fade-in-up"
              >
                <metric.icon className={`size-6 ${metric.color}`} />
                <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                <p className="text-xs text-muted-foreground">{metric.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Achievements section */}
      {false && (
        <div className="space-y-3">
          <div className="terminal-text flex items-center gap-2 text-sm">
            <span className="terminal-prompt">$</span>
            <span className="terminal-path">~/logros</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[].map((ua: any) => {
              const rarity = ua.achievement?.rarity || 'common';
              return (
                <div
                  key={ua.achievementId}
                  className={`glass-card rounded-lg p-3 border ${`rarity-${rarity}`} rarity-bg-${rarity} transition-transform hover:scale-[1.02]`}
                >
                  <div className="flex items-center gap-2">
                    <Trophy className="size-5" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{ua.achievement?.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {ua.achievement?.description}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {relativeTime(ua.unlockedAt)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Edit Mode ────────────────────────────────────────────
function ProfileEdit() {
  const { currentUser, navigate, updateProfile } = useAppStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [interests, setInterests] = useState<Interest[]>(currentUser?.interests || []);
  const [level, setLevel] = useState<ExperienceLevel>(currentUser?.level || 'principiante');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(currentUser?.avatarUrl || null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const toggleInterest = (i: Interest) => {
    setInterests((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  };

  // RF-016: Avatar upload with Firebase Storage
  const handleAvatarChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        // Validate file type and size (max 2MB)
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
          alert('Solo se permiten archivos JPG, PNG o WebP');
          return;
        }
        if (file.size > 2 * 1024 * 1024) {
          alert('El archivo no puede superar 2MB');
          return;
        }
        const url = URL.createObjectURL(file);
        setAvatarPreview(url);
        setAvatarFile(file);
      }
    },
    []
  );

  const handleSave = async () => {
    let avatarUrl = avatarPreview || undefined;

    // Upload avatar to Firebase Storage if a new file was selected
    if (avatarFile && currentUser) {
      setUploading(true);
      try {
        avatarUrl = await uploadAvatar(currentUser.uid, avatarFile);
      } catch (err) {
        console.warn('Error uploading avatar:', err);
      }
      setUploading(false);
    }

    updateProfile({
      displayName,
      bio,
      interests,
      level,
      avatarUrl,
    });
    navigate('perfil');
  };

  const handleCancel = () => {
    navigate('perfil');
  };

  // Preview data derived from form state
  const previewData = {
    displayName: displayName || 'Sin nombre',
    bio,
    interests,
    level,
    levelNumber: currentUser?.levelNumber || 1,
    role: currentUser?.role || 'member',
    xp: currentUser?.xp || 0,
    weeklyXP: currentUser?.weeklyXP || 0,
    postsCount: currentUser?.postsCount || 0,
    commentsCount: currentUser?.commentsCount || 0,
  };

  return (
    <div className="animate-fade-in-up">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Edit form */}
        <div className="glass-card rounded-xl p-6 space-y-5">
          {/* Avatar upload */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer"
              aria-label="Subir avatar"
            >
              <AvatarInitials
                name={previewData.displayName}
                avatarUrl={avatarPreview}
                size="xl"
                level={level}
              />
              <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="size-6 text-white" />
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <div>
              <p className="text-sm font-medium">Foto de perfil</p>
              <p className="text-xs text-muted-foreground">Haz clic para subir una imagen</p>
            </div>
          </div>

          {/* Display name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#10B981] terminal-text">
              Nombre a mostrar
            </label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Tu nombre"
              className="bg-background/50 border-border focus:border-[#10B981]/50"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#10B981] terminal-text">
              Biografía
            </label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Cuéntanos sobre ti..."
              rows={3}
              className="bg-background/50 border-border focus:border-[#10B981]/50 min-h-[80px]"
            />
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#10B981] terminal-text">
              Intereses
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_INTERESTS.map((i) => (
                <button
                  key={i}
                  onClick={() => toggleInterest(i)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all border ${
                    interests.includes(i)
                      ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/50'
                      : 'bg-secondary text-muted-foreground border-border hover:border-muted-foreground/50'
                  }`}
                >
                  {INTEREST_LABELS[i]}
                </button>
              ))}
            </div>
          </div>

          {/* Level */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#10B981] terminal-text">
              Nivel de experiencia
            </label>
            <div className="flex gap-2">
              {(Object.keys(LEVEL_LABELS) as ExperienceLevel[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all border ${
                    level === l
                      ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/50'
                      : 'bg-secondary text-muted-foreground border-border hover:border-muted-foreground/50'
                  }`}
                >
                  {LEVEL_LABELS[l]}
                </button>
              ))}
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={uploading} className="bg-[#10B981] text-background hover:bg-[#10B981]/90">
              {uploading ? 'Subiendo...' : 'Guardar cambios'}
              <Terminal className="size-4" />
              Guardar cambios
            </Button>
            <Button variant="outline" onClick={handleCancel} className="border-border">
              Cancelar
            </Button>
          </div>
        </div>

        {/* RIGHT: Live Preview */}
        <div className="lg:sticky lg:top-4 self-start">
          <div className="terminal-text terminal-comment text-xs mb-2">{'// vista previa'}</div>
          <div
            className="glass-card rounded-xl p-6 space-y-5"
            aria-live="polite"
            role="region"
            aria-label="Vista previa del perfil"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <AvatarInitials
                name={previewData.displayName}
                avatarUrl={avatarPreview}
                size="xl"
                level={level}
              />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-foreground truncate">
                    {previewData.displayName}
                  </h2>
                  <Badge className={ROLE_COLORS[previewData.role] || ''}>
                    {ROLE_LABELS[previewData.role]}
                  </Badge>
                  <Badge className={LEVEL_COLORS[level] || ''}>
                    Nv. {previewData.levelNumber} · {LEVEL_LABELS[level]}
                  </Badge>
                </div>
                {previewData.bio ? (
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {previewData.bio}
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground/50 italic">
                    Sin biografía...
                  </p>
                )}
                {previewData.interests.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {previewData.interests.map((i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="text-[#10B981] border-[#10B981]/30 bg-[#10B981]/5"
                      >
                        {INTEREST_LABELS[i]}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Separator className="bg-border" />

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {[
                { label: 'XP Total', value: previewData.xp.toLocaleString() },
                { label: 'XP Semanal', value: previewData.weeklyXP.toLocaleString() },
                { label: 'Nivel', value: previewData.levelNumber },
                { label: 'Posts', value: previewData.postsCount },
                { label: 'Comentarios', value: previewData.commentsCount },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-lg font-bold text-[#10B981]">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Profile Page ────────────────────────────────────
export function ProfilePage() {
  const { route } = useAppStore();

  const isEditing = route === 'perfil-editar';
  const headerPath = isEditing ? '~/perfil/editar' : '~/perfil';

  return (
    <div className="space-y-4">
      {/* Terminal header */}
      <div className="terminal-text flex items-center gap-2 text-sm">
        <span className="text-foreground font-semibold">bbmdev</span>
        <span className="text-muted-foreground">~/{headerPath}</span>
        <span className="animate-blink text-[#10B981]">▊</span>
      </div>

      {isEditing ? <ProfileEdit /> : <ProfileView />}
    </div>
  );
}
