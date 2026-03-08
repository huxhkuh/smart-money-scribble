import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="בואו חשבון" className="h-8 w-auto" />
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
          <p>© כל הזכויות שמורות. יוסי לוי.</p>
          <a href="mailto:lets.go.business.yosi@gmail.com" className="hover:text-primary transition-colors">
            lets.go.business.yosi@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
