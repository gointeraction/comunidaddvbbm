'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/stores/app-store';
import type { Post, Comment, ExperienceLevel } from '@/types/bbmdev';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Heart,
  MessageSquare,
  Tag,
  Search,
  Plus,
  ArrowLeft,
  Clock,
  Send,
  Filter,
} from 'lucide-react';

const TAG_OPTIONS = ['automatizacion', 'ia', 'webapps', 'general'] as const;
const TAG_LABELS: Record<string, string> = {
  todos: 'Todos',
  automatizacion: 'Automatización',
  ia: 'IA',
  webapps: 'WebApps',
  general: 'General',
};

const LEVEL_COLORS: Record<ExperienceLevel, string> = {
  principiante: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  intermedio: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  avanzado: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);
  const diffW = Math.floor(diffMs / 604800000);

  if (diffMin < 1) return 'ahora';
  if (diffMin < 60) return `hace ${diffMin}m`;
  if (diffH < 24) return `hace ${diffH}h`;
  if (diffD < 7) return `hace ${diffD}d`;
  return `hace ${diffW}w`;
}

// ── Post Card ──────────────────────────────────────────
function PostCard({ post }: { post: Post }) {
  const navigate = useAppStore((s) => s.navigate);
  const likePost = useAppStore((s) => s.likePost);

  return (
    <Card className="glass-card border-border/50 hover:border-primary/30 transition-colors">
      <CardContent className="p-4 md:p-5">
        {/* Author row */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-mono">
              {getInitials(post.authorName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-foreground">
              {post.authorName}
            </span>
            <Badge
              variant="outline"
              className={`text-[10px] px-1.5 py-0 ${LEVEL_COLORS[post.authorLevel]}`}
            >
              {post.authorLevel}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="size-3" />
              {relativeTime(post.createdAt)}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3
          className="font-semibold text-foreground cursor-pointer hover:text-primary transition-colors mb-2 text-sm md:text-base leading-snug"
          onClick={() =>
            navigate('foro-detalle', { postId: post.postId })
          }
        >
          {post.title}
        </h3>

        {/* Content preview */}
        <p className="text-muted-foreground text-sm leading-relaxed mb-3 line-clamp-2">
          {post.content}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-[10px] px-2 py-0 border-primary/30 text-primary/80 bg-primary/5"
            >
              <Tag className="size-2.5 mr-1" />
              {TAG_LABELS[tag] || tag}
            </Badge>
          ))}
        </div>

        <Separator className="mb-3 bg-border/50" />

        {/* Actions row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Like */}
            <button
              onClick={() => likePost(post.postId)}
              className="flex items-center gap-1.5 text-sm group transition-colors"
              aria-label={
                post.likedByUser ? 'Quitar me gusta' : 'Dar me gusta'
              }
            >
              <Heart
                className={`size-4 transition-colors ${
                  post.likedByUser
                    ? 'fill-red-500 text-red-500'
                    : 'text-muted-foreground group-hover:text-red-400'
                }`}
              />
              <span
                className={
                  post.likedByUser
                    ? 'text-red-400'
                    : 'text-muted-foreground'
                }
              >
                {post.likesCount}
              </span>
            </button>

            {/* Comments */}
            <button
              onClick={() =>
                navigate('foro-detalle', { postId: post.postId })
              }
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              aria-label="Ver comentarios"
            >
              <MessageSquare className="size-4" />
              <span>{post.commentsCount}</span>
            </button>
          </div>

          <button
            onClick={() =>
              navigate('foro-detalle', { postId: post.postId })
            }
            className="text-xs text-primary hover:underline cursor-pointer"
          >
            Ver más
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Post Detail ────────────────────────────────────────
function PostDetail() {
  const { posts, routeParams, navigate, createComment, likePost, likeComment, editPost, deleteOwnPost, currentUser } =
    useAppStore();
  const postId = routeParams.postId || '';
  const post = posts.find((p) => p.postId === postId);
  const [commentText, setCommentText] = useState('');
  const [localComments, setLocalComments] = useState<Comment[]>([]);
  const [localLikes, setLocalLikes] = useState<Record<string, boolean>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  function handleSubmitComment() {
    if (!commentText.trim() || !postId) return;
    createComment(postId, commentText.trim());
    const newComment: Comment = {
      commentId: 'c-' + Date.now(),
      postId,
      authorId: 'self',
      authorName: 'Tú',
      authorLevel: 'intermedio',
      authorAvatarUrl: null,
      content: commentText.trim(),
      likesCount: 0,
      likedByUser: false,
      hidden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setLocalComments((prev) => [...prev, newComment]);
    setCommentText('');
  }

  function handleLikeComment(commentId: string) {
    setLocalComments((prev) =>
      prev.map((c) => {
        if (c.commentId !== commentId) return c;
        const wasLiked = localLikes[commentId];
        setLocalLikes((l) => ({ ...l, [commentId]: !wasLiked }));
        return {
          ...c,
          likedByUser: !wasLiked,
          likesCount: wasLiked ? c.likesCount - 1 : c.likesCount + 1,
        };
      })
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p className="terminal-text">Post no encontrado</p>
        <Button
          variant="ghost"
          className="mt-4 text-primary"
          onClick={() => navigate('foro')}
        >
          <ArrowLeft className="size-4 mr-2" />
          Volver al foro
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {/* Back link */}
      <button
        onClick={() => navigate('foro')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="size-4" />
        Volver al foro
      </button>

      {/* Post */}
      <Card className="glass-card border-border/50 mb-6">
        <CardContent className="p-5 md:p-6">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-mono">
                {getInitials(post.authorName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium">{post.authorName}</span>
              <Badge
                variant="outline"
                className={`text-[10px] px-1.5 py-0 ${LEVEL_COLORS[post.authorLevel]}`}
              >
                {post.authorLevel}
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="size-3" />
                {relativeTime(post.createdAt)}
              </span>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-foreground mb-3">
            {post.title}
          </h2>

          <div className="rich-content text-sm text-muted-foreground leading-relaxed whitespace-pre-line mb-4">
            {post.content}
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-[10px] px-2 py-0 border-primary/30 text-primary/80 bg-primary/5"
              >
                <Tag className="size-2.5 mr-1" />
                {TAG_LABELS[tag] || tag}
              </Badge>
            ))}
          </div>

          <Separator className="mb-4 bg-border/50" />

          <div className="flex items-center gap-4">
            <button
              onClick={() => likePost(post.postId)}
              className="flex items-center gap-1.5 text-sm group transition-colors"
            >
              <Heart
                className={`size-5 transition-colors ${
                  post.likedByUser
                    ? 'fill-red-500 text-red-500'
                    : 'text-muted-foreground group-hover:text-red-400'
                }`}
              />
              <span
                className={
                  post.likedByUser
                    ? 'text-red-400'
                    : 'text-muted-foreground'
                }
              >
                {post.likesCount}
              </span>
            </button>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MessageSquare className="size-4" />
              {post.commentsCount}
            </span>

            {/* RF-020/021: Edit/Delete buttons for author */}
            {currentUser && currentUser.uid === post.authorId && (
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => {
                    setEditTitle(post.title);
                    setEditContent(post.content);
                    setIsEditing(true);
                  }}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  Editar
                </button>
                <button
                  onClick={() => {
                    if (confirm('¿Eliminar este post?')) {
                      deleteOwnPost(post.postId);
                      navigate('foro');
                    }
                  }}
                  className="text-xs text-muted-foreground hover:text-red-400 transition-colors cursor-pointer"
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>

          {/* Edit Form */}
          {isEditing && (
            <div className="mt-4 p-4 rounded-lg border border-primary/30 bg-primary/5 space-y-3">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Título"
                className="bg-secondary/50 border-border/50"
              />
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Contenido"
                rows={4}
                className="bg-secondary/50 border-border/50 resize-none"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    editPost(post.postId, editTitle, editContent, post.tags);
                    setIsEditing(false);
                  }}
                  disabled={!editTitle.trim() || !editContent.trim()}
                  className="bg-primary text-primary-foreground"
                >
                  Guardar
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Comments */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <MessageSquare className="size-4 text-primary" />
          Comentarios ({localComments.length})
        </h3>

        {localComments.length > 0 && (
          <div className="space-y-3 mb-6 max-h-96 overflow-y-auto custom-scrollbar">
            {localComments.map((comment) => (
              <Card
                key={comment.commentId}
                className="glass-card border-border/50"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-mono">
                        {getInitials(comment.authorName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {comment.authorName}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 ${LEVEL_COLORS[comment.authorLevel]}`}
                    >
                      {comment.authorLevel}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="size-3" />
                      {relativeTime(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {comment.content}
                  </p>
                  <button
                    onClick={() => handleLikeComment(comment.commentId)}
                    className="flex items-center gap-1 text-xs mt-2 text-muted-foreground hover:text-red-400 transition-colors"
                  >
                    <Heart
                      className={`size-3.5 ${
                        comment.likedByUser
                          ? 'fill-red-500 text-red-500'
                          : ''
                      }`}
                    />
                    {comment.likesCount}
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add comment */}
        <div className="flex gap-2">
          <Input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Añadir comentario..."
            className="flex-1 bg-secondary/50 border-border/50 text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmitComment();
              }
            }}
          />
          <Button
            size="icon"
            onClick={handleSubmitComment}
            disabled={!commentText.trim()}
            className="shrink-0"
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Category Config ──────────────────────────────────────
const CATEGORIES = [
  { id: 'automatizacion', label: 'automatizacion', icon: '🤖', color: 'bg-blue-500/20 border-blue-500/40' },
  { id: 'ia', label: 'ia', icon: '🧠', color: 'bg-purple-500/20 border-purple-500/40' },
  { id: 'webapps', label: 'webapps', icon: '💻', color: 'bg-cyan-500/20 border-cyan-500/40' },
  { id: 'general', label: 'general', icon: '💬', color: 'bg-gray-500/20 border-gray-500/40' },
];

// ── Create Post Dialog ─────────────────────────────────
function CreatePostDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const createPost = useAppStore((s) => s.createPost);
  const resources = useAppStore((s) => s.resources);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('general');
  const [showResources, setShowResources] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) return prev.filter((t) => t !== tag);
      if (prev.length >= 3) return prev;
      return [...prev, tag];
    });
  };

  const handlePublish = () => {
    const newErrors: { title?: string; content?: string } = {};
    if (!title.trim()) newErrors.title = 'El título es obligatorio';
    if (!content.trim() || content.length < 20) newErrors.content = 'Mínimo 20 caracteres';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const tags = selectedCategory ? [selectedCategory, ...selectedTags] : selectedTags;
    createPost(title.trim(), content.trim(), [...new Set(tags)]);
    setTitle('');
    setContent('');
    setSelectedTags([]);
    setSelectedCategory('general');
    setErrors({});
    onOpenChange(false);
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setSelectedTags([]);
    setSelectedCategory('general');
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl bg-[#0f172a] border-white/10 max-h-[90vh] overflow-y-auto custom-scrollbar p-0">
        {/* Terminal header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0a0f1a]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-xs font-mono text-gray-400">
              bbmdev@community: <span className="text-gray-300">~/foro/new-post.sh</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#10B981]">$ bbmdev post --create</span>
            <button
              onClick={handleCancel}
              className="ml-2 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column: Title + Content */}
            <div className="space-y-5">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-mono text-[#10B981]">$ titulo</label>
                <Input
                  value={title}
                  onChange={(e) => {
                    if (e.target.value.length <= 200) {
                      setTitle(e.target.value);
                      if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
                    }
                  }}
                  placeholder="> escribe un titulo claro y descriptivo..."
                  className="bg-transparent border border-white/10 text-white placeholder:text-gray-600 font-mono text-sm focus:border-[#10B981]/50"
                />
                <div className="flex justify-end">
                  <span className="text-[10px] font-mono text-gray-600">{title.length}/200</span>
                </div>
                {errors.title && (
                  <p className="text-xs text-red-400">{errors.title}</p>
                )}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <label className="text-sm font-mono text-[#10B981]">$ contenido</label>
                <div className="border border-white/10 rounded-lg overflow-hidden">
                  {/* Toolbar */}
                  <div className="flex items-center gap-1 px-3 py-2 border-b border-white/10 bg-white/5">
                    <span className="text-xs text-gray-400 px-2">Normal</span>
                    <div className="w-px h-4 bg-white/10 mx-1" />
                    <button className="p-1 text-gray-400 hover:text-white transition-colors"><b>B</b></button>
                    <button className="p-1 text-gray-400 hover:text-white transition-colors"><i>I</i></button>
                    <button className="p-1 text-gray-400 hover:text-white transition-colors font-mono text-xs">&lt;/&gt;</button>
                    <div className="w-px h-4 bg-white/10 mx-1" />
                    <button className="p-1 text-gray-400 hover:text-white transition-colors">≡</button>
                    <button className="p-1 text-gray-400 hover:text-white transition-colors">☰</button>
                    <button className="p-1 text-gray-400 hover:text-white transition-colors">🔗</button>
                  </div>
                  <Textarea
                    value={content}
                    onChange={(e) => {
                      if (e.target.value.length <= 5000) {
                        setContent(e.target.value);
                        if (errors.content) setErrors((prev) => ({ ...prev, content: undefined }));
                      }
                    }}
                    placeholder="Comparte tu conocimiento..."
                    rows={8}
                    className="bg-transparent border-0 text-white placeholder:text-gray-600 font-mono text-sm resize-none focus-visible:ring-0"
                  />
                </div>
                <span className="text-[10px] font-mono text-gray-600">minimo 20 caracteres</span>
                {errors.content && (
                  <p className="text-xs text-red-400">{errors.content}</p>
                )}
              </div>
            </div>

            {/* Right column: Categories + Attachments + Resources */}
            <div className="space-y-5">
              {/* Categories */}
              <div className="space-y-2">
                <label className="text-sm font-mono text-[#10B981]">$ categoria</label>
                <div className="space-y-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all cursor-pointer ${
                        selectedCategory === cat.id
                          ? `${cat.color} border-current`
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <span className="text-lg">{cat.icon}</span>
                      <span className="text-sm font-mono text-gray-200">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Attachments */}
              <div className="space-y-2">
                <label className="text-sm font-mono text-[#10B981]">$ adjuntos</label>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-dashed border-white/20 bg-white/5 hover:border-[#10B981]/40 hover:bg-[#10B981]/5 transition-all cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <span className="text-lg">🖼️</span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-300">subir imagen</p>
                      <p className="text-[10px] text-gray-500 font-mono">max 5MB</p>
                    </div>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-dashed border-white/20 bg-white/5 hover:border-[#10B981]/40 hover:bg-[#10B981]/5 transition-all cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <span className="text-lg">📎</span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-300">adjuntar archivo</p>
                      <p className="text-[10px] text-gray-500 font-mono">pdf, code, zip (max 10MB)</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Related Resources */}
              <div className="space-y-2">
                <button
                  onClick={() => setShowResources(!showResources)}
                  className="flex items-center gap-2 text-sm font-mono text-[#10B981] hover:text-[#34D399] transition-colors cursor-pointer"
                >
                  <span className="text-lg">📊</span>
                  <span>recursos relacionados</span>
                  <span className="ml-auto text-xs">{showResources ? '▲' : '▼'}</span>
                </button>
                {showResources && (
                  <div className="space-y-1 max-h-40 overflow-y-auto custom-scrollbar">
                    {resources.slice(0, 6).map((r) => (
                      <label
                        key={r.resourceId}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                      >
                        <input type="checkbox" className="w-3.5 h-3.5 rounded border-white/20 bg-transparent accent-[#10B981]" />
                        <span className="text-xs text-gray-300 truncate">{r.title}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/10">
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="text-gray-400 hover:text-white font-mono text-sm"
            >
              cancelar
            </Button>
            <Button
              onClick={handlePublish}
              className="bg-[#10B981] text-gray-950 hover:bg-[#34D399] font-mono font-semibold px-6 py-2 rounded-xl shadow-[0_0_22px_rgba(16,185,129,0.4)]"
            >
              <span className="mr-1">{'>'}</span> publicar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Forum Page (main export) ───────────────────────────
export default function ForumPage() {
  const { route, posts, navigate } = useAppStore();

  // Detail view
  if (route === 'foro-detalle') {
    return (
      <div className="space-y-1">
        <div className="terminal-text text-xs mb-6">
          <span className="terminal-prompt">bbmdev</span>{' '}
          <span className="terminal-path">~/foro</span>{' '}
          <span className="terminal-comment">— detalle</span>
        </div>
        <PostDetail />
      </div>
    );
  }

  return <ForumList />;
}

function ForumList() {
  const { posts, navigate } = useAppStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTag, setActiveTag] = useState('todos');
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState<'recientes' | 'populares'>('recientes');
  const [showFilters, setShowFilters] = useState(true);
  const [visibleCount, setVisibleCount] = useState(20);
  const PER_PAGE = 20;

  // Count posts per tag
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = { todos: 0, automatizacion: 0, ia: 0, webapps: 0, general: 0 };
    posts.filter(p => !p.hidden).forEach(p => {
      counts.todos++;
      p.tags.forEach(t => { if (t in counts) counts[t]++; });
    });
    return counts;
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let filtered = posts.filter((p) => {
      if (p.hidden) return false;
      if (activeTag !== 'todos' && !p.tags.includes(activeTag)) return false;
      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.authorName.toLowerCase().includes(q)
        );
      }
      return true;
    });

    if (sortBy === 'populares') {
      filtered = [...filtered].sort((a, b) => b.likesCount - a.likesCount);
    }

    return filtered;
  }, [posts, activeTag, searchText, sortBy]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  const filterChips = [
    { id: 'todos', label: 'todos', prefix: '*' },
    { id: 'automatizacion', label: 'automatizacion', prefix: '~/' },
    { id: 'ia', label: 'ia', prefix: '~/' },
    { id: 'webapps', label: 'webapps', prefix: '~/' },
    { id: 'general', label: 'general', prefix: '~/' },
  ] as const;

  return (
    <div className="space-y-5">
      {/* Post creation area */}
      <Card className="border border-white/10 bg-white/5">
        <CardContent className="p-4">
          <div
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-[#10B981]/20 flex items-center justify-center shrink-0">
              <span className="text-[#10B981] text-sm font-bold font-mono">J</span>
            </div>
            <div className="flex-1 flex items-center gap-2 text-gray-500 group-hover:text-gray-400 transition-colors">
              <span className="text-sm font-mono">{'>'} ¿qué estás construyendo hoy?</span>
            </div>
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setDialogOpen(true);
              }}
              className="bg-[#10B981] text-gray-950 hover:bg-[#34D399] shrink-0 rounded-xl"
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <CreatePostDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono text-[#10B981]">{filteredPosts.length} posts</span>
          <span className="text-gray-600">•</span>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="text-green-500">◉</span>
            <span className="font-mono">--{sortBy}</span>
          </div>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-sm text-gray-400 hover:text-gray-300"
        >
          <Filter className="size-3.5" />
          <span className="font-mono text-xs">buscar / filtrar</span>
          <span className="text-xs">{showFilters ? '▲' : '▼'}</span>
        </button>
      </div>

      {/* Filter section */}
      {showFilters && (
        <div className="space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
            <Input
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setVisibleCount(PER_PAGE);
              }}
              placeholder="grep ~/foro..."
              className="pl-11 bg-white/5 border border-white/10 text-white placeholder:text-gray-600 font-mono text-sm focus:border-[#10B981]/50"
            />
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSortBy(sortBy === 'recientes' ? 'populares' : 'recientes')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-sm text-gray-400"
            >
              <span className="text-green-500">◉</span>
              <span className="font-mono text-xs">--{sortBy}</span>
              <span className="text-xs">▼</span>
            </button>
          </div>

          {/* Category chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {filterChips.map((chip) => {
              const count = tagCounts[chip.id] || 0;
              const isActive = activeTag === chip.id;
              return (
                <button
                  key={chip.id}
                  onClick={() => setActiveTag(chip.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-mono transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-[#10B981] text-gray-950 border-[#10B981] font-semibold'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-300'
                  }`}
                >
                  {chip.id === 'todos' ? (
                    <span className={isActive ? 'text-gray-950' : 'text-[#10B981]'}>*</span>
                  ) : (
                    <span className={isActive ? 'text-gray-950' : 'text-gray-500'}>~/</span>
                  )}
                  <span>{chip.label}</span>
                  {count > 0 && (
                    <span className={`text-xs ${isActive ? 'text-gray-700' : 'text-gray-600'}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Posts */}
        <div className="lg:col-span-2 space-y-3">
          {visiblePosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-sm font-mono">{'// no se encontraron posts'}</p>
              <p className="text-gray-600 text-xs font-mono mt-1">Prueba con otros filtros o crea una nueva publicación</p>
            </div>
          ) : (
            <>
              {visiblePosts.map((post, idx) => (
                <PostCard key={`${post.postId}-${idx}`} post={post} />
              ))}
              {hasMore && (
                <div className="flex justify-center pt-4">
                  <Button variant="outline" onClick={() => setVisibleCount((prev) => prev + PER_PAGE)} className="border-white/10 text-gray-400 hover:bg-white/5 hover:text-white font-mono text-xs">
                    {'>'} cargar más
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right column: Widgets */}
        <div className="hidden lg:block space-y-4">
          {/* Resources Widget */}
          <ResourcesWidget />

          {/* Gamification Widget */}
          <GamificationWidget />

          {/* Trending Widget */}
          <TrendingWidget />
        </div>
      </div>
    </div>
  );
}

// ── Resources Widget ──────────────────────────────────────
function ResourcesWidget() {
  const resources = useAppStore((s) => s.resources);
  const navigate = useAppStore((s) => s.navigate);

  const recentResources = resources.slice(0, 5);

  function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    if (hours < 1) return 'ahora';
    if (hours < 24) return `${hours} horas`;
    if (days < 7) return `${days} dias, ${hours % 24} horas`;
    return `${weeks} semana${weeks > 1 ? 's' : ''}`;
  }

  const TYPE_ICONS: Record<string, string> = {
    Skill: '🧠', Plugin: '🔌', Subagent: '🤖', 'MCP Server': '⚙️', 'Agent Team': '👥', Tutorial: '📚',
  };

  return (
    <div className="border border-white/10 rounded-xl bg-white/5 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-lg">📊</span>
          <span className="font-mono text-sm text-white">$ recursos <span className="text-gray-500">--last</span></span>
        </div>
        <button onClick={() => navigate('recursos')} className="text-xs font-mono text-[#10B981] hover:text-[#34D399] cursor-pointer">
          ver todos
        </button>
      </div>
      <div className="divide-y divide-white/5">
        {recentResources.map((r) => (
          <div key={r.resourceId} className="px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => navigate('recurso-detalle', { resourceId: r.resourceId })}>
            <p className="text-sm text-white leading-snug line-clamp-2">{r.title}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30">{r.type}</span>
              <span className="text-[10px] text-gray-600 font-mono">{timeAgo(r.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Gamification Widget ───────────────────────────────────
function GamificationWidget() {
  const currentUser = useAppStore((s) => s.currentUser);
  const missions = useAppStore((s) => s.missions);
  const [showCompleted, setShowCompleted] = useState(false);

  if (!currentUser) return null;

  const activeMissions = missions.filter(m => !m.completed);
  const completedMissions = missions.filter(m => m.completed);
  const totalTasks = activeMissions.reduce((sum, m) => sum + m.tasks.length, 0);
  const completedTasks = activeMissions.reduce((sum, m) => sum + Object.values(m.progress || {}).filter(v => v > 0).length, 0);
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="border border-[#10B981]/30 rounded-xl bg-[#10B981]/5 overflow-hidden">
      <div className="px-4 py-3 border-b border-[#10B981]/20">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <span>🎁</span> Gana XP extra
          </h3>
          <span className="text-xs font-mono text-[#10B981]">{progressPercent}%</span>
        </div>
        <p className="text-[10px] text-gray-500 mt-1">Completa acciones opcionales para subir de nivel</p>
        <div className="w-full h-1.5 rounded-full bg-gray-700 overflow-hidden mt-2">
          <div className="h-full rounded-full bg-[#10B981] transition-all" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>
      <div className="divide-y divide-white/5">
        {activeMissions.slice(0, 4).map((m) => {
          const completed = Object.values(m.progress || {}).filter(v => v > 0).length;
          return (
            <div key={m.missionId} className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">○</span>
                <span className="text-sm text-gray-300">{m.title}</span>
                {m.tasks.length > 1 && <span className="text-[10px] text-gray-600">({completed}/{m.tasks.length})</span>}
              </div>
              <span className="text-[10px] font-mono text-[#10B981]">+{m.xpReward} XP</span>
            </div>
          );
        })}
      </div>
      {completedMissions.length > 0 && (
        <div className="border-t border-white/5">
          <button onClick={() => setShowCompleted(!showCompleted)} className="w-full px-4 py-2 flex items-center justify-between text-xs text-gray-500 hover:text-gray-400 cursor-pointer">
            <span className="flex items-center gap-1">{showCompleted ? '▼' : '›'} Completados ({completedMissions.length})</span>
          </button>
          {showCompleted && (
            <div className="divide-y divide-white/5">
              {completedMissions.map((m) => (
                <div key={m.missionId} className="px-4 py-2 flex items-center gap-2">
                  <span className="text-[#10B981]">✓</span>
                  <span className="text-sm text-gray-500 line-through">{m.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Trending Widget ───────────────────────────────────────
function TrendingWidget() {
  const posts = useAppStore((s) => s.posts);

  const trendingPosts = useMemo(() => {
    return [...posts]
      .filter(p => !p.hidden)
      .sort((a, b) => (b.likesCount + b.commentsCount) - (a.likesCount + a.commentsCount))
      .slice(0, 5);
  }, [posts]);

  return (
    <div className="border border-white/10 rounded-xl bg-white/5 overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10">
        <span className="font-mono text-sm text-white flex items-center gap-2">
          <span className="text-orange-400">🔥</span> $ trending
        </span>
      </div>
      <div className="divide-y divide-white/5">
        {trendingPosts.map((post, idx) => (
          <div key={`${post.postId}-trending-${idx}`} className="px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer">
            <p className="text-sm text-white leading-snug line-clamp-2">👋 {post.authorName} se presenta</p>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="flex items-center gap-1 text-[10px] text-gray-500">
                <span>❤️</span> {post.likesCount}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-gray-500">
                <span>💬</span> {post.commentsCount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}