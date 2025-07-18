import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Settings } from "lucide-react";
export default function UserSettingsPage() {
  return (
    <div className="bg-muted/50 flex h-full min-h-[100vh] flex-row rounded-xl md:min-h-min">
      <div className="w-md bg-secondary flex h-full flex-col items-center gap-2 rounded-xl p-12 shadow-[0_0_5px_rgba(59,130,246,0.5)]">
        <div className="bg-muted flex items-center justify-center rounded-full p-6">
          <img src="/user_icon.png" className="w-40" />
        </div>
        <h1 className="mt-2 text-2xl">Andrej Nenadic</h1>{" "}
        {/* TODO: get name from backend */}
        <div className="mt-4 flex flex-col gap-2">
          <Button className="cursor-pointer shadow-[0_0_5px_rgba(59,130,246,0.5)]">Edit photo</Button>
        </div>
        <div className="mt-12 flex flex-col gap-2 items-center">
          <h1 className="text-lg">Default team: Eko Koko Farm</h1>
          <h1 className="text-lg">Role: Programmer</h1>{" "}
          {/* TODO: get role from backend */}
        </div>
      </div>
      <div className="flex w-full flex-col gap-2 p-12">
        <div className="flex flex-col gap-2 px-24">
          <h1 className="text-4xl">Profile</h1>
          <div className="flex flex-row gap-2">
            <p className="text-md">
              Change you account settings
            </p>
              <Settings />
          </div>
        </div>
        <div className="flex flex-col gap-6 px-24 py-12">
          <div className="flex flex-col gap-2">
            <h6 className="">Username</h6>
            <Input type="text" className="bg-input w-md"></Input>
          </div>
          <div className="flex flex-col gap-2">
            <h6 className="">First name</h6>
            <Input type="text" className="bg-input w-md"></Input>
          </div>
          <div className="flex flex-col gap-2">
            <h6 className="">Last name</h6>
            <Input type="text" className="bg-input w-md"></Input>
          </div>
          <Button className="w-fit cursor-pointer px-12 py-4 shadow-[0_0_5px_rgba(59,130,246,0.5)]">Update info</Button>
          
        </div>

        <div className="flex flex-col gap-6 px-24">
          <div className="flex flex-col gap-2">
            <h6 className="">Password</h6>
            <Input type="password" className="bg-input w-md"></Input>
          </div>
          <div className="flex flex-col gap-2">
            <h6 className="">Comfirm password</h6>
            <Input type="password" className="bg-input w-md"></Input>
          </div>
           <Button className="w-fit cursor-pointer px-12 py-4 shadow-[0_0_5px_rgba(59,130,246,0.5)]">Update password</Button>
        </div>
      </div>
    </div>
  );
}
