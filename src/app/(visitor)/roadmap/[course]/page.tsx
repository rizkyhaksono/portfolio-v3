type Params = Promise<{ id: string }>

export default async function RoadmapCoursePage({ params }: Readonly<{ params: Params }>) {
  const param = await params

  return (
    <div>
      <p>Under Development</p>
    </div>
  )
}