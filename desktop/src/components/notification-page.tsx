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
    <div className="flex w-full items-center justify-center gap-4 flex-col">
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

      <div className="w-full h-full ">
        <div className="bg-secondary w-full h-full min-h-full rounded-sm grid ">
          <div className="flex gap-2 items-center m-4">
            <Checkbox className="bg-input"></Checkbox>
            <h1>Select all</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
