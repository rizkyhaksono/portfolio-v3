import Image from "next/image";

export default function AboutSection() {
  return (
    <div className="bg-muted/40 dark:bg-muted/20 px-10 py-6 rounded-xl">
      <p className="text-center">About me</p>
      <div className="grid md:grid-cols-10 lg:space-x-5">
        <div className="col-span-2">
          <Image src={"/rizky.jpg"} alt="Profile" width={500} height={500} className="w-60 h-40 lg:w-full rounded-lg lg:rounded-e-sm object-cover lg:h-full" />
        </div>
        <div className="col-span-1 md:col-span-8 rounded-md">
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
        <div className="grid md:grid-cols-3 lg:gap-5 items-center">
          <div className="bg-muted/80 p-2 rounded-md">React</div>
          <div className="bg-muted/80 p-2 rounded-md">Node.js</div>
          <div className="bg-muted/80 p-2 rounded-md">Flutter</div>
          <div className="bg-muted/80 p-2 rounded-md">TypeScript</div>
          <div className="bg-muted/80 p-2 rounded-md">JavaScript</div>
          <div className="bg-muted/80 p-2 rounded-md">HTML/CSS</div>
        </div>
      </div>
    </div>
  );
}
