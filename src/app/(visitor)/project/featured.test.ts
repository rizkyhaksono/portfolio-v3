import { selectFeaturedProjects } from "./featured"

const project = (id: string, title: string, created_at: string, image: string | null = "/shot.png") => ({ id, title, created_at, image })

describe("selectFeaturedProjects", () => {
  const all = [
    project("1", "Adaro Water Solution", "2024-01-01"),
    project("2", "Side thing", "2026-03-01"),
    project("3", "Info Pangan Jakarta Re-engineering", "2023-01-01"),
    project("4", "No picture", "2026-05-01", null),
    project("5", "eCRF Biofarma", "2022-01-01"),
  ]

  it("keeps the editorial order of the hand-picked titles", () => {
    expect(selectFeaturedProjects(all).map((p) => p.id)).toEqual(["3", "1", "5"])
  })

  it("fills a renamed slot with the newest project that has a screenshot", () => {
    const renamed = all.filter((p) => p.id !== "1")
    expect(selectFeaturedProjects(renamed).map((p) => p.id)).toEqual(["3", "5", "2"])
  })
})
