export const JOB_TITLE = "Senior AI Engineer"

export interface Author {
  name: string;
  position: string;
  avatar: string;
}

export const authors: Record<string, Author> = {
  rizky: {
    name: "Muhammad Rizky Haksono",
    position: JOB_TITLE,
    avatar: "/rizky.jpg",
  },
  natee: {
    name: "rizkyhaksono",
    position: JOB_TITLE,
    avatar: "/rizky.jpg",
  },
} as const;

export type AuthorKey = keyof typeof authors;

export function getAuthor(key: AuthorKey): Author {
  return authors[key];
}

export function isValidAuthor(key: string): key is AuthorKey {
  return key in authors;
}
