"use client";

import { useReducer } from "react";
import Image from "next/image";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"
import { useGetProject } from "@/lib/hooks/useProject";
import { useGetCareer } from "@/lib/hooks/useCareer";
import { useGetEducation } from "@/lib/hooks/useEducation";
import CardProject from "@/components/layout/user/card-project";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link";
import emailjs from "@emailjs/browser";
import { toast } from "sonner"

const initialState = {
  email: "",
  message: "",
};

function formReducer(state: any, action: any) {
  switch (action.type) {
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_MESSAGE":
      return { ...state, message: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default function Home() {
  const [formState, dispatch] = useReducer(formReducer, initialState);
  const { data: projects } = useGetProject();
  const { data: careers } = useGetCareer();
  const { data: educations } = useGetEducation();

  const sendEmail = (e: any) => {
    e.preventDefault();

    const templateParams = {
      email: formState.email,
      message: formState.message,
    };

    emailjs
      .send(
        process.env.NEXT_PUBLIC_EMAIL_JS_SERVICE_ID ?? "",
        process.env.NEXT_PUBLIC_EMAIL_JS_TEMPLATE_ID ?? "",
        templateParams,
        process.env.NEXT_PUBLIC_EMAIL_JS_PUBLIC_KEY ?? ""
      )
      .then(
        () => {
          toast.success("Email sent successfully");
          dispatch({ type: "RESET" });
        },
        (error) => {
          toast.error("Failed to send email");
          console.log('FAILED...', error);
        }
      );
  };

  return (
    <div className="container max-w-2xl min-h-screen pt-12 sm:pt-24 px-6">
      <div className="flex flex-row items-center gap-5">
        <div className="flex-1 text-left">
          <div className="font-bold text-3xl mb-2">{`Hi, I'm Rizky Haksono`}</div>
          <span className="text-base">{`Full Stack Developer. I love building web and mobile applications. Very active on GitHub and always looking for new opportunities.`}</span>
        </div>
        <Image
          src={"/rizky.jpg"}
          alt="Profile"
          width={1000}
          height={1000}
          className="rounded-full object-cover size-28 md:justify-self-end"
        />
      </div>
      <div className="mt-10">
        <p className="text-left text-xl font-semibold">About</p>
        <div className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert">
          Experience in Software Development with skills in Web and Mobile Development. I am still an undergraduate and have experience related to web and mobile development as well as UI/UX design.
          <div className="w-fit">
            <a href="/cv-rizky-v3.pdf" download>
              <Button className="flex gap-2 mt-4 rounded-sm" variant={"default"} size={"sm"}>
                CV <Download className="size-4" />
              </Button>
            </a>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <p className="text-left text-xl font-semibold">Skills</p>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge>Next.js</Badge>
          <Badge>Flutter</Badge>
          <Badge>Docker</Badge>
          <Badge>Git</Badge>
          <Badge>Portainer</Badge>
          <Badge>Express.js</Badge>
          <Badge>Nest.js</Badge>
          <Badge>PostgreSQL</Badge>
          <Badge>MySQL</Badge>
          <Badge>Laravel</Badge>
          <Badge>Java Spring</Badge>
          <Badge>Go</Badge>
          <Badge>ASP .NET</Badge>
        </div>
      </div>
      <div className="mt-10">
        <p className="text-left text-xl font-semibold">Work Experience</p>
        {careers?.map((career: any, index: number) => (
          <div
            key={career.company + index}
            className="prose max-w-full text-pretty font-sans text-sm dark:prose-invert mt-2 flex flex-row gap-4"
          >
            <Image
              src={career.image}
              alt={`${career.title} logo`}
              width={1000}
              height={1000}
              className="rounded-full object-cover size-16 justify-self-start"
            />
            <div className="flex-1">
              <p>{career.title}</p>
              <p className="text-muted-foreground text-xs">{career.subtitle}</p>
            </div>
            <div className="text-end text-xs ml-auto self-start">
              {career.duration}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <p className="text-left text-xl font-semibold">Education</p>
        {educations?.map((edu: any, index: number) => (
          <div
            key={edu.school + index}
            className="prose max-w-full text-pretty font-sans text-sm dark:prose-invert mt-2 flex flex-row gap-4"
          >
            <Image
              src={edu.image}
              alt={`${edu.title} logo`}
              width={1000}
              height={1000}
              className="rounded-full object-cover size-16 justify-self-start"
            />
            <div className="flex-1">
              <p>{edu.title}</p>
              <p className="text-muted-foreground text-xs">{edu.subtitle}</p>
            </div>
            <div className="text-end text-xs ml-auto self-start">
              {edu.duration}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <div className="text-center">
          <Button className="text-base font-semibold" variant={"default"} size={"sm"}>
            Projects
          </Button>
          <div className="mt-2 text-sm text-muted-foreground">
            {`I have experience working on a wide range of projects, from basic websites to advanced web applications. Here are a few that stand out.`}
          </div>
        </div>
        <div className="grid max-[760px]:grid-cols-1 grid-cols-2 gap-2 mt-4">
          {projects?.map((project: any) => (
            <CardProject
              key={project.id}
              title={project.title}
              description={project.description}
              href={project.url}
              source={project.source_code}
              image={project.image || "/no-image.jpg"}
            />
          ))}
        </div>
      </div>
      <div className="mt-10">
        <div className="text-center">
          <Button className="text-base font-semibold" variant={"default"} size={"sm"}>
            Certificates
          </Button>
          <Link
            href={"https://www.linkedin.com/in/rizkyhaksono/details/certifications"}
            target="_blank"
          >
            <div className="mt-2 text-sm text-muted-foreground">
              <p>
                {`I have completed various online courses and have received certificates for them.`}
              </p>
              <p className="underline underline-offset-4 flex justify-center">
                {`Click here to view all certificates on LinkedIn.`}
              </p>
            </div>
          </Link>
        </div>
      </div>
      <div className="mt-10">
        <div className="text-center">
          <Button className="text-base font-semibold" variant={"default"} size={"sm"}>
            Contact
          </Button>
          <div className="mt-2 text-sm text-muted-foreground">
            If you have any questions or would like to work together, feel free to reach out.
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <form className="w-full max-w-md" onSubmit={sendEmail}>
            <div className="flex flex-col gap-4">
              <Input
                type="email"
                placeholder="Your Email"
                value={formState.email}
                onChange={(e) => dispatch({ type: "SET_EMAIL", payload: e.target.value })}
                required
              />
              <Textarea
                placeholder="Your Message"
                value={formState.message}
                onChange={(e) => dispatch({ type: "SET_MESSAGE", payload: e.target.value })}
                required
              />
              <Button type="submit" variant={"default"} size={"sm"}>
                Send
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
