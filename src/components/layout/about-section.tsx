"use client"

import Image from "next/image";
import MyCV from "./my-cv";
import { useState } from "react";

export default function AboutSection() {
  const [showCV, setShowCV] = useState(false);

  const handleShowCV = () => {
    setShowCV(!showCV);
  }

  return (
    <div className="bg-muted/40 dark:bg-muted/20 px-10 py-6 rounded-md" id="about-section">
      <p className="text-center text-2xl font-semibold mb-5">About me</p>
      <div className="grid grid-cols-1 md:grid-cols-10 max-[768px]:space-y-5 md:space-x-5">
        <div className="col-span-1 md:col-span-2">
          <Image src={"/rizky.jpg"} alt="Profile" width={500} height={500} className="h-96 md:h-full w-full rounded-md lg:rounded-e-sm object-cover lg:h-full" />
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
      <button
        onClick={handleShowCV}
        className="w-full py-2 mt-4 bg-muted text-white rounded-md hover:bg-muted/80 transition"
      >
        {showCV ? "Hide CV" : "Show CV"}
      </button>
      {showCV && <MyCV />}
    </div>
  );
}
