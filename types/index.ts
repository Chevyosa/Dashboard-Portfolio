export interface Project {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tech_stack: string[];
  live_url?: string;
  repo_url?: string;
  image_url?: string;
  is_published: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}
