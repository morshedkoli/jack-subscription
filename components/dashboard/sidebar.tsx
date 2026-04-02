"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  X,
  Leaf,
  ChevronRight,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        className="lg:hidden fixed top-5 left-5 z-50 p-3 rounded-xl bg-card/90 backdrop-blur-xl border border-border/50 shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle sidebar"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="h-5 w-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen || isDesktop ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
         className={`fixed lg:static inset-y-0 left-0 z-40 w-60 bg-card/80 backdrop-blur-xl border-r border-border/30 transform transition-transform duration-200 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
           {/* Header - Logo */}
           <div className="flex-shrink-0 px-5 py-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <motion.div
                className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/25"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Leaf className="h-5 w-5 text-white" />
              </motion.div>
              <span className="font-bold text-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 bg-size-200 bg-pos-0 group-hover:bg-pos-100 bg-clip-text text-transparent transition-all duration-700 tracking-tight">
                dRecharge
              </span>
            </Link>
          </div>

         <Separator className="mx-5 bg-border/30 flex-shrink-0" />

           {/* Navigation - Scrollable */}
           <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
            {sidebarLinks.map((link, index) => {
              const isActive = pathname === link.href;
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden text-sm ${
                      isActive
                        ? "bg-gradient-to-r from-emerald-500/12 to-teal-500/12 text-emerald-700 dark:text-emerald-400 shadow-md shadow-emerald-500/8"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-emerald-500/12 to-teal-500/12 rounded-lg"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <link.icon className={`h-5 w-5 relative z-10 ${isActive ? "text-emerald-600 dark:text-emerald-400" : "group-hover:scale-110 transition-transform"}`} />
                    <span className="font-semibold relative z-10 tracking-tight">{link.label}</span>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="ml-auto relative z-10"
                      >
                        <ChevronRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </motion.div>
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          <Separator className="mx-5 bg-border/30" />

         {/* Footer - User Section */}
         <div className="flex-shrink-0 px-4 py-4 space-y-2 border-t border-border/30">
            <motion.div
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-muted/40 border border-border/30"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Avatar className="h-9 w-9 ring-2 ring-emerald-500/20">
                <AvatarImage src={session?.user?.image || ""} />
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-semibold">
                  {session?.user?.name?.charAt(0).toUpperCase() || <User className="h-5 w-5" />}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate tracking-tight">
                  {session?.user?.name || "Admin User"}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">
                  {session?.user?.email || "admin@example.com"}
                </p>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="h-4 w-4 mr-3" />
                <span className="font-medium">Sign out</span>
              </Button>
            </motion.div>
          </div>
      </motion.aside>
    </>
  );
}
