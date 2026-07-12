"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { ChevronLeft, PlayCircle, CheckCircle2, ChevronRight, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import { db } from "@/lib/firebase"
import { doc, getDoc, collection, getDocs, setDoc, query, orderBy, updateDoc, increment } from "firebase/firestore"
import type { Course, Lesson } from "@/types/autodev"

export default function LessonViewerPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  
  const courseId = params.courseId as string
  const lessonId = params.lessonId as string

  useEffect(() => {
    async function fetchData() {
      if (!user) {
        router.push(`/login?returnUrl=/courses/${courseId}/lessons/${lessonId}`)
        return
      }

      try {
        const courseDoc = await getDoc(doc(db, 'courses', courseId))
        if (courseDoc.exists()) {
          setCourse({ courseId: courseDoc.id, ...courseDoc.data() } as Course)
        }

        const lessonsSnap = await getDocs(query(collection(db, `courses/${courseId}/lessons`), orderBy('order', 'asc')))
        const lessonsData = lessonsSnap.docs.map(d => ({ lessonId: d.id, ...d.data() } as Lesson))
        setLessons(lessonsData)
        
        const currentLesson = lessonsData.find(l => l.lessonId === lessonId)
        if (currentLesson) {
          setLesson(currentLesson)
        }

        // Check completion status
        const completionDoc = await getDoc(doc(db, `courses/${courseId}/lessons/${lessonId}/completions`, user.uid))
        if (completionDoc.exists()) {
          setIsCompleted(true)
        }
        
        // Calculate progress (mock logic for now, could count completions from db)
        setProgress(lessonsData.length > 0 ? Math.round(100 / lessonsData.length) : 0)

      } catch (err) {
        console.error("Error fetching lesson data", err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [user, courseId, lessonId, router])

  if (loading) return <div className="p-8 text-center text-muted-foreground font-mono">Cargando lección...</div>
  if (!course || !lesson) return <div className="p-8 text-center">Contenido no encontrado</div>

  const handleMarkComplete = async () => {
    if (!user) return
    try {
      await setDoc(doc(db, `courses/${courseId}/lessons/${lessonId}/completions`, user.uid), {
        userId: user.uid,
        completedAt: new Date().toISOString(),
      })
      // Add XP to user
      await updateDoc(doc(db, 'users', user.uid), {
        xp: increment(lesson.xpReward || 50),
        weeklyXP: increment(lesson.xpReward || 50),
      })
      
      setIsCompleted(true)
      toast({
        title: "¡Lección Completada!",
        description: `Has ganado ${lesson.xpReward || 50} XP.`,
      })
    } catch (err) {
      console.error("Error marking complete", err)
    }
  }
  
  // Find next lesson
  const currentIndex = lessons.findIndex(l => l.lessonId === lessonId)
  const nextLesson = currentIndex >= 0 && currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-background">
      {/* Sidebar for Lessons */}
      <aside className="w-80 border-r bg-muted/30 hidden md:flex flex-col">
        <div className="p-4 border-b">
          <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2 text-muted-foreground">
            <Link href={`/courses/${course.courseId}`}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Volver al curso
            </Link>
          </Button>
          <h2 className="font-bold line-clamp-2">{course.title}</h2>
          
          <div className="mt-4 space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Tu progreso (Estimado)</span>
              <span>{isCompleted ? progress : 0}%</span>
            </div>
            <Progress value={isCompleted ? progress : 0} className="h-2" />
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-4 space-y-2">
          {lessons.map(l => {
            const isActive = l.lessonId === lessonId;
            // Optimistic completion display for sidebar could be added here
            return (
              <Link key={l.lessonId} href={`/courses/${courseId}/lessons/${l.lessonId}`}>
                <div className={`p-3 rounded-md flex items-center gap-3 transition-colors cursor-pointer mb-2 ${isActive ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'}`}>
                  {isActive && isCompleted ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <PlayCircle className="h-4 w-4 shrink-0" />}
                  <span className="truncate flex-1">{l.order}. {l.title}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <div className="p-4 border-b flex md:hidden items-center">
          <Button variant="ghost" size="icon" asChild>
             <Link href={`/courses/${course.courseId}`}><ChevronLeft className="h-5 w-5" /></Link>
          </Button>
          <h1 className="font-semibold ml-2 line-clamp-1">{course.title}</h1>
        </div>

        <div className="flex-1 p-4 lg:p-8 max-w-4xl mx-auto w-full space-y-8">
          <div className="aspect-video w-full bg-black rounded-xl overflow-hidden relative flex items-center justify-center">
            <PlayCircle className="h-16 w-16 text-white/50" />
            <span className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded">
              Contenido de la Lección
            </span>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl font-bold">{lesson.order}. {lesson.title}</h1>
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold border-yellow-500/50 text-yellow-500 bg-yellow-500/10">
                <Zap className="w-3 h-3 mr-1" />
                {lesson.xpReward} XP
              </span>
            </div>
            
            <div className="prose dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary">
              <div dangerouslySetInnerHTML={{ __html: lesson.content.replace(/\n/g, '<br/>') }} />
            </div>
          </div>

          <div className="pt-8 border-t flex justify-between items-center">
            <div>
               {isCompleted ? (
                 <span className="text-green-600 dark:text-green-400 font-medium flex items-center gap-2">
                   <CheckCircle2 className="h-5 w-5" /> Completada
                 </span>
               ) : (
                 <Button onClick={handleMarkComplete}>
                   Marcar como Completada
                 </Button>
               )}
            </div>
            {nextLesson ? (
              <Button variant="outline" asChild>
                <Link href={`/courses/${courseId}/lessons/${nextLesson.lessonId}`}>
                  Siguiente <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" disabled>
                Última lección
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
