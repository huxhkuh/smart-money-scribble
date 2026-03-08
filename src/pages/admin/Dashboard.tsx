import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Eye, PenLine, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0 });

  useEffect(() => {
    adminApi.posts.stats().then(setStats).catch(console.error);
  }, []);

  const cards = [
    { title: "סה״כ פוסטים", value: stats.total, icon: FileText, color: "from-primary to-secondary" },
    { title: "פורסמו", value: stats.published, icon: Eye, color: "from-green-500 to-emerald-600" },
    { title: "טיוטות", value: stats.drafts, icon: PenLine, color: "from-accent to-orange-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-bold">ברוך הבא, מנהל</h2>
        <Button asChild className="gradient-primary">
          <Link to="/admin/posts/new">
            <PenLine className="ml-2 h-4 w-4" />
            פוסט חדש
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Card key={card.title} className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                <card.icon className="h-5 w-5 text-primary-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            גישה מהירה
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link to="/admin/posts">כל הפוסטים</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/admin/media">ספריית מדיה</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
