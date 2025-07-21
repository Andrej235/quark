import { useClickAway } from "@uidotdev/usehooks";
import { LucideSearch } from "lucide-react";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { buttonVariants } from "./ui/button";
import { Input } from "./ui/input";

export default function HeaderSearchBar() {
  const [isActive, setIsActive] = useState(false);
  const alertDialogRef = useClickAway<HTMLDivElement>(() => setIsActive(false));

  useEffect(() => {
    document.addEventListener("keydown", (event) => {
      if (event.key === "/") {
        setIsActive(true);
        event.preventDefault();
      }
    });
  }, []);

  return (
    <AlertDialog open={isActive} onOpenChange={setIsActive}>
      <AlertDialogTrigger
        className={buttonVariants({
          variant: "outline",
          className:
            "md:w-196 md:max-w-2/5 ml-auto flex items-center gap-2 md:size-auto md:justify-start",
        })}
      >
        <LucideSearch />

        <span className="hidden md:block text-sm text-muted-foreground">Press / to search</span>
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
