"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, BookOpen, Clock, BarChart } from "lucide-react"
import { db } from "@/lib/firebase"
import { collection, getDocs } from "firebase/firestore"
import type { Course } from "@/types/bbmdev"

export default function CoursesCatalogPage() {
  const [search, setSearch] = useState("")
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCourses() {
      try {
        const snap = await getDocs(collection(db, 'courses'));
        const data = snap.docs.map(doc => ({ courseId: doc.id, ...doc.data() } as Course))
        setCourses(data)
      } catch (err) {
        console.error("Error fetching courses", err)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  const filteredCourses = courses.filter(
    course => course.title.toLowerCase().includes(search.toLowerCase()) || 
              course.description.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return <div className="container mx-auto py-20 px-4 text-center text-muted-foreground font-mono">Cargando cursos desde Firestore...</div>
  }

  return (
    <div className="container mx-auto py-8 px-4 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Catálogo de Cursos</h1>
          <p className="text-muted-foreground mt-2 text-lg">Aprende automatización, IA y desarrollo web con expertos.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Buscar cursos..." 
            className="pl-8 bg-background" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-xl font-medium">No se encontraron cursos</h3>
          <p className="text-muted-foreground">Intenta buscar con otros términos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.courseId} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow border-muted/60 bg-card/50 backdrop-blur-sm">
              <div className="aspect-video w-full overflow-hidden bg-muted relative">
                {/* Fallback pattern since we might not have real images */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-primary/40" />
                </div>
                {(course as any).coverUrl && (
                  <img 
                    src={(course as any).coverUrl} 
                    alt={course.title}
                    className="object-cover w-full h-full relative z-10"
                  />
                )}
                <div className="absolute top-2 right-2 z-20">
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow">
                    {/* @ts-ignore */}
                    {course.level === 'principiante' ? 'Básico' : course.level === 'intermedio' ? 'Medio' : 'Avanzado'}
                  </span>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2 leading-tight">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2 mt-2">{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pb-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <BarChart className="h-4 w-4" />
                    <span>{course.lessonsCount} lecciones</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.durationMinutes} min</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button asChild className="w-full">
                  <Link href={`/courses/${course.courseId}`}>
                    Ver detalles
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
