'use client';

import { useState } from 'react';
import { useAppStore } from '@/stores/app-store';
import { MOCK_COURSES, MOCK_LESSONS } from '@/lib/mock-data';
import type { Course, Lesson } from '@/types/autodev';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
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
}: {
  course: Course;
  onOpenCourse: (courseId: string) => void;
}) {
  const gradient = COURSE_GRADIENTS[course.courseId] || 'from-cyan-900/40 to-blue-900/30';

  return (
    <Card
      className="glass-card border-border/50 hover:border-primary/30 transition-all group cursor-pointer overflow-hidden"
      onClick={() => onOpenCourse(course.courseId)}
    >
      {/* Cover */}
      <div
        className={`relative h-36 bg-gradient-to-br ${gradient} flex items-center justify-center`}
      >
        <div className="text-primary/30 group-hover:text-primary/50 transition-colors">
          {getCourseIcon(course.courseId)}
        </div>
        {course.isEnrolled && (
          <Badge className="absolute top-2 right-2 bg-primary/20 text-primary border-primary/30 text-[10px]">
            <CheckCircle2 className="size-3 mr-1" />
            Inscrito
          </Badge>
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
          <span className="flex items-center gap-1">
            <Play className="size-3" />
            {course.lessonsCount} lecciones
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-3">
          <Users className="size-3" />
          <span>{course.enrolledCount} inscritos</span>
        </div>

        {/* Progress bar */}
        {course.isEnrolled && (
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
            course.isEnrolled
              ? 'bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onOpenCourse(course.courseId);
          }}
        >
          {course.isEnrolled ? (
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
  const [localCourses, setLocalCourses] = useState(MOCK_COURSES);
  const [localLessons, setLocalLessons] = useState<Record<string, Lesson[]>>(
    () => {
      const copy: Record<string, Lesson[]> = {};
      Object.entries(MOCK_LESSONS).forEach(([key, val]) => {
        copy[key] = val.map((l) => ({ ...l }));
      });
      return copy;
    }
  );
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(
    null
  );

  const course = localCourses.find((c) => c.courseId === courseId);
  const lessons = localLessons[courseId] || [];

  const selectedLesson = lessons.find((l) => l.lessonId === selectedLessonId);
  const completedCount = lessons.filter((l) => l.isCompleted).length;
  const progressPercent =
    lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  function handleEnroll() {
    if (!course) return;
    setLocalCourses((prev) =>
      prev.map((c) =>
        c.courseId === courseId
          ? { ...c, isEnrolled: true, enrolledCount: c.enrolledCount + 1 }
          : c
      )
    );
    // Auto-select first lesson
    if (lessons.length > 0 && !selectedLessonId) {
      setSelectedLessonId(lessons[0].lessonId);
    }
  }

  function handleToggleComplete(lessonId: string) {
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
        setLocalCourses((cPrev) =>
          cPrev.map((c) =>
            c.courseId === courseId ? { ...c, progress: newProgress } : c
          )
        );

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
        <div className="w-full sm:w-48">
          <Progress value={progressPercent} className="h-2" />
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

// ── Courses Page (main export) ──────────────────────────
export default function CoursesPage() {
  const { route, navigate } = useAppStore();

  // Course detail view
  if (route === 'curso-detalle' || route === 'leccion') {
    const courseId = useAppStore.getState().routeParams.courseId || '';
    return (
      <div className="space-y-1">
        <div className="terminal-text text-xs mb-4">
          <span className="terminal-prompt">autodev</span>{' '}
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
      <div className="terminal-text text-xs">
        <span className="terminal-prompt">autodev</span>{' '}
        <span className="terminal-path">~/cursos</span>
        <span className="animate-blink text-foreground">▋</span>
      </div>

      {/* Course grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_COURSES.map((course) => (
          <CourseCard
            key={course.courseId}
            course={course}
            onOpenCourse={(id) =>
              navigate('curso-detalle', { courseId: id })
            }
          />
        ))}
      </div>
    </div>
  );
}