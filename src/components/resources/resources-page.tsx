'use client';

import { useState, useMemo, useRef } from 'react';
import { useAppStore } from '@/stores/app-store';
import { createResourceInFirestore, incrementDownloadCountFirestore } from '@/lib/firestore-sync';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { ResourceType, ResourceLevel, Resource } from '@/types/autodev';

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
  ArrowLeft,
  ExternalLink,
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
  resource: Resource;
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
        {/* Title (clickable link) */}
        <h3
          onClick={() => navigate('recurso-detalle', { resourceId: resource.resourceId })}
          className="font-semibold text-sm text-white mb-1.5 leading-snug line-clamp-2 cursor-pointer hover:text-[#10B981] transition-colors"
        >
          {resource.title}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
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
          <span className="text-[10px] text-gray-500 truncate">
            por {resource.authorName}
          </span>
        </div>

        <Separator className="mb-3 bg-white/10" />

        {/* Stats & action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-500">
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
            onClick={() => navigate('recurso-detalle', { resourceId: resource.resourceId })}
            className="text-xs text-[#10B981] hover:underline cursor-pointer font-mono"
          >
            ./ver
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Create Resource Dialog ──────────────────────────────
// ── Resource Category Config ──────────────────────────────
const RESOURCE_TYPES: { id: ResourceType; icon: string }[] = [
  { id: 'Skill', icon: '🧠' },
  { id: 'Plugin', icon: '🔌' },
  { id: 'Subagent', icon: '🤖' },
  { id: 'MCP Server', icon: '⚙️' },
  { id: 'Agent Team', icon: '👥' },
  { id: 'Tutorial', icon: '📚' },
];

function CreateResourceDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const currentUser = useAppStore((s) => s.currentUser);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<ResourceType>('Skill');
  const [level, setLevel] = useState<ResourceLevel>('Principiante');
  const [tags, setTags] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [installCmd, setInstallCmd] = useState('');
  const [attachments, setAttachments] = useState<{ id: string; name: string; size: number }[]>([]);
  const [publishToForum, setPublishToForum] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no puede superar 5MB');
        return;
      }
      const url = URL.createObjectURL(file);
      setCoverPreview(url);
      setCoverFile(file);
    }
  };

  const handleAddAttachment = () => {
    if (attachments.length >= 3) return;
    const fakeNames = ['archivo-ejemplo.json', 'template.zip', 'guia.pdf'];
    const fakeSizes = [12500, 256000, 890000];
    const idx = attachments.length;
    setAttachments((prev) => [
      ...prev,
      { id: `att-${Date.now()}`, name: fakeNames[idx] || `archivo-${idx + 1}.txt`, size: fakeSizes[idx] || 5000 },
    ]);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handlePublish = async () => {
    if (!title.trim() || !description.trim()) return;

    let coverUrl = '';
    if (coverFile && currentUser) {
      try {
        const storageRef = ref(storage, `resources/${currentUser.uid}/${Date.now()}-${coverFile.name}`);
        const snapshot = await uploadBytes(storageRef, coverFile);
        coverUrl = await getDownloadURL(snapshot.ref);
      } catch (err) {
        console.warn('Error uploading cover:', err);
      }
    }

    const newRes = {
      resourceId: `res-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      content: content.trim(),
      type,
      level,
      authorId: currentUser?.uid || 'anon',
      authorName: currentUser?.displayName || 'Desarrollador BBM',
      coverUrl,
      externalUrl: externalUrl.trim() || null,
      downloadsCount: 0,
      viewsCount: 0,
      favoritesCount: 0,
      upvotes: 0,
      isFavorited: false,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      attachments,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    createResourceInFirestore(newRes);
    useAppStore.setState((prev) => ({ resources: [newRes as any, ...prev.resources] }));
    setTitle(''); setDescription(''); setContent(''); setType('Skill'); setLevel('Principiante');
    setTags(''); setExternalUrl(''); setGithubUrl(''); setInstallCmd('');
    setAttachments([]); setPublishToForum(false); setCoverPreview(null); setCoverFile(null);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setTitle(''); setDescription(''); setContent(''); setType('Skill'); setLevel('Principiante');
    setTags(''); setExternalUrl(''); setGithubUrl(''); setInstallCmd('');
    setAttachments([]); setPublishToForum(false); setCoverPreview(null); setCoverFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-[#0f172a] border-white/10 max-h-[90vh] overflow-y-auto custom-scrollbar p-0">
        {/* Terminal header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0a0f1a]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-xs font-mono text-gray-400">{'/> cd ~/recursos'}</span>
          </div>
          <button onClick={handleCancel} className="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer">✕</button>
        </div>

        {/* Title */}
        <div className="px-6 pt-5 pb-2">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-[#10B981]">📦</span> Publicar Recurso
          </h2>
          <p className="text-sm text-gray-500 mt-1">Comparte plantillas, scripts, tutoriales o herramientas con la comunidad.</p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-5">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-mono text-[#10B981]">Titulo *</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nombre claro y descriptivo del recurso..." className="bg-transparent border border-white/10 text-white placeholder:text-gray-600 font-mono text-sm focus:border-[#10B981]/50" />
                <div className="flex justify-end"><span className="text-[10px] font-mono text-gray-600">{title.length}/200</span></div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-mono text-[#10B981]">Descripcion *</label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Resumen corto que aparece en cards y previews..." rows={3} className="bg-transparent border border-white/10 text-white placeholder:text-gray-600 font-mono text-sm resize-none focus:border-[#10B981]/50" />
                <span className="text-[10px] font-mono text-gray-600">Se muestra en las cards de la lista. {description.length}/600</span>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <label className="text-sm font-mono text-[#10B981]">Contenido</label>
                <div className="border border-white/10 rounded-lg overflow-hidden">
                  <div className="flex items-center gap-1 px-3 py-2 border-b border-white/10 bg-white/5">
                    <span className="text-xs text-gray-400 px-2">Paragraph</span>
                    <div className="w-px h-4 bg-white/10 mx-1" />
                    <button className="p-1 text-gray-400 hover:text-white"><b>B</b></button>
                    <button className="p-1 text-gray-400 hover:text-white"><i>I</i></button>
                    <button className="p-1 text-gray-400 hover:text-white"><u>U</u></button>
                    <button className="p-1 text-gray-400 hover:text-white font-mono text-xs">🔗</button>
                    <div className="w-px h-4 bg-white/10 mx-1" />
                    <button className="p-1 text-gray-400 hover:text-white">📎</button>
                    <button className="p-1 text-gray-400 hover:text-white">🖼️</button>
                    <button className="p-1 text-gray-400 hover:text-white">📊</button>
                    <button className="p-1 text-gray-400 hover:text-white">•••</button>
                  </div>
                  <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Contenido completo: headings, negrita, listas, codigo, tablas, links, imagenes..." rows={8} className="bg-transparent border-0 text-white placeholder:text-gray-600 font-mono text-sm resize-none focus-visible:ring-0" />
                </div>
                <span className="text-[10px] font-mono text-gray-600">{content.length} words</span>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-5">
              {/* Categories */}
              <div className="space-y-2">
                <label className="text-sm font-mono text-[#10B981]">Categoria *</label>
                <div className="grid grid-cols-3 gap-2">
                  {RESOURCE_TYPES.map((rt) => (
                    <button key={rt.id} onClick={() => setType(rt.id)} className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all cursor-pointer ${type === rt.id ? 'bg-[#10B981]/10 border-[#10B981]/40 text-white' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}>
                      <span>{rt.icon}</span>
                      <span className="text-xs font-mono">{rt.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Miniatura */}
              <div className="space-y-2">
                <label className="text-sm font-mono text-[#10B981]">Miniatura</label>
                <label className="w-full border-2 border-dashed border-white/20 rounded-lg py-6 flex flex-col items-center gap-2 hover:border-[#10B981]/40 hover:bg-[#10B981]/5 transition-all cursor-pointer">
                  <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                  {coverPreview ? (
                    <img src={coverPreview} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                  ) : (
                    <>
                      <span className="text-2xl">🖼️</span>
                      <span className="text-xs text-gray-400">Click para subir imagen</span>
                    </>
                  )}
                </label>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-sm font-mono text-[#10B981]">Tags</label>
                <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="python, django, api..." className="bg-transparent border border-white/10 text-white placeholder:text-gray-600 font-mono text-sm focus:border-[#10B981]/50" />
                <span className="text-[10px] font-mono text-gray-600">Separados por comas</span>
              </div>

              {/* URL externa */}
              <div className="space-y-2">
                <label className="text-sm font-mono text-[#10B981]">URL externa</label>
                <Input value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} placeholder="https://github.com/..." className="bg-transparent border border-white/10 text-white placeholder:text-gray-600 font-mono text-sm focus:border-[#10B981]/50" />
                <span className="text-[10px] font-mono text-gray-600">Github, Notion, Google Drive, etc.</span>
              </div>

              {/* Repositorio GitHub */}
              <div className="space-y-2">
                <label className="text-sm font-mono text-[#10B981]">Repositorio GitHub</label>
                <Input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/usuario/repo" className="bg-transparent border border-white/10 text-white placeholder:text-gray-600 font-mono text-sm focus:border-[#10B981]/50" />
                <span className="text-[10px] font-mono text-gray-600">Enlaza al repositorio de codigo fuente</span>
              </div>

              {/* Comando de instalacion */}
              <div className="space-y-2">
                <label className="text-sm font-mono text-[#10B981]">Comando de instalacion</label>
                <Input value={installCmd} onChange={(e) => setInstallCmd(e.target.value)} placeholder="claude mcp add mi-servidor" className="bg-transparent border border-white/10 text-white placeholder:text-gray-600 font-mono text-sm focus:border-[#10B981]/50" />
                <span className="text-[10px] font-mono text-gray-600">Comando para instalar o usar este recurso con Claude Code</span>
              </div>

              {/* Dificultad */}
              <div className="space-y-2">
                <label className="text-sm font-mono text-[#10B981]">Dificultad</label>
                <select value={level} onChange={(e) => setLevel(e.target.value as ResourceLevel)} className="w-full px-3 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white font-mono text-sm focus:border-[#10B981]/50 cursor-pointer">
                  <option value="Principiante">Principiante</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                </select>
                <span className="text-[10px] font-mono text-gray-600">Nivel de dificultad requerido para usar este recurso</span>
              </div>

              {/* Archivos adjuntos */}
              <div className="space-y-2">
                <label className="text-sm font-mono text-[#10B981]">Archivos adjuntos</label>
                <div className="space-y-2">
                  {[1, 2, 3].map((num) => (
                    <button key={num} onClick={() => { if (num > attachments.length) handleAddAttachment(); }} className="w-full border border-dashed border-white/20 rounded-lg py-3 flex items-center justify-center gap-2 hover:border-[#10B981]/40 hover:bg-[#10B981]/5 transition-all cursor-pointer">
                      <span className="text-gray-500">📎</span>
                      <span className="text-xs text-gray-500 font-mono">Subir archivo {num}</span>
                      <span className="text-[10px] text-gray-600 font-mono">PDF, code, ZIP, images...</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Publicar en el foro */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer" onClick={() => setPublishToForum(!publishToForum)}>
                  <div className={`w-5 h-5 rounded border ${publishToForum ? 'bg-[#10B981] border-[#10B981]' : 'border-white/20 bg-white/5'}`} />
                  <span className="text-sm font-mono text-white">Publicar en el foro</span>
                </label>
                <span className="text-[10px] font-mono text-gray-600 pl-7">Se creara un post anunciando tu recurso</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
            <Button variant="ghost" onClick={handleCancel} className="text-gray-400 hover:text-white font-mono text-sm">Cancelar</Button>
            <Button onClick={handlePublish} disabled={!title.trim() || !description.trim()} className="bg-[#10B981] text-gray-950 hover:bg-[#34D399] font-mono font-semibold px-6 py-2.5 rounded-xl shadow-[0_0_22px_rgba(16,185,129,0.4)] disabled:opacity-40">
              <span className="mr-1">📦</span> Publicar Recurso <span className="ml-1 text-xs opacity-70">+15 XP</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Authorized emails ──
const AUTHORIZED_EMAILS = ['jibohorquez@gmail.com', 'c.moreno.mvv@gmail.com'];

// ── Resource Detail ─────────────────────────────────────
function ResourceDetail({ resourceId, onBack }: { resourceId: string; onBack: () => void }) {
  const resources = useAppStore((s) => s.resources);
  const currentUser = useAppStore((s) => s.currentUser);
  const navigate = useAppStore((s) => s.navigate);
  const resource = resources.find((r) => r.resourceId === resourceId);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editContent, setEditContent] = useState('');

  const isAuthorized = currentUser && (AUTHORIZED_EMAILS.includes(currentUser.email) || currentUser.role === 'admin');

  // Increment view count on mount
  useEffect(() => {
    if (resource) {
      incrementViewCount(resource.resourceId);
    }
  }, [resource?.resourceId]);

  const handleStartEdit = () => {
    if (!resource) return;
    setEditTitle(resource.title);
    setEditDescription(resource.description);
    setEditContent(resource.content || '');
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!resource) return;
    const { updateDoc, doc } = await import('firebase/firestore');
    const { db } = await import('@/lib/firebase');
    try {
      await updateDoc(doc(db, 'resources', resource.resourceId), {
        title: editTitle.trim(),
        description: editDescription.trim(),
        content: editContent.trim(),
        updatedAt: new Date().toISOString(),
      });
      useAppStore.setState((prev) => ({
        resources: prev.resources.map(r =>
          r.resourceId === resourceId ? { ...r, title: editTitle.trim(), description: editDescription.trim(), content: editContent.trim() } : r
        ),
      }));
      setIsEditing(false);
    } catch (err) {
      console.warn('Error updating resource:', err);
    }
  };

  if (!resource) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="font-mono">Recurso no encontrado</p>
        <Button variant="ghost" className="mt-4 text-[#10B981]" onClick={onBack}>
          <ArrowLeft className="size-4 mr-2" /> Volver
        </Button>
      </div>
    );
  }

  const relatedResources = resources.filter(r => r.resourceId !== resourceId).slice(0, 3);

  function handleDownload() {
    if (resource.externalUrl) window.open(resource.externalUrl, '_blank');
    incrementDownloadCountFirestore(resource.resourceId);
    useAppStore.setState((prev) => ({
      resources: prev.resources.map(r => r.resourceId === resourceId ? { ...r, downloadsCount: r.downloadsCount + 1 } : r),
    }));
  }

  return (
    <div className="animate-fade-in-up">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-gray-500 mb-6">
        <span>{'/> cd ~/recursos'}</span>
        <span>/</span>
        <span className="text-gray-300 truncate">{resource.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tags + Date */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 text-xs font-mono">{resource.type}</span>
            <span className="px-3 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10 text-xs font-mono">{resource.level}</span>
            <span className="text-xs text-gray-600 font-mono ml-auto">{new Date(resource.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white leading-tight">{resource.title}</h1>

          {/* Description */}
          <div className="border-l-4 border-[#10B981] bg-[#10B981]/5 p-4 rounded-r-lg">
            <p className="text-gray-300 leading-relaxed">{resource.description}</p>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-mono text-[#10B981]">
              <span>📄</span>
              <span>$ cat ./contenido</span>
            </div>
            <div className="markdown-content">
              <Markdown
                components={{
                  h1: ({ children }) => <h1 className="text-2xl font-bold text-white mb-4 mt-6">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-bold text-white mb-3 mt-5">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-semibold text-white mb-2 mt-4">{children}</h3>,
                  p: ({ children }) => <p className="text-gray-300 leading-relaxed mb-4">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-gray-300">{children}</li>,
                  a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#10B981] hover:underline">{children}</a>,
                  blockquote: ({ children }) => <blockquote className="border-l-4 border-[#10B981] bg-[#10B981]/5 pl-4 py-2 my-4 text-gray-300">{children}</blockquote>,
                  code: ({ className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    const codeString = String(children).replace(/\n$/, '');
                    if (match) {
                      return (
                        <div className="my-4 rounded-lg overflow-hidden border border-white/10">
                          <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                            <span className="text-xs font-mono text-gray-500">{match[1]}</span>
                          </div>
                          <SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" className="!m-0 !bg-[#0a0f1a]">
                            {codeString}
                          </SyntaxHighlighter>
                        </div>
                      );
                    }
                    return <code className="bg-white/10 text-[#10B981] px-1.5 py-0.5 rounded text-sm font-mono" {...props}>{children}</code>;
                  },
                  pre: ({ children }) => <pre className="my-0">{children}</pre>,
                  strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                  em: ({ children }) => <em className="text-gray-200 italic">{children}</em>,
                  hr: () => <hr className="border-white/10 my-6" />,
                  table: ({ children }) => <div className="overflow-x-auto my-4"><table className="w-full border-collapse">{children}</table></div>,
                  thead: ({ children }) => <thead className="bg-white/5">{children}</thead>,
                  tbody: ({ children }) => <tbody className="divide-y divide-white/10">{children}</tbody>,
                  tr: ({ children }) => <tr className="border-b border-white/10">{children}</tr>,
                  th: ({ children }) => <th className="px-4 py-2 text-left text-sm font-semibold text-white">{children}</th>,
                  td: ({ children }) => <td className="px-4 py-2 text-sm text-gray-300">{children}</td>,
                }}
              >
                {resource.content || 'Sin contenido adicional.'}
              </Markdown>
            </div>
          </div>

          {/* Files */}
          {resource.attachments && resource.attachments.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-mono text-[#10B981]">
                  <span>📁</span>
                  <span>$ ls ./archivos</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#10B981]/10 text-[#10B981] text-xs font-mono">{resource.attachments.length}</span>
              </div>
              <div className="border border-white/10 rounded-xl p-4 bg-white/5">
                {resource.attachments.map((att: any) => (
                  <div key={att.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">📎</span>
                      <div>
                        <p className="text-sm text-gray-300">{att.name}</p>
                        <p className="text-[10px] text-gray-600 font-mono">{formatFileSize(att.size)}</p>
                      </div>
                    </div>
                    <button onClick={handleDownload} className="text-xs text-[#10B981] hover:underline font-mono">Descargar</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-mono text-[#10B981]">
              <span>⭐</span>
              <span>$ reviews</span>
            </div>
            <div className="border border-white/10 rounded-xl p-5 bg-white/5 space-y-4">
              <p className="text-xs font-mono text-gray-500">{'// dejar un review'}</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setReviewRating(star)} className={`text-2xl cursor-pointer transition-colors ${star <= reviewRating ? 'text-yellow-400' : 'text-gray-600 hover:text-gray-400'}`}>★</button>
                ))}
              </div>
              <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="> comparte tu experiencia con este recurso (opcional)" className="w-full bg-transparent border border-white/10 rounded-lg p-3 text-sm text-white placeholder:text-gray-600 font-mono resize-none focus:border-[#10B981]/50" rows={3} />
              <button className="px-4 py-2 bg-[#10B981] text-gray-950 rounded-lg text-sm font-mono font-semibold hover:bg-[#34D399] transition-colors cursor-pointer">{'>'} publicar</button>
              <p className="text-xs text-gray-600 font-mono text-center mt-4">{'// aun no hay reviews. ¡se el primero!'}</p>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Edit Form (shown when editing) */}
          {isEditing && (
            <div className="border border-[#10B981]/30 rounded-xl p-4 bg-[#10B981]/5 space-y-4">
              <p className="text-xs font-mono text-[#10B981]">编辑 recurso</p>
              <div className="space-y-2">
                <label className="text-xs text-gray-400">Titulo</label>
                <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-[#10B981]/50" />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400">Descripcion</label>
                <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} rows={3} className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono resize-none focus:border-[#10B981]/50" />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400">Contenido</label>
                <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={4} className="w-full bg-transparent border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono resize-none focus:border-[#10B981]/50" />
              </div>
              <div className="flex gap-2">
                <button onClick={handleSaveEdit} className="flex-1 py-2 bg-[#10B981] text-gray-950 rounded-lg text-sm font-mono font-semibold hover:bg-[#34D399] transition-colors cursor-pointer">Guardar</button>
                <button onClick={() => setIsEditing(false)} className="flex-1 py-2 border border-white/10 rounded-lg text-gray-400 text-sm font-mono hover:bg-white/5 transition-colors cursor-pointer">Cancelar</button>
              </div>
            </div>
          )}

          {/* Resource Image */}
          <div className="border border-white/10 rounded-xl overflow-hidden bg-gradient-to-br from-[#10B981]/10 to-[#10B981]/5 h-48 flex items-center justify-center">
            {resource.coverUrl ? (
              <img src={resource.coverUrl} alt={resource.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl opacity-30">📦</span>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-white/10 rounded-xl p-4 text-center bg-white/5">
              <p className="text-2xl font-bold text-white">{resource.downloadsCount || 0}</p>
              <p className="text-[10px] font-mono text-gray-500 mt-1">↓ DESCARGAS</p>
            </div>
            <div className="border border-white/10 rounded-xl p-4 text-center bg-white/5">
              <p className="text-2xl font-bold text-white">{resource.viewsCount || 0}</p>
              <p className="text-[10px] font-mono text-gray-500 mt-1">👁 VISTAS</p>
            </div>
          </div>

          {/* Action Buttons */}
          <button className="w-full py-3 bg-[#10B981] text-gray-950 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#34D399] transition-colors cursor-pointer shadow-[0_0_22px_rgba(16,185,129,0.3)]">
            <span>☐</span> guardar recurso
          </button>
          <button className="w-full py-3 border border-white/10 rounded-xl text-gray-300 text-sm flex items-center justify-center gap-2 hover:bg-white/5 transition-colors cursor-pointer">
            <span>🔗</span> share
          </button>
          <button onClick={() => navigate('foro')} className="w-full py-3 border border-white/10 rounded-xl text-gray-300 text-sm flex items-center justify-center gap-2 hover:bg-white/5 transition-colors cursor-pointer">
            <span>📝</span> crear post
          </button>

          {/* Edit button for authorized users */}
          {isAuthorized && (
            <button onClick={handleStartEdit} className="w-full py-3 border border-[#10B981]/30 rounded-xl text-[#10B981] text-sm flex items-center justify-center gap-2 hover:bg-[#10B981]/10 transition-colors cursor-pointer">
              <span>✏️</span> editar recurso
            </button>
          )}

          {/* Author */}
          <div className="border border-white/10 rounded-xl p-4 bg-white/5">
            <div className="flex items-center gap-2 text-xs font-mono text-gray-500 mb-3">
              <span>$ author</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#10B981] flex items-center justify-center text-white font-bold font-mono">
                {resource.authorName?.charAt(0) || 'A'}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{resource.authorName}</p>
              </div>
            </div>
            <button className="w-full mt-3 py-2 border border-white/10 rounded-lg text-gray-400 text-xs font-mono hover:bg-white/5 transition-colors cursor-pointer">ver perfil</button>
          </div>
        </div>
      </div>

      {/* Related Resources */}
      {relatedResources.length > 0 && (
        <div className="mt-12 space-y-4">
          <div className="flex items-center gap-2 text-sm font-mono text-[#10B981]">
            <span>📋</span>
            <span>$ ls ./relacionados</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedResources.map((r) => (
              <div key={r.resourceId} onClick={() => navigate('recurso-detalle', { resourceId: r.resourceId })} className="border border-white/10 rounded-xl overflow-hidden bg-white/5 hover:border-[#10B981]/30 transition-all cursor-pointer">
                <div className="h-32 bg-gradient-to-br from-[#10B981]/10 to-[#10B981]/5 flex items-center justify-center">
                  <span className="text-3xl opacity-30">📦</span>
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30">{r.type}</span>
                  <h3 className="text-sm font-semibold text-white mt-2 line-clamp-1">{r.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{r.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Resources Page (main export) ────────────────────────
export default function ResourcesPage() {
  const { route, navigate } = useAppStore();
  const currentUser = useAppStore((s) => s.currentUser);
  const resources = useAppStore((s) => s.resources);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeType, setActiveType] = useState('All');
  const [activeLevel, setActiveLevel] = useState('All');
  const [searchText, setSearchText] = useState('');

  const canCreate = currentUser?.status === 'active';

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

  // Resource detail view
  if (route === 'recurso-detalle') {
    const resourceId = useAppStore.getState().routeParams.resourceId || '';
    return (
      <div className="space-y-1">
        <div className="terminal-text text-xs mb-4">
          <span className="terminal-prompt">bbmdev</span>{' '}
          <span className="terminal-path">~/recursos</span>{' '}
          <span className="terminal-comment">— {resourceId}</span>
        </div>
        <ResourceDetail resourceId={resourceId} onBack={() => navigate('recursos')} />
      </div>
    );
  }

  function toggleFavorite(resourceId: string) {
    const r = resources.find(x => x.resourceId === resourceId);
    if (!r) return;
    const delta = r.isFavorited ? -1 : 1;
    useAppStore.getState().upvoteResource(resourceId, delta);
    useAppStore.setState((prev) => ({
      resources: prev.resources.map((res) => {
        if (res.resourceId !== resourceId) return res;
        return {
          ...res,
          isFavorited: !res.isFavorited,
          favoritesCount: res.isFavorited
            ? res.favoritesCount - 1
            : res.favoritesCount + 1,
        };
      }),
    }));
  }

  return (
    <div className="space-y-5">
      {/* Terminal header */}
      <div className="flex items-center justify-between">
        <div className="terminal-text text-xs">
          <span className="terminal-prompt">bbmdev</span>{' '}
          <span className="terminal-path">~/recursos</span>
          <span className="animate-blink text-foreground">▋</span>
        </div>

        {canCreate && (
          <Button
            size="sm"
            onClick={() => setDialogOpen(true)}
            className="bg-[#10B981] text-gray-950 hover:bg-[#34D399] font-mono font-semibold rounded-xl shadow-[0_0_22px_rgba(16,185,129,0.4)]"
          >
            <Plus className="size-4 mr-1.5" />
            Publicar Recurso
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