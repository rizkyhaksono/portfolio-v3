import { plainText, safeHtml } from "./safe-html"

describe("safeHtml", () => {
  it("keeps the rich-text formatting", () => {
    expect(safeHtml('<p class="x">A <strong>bold</strong> <a href="https://natee.my.id" target="_blank">link</a></p><ul><li>one</li></ul><br/>')).toBe(
      '<p>A <strong>bold</strong> <a href="https://natee.my.id">link</a></p><ul><li>one</li></ul><br>',
    )
  })

  it("drops scripts, handlers and unsafe links", () => {
    expect(safeHtml("<script>alert(1)</script><p>ok</p>")).toBe("<p>ok</p>")
    expect(safeHtml('<img src=x onerror="alert(1)"><p onclick="x()">ok</p>')).toBe("<p>ok</p>")
    expect(safeHtml('<a href="javascript:alert(1)">x</a>')).toBe("<a>x</a>")
    expect(safeHtml('<a href="javascript&#58;alert(1)">x</a>')).toBe("<a>x</a>")
    expect(safeHtml('<a href="//evil.example">x</a>')).toBe("<a>x</a>")
    expect(safeHtml('<a href="a>b" onclick=x>y</a>')).toBe('<a>b" onclick=x>y</a>')
  })

  it("turns typed ● paragraphs into a list", () => {
    expect(safeHtml("<p>Lead.</p><p>● One</p><p>●&nbsp;<strong>Two</strong></p><p>After</p>")).toBe(
      "<p>Lead.</p><ul><li>One</li><li><strong>Two</strong></li></ul><p>After</p>",
    )
  })

  it("escapes any other angle bracket", () => {
    expect(safeHtml("<scr<script>ipt>alert(1)")).toBe("ipt>alert(1)")
    expect(safeHtml("1 < 2 and <iframe src=x></iframe>")).toBe("1 &lt; 2 and ")
  })
})

describe("plainText", () => {
  it("strips tags and decodes the common entities", () => {
    expect(plainText("<p>Fish &amp; chips</p><p>&lt;b&gt;</p>")).toBe("Fish & chips <b>")
    expect(plainText("<p>ok</p><script>alert(1)</script><!-- note -->")).toBe("ok")
  })

  it("drops figure captions and reads typed bullets as sentences", () => {
    expect(plainText('<figure><img alt=""><figcaption>*kanban</figcaption></figure><p>Before BIGIO</p>')).toBe("Before BIGIO")
    expect(plainText("<p>For the public</p><p>● Built views</p><p>● Added search.</p>")).toBe("For the public. Built views. Added search.")
    expect(plainText("<p>● Led: </p><p>● Shipped</p>")).toBe("Led: Shipped")
  })
})
