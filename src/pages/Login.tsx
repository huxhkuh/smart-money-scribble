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
      redirect_uri: window.location.origin + "/admin",
    });
    setGoogleLoading(false);
    if (error) {
      toast({ title: "שגיאה בהתחברות עם Google", description: String(error), variant: "destructive" });
    }
  };

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

            <div className="flex items-center gap-3 my-2">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">או</span>
              <Separator className="flex-1" />
            </div>

            <Button type="button" variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={googleLoading}>
              <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              {googleLoading ? "מתחבר..." : "התחבר עם Google"}
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
