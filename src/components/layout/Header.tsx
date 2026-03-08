import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ExternalLink, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo.png";

const navItems = [
  { label: "המדריכים שפורסמו", path: "/guides" },
  { label: "טורים", path: "/columns" },
  { label: "מחשבונים", path: "/calculators" },
  { label: "אודות", path: "/about" },
];

const externalLink = {
  label: "המדריכים בדרייב",
  url: "https://drive.google.com/drive/u/0/folders/12j6sADMONjfEcMbpFPLeTpQrPc7kwrix",
};

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border/50">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="בואו חשבון" className="h-10 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                location.pathname === item.path
                  ? "bg-primary/10 text-primary font-bold"
                  : "text-foreground/70 hover:text-foreground hover:bg-muted"
              )}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={externalLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1"
          >
            {externalLink.label}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </nav>

        {/* Home CTA + Contact */}
        <div className="hidden md:flex items-center gap-2">
          {user && isAdmin && (
            <Button asChild variant="outline" size="sm" className="gap-1 border-primary/30 text-primary hover:bg-primary/10">
              <Link to="/admin"><LayoutDashboard className="h-4 w-4" /> דשבורד ניהול</Link>
            </Button>
          )}
          <Button asChild variant="outline" size="sm" className="gap-1">
            <a href="mailto:lets.go.business.yosi@gmail.com">✉️ צרו קשר</a>
          </Button>
          <Button asChild size="sm" className="bg-foreground text-background hover:bg-foreground/90">
            <Link to="/">לדף הבית</Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="תפריט"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background animate-fade-in">
          <nav className="container py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary font-bold"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted"
                )}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={externalLink.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="px-4 py-3 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1"
            >
              {externalLink.label}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href="mailto:lets.go.business.yosi@gmail.com"
              className="px-4 py-3 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
            >
              ✉️ צרו קשר
            </a>
            {user && isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-lg text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors flex items-center gap-1"
              >
                <LayoutDashboard className="h-4 w-4" />
                דשבורד ניהול
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
