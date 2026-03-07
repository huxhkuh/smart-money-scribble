import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Columns3, Calculator, TrendingUp, Sparkles, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const categories = [
  {
    title: "מדריכים",
    description: "מדריכים מקיפים להשקעות, חיסכון, ותכנון פיננסי",
    icon: BookOpen,
    path: "/guides",
    color: "from-primary to-secondary",
    badge: "פופולרי",
  },
  {
    title: "טורים",
    description: "ניתוחים שבועיים, תובנות שוק ודעות מומחים",
    icon: Columns3,
    path: "/columns",
    color: "from-secondary to-info",
    badge: "חדש",
  },
  {
    title: "מחשבונים",
    description: "כלים חכמים לחישוב ריבית, משכנתא, תשואה ועוד",
    icon: Calculator,
    path: "/calculators",
    color: "from-accent to-warning",
    badge: "כלים",
  },
];

const features = [
  { icon: TrendingUp, title: "ניתוחי שוק", desc: "עדכונים ותובנות על שוק ההון הישראלי והבינלאומי" },
  { icon: Sparkles, title: "תוכן ויזואלי", desc: "מדריכים מעוצבים עם גרפים, טבלאות ואינפוגרפיקות" },
  { icon: BarChart3, title: "כלים אינטראקטיביים", desc: "מחשבונים פיננסיים מתקדמים לקבלת החלטות חכמות" },
];

export default function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(262_83%_58%/0.15),transparent_60%)]" />
        <div className="container relative py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge className="gradient-primary text-primary-foreground border-0 px-4 py-1.5 text-sm">
              🚀 הבלוג הפיננסי שלך
            </Badge>
            <h1 className="text-4xl md:text-6xl font-heading font-black leading-tight">
              הכסף שלך,{" "}
              <span className="gradient-text">ההחלטות שלך</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              מדריכים מקיפים, ניתוחי שוק מעמיקים, וכלים חכמים שיעזרו לך לקבל החלטות פיננסיות טובות יותר
            </p>
            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <Button asChild size="lg" className="gradient-primary border-0 text-primary-foreground shadow-elevated hover:opacity-90 transition-opacity">
                <Link to="/guides">
                  התחל ללמוד
                  <ArrowLeft className="h-4 w-4 mr-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/calculators">מחשבונים פיננסיים</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-heading font-bold mb-3">גלה את התוכן שלנו</h2>
          <p className="text-muted-foreground text-lg">בחר קטגוריה והתחל לחקור</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link key={cat.path} to={cat.path} className="group">
              <Card className="h-full border-0 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <div className={`h-2 bg-gradient-to-l ${cat.color}`} />
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${cat.color}`}>
                      <cat.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <Badge variant="secondary" className="text-xs">{cat.badge}</Badge>
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold mb-2 group-hover:text-primary transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                  <div className="flex items-center text-primary text-sm font-medium">
                    <span>צפה בתוכן</span>
                    <ArrowLeft className="h-4 w-4 mr-1 group-hover:translate-x-[-4px] transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30">
        <div className="container py-16">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="flex gap-4 items-start animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-bold mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
