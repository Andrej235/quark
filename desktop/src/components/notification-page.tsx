import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Select } from "./ui/select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NotificationPage() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <div className="mt-4 flex w-full items-center justify-center gap-4">
        <div className="flex flex-col">
          <Select defaultValue={"inbox"}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inbox">Inbox</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-full">
          <Input className="" placeholder="Search" />
        </div>
        <div>
          <Select defaultValue={"none"}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="type">Type</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-full w-full">
        <div className="bg-secondary grid h-full min-h-full w-full rounded-sm">
          <div className="flex h-full w-full items-center gap-2 rounded-sm border-2 p-4">
            <Checkbox className="bg-input"></Checkbox>
            <h1>Select all</h1>
          </div>

          <div className="bt-0 flex h-full w-full flex-col gap-4 rounded-sm border-2 border-t-0 p-4">
            <NotificationItem />
            <NotificationItem />
            <NotificationItem />
            <NotificationItem />
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationItem() {
  return (
    <div className="flex justify-between">
      <div className="flex items-center gap-4">
        <Checkbox className="bg-input"></Checkbox>
        <div className="flex flex-col">
          <h1>Notification title or user</h1>
          <p>Notification description</p>
        </div>
      </div>
      <div>
        <p>Time</p>
      </div>
    </div>
  );
}
