import {
  BookText,
  CatIcon,
  Coffee,
  Home,
  Lock,
  LucideIcon,
  MessageCircle,
  RocketIcon,
  Rss,
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