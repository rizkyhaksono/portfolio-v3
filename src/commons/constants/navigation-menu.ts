import {
  Wrench,
  CatIcon,
  Coffee,
  Home,
  MessageSquare,
  LucideIcon,
  BookOpen,
  Rss,
  HomeIcon,
  LogIn,
  User,
} from "lucide-react";

type Menu = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export type SidebarMenu = {
  groupLabel: string;
  menus: Menu[];
};

export const publicDashboardMenu = [
  {
    groupLabel: "",
    menus: [
      {
        href: "/",
        label: "Home",
        icon: Home,
      },
      {
        href: "/project",
        label: "Project",
        icon: Coffee,
      },
      {
        href: "/blog",
        label: "Blog",
        icon: Rss,
      },
    ],
  },
  {
    groupLabel: "Application",
    menus: [
      {
        href: "/ai",
        label: "Etan AI",
        icon: CatIcon,
      },
      {
        href: "/chat",
        label: "Chat",
        icon: MessageSquare,
      },
    ],
  },
  {
    groupLabel: "Playground",
    menus: [
      {
        href: "/tools",
        label: "Tools",
        icon: Wrench,
      },
      {
        href: "/roadmap",
        label: "Roadmap",
        icon: BookOpen,
      },
    ],
  },
];

export const userProfileMenu = [
  {
    groupLabel: "",
    menus: [
      {
        href: "/profile",
        label: "My Profile",
        icon: User,
      },
    ],
  },
];

export const mainNavData = (isHaveToken: boolean) => [
  { href: "/", icon: HomeIcon, label: "Home" },
  { href: "/project", icon: Coffee, label: "Project" },
  { href: "/blog", icon: Rss, label: "Blog" },
  {
    href: isHaveToken ? "/profile" : "/auth",
    icon: isHaveToken ? User : LogIn,
    label: isHaveToken ? "Profile" : "Login",
  },
];