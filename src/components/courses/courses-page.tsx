'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/stores/app-store';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import type { Course, Lesson } from '@/types/bbmdev';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  BookOpen,
  Clock,
  Users,
  Play,
  CheckCircle2,
  ArrowLeft,
  Zap,
  Trophy,
  GraduationCap,
  Plus,
  ExternalLink,
} from 'lucide-react';

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const COURSE_GRADIENTS: Record<string, string> = {
  'c-001': 'from-cyan-900/40 to-blue-900/30',
  'c-002': 'from-emerald-900/40 to-teal-900/30',
  'c-003': 'from-violet-900/40 to-purple-900/30',
  'c-004': 'from-amber-900/40 to-orange-900/30',
  'c-005': 'from-rose-900/40 to-pink-900/30',
};

function getCourseIcon(courseId: string, size = 'size-8') {
  const icons: Record<string, React.ReactNode> = {
    'c-001': <BookOpen className={size} />,
    'c-002': <GraduationCap className={size} />,
    'c-003': <Zap className={size} />,
    'c-004': <Trophy className={size} />,
    'c-005': <Play className={size} />,
  };
  return icons[courseId] || <BookOpen className={size} />;
}

// ── Course Card ─────────────────────────────────────────
function CourseCard({
  course,
  onOpenCourse,
  onEditCourse,
}: {
  course: Course;
  onOpenCourse: (courseId: string) => void;
  onEditCourse?: (course: any) => void;
}) {
  const gradient = COURSE_GRADIENTS[course.courseId] || 'from-cyan-900/40 to-blue-900/30';

  return (
    <Card
      className="glass-card border-border/50 hover:border-primary/30 transition-all group cursor-pointer overflow-hidden"
      onClick={() => {
        if (course.externalUrl) {
          window.open(course.externalUrl, '_blank');
        } else {
          onOpenCourse(course.courseId);
        }
      }}
    >
      {/* Cover */}
      <div
        className={`relative h-36 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}
      >
        {(course as any).coverUrl ? (
          <img src={(course as any).coverUrl} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-primary/30 group-hover:text-primary/50 transition-colors">
            {getCourseIcon(course.courseId)}
          </div>
        )}
        {course.isEnrolled && (
          <Badge className="absolute top-2 right-2 bg-primary/20 text-primary border-primary/30 text-[10px]">
            <CheckCircle2 className="size-3 mr-1" />
            Inscrito
          </Badge>
        )}
        {onEditCourse && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditCourse(course);
            }}
            className="absolute top-2 left-2 p-1.5 rounded-full bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-colors text-gray-400 hover:text-[#10B981]"
          >
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </button>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-sm text-foreground mb-1.5 leading-snug line-clamp-2">
          {course.title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
          {course.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <BookOpen className="size-3" />
            {course.authorName}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {formatDuration(course.durationMinutes)}
          </span>
          {!course.externalUrl && (
            <span className="flex items-center gap-1">
              <Play className="size-3" />
              {course.lessonsCount} lecciones
            </span>
          )}
        </div>

        {!course.externalUrl && (
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-3">
            <Users className="size-3" />
            <span>{course.enrolledCount} inscritos</span>
          </div>
        )}

        {/* Progress bar */}
        {!course.externalUrl && course.isEnrolled && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-muted-foreground">
                Progreso
              </span>
              <span className="text-[10px] text-primary terminal-text">
                {course.progress}%
              </span>
            </div>
            <Progress value={course.progress} className="h-1.5" />
          </div>
        )}

        {/* Action button */}
        <Button
          size="sm"
          className={`w-full text-xs ${
            course.externalUrl
              ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
              : course.isEnrolled
                ? 'bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            if (course.externalUrl) {
              window.open(course.externalUrl, '_blank');
            } else {
              onOpenCourse(course.courseId);
            }
          }}
        >
          {course.externalUrl ? (
            <>
              <ExternalLink className="size-3.5 mr-1.5" />
              Ir al curso
            </>
          ) : course.isEnrolled ? (
            <>
              <Play className="size-3.5 mr-1.5" />
              Continuar
            </>
          ) : (
            <>
              <GraduationCap className="size-3.5 mr-1.5" />
              Inscribirse
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

// ── Course Detail ───────────────────────────────────────
function CourseDetail({
  courseId,
  onBack,
}: {
  courseId: string;
  onBack: () => void;
}) {
  const courses = useAppStore((s) => s.courses);
  const [localLessons, setLocalLessons] = useState<Record<string, Lesson[]>>({});
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);

  // Fetch lessons from Firestore
  useEffect(() => {
    async function fetchLessons() {
      try {
        const lessonsSnap = await getDocs(
          query(collection(db, `courses/${courseId}/lessons`), orderBy('order', 'asc'))
        );
        const lessonsData = lessonsSnap.docs.map(d => ({ lessonId: d.id, ...d.data() } as Lesson));
        setLocalLessons(prev => ({ ...prev, [courseId]: lessonsData }));
      } catch (err) {
        console.warn('Error fetching lessons:', err);
      }
    }
    fetchLessons();
  }, [courseId]);

  const course = courses.find((c) => c.courseId === courseId);
  const lessons = localLessons[courseId] || [];

  const selectedLesson = lessons.find((l) => l.lessonId === selectedLessonId);
  const completedCount = lessons.filter((l) => l.isCompleted).length;
  const progressPercent =
    lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  function handleEnroll() {
    if (!course) return;
    // RF-030: Enroll in course via Firestore
    useAppStore.getState().enrollInCourse(courseId);
    // Auto-select first lesson
    if (lessons.length > 0 && !selectedLessonId) {
      setSelectedLessonId(lessons[0].lessonId);
    }
  }

  function handleToggleComplete(lessonId: string) {
      // RF-031: Mark lesson complete via Firestore
      useAppStore.getState().markLessonCompleteInCourse(courseId, lessonId);
      useAppStore.getState().markLessonCompleted(courseId, lessonId);
      setLocalLessons((prev) => {
        const courseLessons = prev[courseId] || [];
        const updated = courseLessons.map((l) =>
          l.lessonId === lessonId ? { ...l, isCompleted: !l.isCompleted } : l
        );
        const newCompleted = updated.filter((l) => l.isCompleted).length;
        const newProgress = Math.round(
          (newCompleted / updated.length) * 100
        );

        // Update course progress
        useAppStore.setState((sPrev) => ({
          courses: sPrev.courses.map((c) =>
            c.courseId === courseId ? { ...c, progress: newProgress } : c
          ),
        }));

        return { ...prev, [courseId]: updated };
      });
    }

  function handleSelectLesson(lessonId: string) {
    setSelectedLessonId(lessonId);
  }

  if (!course) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p className="terminal-text">Curso no encontrado</p>
        <Button
          variant="ghost"
          className="mt-4 text-primary"
          onClick={onBack}
        >
          <ArrowLeft className="size-4 mr-2" />
          Volver a cursos
        </Button>
      </div>
    );
  }

  // If not enrolled, show course info + enroll button
  if (!course.isEnrolled) {
    const gradient = COURSE_GRADIENTS[course.courseId] || 'from-cyan-900/40 to-blue-900/30';

    return (
      <div className="animate-fade-in-up">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          Volver a cursos
        </button>

        <Card className="glass-card border-border/50 overflow-hidden mb-6">
          <div
            className={`h-40 bg-gradient-to-br ${gradient} flex items-center justify-center`}
          >
            <div className="text-primary/40">
              {getCourseIcon(course.courseId, 'size-10')}
            </div>
          </div>
          <CardContent className="p-5 md:p-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {course.title}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {course.description}
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1.5">
                <BookOpen className="size-4" />
                {course.authorName}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" />
                {formatDuration(course.durationMinutes)}
              </span>
              <span className="flex items-center gap-1.5">
                <Play className="size-4" />
                {course.lessonsCount} lecciones
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="size-4" />
                {course.enrolledCount} inscritos
              </span>
            </div>

            <Button
              size="lg"
              onClick={handleEnroll}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <GraduationCap className="size-5 mr-2" />
              Inscribirse
            </Button>
          </CardContent>
        </Card>

        {/* Lesson preview */}
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Contenido del curso
        </h3>
        <Card className="glass-card border-border/50">
          <CardContent className="p-4">
            <div className="space-y-2">
              {lessons.map((lesson, idx) => (
                <div
                  key={lesson.lessonId}
                  className="flex items-center gap-3 py-2 text-sm text-muted-foreground"
                >
                  <span className="w-6 h-6 rounded-full bg-secondary/80 flex items-center justify-center text-xs font-mono text-muted-foreground shrink-0">
                    {lesson.order}
                  </span>
                  <span className="flex-1">{lesson.title}</span>
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 border-terminal-green/30 text-terminal-green bg-terminal-green/5"
                  >
                    <Zap className="size-2.5 mr-0.5" />
                    {lesson.xpReward} XP
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Enrolled: show lesson sidebar + content
  return (
    <div className="animate-fade-in-up">
      {/* Back link */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4 cursor-pointer"
      >
        <ArrowLeft className="size-4" />
        Volver a cursos
      </button>

      {/* Course header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {course.title}
          </h2>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span>
              {completedCount}/{lessons.length} lecciones
            </span>
            <span className="text-primary terminal-text font-medium">
              {progressPercent}%
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* RF-035: Simulated certificate */}
          {progressPercent === 100 && (
            <Button
              size="sm"
              onClick={() => {
                const user = useAppStore.getState().currentUser;
                const html = `<!DOCTYPE html><html><head><style>body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f5f5f5;font-family:Georgia,serif;}.cert{width:700px;padding:40px;background:white;border:3px solid #10B981;position:relative;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,.1);}.cert::before{content:'';position:absolute;inset:8px;border:1px solid #10B981;pointer-events:none;}h1{color:#10B981;margin:0 0 8px}h2{margin:0 0 4px;font-size:1.3em}.meta{color:#666;font-size:.9em;margin:16px 0}</style></head><body><div class="cert"><h1>CERTIFICADO</h1><h2>${course.title}</h2><p style="font-size:1.1em">Otorgado a</p><p style="font-size:1.4em;font-weight:bold;color:#333">${user?.displayName || 'Estudiante'}</p><p class="meta">Fecha: ${new Date().toLocaleDateString('es-ES', { year:'numeric', month:'long', day:'numeric' })}</p><p class="meta">Comunidad BBMDev</p></div></body></html>`;
                window.open('data:text/html,' + encodeURIComponent(html), '_blank');
              }}
              className="bg-yellow-500 text-black hover:bg-yellow-400"
            >
              <GraduationCap className="size-4 mr-1.5" />
              Ver Certificado
            </Button>
          )}
          <div className="w-full sm:w-48">
            <Progress value={progressPercent} className="h-2" />
          </div>
        </div>
      </div>

      <Separator className="mb-4 bg-border/50" />

      {/* Two-column layout */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Lessons sidebar */}
        <div className="w-full md:w-72 shrink-0">
          <Card className="glass-card border-border/50">
            <ScrollArea className="max-h-[70vh]">
              <div className="p-3 space-y-1">
                {lessons.map((lesson) => (
                  <button
                    key={lesson.lessonId}
                    onClick={() => handleSelectLesson(lesson.lessonId)}
                    className={`w-full text-left flex items-start gap-3 p-2.5 rounded-lg transition-all cursor-pointer ${
                      selectedLessonId === lesson.lessonId
                        ? 'bg-primary/10 border border-primary/30'
                        : 'hover:bg-secondary/50 border border-transparent'
                    }`}
                  >
                    <div className="mt-0.5">
                      <Checkbox
                        checked={lesson.isCompleted}
                        onCheckedChange={() =>
                          handleToggleComplete(lesson.lessonId)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] text-muted-foreground terminal-text font-mono">
                          {String(lesson.order).padStart(2, '0')}
                        </span>
                      </div>
                      <p
                        className={`text-xs leading-snug ${
                          lesson.isCompleted
                            ? 'text-muted-foreground line-through'
                            : 'text-foreground'
                        } ${
                          selectedLessonId === lesson.lessonId
                            ? 'text-primary'
                            : ''
                        }`}
                      >
                        {lesson.title}
                      </p>
                      <Badge
                        variant="outline"
                        className="text-[9px] px-1 py-0 mt-1 border-terminal-amber/30 text-terminal-amber bg-terminal-amber/5"
                      >
                        <Zap className="size-2 mr-0.5" />
                        {lesson.xpReward} XP
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Main content area */}
        <div className="flex-1 min-w-0">
          {selectedLesson ? (
            <Card className="glass-card border-border/50">
              <CardContent className="p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-foreground">
                    <span className="terminal-text text-primary mr-2">
                      {String(selectedLesson.order).padStart(2, '0')}
                    </span>
                    {selectedLesson.title}
                  </h3>
                  <Badge
                    variant="outline"
                    className="text-[10px] px-2 py-0 border-terminal-amber/30 text-terminal-amber bg-terminal-amber/5 shrink-0"
                  >
                    <Zap className="size-3 mr-1" />
                    {selectedLesson.xpReward} XP
                  </Badge>
                </div>

                {/* Lesson content (render markdown as HTML) */}
                <div
                  className="prose prose-invert prose-sm max-w-none
                    prose-headings:text-foreground prose-headings:font-semibold
                    prose-p:text-muted-foreground prose-p:leading-relaxed
                    prose-strong:text-foreground
                    prose-code:text-primary prose-code:bg-secondary/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
                    prose-pre:bg-secondary/50 prose-pre:border prose-pre:border-border/50
                    prose-li:text-muted-foreground
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                    mb-6"
                  dangerouslySetInnerHTML={{
                    __html: selectedLesson.content
                      .replace(/^# (.+)$/gm, '<h2 class="text-lg font-semibold text-foreground mt-4 mb-2">$1</h2>')
                      .replace(/^## (.+)$/gm, '<h3 class="text-base font-semibold text-foreground mt-3 mb-1.5">$1</h3>')
                      .replace(/^### (.+)$/gm, '<h4 class="text-sm font-semibold text-foreground mt-2 mb-1">$1</h4>')
                      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground">$1</strong>')
                      .replace(/`(.+?)`/g, '<code class="text-xs bg-secondary/50 text-primary px-1 py-0.5 rounded font-mono">$1</code>')
                      .replace(/^- (.+)$/gm, '<li class="text-muted-foreground ml-4 list-disc">$1</li>')
                      .replace(/^\d+\. (.+)$/gm, '<li class="text-muted-foreground ml-4 list-decimal">$1</li>')
                      .replace(/\n\n/g, '</p><p class="text-muted-foreground leading-relaxed mb-2">')
                      .replace(/\n/g, '<br/>')
                  }}
                />

                <Separator className="my-4 bg-border/50" />

                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs flex items-center gap-1.5 ${
                      selectedLesson.isCompleted
                        ? 'text-terminal-green'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <CheckCircle2
                      className={`size-4 ${
                        selectedLesson.isCompleted
                          ? 'text-terminal-green'
                          : 'text-muted-foreground/40'
                      }`}
                    />
                    {selectedLesson.isCompleted
                      ? 'Completada'
                      : 'Pendiente'}
                  </span>
                  <Button
                    size="sm"
                    variant={
                      selectedLesson.isCompleted ? 'outline' : 'default'
                    }
                    onClick={() =>
                      handleToggleComplete(selectedLesson.lessonId)
                    }
                    className={
                      selectedLesson.isCompleted
                        ? 'border-primary/30 text-primary hover:bg-primary/10'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }
                  >
                    <CheckCircle2 className="size-4 mr-1.5" />
                    {selectedLesson.isCompleted
                      ? 'Desmarcar completada'
                      : 'Marcar completada'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="glass-card border-border/50">
              <CardContent className="p-10 text-center">
                <BookOpen className="size-10 text-primary/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">
                  Selecciona una lección para comenzar
                </p>
                <p className="text-muted-foreground/50 text-xs mt-1">
                  Usa el panel lateral para navegar entre lecciones
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Authorized emails for admin ──
const AUTHORIZED_EMAILS = ['jibohorquez@gmail.com', 'c.moreno.mvv@gmail.com'];

// ── Courses Page (main export) ──────────────────────────
export default function CoursesPage() {
  const { route, navigate, courses } = useAppStore();
  const currentUser = useAppStore((s) => s.currentUser);
  const [newCourseOpen, setNewCourseOpen] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseDuration, setCourseDuration] = useState('');
  const [courseExternalUrl, setCourseExternalUrl] = useState('');
  const [editCourse, setEditCourse] = useState<any>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const canCreate = currentUser?.role === 'admin' || (currentUser?.role === 'autor') || (currentUser && AUTHORIZED_EMAILS.includes(currentUser.email));

  // Populate form when editing
  useEffect(() => {
    if (editCourse) {
      setCourseTitle(editCourse.title || '');
      setCourseDescription(editCourse.description || '');
      setCourseDuration(String(editCourse.durationMinutes || 60));
      setCourseExternalUrl(editCourse.externalUrl || '');
      setCoverPreview(editCourse.coverUrl || null);
      setCoverFile(null);
    } else {
      setCourseTitle('');
      setCourseDescription('');
      setCourseDuration('');
      setCourseExternalUrl('');
      setCoverPreview(null);
      setCoverFile(null);
    }
  }, [editCourse]);

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
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
  }

  async function uploadCoverImage(file: File, userId: string): Promise<string> {
    const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
    const { storage } = await import('@/lib/firebase');
    const storageRef = ref(storage, `courses/${userId}/${Date.now()}-${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  }

  async function handleCreateCourse() {
    if (!courseTitle.trim() || !courseDescription.trim()) return;
    const duration = parseInt(courseDuration) || 60;

    let coverUrl = '';
    if (coverFile && currentUser) {
      try {
        coverUrl = await uploadCoverImage(coverFile, currentUser.uid);
      } catch (err) {
        console.warn('Error uploading cover:', err);
      }
    }

    const newCourse = {
      courseId: `c-${Date.now()}`,
      title: courseTitle.trim(),
      description: courseDescription.trim(),
      durationMinutes: duration,
      authorId: currentUser?.uid || 'anon',
      authorName: currentUser?.displayName || 'Autor',
      lessonsCount: 0,
      enrolledCount: 0,
      isEnrolled: false,
      progress: 0,
      tags: [],
      coverUrl,
      createdAt: new Date().toISOString(),
      externalUrl: courseExternalUrl.trim() || null,
    };
    try {
      await addDoc(collection(db, 'courses'), newCourse);
    } catch (e) {
      console.warn('Error creating course:', e);
    }
    useAppStore.setState((prev) => ({
      courses: [newCourse as any, ...prev.courses],
    }));
    setCourseTitle('');
    setCourseDescription('');
    setCourseDuration('');
    setCourseExternalUrl('');
    setCoverPreview(null);
    setCoverFile(null);
    setNewCourseOpen(false);
  }

  async function handleUpdateCourse() {
    if (!editCourse || !courseTitle.trim() || !courseDescription.trim()) return;
    const duration = parseInt(courseDuration) || 60;

    let coverUrl = editCourse.coverUrl || '';
    if (coverFile && currentUser) {
      try {
        coverUrl = await uploadCoverImage(coverFile, currentUser.uid);
      } catch (err) {
        console.warn('Error uploading cover:', err);
      }
    }

    const { updateDoc, doc } = await import('firebase/firestore');
    try {
      await updateDoc(doc(db, 'courses', editCourse.courseId || (editCourse as any).id), {
        title: courseTitle.trim(),
        description: courseDescription.trim(),
        durationMinutes: duration,
        externalUrl: courseExternalUrl.trim() || null,
        coverUrl,
        updatedAt: new Date().toISOString(),
      });
      useAppStore.setState((prev) => ({
        courses: prev.courses.map(c =>
          (c.courseId || (c as any).id) === (editCourse.courseId || (editCourse as any).id)
            ? { ...c, title: courseTitle.trim(), description: courseDescription.trim(), durationMinutes: duration, externalUrl: courseExternalUrl.trim() || null, coverUrl }
            : c
        ),
      }));
    } catch (e) {
      console.warn('Error updating course:', e);
    }
    setCourseTitle('');
    setCourseDescription('');
    setCourseDuration('');
    setCourseExternalUrl('');
    setCoverPreview(null);
    setCoverFile(null);
    setNewCourseOpen(false);
    setEditCourse(null);
  }

  // Course detail view
  if (route === 'curso-detalle' || route === 'leccion') {
    const courseId = useAppStore.getState().routeParams.courseId || '';
    return (
      <div className="space-y-1">
        <div className="terminal-text text-xs mb-4">
          <span className="terminal-prompt">bbmdev</span>{' '}
          <span className="terminal-path">~/cursos</span>{' '}
          <span className="terminal-comment">— {courseId}</span>
        </div>
        <CourseDetail
          courseId={courseId}
          onBack={() => navigate('cursos')}
        />
      </div>
    );
  }

  // Course list
  return (
    <div className="space-y-5">
      {/* Terminal header */}
      <div className="flex items-center justify-between">
        <div className="terminal-text text-xs">
          <span className="terminal-prompt">bbmdev</span>{' '}
          <span className="terminal-path">~/cursos</span>
          <span className="animate-blink text-foreground">▋</span>
        </div>
        {canCreate && (
          <Button size="sm" onClick={() => setNewCourseOpen(true)} className="bg-[#10B981] text-gray-950 hover:bg-[#34D399] font-mono font-semibold rounded-xl shadow-[0_0_22px_rgba(16,185,129,0.4)]">
            <Plus className="size-4 mr-1.5" />
            Nuevo curso
          </Button>
        )}
      </div>

      {/* RF-034: Create/Edit Course Dialog */}
      <Dialog open={newCourseOpen} onOpenChange={(open) => { setNewCourseOpen(open); if (!open) setEditCourse(null); }}>
        <DialogContent className="sm:max-w-lg bg-[#0f172a] border-white/10">
          <DialogHeader>
            <DialogTitle className="font-mono text-lg text-white">{editCourse ? 'Editar Curso' : 'Nuevo Curso'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <label className="text-sm font-mono text-[#10B981]">Título *</label>
              <Input value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} placeholder="Nombre del curso" className="bg-transparent border border-white/10 text-white placeholder:text-gray-600 font-mono text-sm focus:border-[#10B981]/50" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-mono text-[#10B981]">Descripción *</label>
              <Textarea value={courseDescription} onChange={(e) => setCourseDescription(e.target.value)} placeholder="Describe el curso..." rows={4} className="bg-transparent border border-white/10 text-white placeholder:text-gray-600 font-mono text-sm resize-none focus:border-[#10B981]/50" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-mono text-[#10B981]">Duración (minutos)</label>
              <Input type="number" value={courseDuration} onChange={(e) => setCourseDuration(e.target.value)} placeholder="60" className="bg-transparent border border-white/10 text-white placeholder:text-gray-600 font-mono text-sm focus:border-[#10B981]/50" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-mono text-[#10B981]">Foto del curso</label>
              <label className="w-full border-2 border-dashed border-white/20 rounded-lg py-4 flex flex-col items-center gap-2 hover:border-[#10B981]/40 hover:bg-[#10B981]/5 transition-all cursor-pointer">
                <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                {coverPreview ? (
                  <img src={coverPreview} alt="Preview" className="w-full h-24 object-cover rounded-lg" />
                ) : (
                  <>
                    <span className="text-2xl">🖼️</span>
                    <span className="text-xs text-gray-400 font-mono">Click para subir imagen</span>
                  </>
                )}
              </label>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-mono text-[#10B981]">Enlace externo (opcional)</label>
              <Input value={courseExternalUrl} onChange={(e) => setCourseExternalUrl(e.target.value)} placeholder="https://ejemplo.com/curso" className="bg-transparent border border-white/10 text-white placeholder:text-gray-600 font-mono text-sm focus:border-[#10B981]/50" />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="ghost" onClick={() => { setNewCourseOpen(false); setEditCourse(null); }} className="flex-1 text-gray-400 hover:text-white">Cancelar</Button>
              <Button onClick={editCourse ? handleUpdateCourse : handleCreateCourse} disabled={!courseTitle.trim() || !courseDescription.trim()} className="flex-1 bg-[#10B981] text-gray-950 hover:bg-[#34D399] font-mono font-semibold rounded-xl shadow-[0_0_22px_rgba(16,185,129,0.4)] disabled:opacity-40">
                {editCourse ? 'Guardar cambios' : <><Plus className="size-4 mr-1.5" /> Crear curso</>}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Course grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <CourseCard
            key={course.courseId}
            course={course}
            onOpenCourse={(id) => navigate('curso-detalle', { courseId: id })}
            onEditCourse={canCreate ? (c) => { setEditCourse(c); setNewCourseOpen(true); } : undefined}
          />
        ))}
      </div>
    </div>
  );
}
