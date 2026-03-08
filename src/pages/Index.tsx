import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, Calendar, ArrowLeft } from "lucide-react";
import logo from "@/assets/logo.png";

export default function Index() {
  const [latestPosts, setLatestPosts] = useState<any[]>([]);

  useEffect(() => {
    supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(6)
      .then(({ data }) => setLatestPosts(data || []));
  }, []);

  const typeLabels: Record<string, string> = { guide: "מדריך", column: "טור", news: "חדשות" };

  return (
    <div>
      {/* Hero Section - matching original layout */}
      <section className="relative overflow-hidden bg-background">
        <div className="container py-12 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Right side - text content (RTL) */}
            <div className="space-y-6 text-center md:text-right order-2 md:order-1">
              <img src={logo} alt="בואו חשבון" className="h-36 w-auto mx-auto md:mx-0 md:mr-0" />
              
              <h1 className="text-5xl md:text-6xl font-heading font-black">
                בואו חשבון.
              </h1>
              
              <p className="text-xl md:text-2xl text-accent font-bold">
                ידע פשוט. בחירות חכמות. עתיד בטוח.
              </p>
              
              <p className="text-lg text-foreground/80 font-medium">
                מדריכים פשוטים שמובילים לבחירות נכונות בכסף.
              </p>

              {/* Disclaimer callout - like original orange box */}
              <div className="bg-accent/20 border border-accent/40 rounded-xl p-5 text-right">
                <div className="flex gap-3">
                  <Info className="h-5 w-5 text-accent shrink-0 mt-1" />
                  <div className="text-sm leading-relaxed text-foreground/80 space-y-2">
                    <p>חשוב שתדעו – אני <strong>לא</strong> יועץ פנסיוני מוסמך. גם לא סוכן ביטוח או משהו בסגנון.</p>
                    <p>אין לי אפשרות לייעץ לכם, בשביל זה צריך להכיר אותכם.</p>
                    <p>אני רק מנסה לעשות סדר בבלגן, להסביר בשפה פשוטה מה כל אחד צריך לדעת.</p>
                    <p>אם אתם צריכים ייעוץ מותאם אישית – תמיד עדיף לפנות לאיש מקצוע עם רישיון.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Left side - hero image */}
            <div className="order-1 md:order-2">
              <div className="rounded-2xl overflow-hidden shadow-elevated">
                <img
                  src="https://images.unsplash.com/photo-1621981386829-9b458a2cddde?w=600&h=800&fit=crop"
                  alt="מטבעות ומחשבון - תכנון פיננסי"
                  className="w-full h-[400px] md:h-[550px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="bg-muted/30 border-t">
        <div className="container py-16">
          <h2 className="text-3xl font-heading font-bold mb-2 text-center">המדריכים האחרונים שפורסמו</h2>
          <p className="text-muted-foreground text-center mb-10">תוכן חדש שעלה לאתר</p>

          {latestPosts.length === 0 ? (
            <div className="text-center text-muted-foreground py-12 border-2 border-dashed border-muted-foreground/20 rounded-2xl">
              <p>מדריכים יופיעו כאן לאחר הוספתם מה-Dashboard</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((post) => (
                <Link to={`/post/${post.slug}`} key={post.id} className="group">
                  <Card className="h-full border shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                    {post.cover_image && (
                      <div className="aspect-video overflow-hidden">
                        <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">{typeLabels[post.post_type] || post.post_type}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(post.published_at || post.created_at).toLocaleDateString("he-IL")}
                        </span>
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">{post.title}</CardTitle>
                      {post.excerpt && <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>}
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/guides" className="inline-flex items-center gap-1 text-primary hover:underline font-medium">
              כל המדריכים »
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom section - links & contact like original */}
      <section className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-card hover:shadow-elevated transition-all text-center p-6">
            <CardContent className="space-y-3 p-0">
              <h3 className="text-lg font-heading font-bold">מה זה בכלל בואו חשבון?</h3>
              <Link to="/about" className="text-primary hover:underline font-medium">כאן »</Link>
            </CardContent>
          </Card>
          <Card className="shadow-card hover:shadow-elevated transition-all text-center p-6">
            <CardContent className="space-y-3 p-0">
              <h3 className="text-lg font-heading font-bold">כל המדריכים</h3>
              <div className="flex flex-col gap-2">
                <Link to="/guides" className="text-primary hover:underline font-medium">כל המדריכים »</Link>
                <a
                  href="https://drive.google.com/drive/u/0/folders/12j6sADMONjfEcMbpFPLeTpQrPc7kwrix"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-medium"
                >
                  המדריכים בדרייב »
                </a>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card hover:shadow-elevated transition-all text-center p-6">
            <CardContent className="space-y-3 p-0">
              <h3 className="text-lg font-heading font-bold">יצירת קשר</h3>
              <p className="text-sm text-muted-foreground">אפשר ליצור איתי קשר במייל (אני ממש משתדל לענות. בחינם)</p>
              <a href="mailto:lets.go.business.yosi@gmail.com" className="text-primary hover:underline font-medium text-sm">
                lets.go.business.yosi@gmail.com
              </a>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
