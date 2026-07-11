'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/stores/app-store';
import { MOCK_COMMENTS } from '@/lib/mock-data';
import type { Post, Comment, ExperienceLevel } from '@/types/autodev';

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
  const { posts, routeParams, navigate, createComment, likePost, likeComment } =
    useAppStore();
  const postId = routeParams.postId || '';
  const post = posts.find((p) => p.postId === postId);
  const [commentText, setCommentText] = useState('');
  const [localComments, setLocalComments] = useState<Comment[]>(
    MOCK_COMMENTS[postId] || []
  );
  const [localLikes, setLocalLikes] = useState<Record<string, boolean>>({});

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
          </div>
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

// ── Create Post Dialog ─────────────────────────────────
function CreatePostDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const createPost = useAppStore((s) => s.createPost);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>(
    {}
  );

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
    if (!content.trim()) newErrors.content = 'El contenido es obligatorio';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    createPost(title.trim(), content.trim(), selectedTags);
    setTitle('');
    setContent('');
    setSelectedTags([]);
    setErrors({});
    onOpenChange(false);
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setSelectedTags([]);
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border/50 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="terminal-text text-primary">
            ~/nuevo-post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Title */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm text-muted-foreground">Título</label>
              <span className="text-[10px] text-muted-foreground terminal-text">
                {title.length}/100
              </span>
            </div>
            <Input
              value={title}
              onChange={(e) => {
                if (e.target.value.length <= 100) {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
                }
              }}
              placeholder="Título de tu publicación"
              className="bg-secondary/50 border-border/50"
            />
            {errors.title && (
              <p className="text-xs text-terminal-red">{errors.title}</p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm text-muted-foreground">Contenido</label>
              <span className="text-[10px] text-muted-foreground terminal-text">
                {content.length}/5000
              </span>
            </div>
            <Textarea
              value={content}
              onChange={(e) => {
                if (e.target.value.length <= 5000) {
                  setContent(e.target.value);
                  if (errors.content) setErrors((prev) => ({ ...prev, content: undefined }));
                }
              }}
              placeholder="¿Qué estás construyendo hoy?"
              rows={6}
              className="bg-secondary/50 border-border/50 resize-none"
            />
            {errors.content && (
              <p className="text-xs text-terminal-red">{errors.content}</p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Tag className="size-3.5" />
              Tags (máx. 3)
            </label>
            <div className="flex flex-wrap gap-2">
              {TAG_OPTIONS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                const isDisabled = !isSelected && selectedTags.length >= 3;
                return (
                  <button
                    key={tag}
                    onClick={() => !isDisabled && toggleTag(tag)}
                    disabled={isDisabled}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-primary/20 border-primary/50 text-primary'
                        : isDisabled
                          ? 'bg-secondary/30 border-border/30 text-muted-foreground/40 cursor-not-allowed'
                          : 'bg-secondary/50 border-border/50 text-muted-foreground hover:border-primary/30 hover:text-primary/80'
                    }`}
                  >
                    {TAG_LABELS[tag]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handlePublish}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="size-4 mr-1.5" />
              Publicar
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
  const [visibleCount, setVisibleCount] = useState(20);
  const PER_PAGE = 20;

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
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
  }, [posts, activeTag, searchText]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  const filterChips = [
    'todos',
    'automatizacion',
    'ia',
    'webapps',
    'general',
  ] as const;

  return (
    <div className="space-y-5">
      {/* Terminal header */}
      <div className="terminal-text text-xs">
        <span className="terminal-prompt">bbmdev</span>{' '}
        <span className="terminal-path">~/foro</span>
        <span className="animate-blink text-foreground">▋</span>
      </div>

      {/* Post creation area */}
      <Card className="glass-card border-border/50">
        <CardContent className="p-4">
          <div
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="flex-1 flex items-center gap-2 text-muted-foreground group-hover:text-primary/70 transition-colors">
              <span className="terminal-prompt">$</span>
              <span className="text-sm">
                ¿Qué estás construyendo hoy?
              </span>
            </div>
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setDialogOpen(true);
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
            >
              <Plus className="size-4 mr-1.5" />
              Publicar
            </Button>
          </div>
        </CardContent>
      </Card>

      <CreatePostDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Tag chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter className="size-4 text-muted-foreground mr-1 shrink-0" />
          {filterChips.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer border whitespace-nowrap ${
                activeTag === tag
                  ? 'bg-primary/20 border-primary/50 text-primary'
                  : 'bg-secondary/50 border-border/50 text-muted-foreground hover:border-primary/30 hover:text-primary/80'
              }`}
            >
              {TAG_LABELS[tag]}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative sm:ml-auto w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setVisibleCount(PER_PAGE);
            }}
            placeholder="Buscar..."
            className="pl-9 bg-secondary/50 border-border/50 text-sm"
          />
        </div>
      </div>

      {/* Post list */}
      <div className="space-y-3">
        {visiblePosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="terminal-text text-muted-foreground text-sm">
              No se encontraron publicaciones
            </p>
            <p className="terminal-text text-muted-foreground/50 text-xs mt-1">
              Prueba con otros filtros o crea una nueva publicación
            </p>
          </div>
        ) : (
          <>
            {visiblePosts.map((post) => (
              <PostCard key={post.postId} post={post} />
            ))}

            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={() =>
                    setVisibleCount((prev) => prev + PER_PAGE)
                  }
                  className="border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
                >
                  Cargar más
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}