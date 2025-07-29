"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type NotificationGroup = {
  title: string;
};

type Section = {
  titleCard: string;
  groups: NotificationGroup[];
};

type Props = {
  sections: Section[];
};

export function NotificationAccordionList({ sections }: Props) {
  return (
    <Accordion type="multiple" className="w-full">
      {sections.map((section, index) => (
        <AccordionItem key={index} value={`section-${index}`}>
          <AccordionTrigger className="text-xl font-semibold text-left">
            {section.titleCard}
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-4 mt-2">
              {section.groups.map((group, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-md bg-muted px-4 py-2"
                >
                  <span className="text-base">{group.title}</span>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="app">App Notification</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
