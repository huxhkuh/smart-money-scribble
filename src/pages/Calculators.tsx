import { useState } from "react";
import { Calculator, TrendingUp, BarChart3, Home, PiggyBank, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// ========== Compound Interest Calculator ==========
function CompoundInterestCalc() {
  const [principal, setPrincipal] = useState(100000);
  const [monthly, setMonthly] = useState(2000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(20);
  const [tax, setTax] = useState(25);
  const [inflation, setInflation] = useState(2.5);
  const [fee, setFee] = useState(0.5);
  const [result, setResult] = useState<{ nominal: number; real: number; totalInvested: number } | null>(null);

  const calculate = () => {
    const effectiveRate = (rate - fee) / 100;
    const months = years * 12;
    const monthlyRate = effectiveRate / 12;
    let balance = principal;
    for (let i = 0; i < months; i++) {
      balance = balance * (1 + monthlyRate) + monthly;
    }
    const totalInvested = principal + monthly * months;
    const gains = balance - totalInvested;
    const afterTax = totalInvested + gains * (1 - tax / 100);
    const realValue = afterTax / Math.pow(1 + inflation / 100, years);
    setResult({ nominal: Math.round(afterTax), real: Math.round(realValue), totalInvested: Math.round(totalInvested) });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>השקעה ראשונית (₪)</Label>
          <Input type="number" value={principal} onChange={(e) => setPrincipal(+e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>הפקדה חודשית (₪)</Label>
          <Input type="number" value={monthly} onChange={(e) => setMonthly(+e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>תשואה שנתית (%)</Label>
          <Input type="number" step="0.1" value={rate} onChange={(e) => setRate(+e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>שנים</Label>
          <Input type="number" value={years} onChange={(e) => setYears(+e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>מס רווחי הון (%)</Label>
          <Input type="number" step="0.1" value={tax} onChange={(e) => setTax(+e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>אינפלציה (%)</Label>
          <Input type="number" step="0.1" value={inflation} onChange={(e) => setInflation(+e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>דמי ניהול (%)</Label>
          <Input type="number" step="0.1" value={fee} onChange={(e) => setFee(+e.target.value)} />
        </div>
      </div>
      <Button onClick={calculate} className="gradient-primary border-0 text-primary-foreground">חשב תוצאה</Button>
      {result && (
        <div className="grid grid-cols-3 gap-4 pt-4">
          <Card className="border-0 shadow-card">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">סה״כ הושקע</p>
              <p className="text-2xl font-bold text-foreground">₪{result.totalInvested.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-card">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">ערך נומינלי (אחרי מס)</p>
              <p className="text-2xl font-bold text-success">₪{result.nominal.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-card">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">ערך ריאלי</p>
              <p className="text-2xl font-bold text-primary">₪{result.real.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// ========== Sharpe Ratio Calculator ==========
function SharpeCalc() {
  const [portfolioReturn, setPortfolioReturn] = useState(12);
  const [riskFreeRate, setRiskFreeRate] = useState(4.5);
  const [stdDev, setStdDev] = useState(15);
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    setResult(+((portfolioReturn - riskFreeRate) / stdDev).toFixed(3));
  };

  const getRating = (sharpe: number) => {
    if (sharpe >= 1) return { label: "מצוין", color: "bg-success text-success-foreground" };
    if (sharpe >= 0.5) return { label: "טוב", color: "bg-info text-info-foreground" };
    if (sharpe >= 0) return { label: "בינוני", color: "bg-accent text-accent-foreground" };
    return { label: "גרוע", color: "bg-destructive text-destructive-foreground" };
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground leading-relaxed">
        יחס שארפ מודד את התשואה העודפת ביחס לסיכון. ככל שהיחס גבוה יותר, ההשקעה משתלמת יותר ביחס לסיכון.
      </p>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>תשואת תיק (%)</Label>
          <Input type="number" step="0.1" value={portfolioReturn} onChange={(e) => setPortfolioReturn(+e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>ריבית חסרת סיכון (%)</Label>
          <Input type="number" step="0.1" value={riskFreeRate} onChange={(e) => setRiskFreeRate(+e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>סטיית תקן (%)</Label>
          <Input type="number" step="0.1" value={stdDev} onChange={(e) => setStdDev(+e.target.value)} />
        </div>
      </div>
      <Button onClick={calculate} className="gradient-primary border-0 text-primary-foreground">חשב יחס שארפ</Button>
      {result !== null && (
        <div className="flex items-center gap-4 pt-4">
          <Card className="border-0 shadow-card flex-1">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">יחס שארפ</p>
              <p className="text-3xl font-bold">{result}</p>
            </CardContent>
          </Card>
          <Badge className={`${getRating(result).color} border-0 text-base px-4 py-2`}>
            {getRating(result).label}
          </Badge>
        </div>
      )}
    </div>
  );
}

// ========== Mortgage Calculator ==========
function MortgageCalc() {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(5);
  const [loanYears, setLoanYears] = useState(25);
  const [result, setResult] = useState<{ monthly: number; totalInterest: number; total: number } | null>(null);

  const calculate = () => {
    const r = interestRate / 100 / 12;
    const n = loanYears * 12;
    const monthlyPayment = loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = monthlyPayment * n;
    setResult({
      monthly: Math.round(monthlyPayment),
      totalInterest: Math.round(total - loanAmount),
      total: Math.round(total),
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>סכום הלוואה (₪)</Label>
          <Input type="number" value={loanAmount} onChange={(e) => setLoanAmount(+e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>ריבית שנתית (%)</Label>
          <Input type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(+e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>תקופה (שנים)</Label>
          <Input type="number" value={loanYears} onChange={(e) => setLoanYears(+e.target.value)} />
        </div>
      </div>
      <Button onClick={calculate} className="gradient-primary border-0 text-primary-foreground">חשב משכנתא</Button>
      {result && (
        <div className="grid grid-cols-3 gap-4 pt-4">
          <Card className="border-0 shadow-card">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">החזר חודשי</p>
              <p className="text-2xl font-bold text-primary">₪{result.monthly.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-card">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">סה״כ ריבית</p>
              <p className="text-2xl font-bold text-destructive">₪{result.totalInterest.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-card">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">סה״כ לתשלום</p>
              <p className="text-2xl font-bold">₪{result.total.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// ========== Real Estate Calculator ==========
function RealEstateCalc() {
  const [propertyPrice, setPropertyPrice] = useState(2000000);
  const [monthlyRent, setMonthlyRent] = useState(5000);
  const [annualExpenses, setAnnualExpenses] = useState(12000);
  const [equity, setEquity] = useState(600000);
  const [result, setResult] = useState<{ grossYield: number; netYield: number; monthlyCashflow: number; roiOnEquity: number } | null>(null);

  const calculate = () => {
    const annualRent = monthlyRent * 12;
    const grossYield = (annualRent / propertyPrice) * 100;
    const netIncome = annualRent - annualExpenses;
    const netYield = (netIncome / propertyPrice) * 100;
    const monthlyCashflow = netIncome / 12;
    const roiOnEquity = (netIncome / equity) * 100;
    setResult({
      grossYield: +grossYield.toFixed(2),
      netYield: +netYield.toFixed(2),
      monthlyCashflow: Math.round(monthlyCashflow),
      roiOnEquity: +roiOnEquity.toFixed(2),
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>מחיר נכס (₪)</Label>
          <Input type="number" value={propertyPrice} onChange={(e) => setPropertyPrice(+e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>שכירות חודשית (₪)</Label>
          <Input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(+e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>הוצאות שנתיות (₪)</Label>
          <Input type="number" value={annualExpenses} onChange={(e) => setAnnualExpenses(+e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>הון עצמי (₪)</Label>
          <Input type="number" value={equity} onChange={(e) => setEquity(+e.target.value)} />
        </div>
      </div>
      <Button onClick={calculate} className="gradient-primary border-0 text-primary-foreground">חשב תשואה</Button>
      {result && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <Card className="border-0 shadow-card">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">תשואה ברוטו</p>
              <p className="text-2xl font-bold text-success">{result.grossYield}%</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-card">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">תשואה נטו</p>
              <p className="text-2xl font-bold text-primary">{result.netYield}%</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-card">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">תזרים חודשי</p>
              <p className="text-2xl font-bold">₪{result.monthlyCashflow.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-card">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">ROI על הון עצמי</p>
              <p className="text-2xl font-bold text-accent">{result.roiOnEquity}%</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// ========== Budget Calculator ==========
function BudgetCalc() {
  const [income, setIncome] = useState(15000);
  const [housing, setHousing] = useState(4000);
  const [food, setFood] = useState(2500);
  const [transport, setTransport] = useState(1500);
  const [other, setOther] = useState(2000);
  const [emergencyMonths, setEmergencyMonths] = useState(6);
  const [savingsGoal, setSavingsGoal] = useState(100000);

  const totalExpenses = housing + food + transport + other;
  const monthlySavings = income - totalExpenses;
  const emergencyFund = totalExpenses * emergencyMonths;
  const monthsToGoal = savingsGoal > 0 && monthlySavings > 0 ? Math.ceil(savingsGoal / monthlySavings) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>הכנסה חודשית (₪)</Label>
          <Input type="number" value={income} onChange={(e) => setIncome(+e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>דיור (₪)</Label>
          <Input type="number" value={housing} onChange={(e) => setHousing(+e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>מזון (₪)</Label>
          <Input type="number" value={food} onChange={(e) => setFood(+e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>תחבורה (₪)</Label>
          <Input type="number" value={transport} onChange={(e) => setTransport(+e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>הוצאות אחרות (₪)</Label>
          <Input type="number" value={other} onChange={(e) => setOther(+e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>חודשי כרית חירום</Label>
          <Input type="number" value={emergencyMonths} onChange={(e) => setEmergencyMonths(+e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>יעד חיסכון (₪)</Label>
          <Input type="number" value={savingsGoal} onChange={(e) => setSavingsGoal(+e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
        <Card className="border-0 shadow-card">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">חיסכון חודשי</p>
            <p className={`text-2xl font-bold ${monthlySavings >= 0 ? "text-success" : "text-destructive"}`}>
              ₪{monthlySavings.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-card">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">כרית חירום נדרשת</p>
            <p className="text-2xl font-bold text-primary">₪{emergencyFund.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-card">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">% חיסכון מהכנסה</p>
            <p className="text-2xl font-bold">{income > 0 ? ((monthlySavings / income) * 100).toFixed(1) : 0}%</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-card">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">חודשים ליעד</p>
            <p className="text-2xl font-bold text-accent">{monthsToGoal > 0 ? monthsToGoal : "∞"}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ========== Main Page ==========
const calcs = [
  { id: "compound", label: "ריבית דריבית", icon: TrendingUp },
  { id: "sharpe", label: "יחס שארפ", icon: Scale },
  { id: "mortgage", label: "משכנתא", icon: Home },
  { id: "realestate", label: "נדל\"ן", icon: BarChart3 },
  { id: "budget", label: "תקציב", icon: PiggyBank },
];

export default function Calculators() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mb-12">
        <Badge className="gradient-accent text-accent-foreground border-0 mb-4">
          <Calculator className="h-3.5 w-3.5 ml-1" />
          מחשבונים
        </Badge>
        <h1 className="text-4xl font-heading font-bold mb-4">מחשבונים פיננסיים</h1>
        <p className="text-lg text-muted-foreground">
          כלים חכמים שיעזרו לך לקבל החלטות פיננסיות מושכלות
        </p>
      </div>

      <Tabs defaultValue="compound" dir="rtl">
        <TabsList className="flex-wrap h-auto gap-1 bg-transparent p-0 mb-8">
          {calcs.map((c) => (
            <TabsTrigger
              key={c.id}
              value={c.id}
              className="data-[state=active]:gradient-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-card rounded-lg gap-1.5 px-4 py-2.5"
            >
              <c.icon className="h-4 w-4" />
              {c.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <Card className="border-0 shadow-card">
          <CardContent className="p-6 md:p-8">
            <TabsContent value="compound"><CompoundInterestCalc /></TabsContent>
            <TabsContent value="sharpe"><SharpeCalc /></TabsContent>
            <TabsContent value="mortgage"><MortgageCalc /></TabsContent>
            <TabsContent value="realestate"><RealEstateCalc /></TabsContent>
            <TabsContent value="budget"><BudgetCalc /></TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
