import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, LogOut, HeartPulse, Menu, Bell, Activity, User as UserIcon, Mail } from "lucide-react";
import { clsx } from "clsx";
import { useAuth } from "@/context/AuthContext";
import { getApiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(getApiUrl('/users/notifications'), {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const getNavLinks = () => {
    let links: any[] = [];
    switch (user?.role) {
      case "Admin":
        links = [{ name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard }];
        break;
      case "Doctor":
        links = [{ name: "Workspace", href: "/dashboard/doctor", icon: LayoutDashboard }];
        break;
      case "Patient":
        links = [{ name: "Health Hub", href: "/dashboard/patient", icon: LayoutDashboard }];
        break;
      default:
        links = [];
    }
    // Append the workflow nav link for everybody
    links.push({ name: "System Workflow", href: "/dashboard/workflow", icon: Activity });
    return links;
  };

  const navLinks = getNavLinks();

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <HeartPulse className="h-6 w-6 text-primary mr-2" />
        <span className="text-xl font-bold tracking-tight">PharmaCare</span>
      </div>
      <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        <p className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Main Menu
        </p>
        {navLinks.map((link) => {
          const isActive = location.pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              to={link.href}
              className={clsx(
                "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className={clsx("mr-3 h-5 w-5", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
              {link.name}
            </Link>
          );
        })}
      </div>
      <div className="p-4 border-t border-border space-y-3">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50">
          <Avatar className="h-9 w-9 border border-border">
            <AvatarFallback className="bg-primary/10 text-primary">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={logout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="md:hidden fixed top-3 left-4 z-50 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm px-2 py-2">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72 border-r">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <div className="hidden md:flex md:w-64 md:flex-col fixed inset-y-0 z-10">
        <SidebarContent />
      </div>

      <div className="flex-1 flex flex-col md:pl-64 min-h-screen">
        <header className="h-16 flex items-center justify-end px-6 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            
            {/* Notification Bell Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative text-muted-foreground hover:text-foreground rounded-full px-2 py-2 border border-transparent hover:border-border">
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-destructive border-[1.5px] border-background animate-pulse"></span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end">
                <DropdownMenuLabel className="font-semibold px-4 py-2">Recent Activity</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">No new notifications</div>
                  ) : (
                    notifications.map((notif: any) => (
                      <div key={notif.id} className="px-4 py-3 hover:bg-muted/50 border-b border-border/50 last:border-0 transition-colors">
                        <div className="text-sm font-semibold">{notif.title}</div>
                        <div className="text-xs text-muted-foreground mt-1 leading-snug">{notif.message}</div>
                        <div className="text-[10px] text-muted-foreground/70 mt-2 font-medium">
                          {new Date(notif.date).toLocaleString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full border border-border hover:shadow-sm">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem className="cursor-pointer py-2" onClick={() => setShowProfile(true)}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span className="font-medium">Registered Details</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 leading-none py-2" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="font-medium">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 bg-muted/20">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>

      {/* Profile Details Modal */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Profile Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center mb-6">
              <Avatar className="h-24 w-24 border-2 border-primary/20 shadow-sm">
                <AvatarFallback className="bg-primary/10 text-primary text-3xl font-semibold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase">First Name</p>
                <p className="text-sm font-medium">{user?.firstName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Last Name</p>
                <p className="text-sm font-medium">{user?.lastName}</p>
              </div>
              <div className="space-y-1 col-span-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Email Address</p>
                <p className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" /> {user?.email}
                </p>
              </div>
              <div className="space-y-1 pt-2 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase">System Role</p>
                <div className="inline-flex mt-1 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {user?.role}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
