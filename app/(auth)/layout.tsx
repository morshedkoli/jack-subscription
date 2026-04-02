import { Leaf } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-600/5 to-background" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Header */}
      <header className="p-6 relative z-10">
        <Link href="/" className="flex items-center gap-3 w-fit group">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20 group-hover:shadow-xl group-hover:shadow-emerald-500/30 transition-shadow duration-300">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 bg-size-200 bg-pos-0 group-hover:bg-pos-100 bg-clip-text text-transparent transition-all duration-700 tracking-tight">
            dRecharge
          </span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-muted-foreground relative z-10">
        <p>Secure admin access</p>
      </footer>
    </div>
  );
}
