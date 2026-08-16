"use client";

import { usePathname, useRouter } from "next/navigation";
import { Bell, Moon, Sun, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { fetcher } from "@/lib/api";
import { toast } from "sonner";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  
  // Create breadcrumbs from pathname (e.g., /dashboard/projects -> Dashboard / Projects)
  const paths = pathname.split('/').filter(Boolean);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = async () => {
    try {
      await fetcher('/auth/logout', { method: 'POST' });
      toast.success("Logged out successfully");
      window.location.href = "/login";
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {paths.map((path, idx) => {
          const isLast = idx === paths.length - 1;
          const label = path.charAt(0).toUpperCase() + path.slice(1);
          return (
            <span key={path} className="flex items-center gap-2">
              <span className={isLast ? "text-foreground font-medium" : ""}>
                {label}
              </span>
              {!isLast && <span>/</span>}
            </span>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
          <Sun className="h-4 w-4 dark:hidden" />
          <Moon className="h-4 w-4 hidden dark:block" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full outline-none">
            <Avatar className="h-8 w-8 cursor-pointer ring-1 ring-border transition-opacity hover:opacity-80">
              <AvatarImage src="https://github.com/shadcn.png" alt="@admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
