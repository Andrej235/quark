import { buttonVariants } from "@/components/ui/button";
import { LucideBell } from "lucide-react";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function NotificationPageLink() {
  //TODO: Replace with actual logic to fetch unread notifications count
  const unreadNotifications = 0;

  return (
    <Tooltip>
      <TooltipTrigger
        className={buttonVariants({
          variant: "outline",
          size: "icon",
          className: "relative",
        })}
        asChild
      >
        <Link to="/notifications">
          <LucideBell />

          {unreadNotifications > 0 && (
            <div className="absolute bottom-1/3 right-1/3 h-2 w-2 translate-x-full translate-y-full transform rounded-full bg-red-500" />
          )}
        </Link>
      </TooltipTrigger>

      <TooltipContent>
        {unreadNotifications > 0 ? unreadNotifications : "You have no"} unread
        notifications
      </TooltipContent>
    </Tooltip>
  );
}
