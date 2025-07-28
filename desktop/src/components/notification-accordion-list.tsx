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

type Props = {
  groups: NotificationGroup[];
};

export function NotificationAccordionList({ groups }: Props) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {groups.map((group, index) => (
        <AccordionItem key={index} value={group.title}>
          <AccordionTrigger className="text-left text-base font-medium">
            {group.title}
          </AccordionTrigger>
          <AccordionContent className="pt-3">
            <div className="flex items-center justify-between px-2">
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
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
