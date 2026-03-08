import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail, UserPlus } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    setGoogleLoading(false);
    if (error) {
      toast({ title: "שגיאה בהתחברות עם Google", description: String(error), variant: "destructive" });
    }
  };
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password, fullName);
      setIsLoading(false);
      if (error) {
        toast({ title: "שגיאה בהרשמה", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "נרשמת בהצלחה!", description: "כעת תוכל להתחבר" });
        setIsSignUp(false);
      }
    } else {
      const { error } = await signIn(email, password);
      setIsLoading(false);
      if (error) {
        toast({ title: "שגיאה בהתחברות", description: error.message, variant: "destructive" });
      } else {
        navigate("/admin");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-elevated">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-2">
            {isSignUp ? <UserPlus className="w-7 h-7 text-primary-foreground" /> : <Lock className="w-7 h-7 text-primary-foreground" />}
          </div>
          <CardTitle className="text-2xl">{isSignUp ? "הרשמה" : "כניסת מנהלים"}</CardTitle>
          <CardDescription>{isSignUp ? "צור חשבון חדש" : "הזן את פרטי ההתחברות שלך"}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName">שם מלא</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="השם שלך" required dir="rtl" />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">אימייל</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="admin@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pr-10" required dir="ltr" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">סיסמה</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required dir="ltr" />
            </div>
            <Button type="submit" className="w-full gradient-primary" disabled={isLoading}>
              {isLoading ? (isSignUp ? "נרשם..." : "מתחבר...") : (isSignUp ? "הרשמה" : "התחבר")}
            </Button>
            <Button type="button" variant="ghost" className="w-full" onClick={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? "כבר יש לך חשבון? התחבר" : "אין לך חשבון? הרשם"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
