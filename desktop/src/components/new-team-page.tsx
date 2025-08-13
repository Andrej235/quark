import sendApiRequest from "@/api-dsl/send-api-request";
import { Schema } from "@/api-dsl/types/endpoints/schema-parser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useAuthStore from "@/stores/auth-store";
import { useUserStore } from "@/stores/user-store";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  ChevronsUpDown,
  Crown,
  LogOut,
  Upload,
  Users,
} from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const [inviteEmail, setInviteEmail] = useState("");
  const queryClient = useQueryClient();

  const user = useUserStore((x) => x.user);
  const setUser = useUserStore((x) => x.setUser);
  const [createdTeam, setCreatedTeam] =
    useState<Schema<"TeamResponseDto"> | null>(null);
  const logOut = useAuthStore((x) => x.logOut);
  const navigate = useNavigate();

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

  const handlePlanSelection = async () => {
    setStep(3);

    if (!user) return;

    const { isOk, response } = await sendApiRequest(
      "/teams",
      {
        method: "post",
        payload: {
          name: teamData.name,
          description: teamData.description,
          logo: logoPreview,
        },
      },
      {
        showToast: true,
        toastOptions: {
          loading: "Creating team, please wait...",
          success: "Team created successfully!",
          error: (x) => {
            setStep(1);
            return x.message || "Failed to create team, please try again";
          },
        },
      },
    );

    if (!isOk || !response) return;

    setUser({ ...user, teams: [...user.teams, response] });
    setCreatedTeam(response);
  };

  const handleInvite = async () => {
    if (!createdTeam) {
      toast.error("Please choose a payment plan first");
      return;
    }

    if (!inviteEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(inviteEmail)
    ) {
      toast.error("Please enter a valid email address");
      return;
    }

    const { isOk } = await sendApiRequest(
      "/teams/invite",
      {
        method: "post",
        payload: {
          teamId: createdTeam.id,
          email: inviteEmail,
        },
      },
      {
        showToast: true,
        toastOptions: {
          loading: "Inviting user, please wait...",
          success: "User invited successfully!",
          error: (x) => {
            return x.message || "Failed to invite user, please try again";
          },
        },
      },
    );

    if (!isOk) return;
    setInviteEmail("");
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
        return (
          <div className="space-y-8">
            <div className="space-y-4 text-center">
              <div className="bg-success mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Check className="text-success-foreground h-8 w-8" />
              </div>
              <h1 className="from-success to-success/70 bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent">
                Team Created Successfully!
              </h1>
              <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
                Your team &quot;{teamData.name}&quot; is ready to go. Invite
                your first team member to get started.
              </p>
            </div>

            <Card className="mx-auto max-w-2xl shadow-[var(--shadow-card)]">
              <CardHeader>
                <CardTitle>Invite Team Members</CardTitle>
                <CardDescription>
                  Send an invitation to your first team member. You can invite
                  more people later from your team dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="invite-email">Email Address</Label>
                  <div className="flex gap-2">
                    <Input
                      id="invite-email"
                      type="email"
                      placeholder="colleague@company.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleInvite}>Send Invite</Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    asChild
                  >
                    <Link to={"/"}>
                      Skip for now - Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  async function handleLogOut() {
    await logOut();

    // Force revalidation, without this app.tsx would just redirect the user to the dashboard
    await queryClient.resetQueries({
      queryKey: ["isLoggedIn"],
      exact: true,
    });

    await navigate("/login");
  }

  // User is loading or not logged in
  if (!user) return null;

  return (
    <div className="from-background via-background to-accent/5 grid min-h-screen bg-gradient-to-br">
      <header className="bg-card flex h-16 w-full items-center justify-between place-self-start px-4 py-8">
        <Button variant="ghost" asChild>
          <Link to="..">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              tabIndex={0}
              className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex w-full max-w-64 items-center gap-2 rounded-lg px-2 py-1.5"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={user.profilePicture ?? undefined}
                  alt={user.firstName}
                />
                <AvatarFallback className="rounded-lg">
                  {user.firstName[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.firstName}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>

              <ChevronsUpDown className="ml-auto size-4" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user.profilePicture ?? undefined}
                    alt={user.firstName}
                  />
                  <AvatarFallback className="rounded-lg">
                    {user.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.firstName}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <button onClick={handleLogOut} className="w-full">
                <LogOut />
                Log out
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

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
