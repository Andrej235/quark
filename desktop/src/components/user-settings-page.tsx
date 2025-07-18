import { Button } from "./ui/button";
import { Input } from "./ui/input";
export default function UserSettingsPage() {
  return (
    <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min">
      <div className="p-10">
        <h1 className="text-4xl">User settings</h1>
      </div>
      <div className="mt-12 flex w-full flex-row items-center justify-between px-12 text-start">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl">Profile</h1>
          <p className="text-md">Change you account settings</p>
        </div>
        <div className="flex flex-row items-center justify-center gap-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <img src="/user_icon.png" className="w-40" />
            <Button className="cursor-pointer">Edit photo</Button>
          </div>

          <div className="flex flex-col gap-2 px-12">
            <div className="flex flex-col gap-2">
              <h6 className="">Username</h6>
              <Input type="text" className="bg-input w-2xs"></Input>
            </div>
            <div className="flex flex-col gap-2">
              <h6 className="">First name</h6>
              <Input type="text" className="bg-input w-2xs"></Input>
            </div>
            <div className="flex flex-col gap-2">
              <h6 className="">Last name</h6>
              <Input type="text" className="bg-input w-2xs"></Input>
            </div>
            <div className="flex flex-col gap-2">
              <h6 className="">Password</h6>
              <Input type="password" className="bg-input w-2xs"></Input>
            </div>
            <div className="flex flex-col gap-2">
              <h6 className="">Comfirm password</h6>
              <Input type="password" className="bg-input w-2xs"></Input>
            </div>
            <div className="flex flex-col items-center mt-4">
              <Button className="cursor-pointer">Save</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
