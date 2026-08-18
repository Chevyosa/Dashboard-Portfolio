"use client";

import useSWR from "swr";
import type { ComponentType } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, Users, Eye, TrendingUp, Loader2 } from "lucide-react";
import { fetcher } from "@/lib/api";
import { Project } from "@/types";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: ComponentType<{ className?: string }>;
  loading?: boolean;
}

function StatCard({ title, value, change, icon: Icon, loading }: StatCardProps) {
  return (
    <Card className="rounded-2xl border-border/50 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <p className="text-xs text-muted-foreground mt-1">{change}</p>
      </CardContent>
    </Card>
  );
}

export default function DashboardOverview() {
  const { data, isLoading } = useSWR("/projects", fetcher);
  const projects: Project[] = data?.data || [];
  const total = projects.length;
  const published = projects.filter((p) => p.is_published).length;
  const publishedPct = total > 0 ? Math.round((published / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back! Here is a summary of your portfolio performance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Projects"
          value={String(total)}
          change="All projects (incl. drafts)"
          icon={FolderKanban}
          loading={isLoading}
        />
        <StatCard
          title="Published"
          value={String(published)}
          change={`${publishedPct}% of total`}
          icon={Eye}
          loading={isLoading}
        />
        <StatCard
          title="Profile Views"
          value="—"
          change="Tracked via Vercel Analytics"
          icon={Users}
        />
        <StatCard
          title="Engagement"
          value="—"
          change="Tracked via Vercel Analytics"
          icon={TrendingUp}
        />
      </div>
    </div>
  );
}
