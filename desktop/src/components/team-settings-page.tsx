import { Button } from "./ui/button";

export default function TeamSettingsPage() {
  return (
    <div>
      <div className="m-12 flex gap-4 flex-col">
        <h1 className="text-2xl font-extralight">Danger Zone</h1>
        <div className="border-2 border-red-800 rounded-xl">
          <TeamNotifications />
          <TeamNotifications />
        </div>
      </div>
    </div>
  );
}

function TeamNotifications() {
  return (
    <div>
      <div className="flex justify-between p-4 ">
        <div className="flex flex-col">
          <h1 className="">Change repository visibillity</h1>
          <p className="text-sm">This repository is currently public.</p>
        </div>
        <Button className="cursor-pointer" variant={"destructive"}>Change visibillity</Button>
      </div>
    </div>
  );
}
