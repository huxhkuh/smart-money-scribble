import { Columns3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Columns() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mb-12">
        <Badge className="bg-secondary text-secondary-foreground border-0 mb-4">
          <Columns3 className="h-3.5 w-3.5 ml-1" />
          טורים
        </Badge>
        <h1 className="text-4xl font-heading font-bold mb-4">טורים ודעות</h1>
        <p className="text-lg text-muted-foreground">
          ניתוחים שבועיים, תובנות שוק ודעות מומחים על הכלכלה והשקעות
        </p>
      </div>
      <div className="flex items-center justify-center min-h-[300px] rounded-2xl border-2 border-dashed border-muted-foreground/20">
        <p className="text-muted-foreground">טורים יופיעו כאן לאחר הוספתם מה-Dashboard</p>
      </div>
    </div>
  );
}
