import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion";
import { ArrowRight } from "lucide-react";

export default function NotificationSettingsPage() {
  return (
    <div className="bg-muted/50 flex h-full min-h-[100vh] flex-row rounded-xl md:min-h-min">
      <div className="flex w-full flex-col items-center gap-6 py-12">
        <div className="flex w-1/3 items-center justify-center p-2">
          <h1 className="text-4xl">Notification center</h1>
        </div>

        <div className="bg-secondary flex w-1/3 flex-col items-start justify-start gap-8 rounded-xl p-4 text-start shadow-[0_0_5px_rgba(59,130,246,0.5)]">
          <h1 className="text-2xl">User settings for teams</h1>
          <div className="flex w-full">
            <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="user-invited" className="w-full">
              <div className="w-full">
                <AccordionTrigger className="w-full flex justify-between py-2">
                  <span className="text-start w-full">User invited</span>
                  <ArrowRight className="shrink-0" />
                </AccordionTrigger>
                <AccordionContent className="pt-2 text-muted-foreground">
                  <ul className="pl-4 list-disc space-y-1">
                    <li>Send notification</li>
                    <li>Mute this user</li>
                    <li>Remove from team</li>
                  </ul>
                </AccordionContent>
                <div className="border-b-2 mt-2" />
              </div>
            </AccordionItem>
            </Accordion>
          </div>
          <div className="flex w-full justify-between border-b-2">
            <p className="w-full">User invitation accepted</p>
            <ArrowRight className="cursor-pointer" />
          </div>
          <div className="flex w-full justify-between border-b-2">
            <p className="w-full">User kicked out</p>
            <ArrowRight className="cursor-pointer" />
          </div>
          <div className="flex w-full justify-between border-b-2">
            <p className="w-full">User role changed</p>
            <ArrowRight className="cursor-pointer" />
          </div>
        </div>

        <div className="bg-secondary flex w-1/3 flex-col items-start justify-start gap-8 rounded-xl p-4 text-start shadow-[0_0_5px_rgba(59,130,246,0.5)]">
          <h1 className="text-2xl">User settings</h1>
          <div className="flex w-full justify-between border-b-2">
            <p className="w-full">Invited to team</p>
            <ArrowRight className="cursor-pointer" />
          </div>
          <div className="flex w-full justify-between border-b-2">
            <p className="w-full">Role changed</p>
            <ArrowRight className="cursor-pointer" />
          </div>
          <div className="flex w-full justify-between border-b-2">
            <p className="w-full">Kicked out</p>
            <ArrowRight className="cursor-pointer" />
          </div>
        </div>

        <div className="bg-secondary flex w-1/3 flex-col items-start justify-start gap-8 rounded-xl p-4 text-start shadow-[0_0_5px_rgba(59,130,246,0.5)]">
          <h1 className="text-2xl">Client settings</h1>
          <div className="flex w-full justify-between border-b-2">
            <p className="w-full">Invited to team</p>
            <ArrowRight className="cursor-pointer" />
          </div>
          <div className="flex w-full justify-between border-b-2">
            <p className="w-full">Role changed</p>
            <ArrowRight className="cursor-pointer" />
          </div>
          <div className="flex w-full justify-between border-b-2">
            <p className="w-full">Kicked out</p>
            <ArrowRight className="cursor-pointer" />
          </div>
        </div>

        <div className="bg-secondary flex w-1/3 flex-col items-start justify-start gap-8 rounded-xl p-4 text-start shadow-[0_0_5px_rgba(59,130,246,0.5)]">
          <h1 className="text-2xl">Mail settings</h1>
          <div className="flex w-full justify-between border-b-2">
            <p className="w-full">Add email</p>
            <ArrowRight className="cursor-pointer" />
          </div>
          <div className="flex w-full justify-between border-b-2">
            <p className="w-full">Edit email</p>
            <ArrowRight className="cursor-pointer" />
          </div>
          <div className="flex w-full justify-between border-b-2">
            <p className="w-full">Delete email</p>
            <ArrowRight className="cursor-pointer" />
          </div>
          <div className="flex w-full justify-between border-b-2">
            <p className="w-full">Send email</p>
            <ArrowRight className="cursor-pointer" />
          </div>
          <div className="flex w-full justify-between border-b-2">
            <p className="w-full">Schedule email</p>
            <ArrowRight className="cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  );
}
