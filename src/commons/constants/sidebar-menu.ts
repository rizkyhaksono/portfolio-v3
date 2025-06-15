import {
  BookText,
  CatIcon,
  Coffee,
  Home,
  MessageSquare,
  LucideIcon,
  BookOpen,
  Code,
  Rss,
  User,
  FolderOpen,
  SquareDashedBottomCode,
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
        href: "/notes",
        label: "Notes",
        icon: BookText,
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