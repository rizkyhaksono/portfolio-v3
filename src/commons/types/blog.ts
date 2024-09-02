export type BlogItemProps = {
  id: number;
  date: string;
  modified: string;
  slug: string;
  status: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    markdown: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: {
    footnotes: string;
  };
  categories: number[];
  tags: number[];
  tags_list: {
    term_id: number;
    name: string;
    slug: string;
    term_group: number;
    term_taxonomy_id: number;
    taxonomy: string;
    description: string;
    parent: number;
    count: number;
    filter: string;
  }[];
  amp_enabled: boolean;
  featured_image_url: string;
  total_views_count: number;
};

export type UserProps = {
  name: string
  username: string
  twitter_username: string | null
  github_username: string
  user_id: number
  website_url: string
  profile_image: string
  profile_image_90: string
}

export type BlogItem = {
  type_of: string;
  id: number;
  title: string;
  description: string;
  published: boolean;
  published_at: string;
  slug: string;
  path: string;
  url: string;
  comments_count: number;
  public_reactions_count: number;
  page_views_count: number;
  published_timestamp: string;
  body_markdown: string;
  positive_reactions_count: number;
  cover_image: string;
  tag_list: string[];
  canonical_url: string;
  reading_time_minutes: number;
  user: UserProps;
  db_views_count: number;
  total_views_count: number;
  collection_id: number;
  created_at: string;
};

export type BlogDetailProps = {
  type_of: string
  id: number
  title: string
  description: string
  readable_publish_date: string
  slug: string
  path: string
  url: string
  comments_count: number
  public_reactions_count: number
  collection_id: number | null
  published_timestamp: string
  positive_reactions_count: number
  cover_image: string
  social_image: string
  canonical_url: string
  created_at: string
  edited_at: string | null
  crossposted_at: string | null
  published_at: string
  last_comment_at: string | null
  reading_time_minutes: number
  tag_list: string
  tags: string[]
  body_html: string
  body_markdown: string
  user: UserProps
  blog_slug: string | null
}

export type BlogProps = {
  blogs: BlogItem[]
}

export type CommentItemProps = {
  type_of: string
  id_code: string
  created_at: string
  body_html: string
  user: UserProps
  children: CommentItemProps[]
}

export type BlogParamsProps = {
  params: { content: string };
  searchParams: { [key: string]: string | string[] | undefined };
};