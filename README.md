# 🚀 Dashboard Portfolio - Frontend

A modern, responsive, and blazing-fast admin dashboard built to manage portfolio projects. This is the frontend part of the Portfolio system, designed with a focus on premium aesthetics, robust authentication, and seamless user experience.

## ✨ Features

- **🔐 Secure Authentication**: JWT-based authentication using HTTP-only cookies.
- **🎨 Premium UI/UX**: Beautifully crafted components using Shadcn UI and Tailwind CSS.
- **🌓 Theme Support**: Seamless Dark and Light mode toggling.
- **⚡ SWR Data Fetching**: Real-time data caching, revalidation, and mutation using `useSWR`.
- **📱 Fully Responsive**: Optimized layouts that look great on desktops, tablets, and mobile devices.
- **🛡️ Protected Routes**: Next.js Middleware to safeguard private dashboard routes.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Library**: [React 18](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Shadcn UI](https://ui.shadcn.com/) (powered by Base UI)
- **Data Fetching**: [SWR](https://swr.vercel.app/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Toast Notifications**: [Sonner](https://sonner.emilkowal.ski/)

## ⚙️ Environment Variables

Before running the project, make sure to set the environment variable pointing to the backend API.

Create a `.env.local` file in the root of the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
*(If running via Docker Compose in the backend repo, this is automatically injected).*

## 🚀 Getting Started

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker (Production / VPS)

If you are deploying this application alongside the backend, it is recommended to run it via the `docker-compose.yml` located in the **backend repository**. 

Ensure both repositories are cloned side-by-side:
```bash
/var/www/
  ├── /backend   # (Contains docker-compose.yml)
  └── /frontend  # (This repository)
```

Then, from the `backend` directory, run:
```bash
docker compose up -d --build
```

## 📁 Folder Structure

- `/app`: Next.js App Router pages (`/login`, `/dashboard`, etc.)
- `/components`: Reusable UI components (Layouts, UI primitives, Forms, Tables)
- `/lib`: Utility functions and API fetchers (`fetcher`, `utils`)
- `/public`: Static assets (images, icons)
- `middleware.ts`: Route protection logic

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
