"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { ChevronLeft, PlayCircle, CheckCircle2, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { db } from "@/lib/firebase"
import { doc, getDoc, collection, getDocs, setDoc, updateDoc, increment, query, orderBy } from "firebase/firestore"
import type { Course, Lesson } from "@/types/autodev"

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [isEnrolling, setIsEnrolling] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const courseId = params.courseId as string

  useEffect(() => {
    async function fetchCourseData() {
      if (!courseId) return
      
      try {
        const courseDoc = await getDoc(doc(db, 'courses', courseId))
        if (courseDoc.exists()) {
          setCourse({ courseId: courseDoc.id, ...courseDoc.data() } as Course)
        }
        
        const lessonsSnap = await getDocs(query(collection(db, `courses/${courseId}/lessons`), orderBy('order', 'asc')))
        const lessonsData = lessonsSnap.docs.map(d => ({ lessonId: d.id, ...d.data() } as Lesson))
        setLessons(lessonsData)
        
        if (user) {
          const enrollDoc = await getDoc(doc(db, `courses/${courseId}/enrollments`, user.uid))
          if (enrollDoc.exists()) {
            setIsEnrolled(true)
          }
        }
      } catch (err) {
        console.error("Error fetching course detail", err)
      } finally {
        setLoading(false)
      }
    }
    fetchCourseData()
  }, [courseId, user])

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground font-mono">Cargando detalles del curso...</div>
  }

  if (!course) {
    return <div className="p-8 text-center">Curso no encontrado</div>
  }

  const handleEnroll = async () => {
    if (!user) {
      router.push(`/login?returnUrl=/courses/${courseId}`)
      return
    }
    
    setIsEnrolling(true)
    try {
      await setDoc(doc(db, `courses/${courseId}/enrollments`, user.uid), {
        userId: user.uid,
        enrolledAt: new Date().toISOString(),
      });
      await updateDoc(doc(db, 'courses', courseId), {
        enrolledCount: increment(1),
      });
      setIsEnrolled(true)
      toast({
        title: "¡Inscripción exitosa!",
        description: `Te has inscrito en ${course.title}.`,
      })
    } catch (err) {
      console.error("Error al inscribirse", err)
      toast({
        title: "Error",
        description: "Hubo un problema con la inscripción.",
        variant: "destructive",
      })
    } finally {
      setIsEnrolling(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 lg:px-8 max-w-5xl">
      <Button variant="ghost" asChild className="mb-6 -ml-4 text-muted-foreground">
        <Link href="/courses">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Volver al catálogo
        </Link>
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div>
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary mb-4">
              {/* @ts-ignore */}
              {course.category || "General"}
            </span>
            <h1 className="text-4xl font-bold tracking-tight mb-4">{course.title}</h1>
            <p className="text-lg text-muted-foreground">{course.description}</p>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <h3>Acerca de este curso</h3>
            <p>Este es un curso avanzado diseñado para llevarte de cero a experto. Aprenderás las mejores prácticas de la industria con proyectos reales.</p>
          </div>
          
          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4">Temario del Curso</h3>
            {lessons.length === 0 ? (
              <div className="text-muted-foreground italic">No hay lecciones publicadas aún.</div>
            ) : (
              <div className="border rounded-lg divide-y bg-card">
                {lessons.map((lesson) => (
                  <div key={lesson.lessonId} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      {isEnrolled ? (
                        <PlayCircle className="h-5 w-5 text-primary" />
                      ) : (
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      )}
                      <span className="font-medium">{lesson.order}. {lesson.title}</span>
                    </div>
                    {isEnrolled ? (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/courses/${course.courseId}/lessons/${lesson.lessonId}`}>
                          Ver lección
                        </Link>
                      </Button>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="sticky top-8 border rounded-xl p-6 bg-card shadow-sm">
            <div className="aspect-video w-full bg-muted rounded-lg mb-6 overflow-hidden relative">
               {(course as any).coverUrl && (
                  <img src={(course as any).coverUrl} alt="Cover" className="w-full h-full object-cover" />
               )}
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Nivel</span>
                <span className="font-medium capitalize">{course.level}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Lecciones</span>
                <span className="font-medium">{lessons.length || course.lessonsCount}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Acceso</span>
                <span className="font-medium">De por vida</span>
              </div>
              
              <div className="pt-4 border-t mt-4">
                {isEnrolled ? (
                  <Button className="w-full" asChild disabled={lessons.length === 0}>
                    <Link href={lessons.length > 0 ? `/courses/${course.courseId}/lessons/${lessons[0].lessonId}` : '#'}>
                      Continuar Aprendiendo
                    </Link>
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={handleEnroll}
                    disabled={isEnrolling}
                  >
                    {isEnrolling ? "Inscribiendo..." : "Inscribirse ahora"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
