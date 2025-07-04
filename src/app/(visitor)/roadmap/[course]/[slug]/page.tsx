type Params = Promise<{ course: string, slug: string }>

export default async function RoadmapCourseSlugPage({ params }: Readonly<{ params: Params }>) {
  const param = await params

  return (
    <div>
      <p>Under Development {param.course} {param.slug}</p>
    </div>
  )
}