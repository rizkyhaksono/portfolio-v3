type Params = Promise<{ id: string }>

export default async function RoadmapCourseSlugPage({ params }: Readonly<{ params: Params }>) {
  const param = await params
  console.log("Roadmap Detail Page Params:", param)

  return (
    <div>
      <p>Under Development</p>
    </div>
  )
}