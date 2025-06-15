type Params = Promise<{ slug: string }>

export default async function NoteSlugPage({ params }: Readonly<{ params: Params }>) {
  const param = await params

  return (
    <div>
      <p>Under Development</p>
    </div>
  )
}