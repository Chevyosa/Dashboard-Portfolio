export interface Project {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  excerpt?: string;
  content?: string;
  challenge?: string;
  solution?: string;
  results?: string[];
  tech_stack: string[];
  image_url?: string;
  gallery?: string[];
  live_url?: string;
  repo_url?: string;
  confidential?: boolean;
  year?: number;
  is_published: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}
