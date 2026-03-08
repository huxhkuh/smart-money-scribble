import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { CheckCircle, XCircle, ArrowLeft, Mail } from "lucide-react";

export default function About() {
  return (
    <div className="container py-12 max-w-3xl">
      {/* Hero */}
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-heading font-black">מה זה בואו חשבון?</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          שמעתם על חיסכון, דמי ניהול, מניות, אג"ח, מדדים... ואולי הרגשתם מבולבלים?
          <br />הגיע הזמן לפשט את זה.
        </p>
      </div>

      {/* Cards section */}
      <div className="grid gap-6 mb-12">
        <Card className="shadow-card">
          <CardContent className="p-6 space-y-3">
            <h2 className="text-2xl font-heading font-bold">מבולבלים מהז'רגון הפיננסי?</h2>
            <p className="text-foreground/80 leading-relaxed">
              מישהו אמר לכם "אתם חייבים לבדוק את הפנסיה שלכם", ואתם חייכתם והנהנתם, ובפנים חשבתם – <em>"אין לי מושג על מה הוא מדבר."</em>
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6 space-y-3">
            <h2 className="text-2xl font-heading font-bold">הכסף שלכם. ההבנה שלכם.</h2>
            <p className="text-foreground/80 leading-relaxed">
              לא צריך להפוך למומחים, או לקרוא ספרי ענק. זה הכסף שלכם, והגיע הזמן שתדעו עליו משהו. די, נגמר הבלבול.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6 space-y-3">
            <h2 className="text-2xl font-heading font-bold">קונספט פשוט וברור</h2>
            <p className="text-foreground/80 leading-relaxed">
              לא להילחץ מהמילים המפחידות, להבין מה באמת חשוב לדעת, ולקבל החלטות טובות עם ראש שקט.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card bg-accent/10 border-accent/30">
          <CardContent className="p-6 space-y-3">
            <h2 className="text-2xl font-heading font-bold">פשטות.</h2>
            <p className="text-foreground/80 leading-relaxed">
              זה לא אתר למומחי אקסל או טריק להתעשרות מהירה. זה מקום אחד, פשוט, בשביל להבין את הכסף שלכם. בלי רעש, עם דוגמאות אמיתיות.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* What you won't / will learn */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Card className="shadow-card">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-heading font-bold text-destructive">מה <em>לא</em> תלמדו כאן?</h2>
            <ul className="space-y-3">
              {[
                "איך להפוך לסוחרי יום",
                "חמש שיטות להכות את המדד (ספוילר: אין כאלה)",
                "ייעוץ משכנתאות מקצועי (בשביל זה צריך התמחות)",
                "פקודות סטופ-לוס וקונפיגורציית גרפים",
                'איך לקנות נדל"ן בברלין עם עשרה שקלים והבטחה בלב',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                  <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-heading font-bold text-primary">מה <em>כן</em> תלמדו כאן?</h2>
            <ul className="space-y-3">
              {[
                "איך עובדת ריבית דריבית",
                "איך עושים החזר מס (ולמה זה כדאי)",
                "מה זה קרן כספית ולמה חשוב לדעת עליה",
                "למה יש לך דירוג אשראי ואיך הוא משפיע עליך",
                "איך להשקיע בצורה פאסיבית, פשוטה ונגישה",
                "מה זה דמי ניהול, ואיך הם אוכלים לך את הפנסיה",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                  <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Who is it for */}
      <div className="space-y-6 mb-12 text-center">
        <h2 className="text-2xl font-heading font-bold">למי זה מתאים?</h2>
        <div className="space-y-3 text-foreground/80 leading-relaxed">
          <p>למי שאמר פעם "נראה לי שאני צריך להתחיל להבין בזה" ולא ידע מאיפה להתחיל.</p>
          <p>למי שפתח את הדוח מהבנק וחשב שזה באיסלנדית.</p>
          <p>ולמי שפשוט רוצה לעשות סדר, בלי להקדיש לזה חיים שלמים.</p>
        </div>
      </div>

      {/* How to start */}
      <Card className="shadow-card mb-12">
        <CardContent className="p-8 text-center space-y-4">
          <h2 className="text-2xl font-heading font-bold">איך מתחילים?</h2>
          <p className="text-lg text-foreground/80">לאט. בנחת.</p>
          <p className="text-foreground/80">מדריך אחד בכל פעם.</p>
          <p className="text-foreground/80">
            תוך כדי הקפה של הבוקר, או בזמן שהילדים סוף סוף הלכו לישון.
          </p>
          <p className="text-foreground/80">
            כל מדריך קצר, ברור, עם מסקנה אחת שתוכלו ליישם כבר מחר בבוקר.
          </p>
          <p className="text-lg font-bold mt-4">בלי לחץ. בלי בלאגן.</p>
          <p className="text-2xl font-heading font-black mt-6">אז קדימה, בואו, חשבון.</p>
        </CardContent>
      </Card>

      {/* Links */}
      <div className="flex flex-col items-center gap-4">
        <Link to="/guides" className="text-primary hover:underline font-medium">
          לעמוד המדריכים »
        </Link>
        <a href="mailto:lets.go.business.yosi@gmail.com" className="inline-flex items-center gap-2 text-primary hover:underline font-medium">
          <Mail className="h-4 w-4" />
          lets.go.business.yosi@gmail.com
        </a>
        <p className="text-sm text-muted-foreground mt-4">© כל הזכויות שמורות. יוסי לוי.</p>
      </div>
    </div>
  );
}
