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
import { ArrowRight, Check, Upload, Users } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

function CreateTeam() {
  const [step, setStep] = useState(1);
  const [teamData, setTeamData] = useState({
    name: "",
    description: "",
    logo: null as File | null,
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

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
        return <></>;

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
                x2={`${(Math.max(0, step - 1) / 3) * 100}%`}
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
