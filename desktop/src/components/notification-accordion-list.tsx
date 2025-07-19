import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type NotificationGroup = {
  title: string;
  items: string[];
};

interface Props {
  groups: NotificationGroup[];
}

export function NotificationAccordionList({ groups }: Props) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {groups.map((group, index) => (
        <AccordionItem
          value={group.title + index}
          key={group.title + index}
          className="w-full"
        >
          <div className="w-full">
            <AccordionTrigger className="flex w-full justify-between py-2">
              <span className="w-full text-start">{group.title}</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pt-2">
              <ul className="list-disc space-y-1 pl-4">
                {group.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </AccordionContent>
            <div className="mt-2 border-b-2" />
          </div>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
