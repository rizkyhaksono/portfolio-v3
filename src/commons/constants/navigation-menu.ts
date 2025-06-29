import {
  Wrench,
  CatIcon,
  Coffee,
  Home,
  MessageSquare,
  LucideIcon,
  BookOpen,
  Rss,
  SquareDashedBottomCode,
  FolderOpen,
  HomeIcon,
  Code,
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
        href: "/snippets",
        label: "Snippets",
        icon: SquareDashedBottomCode,
      },
      {
        href: "/tools",
        label: "Tools",
        icon: Wrench,
      },
      {
        href: "/files",
        label: "Files",
        icon: FolderOpen,
      },
    ],
  },
  {
    groupLabel: "Playground",
    menus: [
      {
        href: "/compiler",
        label: "Compiler",
        icon: Code,
      },
      {
        href: "/chat",
        label: "Chat",
        icon: MessageSquare,
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
  { href: "/ai", icon: CatIcon, label: "Etan AI" },
  {
    href: isHaveToken ? "/profile" : "/auth",
    icon: isHaveToken ? User : LogIn,
    label: isHaveToken ? "Profile" : "Login",
  },
];

export const expandedNavData = [
  { href: "/snippets", icon: SquareDashedBottomCode, label: "Snippets" },
  { href: "/tools", icon: Wrench, label: "Notes" },
  { href: "/files", icon: FolderOpen, label: "Files" },
  { href: "/compiler", icon: Code, label: "Compiler" },
  { href: "/chat", icon: MessageSquare, label: "Chat" },
  { href: "/roadmap", icon: BookOpen, label: "Roadmap" },
];