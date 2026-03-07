import { TrendingUp } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-card/50 mt-auto">
      <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md gradient-primary">
            <TrendingUp className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold gradient-text">פיננסי+</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} פיננסי+. כל הזכויות שמורות. התוכן באתר הוא למטרות מידע בלבד ואינו מהווה ייעוץ השקעות.
        </p>
      </div>
    </footer>
  );
}
