import Image from "next/image"

export default function AboutSection() {
  return (
    <div className="bg-muted/40 px-10 py-6 rounded-xl">
      <p className="text-center">About me</p>
      <div className="grid grid-cols-10 gap-5">
        <div className="col-span-2">
          <Image src={"/rizky.jpg"} alt="Profile" width={500} height={500} className="rounded-md object-cover h-full" />
        </div>
        <div className="bg-muted/80 p-2 col-span-8 rounded-md">
          I am a developer with a passion for building scalable and maintainable application and website. I have experience in building web applications using React and etc. I am also interested in building mobile applications using
          Flutter.
          <br />
          <br />I educate, refine and drive myself to be a better person
          <br />- I am constantly learning.
          <br />- I stay calm when faced with adversity.
          <br />- I focus on making difficult decisions.
          <br />
          <br />I enjoy meeting new people and hearing new perspectives.
        </div>
      </div>
      <div className="mt-10">
        <p>Skills</p>
        <div className="grid grid-cols-3 gap-5">
          <div className="bg-muted/80 p-2 rounded-md">React</div>
          <div className="bg-muted/80 p-2 rounded-md">Node.js</div>
          <div className="bg-muted/80 p-2 rounded-md">Flutter</div>
          <div className="bg-muted/80 p-2 rounded-md">TypeScript</div>
          <div className="bg-muted/80 p-2 rounded-md">JavaScript</div>
          <div className="bg-muted/80 p-2 rounded-md">HTML/CSS</div>
        </div>
      </div>
    </div>
  )
}
