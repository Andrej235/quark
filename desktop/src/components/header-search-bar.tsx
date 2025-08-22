import { useShortcut } from "@/lib/hooks/use-shortcut";
import { LucideSearch } from "lucide-react";
import { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function HeaderSearchBar() {
  const [isActive, setIsActive] = useState(false);
  const alertDialogRef = useRef<HTMLDivElement>(null!);
  useOnClickOutside(alertDialogRef, () => setIsActive(false));

  useShortcut({
    key: "/",
    callback: () => setIsActive(true),
    preventDefault: true,
  });

  return (
    <AlertDialog open={isActive} onOpenChange={setIsActive}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="md:max-w-2/5 md:w-196 flex items-center gap-2 md:h-auto md:justify-start"
        >
          <LucideSearch />

          <span className="text-muted-foreground hidden text-sm md:block">
            Press / to search
          </span>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="p-4" ref={alertDialogRef}>
        <AlertDialogHeader className="sr-only">
          <AlertDialogTitle>Search</AlertDialogTitle>
        </AlertDialogHeader>

        <div className="border-input relative flex items-center justify-between rounded-md border-2 pl-4">
          <LucideSearch size={24} />

          <Input
            placeholder="Search"
            className="border-0! ring-0! h-12 w-full"
            autoFocus
          />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
