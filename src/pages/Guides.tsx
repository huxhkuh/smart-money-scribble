import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Guides() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mb-12">
        <Badge className="gradient-primary text-primary-foreground border-0 mb-4">
          <BookOpen className="h-3.5 w-3.5 ml-1" />
          מדריכים
        </Badge>
        <h1 className="text-4xl font-heading font-bold mb-4">מדריכים פיננסיים</h1>
        <p className="text-lg text-muted-foreground">
          מדריכים מקיפים ומעמיקים בנושאי השקעות, חיסכון, מס ותכנון פיננסי
        </p>
      </div>
      <div className="flex items-center justify-center min-h-[300px] rounded-2xl border-2 border-dashed border-muted-foreground/20">
        <p className="text-muted-foreground">מדריכים יופיעו כאן לאחר הוספתם מה-Dashboard</p>
      </div>
    </div>
  );
}
