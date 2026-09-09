"use client";

import { formatDate } from "@/commons/helpers";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { FaRegEye as ViewIcon } from "react-icons/fa";
import { scroller } from "react-scroll";
import { HiOutlineClock as ClockIcon } from "react-icons/hi";
import { TbMessage2 as CommentIcon } from "react-icons/tb";
import Typography from "@/components/ui/typography";

interface BlogReaderHeaderProps {
  title: string;
  comments_count?: number;
  reading_time_minutes?: number;
  page_views_count?: number | null;
  published_at?: string;
}

const BlogReaderHeader = ({
  title,
  comments_count = 0,
  page_views_count,
  published_at,
  reading_time_minutes,
}: BlogReaderHeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  const scrollToSection = () => {
    scroller.scrollTo("comments", {
      duration: 800,
      delay: 0,
      smooth: "easeInOutQuart",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 250);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const titleVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <>
      <motion.h1
        className="max-w-3xl text-balance font-display text-3xl font-semibold leading-[1.08] tracking-tight sm:text-4xl md:text-5xl"
        initial="initial"
        animate="animate"
        variants={titleVariants}
        transition={{
          duration: 0.3,
          delay: 0,
          ease: "easeInOut"
        }}
      >
        {title}
      </motion.h1>
      <div className="mb-10 mt-5 flex flex-col justify-between gap-3 border-y border-border py-4 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground sm:flex-row">
        <Typography.P>
          Published on <span className="px-1 font-medium">{published_at ? formatDate(published_at) : ""}</span>
        </Typography.P>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1 font-medium">
            <ViewIcon size={18} />
            <Typography.P className="ml-0.5 flex gap-1">
              <span>{page_views_count ?? "-"}</span>
              <span>Views</span>
            </Typography.P>
          </div>
          <div className="flex items-center gap-1 font-medium">
            <ClockIcon size={18} />
            <Typography.P className="ml-0.5 flex gap-1">
              <span>{reading_time_minutes}</span>
              <span>min read</span>
            </Typography.P>
          </div>
          <button
            className="hidden cursor-pointer items-center gap-1 font-medium hover:dark:text-neutral-300 md:flex"
            onClick={scrollToSection}
          >
            <CommentIcon size={20} />
            <Typography.P className="ml-0.5 flex gap-1">
              <span>{comments_count}</span>
              <span>Comment{comments_count > 1 && "s"}</span>
            </Typography.P>
          </button>
        </div>

        <button
          className="flex cursor-pointer items-center gap-1 font-medium hover:dark:text-neutral-300 md:hidden"
          onClick={scrollToSection}
        >
          <CommentIcon size={20} />
          <div className="ml-0.5 flex gap-1">
            <span>{comments_count}</span>
            <span>Comment{comments_count > 1 && "s"}</span>
          </div>
        </button>
      </div>
    </>
  );
};

export default BlogReaderHeader;
