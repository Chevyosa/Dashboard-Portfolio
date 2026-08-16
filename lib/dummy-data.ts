import { Project } from "../types";

export const dummyProjects: Project[] = [
  {
    id: "1",
    title: "E-Commerce Dashboard",
    slug: "e-commerce-dashboard",
    excerpt: "Admin dashboard for an e-commerce platform with real-time stats.",
    content: "# E-Commerce Dashboard\n\nA fullstack application...",
    tech_stack: ["Next.js", "TailwindCSS", "PostgreSQL"],
    live_url: "https://example.com/demo1",
    repo_url: "https://github.com/example/ecommerce",
    is_published: true,
    order_index: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "AI Chat Application",
    slug: "ai-chat-application",
    excerpt: "A realtime chat application integrated with LLM APIs.",
    content: "# AI Chat\n\nBuilt with WebSockets and OpenAI API...",
    tech_stack: ["React", "Express", "Socket.io"],
    is_published: false,
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];
