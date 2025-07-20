import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  Building2,
  Check,
  Crown,
  Upload,
  Users,
} from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

const pricingPlans = [
  {
    id: "basic",
    name: "Basic",
    pricePerMonth: 19,
    pricePerYear: 199,
    description: "For individuals and small teams",
    features: [
      "Up to a 1,000 prospects",
      "Up to 100 emails per month",
      "Up to 10 team members",
      "Basic AI tools",
    ],
    popular: false,
  },
  {
    id: "premium",
    name: "Premium",
    pricePerMonth: 49,
    description: "For established teams",
    features: [
      "Up to 10,000 prospects",
      "Up to 1,000 emails per month",
      "Up to 50 team members",
      "Advanced AI tools",
      "Priority support",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    pricePerMonth: 199,
    pricePerYear: 1999,
    description: "For large organizations",
    features: [
      "Unlimited prospects",
      "Unlimited emails",
      "Unlimited team members",
      "Advanced AI tools",
      "Priority support",
    ],
    popular: false,
  },
];

function CreateTeam() {
  const [step, setStep] = useState(1);
  const [teamData, setTeamData] = useState({
    name: "",
    description: "",
    logo: null as File | null,
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState("premium");

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTeamData({ ...teamData, logo: file });
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTeamSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!teamData.name.trim() || !teamData.description.trim()) {
      toast.error("Missing information", {
        description: "Please fill in all required fields",
      });
      return;
    }
    setStep(2);
  };

  const handlePlanSelection = () => {
    setStep(3);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="space-y-4 text-center">
              <h1 className="text-4xl font-bold">Create Your Team</h1>
              <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
                Set up your team with a name, logo, and description to get
                started on your journey together.
              </p>
            </div>

            <Card className="mx-auto max-w-2xl shadow-[var(--shadow-card)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Information
                </CardTitle>
                <CardDescription>
                  Tell us about your team and what it represents. This will be
                  only be shown to people you invite to the team.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTeamSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Team Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter your team name"
                      value={teamData.name}
                      onChange={(e) =>
                        setTeamData({ ...teamData, name: e.target.value })
                      }
                      className="text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logo">Team Logo</Label>
                    <div className="flex items-center gap-4">
                      {logoPreview ? (
                        <div className="border-border bg-muted h-16 w-16 overflow-hidden rounded-lg border-2">
                          <img
                            src={logoPreview}
                            alt="Team logo preview"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="border-border bg-muted flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed">
                          <Upload className="text-muted-foreground h-6 w-6" />
                        </div>
                      )}
                      <div className="flex-1">
                        <Input
                          id="logo"
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="cursor-pointer"
                        />
                        <p className="text-muted-foreground mt-1 text-sm">
                          Upload a square image (PNG, JPG, or SVG)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Team Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your team's mission, goals, or what you're working on..."
                      value={teamData.description}
                      onChange={(e) =>
                        setTeamData({
                          ...teamData,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Continue to Pricing
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="space-y-4 text-center">
              <h1 className="from-primary to-primary/70 bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent">
                Choose Your Plan
              </h1>
              <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
                Select the perfect plan for your team&apos;s needs. You can
                always upgrade or downgrade later.
              </p>
            </div>

            <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
              {pricingPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative cursor-pointer transition-all duration-300 hover:shadow-[var(--shadow-elegant)] ${
                    selectedPlan === plan.id
                      ? "ring-primary shadow-[var(--shadow-elegant)] ring-2"
                      : "hover:ring-primary/50 hover:ring-1"
                  } ${plan.popular ? "scale-105" : ""}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <div className="bg-primary text-primary-foreground flex min-w-max items-center gap-1 rounded-full px-4 py-1 text-sm font-medium">
                        <Crown className="h-3 w-3" />
                        <span>Most Popular</span>
                      </div>
                    </div>
                  )}

                  <CardHeader className="pb-4 text-center">
                    <div className="mb-2 flex justify-center">
                      {plan.id === "enterprise" ? (
                        <Building2 className="text-primary h-8 w-8" />
                      ) : (
                        <Users className="text-primary h-8 w-8" />
                      )}
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">
                        ${plan.pricePerMonth}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="text-success h-4 w-4" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {selectedPlan === plan.id && (
                      <div className="bg-primary/10 mt-4 rounded-lg p-2 text-center">
                        <span className="text-primary text-sm font-medium">
                          Selected Plan
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button size="lg" onClick={handlePlanSelection} className="px-8">
                Create Team with{" "}
                {pricingPlans.find((p) => p.id === selectedPlan)?.name}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case 3:
        return <></>;

      default:
        return null;
    }
  };

  return (
    <div className="from-background via-background to-accent/5 grid min-h-screen place-items-center bg-gradient-to-br px-4 py-8">
      <div>
        {/* Progress Indicator */}
        <div className="mx-auto mb-16 max-w-md">
          <div className="relative grid grid-cols-3 place-items-center">
            <svg className="absolute top-1/2 -translate-y-1/2">
              <line
                x1="0"
                y1="50%"
                x2="100%"
                y2="50%"
                strokeWidth={6}
                className="stroke-muted absolute"
              />

              <line
                x1="0"
                y1="50%"
                x2={`${(Math.max(0, step - 1) / 2) * 100}%`}
                y2="50%"
                strokeWidth={6}
                className="stroke-primary absolute"
              />
            </svg>

            {[1, 2, 3].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`relative flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  step >= stepNumber
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step > stepNumber ? <Check className="h-4 w-4" /> : stepNumber}
              </div>
            ))}
          </div>

          <div className="text-muted-foreground mt-4 grid grid-cols-3 place-items-center text-xs">
            <span>Team Info</span>
            <span>Pricing</span>
            <span>Invite</span>
          </div>
        </div>

        {renderStepContent()}
      </div>
    </div>
  );
}

export default CreateTeam;
