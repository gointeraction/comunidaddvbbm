'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/stores/app-store';
import type { ResourceType, ResourceLevel } from '@/types/autodev';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Search,
  Plus,
  Download,
  Star,
  Filter,
  Eye,
  FileText,
  Cpu,
  Bot,
  Server,
  Users,
  GraduationCap,
  X,
} from 'lucide-react';

const TYPE_OPTIONS: (ResourceType | 'All')[] = [
  'All',
  'Skill',
  'Plugin',
  'Subagent',
  'MCP Server',
  'Agent Team',
  'Tutorial',
];

const LEVEL_OPTIONS: (ResourceLevel | 'All')[] = [
  'All',
  'Principiante',
  'Intermedio',
  'Avanzado',
];

const TYPE_ICONS: Record<string, React.ReactNode> = {
  Skill: <Cpu className="size-6" />,
  Plugin: <FileText className="size-6" />,
  Subagent: <Bot className="size-6" />,
  'MCP Server': <Server className="size-6" />,
  'Agent Team': <Users className="size-6" />,
  Tutorial: <GraduationCap className="size-6" />,
};

const TYPE_GRADIENTS: Record<string, string> = {
  Skill: 'from-cyan-900/40 to-blue-900/30',
  Plugin: 'from-emerald-900/40 to-teal-900/30',
  Subagent: 'from-violet-900/40 to-purple-900/30',
  'MCP Server': 'from-amber-900/40 to-orange-900/30',
  'Agent Team': 'from-rose-900/40 to-pink-900/30',
  Tutorial: 'from-sky-900/40 to-indigo-900/30',
};

const LEVEL_COLORS: Record<ResourceLevel, string> = {
  Principiante: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  Intermedio: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Avanzado: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

// ── Resource Card ───────────────────────────────────────
function ResourceCard({
  resource,
  onToggleFavorite,
}: {
  resource: (typeof MOCK_RESOURCES)[0];
  onToggleFavorite: (id: string) => void;
}) {
  const navigate = useAppStore((s) => s.navigate);

  return (
    <Card className="glass-card border-border/50 hover:border-primary/30 transition-all group overflow-hidden">
      {/* Cover */}
      <div
        className={`relative h-32 bg-gradient-to-br ${TYPE_GRADIENTS[resource.type] || 'from-gray-900/40 to-gray-800/30'} flex items-center justify-center`}
      >
        <div className="text-primary/40 group-hover:text-primary/60 transition-colors">
          {TYPE_ICONS[resource.type] || <FileText className="size-6" />}
        </div>
        {/* Type badge top-right */}
        <Badge
          variant="outline"
          className="absolute top-2 right-2 text-[10px] px-2 py-0 bg-card/80 backdrop-blur-sm border-primary/30 text-primary/80"
        >
          {resource.type}
        </Badge>
        {/* Favorite button top-left */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(resource.resourceId);
          }}
          className="absolute top-2 left-2 p-1.5 rounded-full bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-colors"
          aria-label={
            resource.isFavorited ? 'Quitar de favoritos' : 'Añadir a favoritos'
          }
        >
          <Star
            className={`size-4 transition-colors ${
              resource.isFavorited
                ? 'fill-yellow-500 text-yellow-500'
                : 'text-muted-foreground'
            }`}
          />
        </button>
      </div>

      <CardContent className="p-4">
        {/* Title & description */}
        <h3 className="font-semibold text-sm text-foreground mb-1.5 leading-snug line-clamp-2">
          {resource.title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
          {resource.description}
        </p>

        {/* Level & Author */}
        <div className="flex items-center gap-2 mb-3">
          <Badge
            variant="outline"
            className={`text-[10px] px-1.5 py-0 ${LEVEL_COLORS[resource.level]}`}
          >
            {resource.level}
          </Badge>
          <span className="text-[10px] text-muted-foreground truncate">
            por {resource.authorName}
          </span>
        </div>

        <Separator className="mb-3 bg-border/50" />

        {/* Stats & action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Download className="size-3.5" />
              {resource.downloadsCount}
            </span>
            <span className="flex items-center gap-1">
              <Star className="size-3.5" />
              {resource.favoritesCount}
            </span>
          </div>
          <button
            onClick={() =>
              navigate('recurso-detalle', {
                resourceId: resource.resourceId,
              })
            }
            className="text-xs text-primary hover:underline cursor-pointer terminal-text"
          >
            ./ver
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Create Resource Dialog ──────────────────────────────
function CreateResourceDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ResourceType>('Skill');
  const [level, setLevel] = useState<ResourceLevel>('Principiante');
  const [attachments, setAttachments] = useState<
    { id: string; name: string; size: number }[]
  >([]);

  const handleAddAttachment = () => {
    if (attachments.length >= 3) return;
    const fakeNames = [
      'archivo-ejemplo.json',
      'template.zip',
      'guia.pdf',
    ];
    const fakeSizes = [12500, 256000, 890000];
    const idx = attachments.length;
    setAttachments((prev) => [
      ...prev,
      {
        id: `att-${Date.now()}`,
        name: fakeNames[idx] || `archivo-${idx + 1}.txt`,
        size: fakeSizes[idx] || 5000,
      },
    ]);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handlePublish = () => {
    if (!title.trim() || !description.trim()) return;
    // Reset and close
    setTitle('');
    setDescription('');
    setType('Skill');
    setLevel('Principiante');
    setAttachments([]);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setType('Skill');
    setLevel('Principiante');
    setAttachments([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border/50 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="terminal-text text-primary">
            ~/nuevo-recurso
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">Título</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nombre del recurso"
              className="bg-secondary/50 border-border/50"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">
              Descripción
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe tu recurso..."
              rows={4}
              className="bg-secondary/50 border-border/50 resize-none"
            />
          </div>

          {/* Type selector */}
          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">Tipo</label>
            <div className="flex flex-wrap gap-1.5">
              {TYPE_OPTIONS.filter((t) => t !== 'All').map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t as ResourceType)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer border ${
                    type === t
                      ? 'bg-primary/20 border-primary/50 text-primary'
                      : 'bg-secondary/50 border-border/50 text-muted-foreground hover:border-primary/30 hover:text-primary/80'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Level selector */}
          <div className="space-y-1.5">
            <label className="text-sm text-muted-foreground">Nivel</label>
            <div className="flex flex-wrap gap-1.5">
              {LEVEL_OPTIONS.filter((l) => l !== 'All').map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l as ResourceLevel)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer border ${
                    level === l
                      ? 'bg-primary/20 border-primary/50 text-primary'
                      : 'bg-secondary/50 border-border/50 text-muted-foreground hover:border-primary/30 hover:text-primary/80'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground flex items-center gap-1.5">
              <FileText className="size-3.5" />
              Adjuntos ({attachments.length}/3)
            </label>

            {attachments.length > 0 && (
              <div className="space-y-2">
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between bg-secondary/50 border border-border/50 rounded-md px-3 py-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="size-4 text-primary/60 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-foreground truncate">
                          {att.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {formatFileSize(att.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveAttachment(att.id)}
                      className="text-muted-foreground hover:text-terminal-red transition-colors shrink-0 ml-2"
                      aria-label="Eliminar adjunto"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddAttachment}
                    disabled={attachments.length >= 3}
                    className="border-primary/30 text-primary hover:bg-primary/10 hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Plus className="size-4 mr-1.5" />
                    Agregar adjunto
                  </Button>
                </span>
              </TooltipTrigger>
              {attachments.length >= 3 && (
                <TooltipContent>
                  Límite máximo: 3 archivos
                </TooltipContent>
              )}
            </Tooltip>
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
              disabled={!title.trim() || !description.trim()}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
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

// ── Resources Page (main export) ────────────────────────
export default function ResourcesPage() {
  const currentUser = useAppStore((s) => s.currentUser);
  const resources = useAppStore((s) => s.resources);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeType, setActiveType] = useState('All');
  const [activeLevel, setActiveLevel] = useState('All');
  const [searchText, setSearchText] = useState('');

  const canCreate =
    currentUser?.role === 'autor' ||
    currentUser?.role === 'moderador' ||
    currentUser?.role === 'admin';

  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
      if (activeType !== 'All' && r.type !== activeType) return false;
      if (activeLevel !== 'All' && r.level !== activeLevel) return false;
      if (searchText.trim()) {
        const q = searchText.toLowerCase();
        return (
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.authorName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [resources, activeType, activeLevel, searchText]);

  function toggleFavorite(resourceId: string) {
    useAppStore.setState((prev) => ({
      resources: prev.resources.map((r) => {
        if (r.resourceId !== resourceId) return r;
        return {
          ...r,
          isFavorited: !r.isFavorited,
          favoritesCount: r.isFavorited
            ? r.favoritesCount - 1
            : r.favoritesCount + 1,
        };
      }),
    }));
  }

  return (
    <div className="space-y-5">
      {/* Terminal header */}
      <div className="flex items-center justify-between">
        <div className="terminal-text text-xs">
          <span className="terminal-prompt">autodev</span>{' '}
          <span className="terminal-path">~/recursos</span>
          <span className="animate-blink text-foreground">▋</span>
        </div>

        {canCreate && (
          <Button
            size="sm"
            onClick={() => setDialogOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4 mr-1.5" />
            Nuevo recurso
          </Button>
        )}
      </div>

      <CreateResourceDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      {/* Filter bar */}
      <div className="space-y-3">
        {/* Type filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter className="size-4 text-muted-foreground mr-1 shrink-0" />
          <span className="text-xs text-muted-foreground mr-1">Tipo:</span>
          {TYPE_OPTIONS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer border whitespace-nowrap ${
                activeType === t
                  ? 'bg-primary/20 border-primary/50 text-primary'
                  : 'bg-secondary/50 border-border/50 text-muted-foreground hover:border-primary/30 hover:text-primary/80'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Level filters + Search */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-muted-foreground mr-1">
              Nivel:
            </span>
            {LEVEL_OPTIONS.map((l) => (
              <button
                key={l}
                onClick={() => setActiveLevel(l)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer border whitespace-nowrap ${
                  activeLevel === l
                    ? 'bg-primary/20 border-primary/50 text-primary'
                    : 'bg-secondary/50 border-border/50 text-muted-foreground hover:border-primary/30 hover:text-primary/80'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="relative sm:ml-auto w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Buscar recursos..."
              className="pl-9 bg-secondary/50 border-border/50 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Resource grid */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-16">
          <p className="terminal-text text-muted-foreground text-sm">
            No se encontraron recursos
          </p>
          <p className="terminal-text text-muted-foreground/50 text-xs mt-1">
            Prueba con otros filtros
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((resource) => (
            <ResourceCard
              key={resource.resourceId}
              resource={resource}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}